import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MessageCircle, Send, Phone, Mail, HelpCircle, ChevronDown, BookOpen, Shield, CreditCard, Users } from 'lucide-react';
import { useState } from 'react';
import { KidioPageHeader } from '../../components/KidioPageHeader';

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'You can create an account by clicking the "Sign Up" button on the homepage. Parents need email and password, while kids only need to enter their name.',
  },
  {
    question: 'How many kid accounts can I manage?',
    answer: 'With a parent account, you can manage unlimited kid accounts. Each child will have their own learning progress.',
  },
  {
    question: 'How do I track my child\'s learning progress?',
    answer: 'Log in to the Parent Dashboard to view detailed reports on study time, vocabulary learned, completed lessons, and achievements.',
  },
  {
    question: 'What features does Fluent Pro include?',
    answer: 'Fluent Pro unlocks all lessons, full video library, offline mode, detailed progress reports, and no ads. Price: 69,000 VND/month.',
  },
  {
    question: 'What is the difference between Fluent Pro and Premium?',
    answer: 'Premium includes all Fluent Pro features plus priority support and saves you 2 months with annual billing. Fluent Pro: 69,000 VND/month. Premium: 690,000 VND/year.',
  },
  {
    question: 'Do I see ads with the free plan?',
    answer: 'Yes, the free Explorer plan includes ads. Upgrade to Fluent Pro or Premium for an ad-free experience.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You will still have access to the service until the end of your current billing cycle.',
  },
  {
    question: 'What age group is the app suitable for?',
    answer: 'Kidio Learning is designed for children aged 5-10, with content and teaching methods appropriate for each age group.',
  },
  {
    question: 'I\'m having technical issues, what should I do?',
    answer: 'Try refreshing the page or clearing your browser cache. If the problem persists, contact us via AI chat or email support@kidiolearning.com.',
  },
  {
    question: 'Is there an offline learning mode?',
    answer: 'Yes, with Fluent Pro, you can download lessons and videos to learn offline anytime, anywhere.',
  },
];

const parentTips = [
  {
    icon: BookOpen,
    title: 'Schedule Regular Learning',
    description: 'Encourage your child to study 15-20 minutes daily for best results.',
  },
  {
    icon: Users,
    title: 'Learn Together',
    description: 'Join your child in learning to create motivation and family bonding.',
  },
  {
    icon: Shield,
    title: 'Track Progress',
    description: 'Check Parent Dashboard weekly to monitor your child\'s progress.',
  },
  {
    icon: CreditCard,
    title: 'Upgrade When Ready',
    description: 'Choose Fluent Pro when your child is ready to learn more.',
  },
];

export function CustomerSupport() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m the AI Assistant for Kidio Learning. How can I help you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      setChatMessages([...chatMessages, { type: 'user', text: inputMessage }]);
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          'Thank you for contacting us! I\'m reviewing your question...',
          'For better support, you can check the FAQ section below or contact us directly at support@kidiolearning.com',
          'I will forward your request to our support team. You will receive a response within 24 hours.',
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      }, 1000);

      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen app-sky-background px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <KidioPageHeader backLabel="Home" backTo="/" />

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-2xl text-gray-600">Need help? Our AI assistant is here to support you.</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* AI Chat Box - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] p-6 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">AI Support Assistant</h2>
                <p className="text-white/80">Online • Instant Response</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 bg-gray-50">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-[#2BADEE] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 shadow-md rounded-bl-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t-2 border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#2BADEE] outline-none transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Contact Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#2BADEE]" />
                Direct Contact
              </h3>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-3 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Call: 1900-1900
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </motion.button>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-lg border-2 border-blue-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">⏰ Support Hours</h3>
              <p className="text-gray-700 mb-2">Mon - Fri: 8:00 - 20:00</p>
              <p className="text-gray-700 mb-2">Sat - Sun: 9:00 - 18:00</p>
              <p className="text-sm text-gray-600 mt-3">📧 Email: support@kidiolearning.com</p>
            </div>
          </motion.div>
        </div>

        {/* Parent Help Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">💡 Tips for Parents</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {parentTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#2BADEE] to-[#1E90D0] rounded-2xl flex items-center justify-center mb-4">
                  <tip.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#2BADEE]" />
            Frequently Asked Questions (FAQ)
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#2BADEE] transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 flex items-center justify-between bg-white hover:bg-blue-50 transition-all"
                >
                  <span className="text-lg font-bold text-gray-900 text-left">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-[#2BADEE]" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 bg-gradient-to-r from-blue-50 to-purple-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-[#2BADEE] to-[#1E90D0] rounded-3xl p-8 shadow-2xl text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-xl mb-6">Our support team is always ready to help you!</p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#2BADEE] rounded-full text-xl font-bold hover:shadow-2xl transition-all"
            >
              Chat with AI Assistant
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-xl font-bold hover:bg-white hover:text-[#2BADEE] transition-all"
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
