import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Lock, ArrowRight, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { resetPassword } from "../services/authApi";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMessage("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await resetPassword(token, newPassword, confirmPassword);
      if (response.success) {
        setSuccessMessage("Password reset successfully! You can now log in with your new password.");
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/parent-login"), 3000);
      } else {
        throw new Error(response.message || "Failed to reset password.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred. The token might have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackground variant="login" className="px-6 py-12">
      <KidioPageHeader backLabel="Back to Login" backTo="/parent-login" />

      <div className="max-w-md mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4 text-[#2BADEE]">
              <KeyRound className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h1>
            <p className="text-gray-600">Please enter and confirm your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-semibold">
                <Lock className="w-5 h-5 text-[#2BADEE]" />
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors pr-12"
                  placeholder="Enter new password"
                  required
                  disabled={!token || !!successMessage}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2BADEE] focus:outline-none"
                  disabled={!token || !!successMessage}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-semibold">
                <Lock className="w-5 h-5 text-[#2BADEE]" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors pr-12"
                  placeholder="Confirm new password"
                  required
                  disabled={!token || !!successMessage}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2BADEE] focus:outline-none"
                  disabled={!token || !!successMessage}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-700">
                {successMessage}
                <div className="mt-2 text-sm">Redirecting to login...</div>
              </div>
            )}

            {!successMessage && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !token || !newPassword || !confirmPassword}
                className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSubmitting ? "Resetting..." : "Reset Password"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            )}
          </form>
        </motion.div>
      </div>
    </PageBackground>
  );
}
