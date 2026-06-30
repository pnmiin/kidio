import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User } from "lucide-react";
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
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
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
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

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

          {errorMessage ? (
            <div className="mt-4 rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-700">
              {errorMessage}
            </div>
          ) : null}

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
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
