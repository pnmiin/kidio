import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { isAdminEmail } from "../utils/adminAuth";

const DEMO_PARENT_EMAIL = "demo@kidio.com";
const DEMO_PARENT_PASSWORD = "123456";

export function ParentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: DEMO_PARENT_EMAIL,
    password: DEMO_PARENT_PASSWORD,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = formData.email.trim().toLowerCase();

    if (isAdminEmail(normalizedEmail)) {
      localStorage.setItem("currentParent", normalizedEmail);
      localStorage.setItem("currentUserRole", "admin");
      navigate("/admin");
      return;
    }

    if (isLogin) {
      if (
        normalizedEmail === DEMO_PARENT_EMAIL &&
        formData.password === DEMO_PARENT_PASSWORD
      ) {
        const savedParent = JSON.parse(
          localStorage.getItem("parentData") || "{}",
        );
        const demoParent = {
          ...savedParent,
          name: savedParent.name || "KIDIO Parent",
          email: DEMO_PARENT_EMAIL,
          password: DEMO_PARENT_PASSWORD,
          kids: Array.isArray(savedParent.kids) ? savedParent.kids : [],
        };

        localStorage.setItem("parentData", JSON.stringify(demoParent));
        localStorage.setItem("currentParent", DEMO_PARENT_EMAIL);
        localStorage.setItem("currentUserRole", "parent");
        localStorage.removeItem("linkedKidId");
        navigate("/parent-dashboard");
        return;
      }

      const savedParent = localStorage.getItem("parentData");
      if (savedParent) {
        const parentData = JSON.parse(savedParent);
        if (
          parentData.email?.toLowerCase() === normalizedEmail &&
          parentData.password === formData.password
        ) {
          localStorage.setItem("currentParent", normalizedEmail);
          localStorage.setItem("currentUserRole", "parent");
          localStorage.removeItem("linkedKidId");

          // Check if there's a pending plan to purchase
          const pendingPlan = sessionStorage.getItem("pendingPlan");
          if (pendingPlan) {
            sessionStorage.removeItem("pendingPlan");
            navigate(`/checkout?plan=${pendingPlan}`);
          } else {
            navigate("/parent-dashboard");
          }
        } else {
          alert("Incorrect email or password!");
        }
      } else {
        alert("Account does not exist! Please sign up.");
      }
    } else {
      // Register logic
      const parentData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        kids: [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("parentData", JSON.stringify(parentData));
      localStorage.setItem("currentParent", formData.email);
      localStorage.setItem("currentUserRole", "parent");
      localStorage.removeItem("linkedKidId");

      // Check if there's a pending plan to purchase
      const pendingPlan = sessionStorage.getItem("pendingPlan");
      if (pendingPlan) {
        sessionStorage.removeItem("pendingPlan");
        navigate(`/checkout?plan=${pendingPlan}`);
      } else {
        navigate("/parent-dashboard");
      }
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
              className="w-full py-4 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              {isLogin ? "Login" : "Sign Up"}
            </motion.button>
          </form>

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
