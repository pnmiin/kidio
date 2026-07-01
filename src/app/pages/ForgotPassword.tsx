import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { forgotPassword } from "../services/authApi";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccessMessage(response.message || "If the email is registered, a password reset link has been sent.");
        setEmail("");
      } else {
        throw new Error(response.message || "Failed to request password reset.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred.");
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-semibold">
                <Mail className="w-5 h-5 text-[#2BADEE]" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-colors"
                placeholder="Enter your registered email"
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center font-bold text-amber-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-700">
                {successMessage}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/parent-login")}
              className="inline-flex items-center gap-2 text-[#2BADEE] hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </PageBackground>
  );
}
