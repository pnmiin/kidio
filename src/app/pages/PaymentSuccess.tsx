import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'parent' | 'kid' | null>(null);

  useEffect(() => {
    // Check which type of user is logged in
    const currentParent = localStorage.getItem('currentParent');
    const currentKid = localStorage.getItem('currentKid');

    if (currentParent) {
      setUserType('parent');
    } else if (currentKid) {
      setUserType('kid');
    }
  }, []);

  const handleContinue = () => {
    if (userType === 'parent') {
      navigate('/parent-dashboard');
    } else if (userType === 'kid') {
      navigate('/kid-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen app-sky-background px-6 py-6">
      <KidioPageHeader />

      <div className="max-w-2xl w-full mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-12 shadow-2xl text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Thanh toán thành công! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mb-8"
          >
            Chúc mừng! Bạn đã nâng cấp lên <strong className="text-[#2BADEE]">Fluent Pro</strong> thành công.
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Bạn đã mở khóa:</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Unlimited lessons - Học không giới hạn</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Story library - Thư viện câu chuyện đầy đủ</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Progress reports - Báo cáo tiến độ chi tiết</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Offline mode - Học mọi lúc mọi nơi</span>
              </li>
            </ul>
          </motion.div>

          {/* Email Confirmation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 mb-8"
          >
            📧 Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.
          </motion.p>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white text-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {userType === 'parent' ? 'Về Parent Dashboard' : 'Về Kid Dashboard'}
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          {/* Support Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-gray-500 mt-6"
          >
            Cần hỗ trợ?{' '}
            <a href="#" className="text-[#2BADEE] hover:underline font-semibold">
              Liên hệ chúng tôi
            </a>
          </motion.p>
        </motion.div>

        {/* Celebration Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 0 }}
              animate={{
                y: window.innerHeight + 100,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
              className="absolute text-4xl"
            >
              {['🎉', '🎊', '⭐', '✨', '🌟'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
