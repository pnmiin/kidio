import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { verifyEmail } from "../services/authApi";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  
  // Prevent strict mode double-firing from causing false failures
  const verifyAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    if (verifyAttempted.current) return;
    verifyAttempted.current = true;

    const performVerification = async () => {
      try {
        const response = await verifyEmail(token);
        if (response.success) {
          setStatus("success");
          setMessage("Your email has been successfully verified! You can now log in to your account.");
        } else {
          throw new Error(response.message || "Failed to verify email.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "The verification link is invalid or has expired.");
      }
    };

    performVerification();
  }, [token]);

  return (
    <PageBackground variant="login" className="px-6 py-12">
      <KidioPageHeader backLabel="Back to Login" backTo="/parent-login" />

      <div className="max-w-md mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 shadow-2xl text-center"
        >
          {status === "loading" && (
            <div className="py-8">
              <Loader2 className="w-16 h-16 animate-spin text-[#2BADEE] mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying...</h1>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="py-8">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/parent-login")}
                className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Login <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}

          {status === "error" && (
            <div className="py-8">
              <XCircle className="w-20 h-20 text-rose-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/parent-login")}
                className="w-full py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-200 to-slate-300 text-gray-700 rounded-full text-lg font-bold shadow hover:shadow-md transition-all"
              >
                Return to Login
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </PageBackground>
  );
}
