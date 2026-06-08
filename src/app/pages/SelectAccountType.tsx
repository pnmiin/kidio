import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { KidioPageHeader } from '../../components/KidioPageHeader';
import kidModeImg from 'figma:asset/account-kid-mode-children.png';
import parentModeImg from 'figma:asset/account-parent-mode-family.png';

export function SelectAccountType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen app-sky-background px-6 py-6">
      <KidioPageHeader />

      <div className="max-w-5xl w-full mx-auto pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center text-gray-900 mb-16"
        >
          Who is using Kidio today?
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Kid Mode */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/kid-login')}
            className="bg-white rounded-3xl p-12 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl"
          >
            <div className="text-center">
              <img
                src={kidModeImg}
                alt="Kid Mode"
                className="w-48 h-48 mx-auto mb-6 object-contain"
              />
              <h2 className="text-4xl font-bold text-[#2BADEE] mb-4">Kid Mode</h2>
              <p className="text-xl text-gray-600">
                Start learning English through fun lessons and games.
              </p>
            </div>
          </motion.div>

          {/* Parent Mode */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate('/parent-login')}
            className="bg-white rounded-3xl p-12 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl"
          >
            <div className="text-center">
              <img
                src={parentModeImg}
                alt="Parent Mode"
                className="w-48 h-48 mx-auto mb-6 object-contain"
              />
              <h2 className="text-4xl font-bold text-[#2BADEE] mb-4">Parent Mode</h2>
              <p className="text-xl text-gray-600">
                Track your child's learning progress.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
