import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

export function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const planDetails = {
    pro: {
      name: 'Fluent Pro',
      price: '69,000 VND',
      period: 'tháng',
      features: [
        'Unlimited lessons',
        'Story library',
        'Progress reports',
        'Offline mode',
        'No ads',
      ],
    },
    premium: {
      name: 'Premium',
      price: '690,000 VND',
      period: 'năm',
      features: [
        'All Fluent Pro features',
        'No ads',
        'Priority support',
        'Save 2 months!',
      ],
    },
    free: {
      name: 'Explorer',
      price: 'Free',
      period: '',
      features: [
        'Basic lessons',
        'Limited games',
      ],
    },
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      navigate('/payment-success');
    }, 1000);
  };

  return (
    <div className="min-h-screen app-sky-background px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <KidioPageHeader
          backLabel="Back"
          backTo="/"
          title={<h1 className="text-4xl font-bold text-gray-900">Thanh to�n</h1>}
        />

        {/* Payment Form */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className={`rounded-3xl p-8 shadow-lg ${
              plan === 'premium' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-[#2BADEE] to-[#1E90D0]'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-2">{currentPlan.name}</h3>
              <div className="text-4xl font-bold text-white mb-6">
                {currentPlan.price}
                {currentPlan.period && <span className="text-lg">/{currentPlan.period}</span>}
              </div>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-white">
                    <Check className="w-5 h-5 text-white" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg md:col-span-2"
          >
            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: 'card', label: 'Thẻ tín dụng/ghi nợ', icon: CreditCard },
                  { id: 'momo', label: 'MoMo', icon: '📱' },
                  { id: 'banking', label: 'Chuyển khoản', icon: '🏦' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      selectedPayment === method.id
                        ? 'border-[#2BADEE] bg-blue-50'
                        : 'border-gray-200 hover:border-[#2BADEE]/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {typeof method.icon === 'string' ? (
                        <span className="text-3xl">{method.icon}</span>
                      ) : (
                        <method.icon className="w-8 h-8 text-[#2BADEE]" />
                      )}
                      <span className="text-sm font-semibold text-gray-900">{method.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details */}
            {selectedPayment === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày hết hạn
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Billing Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin thanh toán</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={billingInfo.fullName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      placeholder="0123 456 789"
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    placeholder="Số nhà, tên đường, quận/huyện, thành phố"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#2BADEE] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Payment */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white text-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Xác nhận thanh toán
            </motion.button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Bằng việc thanh toán, bạn đồng ý với{' '}
              <a href="#" className="text-[#2BADEE] hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              của chúng tôi
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
