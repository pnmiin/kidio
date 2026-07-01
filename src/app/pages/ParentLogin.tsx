import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { isAdminEmail } from "../utils/adminAuth";
import { loginParent, registerParent, saveAuthSession, resendVerification, loginGoogle } from "../services/authApi";
import { GoogleLogin } from "@react-oauth/google";

export function ParentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const navigateAfterAuth = () => {
    const pendingPlan = sessionStorage.getItem("pendingPlan");
    if (pendingPlan) {
      sessionStorage.removeItem("pendingPlan");
      navigate(`/checkout?plan=${pendingPlan}`);
      return;
    }

    navigate("/parent-dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = formData.email.trim().toLowerCase();
    setErrorMessage("");
    setSuccessMessage("");
    setNeedsVerification(false);

    if (isAdminEmail(normalizedEmail)) {
      localStorage.setItem("currentParent", normalizedEmail);
      localStorage.setItem("currentUserRole", "admin");
      navigate("/admin");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await loginParent(normalizedEmail, formData.password);

        if (!response.success || !response.data?.accessToken) {
          throw new Error(response.message || "Login failed. Please try again.");
        }

        saveAuthSession(response.data);
        localStorage.setItem("currentUserRole", response.data.user?.role || "parent");
        localStorage.removeItem("linkedKidId");
        navigateAfterAuth();
        return;
      }

      const displayName = formData.name.trim();
      if (!displayName) {
        throw new Error("Please enter your full name.");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const registerResponse = await registerParent(displayName, normalizedEmail, formData.password, formData.confirmPassword);
      if (!registerResponse.success) {
        throw new Error(registerResponse.message || "Sign up failed. Please try again.");
      }

      setIsLogin(true);
      setSuccessMessage(registerResponse.message || "Registration successful! Please check your email to verify your account.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("verif") || msg.toLowerCase().includes("activat")) {
        setNeedsVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setErrorMessage("");
    try {
      const response = await resendVerification(formData.email.trim().toLowerCase());
      if (response.success) {
        setSuccessMessage(response.message || "Verification email resent successfully. Please check your inbox.");
        setNeedsVerification(false);
      } else {
        throw new Error(response.message || "Failed to resend verification email.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await loginGoogle(credentialResponse.credential);
      if (res.success && res.data?.accessToken) {
        saveAuthSession(res.data);
        localStorage.setItem("currentUserRole", res.data.user?.role || "parent");
        
        if (res.data.user?.role === "admin" || res.data.user?.role === "Admin") {
          navigate("/admin");
          return;
        }

        navigateAfterAuth();
      } else {
        throw new Error(res.message || "Google login failed.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Google login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground variant="login" className="px-6 py-12">
      <KidioPageHeader backLabel="Back" backTo="/" />

      <div className="max-w-md mx-auto">
        {/* Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isLogin ? "Login" : "Sign Up"}
            </h1>
            <p className="text-gray-600">For Parents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#2BADEE]" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#2BADEE]" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#2BADEE]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2BADEE] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-[#2BADEE] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#2BADEE]" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2BADEE] focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? "Logging in..." : isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setErrorMessage("Google Login Failed");
                  }}
                  useOneTap
                  theme="outline"
                  shape="pill"
                />
              </div>
            </div>
          )}

          {errorMessage ? (
            <div className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-700">
              {errorMessage}
              {needsVerification && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-4 rounded-2xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className="text-[#2BADEE] hover:underline font-semibold"
            >
              {isLogin
                ? "Don't have an account? Sign up now"
                : "Already have an account? Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </PageBackground>
  );
}
