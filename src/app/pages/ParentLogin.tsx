import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Check, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { isAdminEmail } from "../utils/adminAuth";
import { loginParent, registerParent, saveAuthSession } from "../services/authApi";

export function ParentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;/`~']/.test(formData.password);
  const passwordValid = hasMinLength && hasUppercase && hasSpecialChar;

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

      if (!passwordValid) {
        throw new Error("Password does not meet all requirements.");
      }

      const registerResponse = await registerParent(displayName, normalizedEmail, formData.password);
      if (!registerResponse.success) {
        throw new Error(registerResponse.message || "Sign up failed. Please try again.");
      }

      const loginResponse = await loginParent(normalizedEmail, formData.password);
      if (!loginResponse.success || !loginResponse.data?.accessToken) {
        throw new Error(loginResponse.message || "Sign up worked, but login failed.");
      }

      saveAuthSession(loginResponse.data);
      localStorage.setItem("currentUserRole", loginResponse.data.user?.role || "parent");
      localStorage.removeItem("linkedKidId");
      navigateAfterAuth();
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        apiError.response?.data?.message ||
          apiError.message ||
          "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground variant="login" className="px-6 py-12">
      <KidioPageHeader backLabel="Back" backTo="/select-account" />

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
                className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 pr-12 outline-none transition-colors focus:border-[#2BADEE]"
                placeholder="••••••••"
                required
                minLength={isLogin ? 1 : 8}
              />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#2BADEE] transition hover:bg-sky-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <div className="mt-3 rounded-2xl bg-sky-50/70 px-4 py-3 text-sm">
                  <p className="mb-2 font-bold text-[#21435f]">Password must include:</p>
                  <div className="space-y-1.5">
                    {[
                      { label: "At least 8 characters", valid: hasMinLength },
                      { label: "One uppercase letter", valid: hasUppercase },
                      { label: "One special character", valid: hasSpecialChar },
                    ].map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-2 font-semibold transition-colors ${
                          rule.valid ? "text-emerald-600" : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            rule.valid
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-gray-300 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-700">
              {errorMessage}
            </div>
          ) : null}

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage("");
                setShowPassword(false);
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
