import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useState } from 'react';

const ageOptions = [
  {
    age: '5',
    className: 'border-sky-200 bg-sky-100/80 shadow-sky-100',
    selectedClassName: 'border-sky-500 bg-sky-300 text-sky-950 shadow-[0_18px_34px_rgba(14,165,233,0.32)] ring-sky-200',
  },
  {
    age: '6',
    className: 'border-emerald-200 bg-emerald-100/80 shadow-emerald-100',
    selectedClassName: 'border-emerald-500 bg-emerald-300 text-emerald-950 shadow-[0_18px_34px_rgba(16,185,129,0.3)] ring-emerald-200',
  },
  {
    age: '7',
    className: 'border-yellow-200 bg-yellow-100/85 shadow-yellow-100',
    selectedClassName: 'border-yellow-500 bg-yellow-300 text-yellow-950 shadow-[0_18px_34px_rgba(234,179,8,0.3)] ring-yellow-200',
  },
  {
    age: '8',
    className: 'border-violet-200 bg-violet-100/80 shadow-violet-100',
    selectedClassName: 'border-violet-500 bg-violet-300 text-violet-950 shadow-[0_18px_34px_rgba(139,92,246,0.3)] ring-violet-200',
  },
  {
    age: '9',
    className: 'border-pink-200 bg-pink-100/80 shadow-pink-100',
    selectedClassName: 'border-pink-500 bg-pink-300 text-pink-950 shadow-[0_18px_34px_rgba(236,72,153,0.28)] ring-pink-200',
  },
  {
    age: '10',
    className: 'border-orange-200 bg-orange-100/80 shadow-orange-100',
    selectedClassName: 'border-orange-500 bg-orange-300 text-orange-950 shadow-[0_18px_34px_rgba(249,115,22,0.28)] ring-orange-200',
  },
];

export function KidLogin() {
  const navigate = useNavigate();
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (kidName.trim()) {
      // Save kid name to localStorage
      localStorage.setItem('currentKid', kidName);

      // Check if there's a pending plan to purchase
      const pendingPlan = sessionStorage.getItem('pendingPlan');
      if (pendingPlan) {
        sessionStorage.removeItem('pendingPlan');
        navigate(`/checkout?plan=${pendingPlan}`);
      } else {
        navigate('/kid-dashboard');
      }
    }
  };

  // Suggest some kid names from parent's account
  const parentData = localStorage.getItem('parentData');
  const savedKids = parentData ? JSON.parse(parentData).kids || [] : [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#dff5ff_0%,#f3fbff_42%,#fff3df_100%)] px-4 py-6 text-[#102d54] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute left-[-72px] top-[150px] h-28 w-52 rounded-[999px] bg-white/72 blur-[1px] before:absolute before:left-8 before:top-[-34px] before:h-24 before:w-24 before:rounded-full before:bg-white/78 after:absolute after:right-8 after:top-[-22px] after:h-20 after:w-20 after:rounded-full after:bg-white/70" />
        <span className="absolute right-[-60px] top-[100px] h-24 w-48 rounded-[999px] bg-white/62 blur-[1px] before:absolute before:left-9 before:top-[-28px] before:h-20 before:w-20 before:rounded-full before:bg-white/68 after:absolute after:right-7 after:top-[-18px] after:h-16 after:w-16 after:rounded-full after:bg-white/62" />
        <span className="absolute bottom-[105px] left-[-54px] h-24 w-48 rounded-[999px] bg-white/58 before:absolute before:left-8 before:top-[-28px] before:h-20 before:w-20 before:rounded-full before:bg-white/68 after:absolute after:right-10 after:top-[-18px] after:h-16 after:w-16 after:rounded-full after:bg-white/64" />
        <span className="absolute bottom-[120px] right-[-70px] h-28 w-56 rounded-[999px] bg-white/66 before:absolute before:left-10 before:top-[-34px] before:h-24 before:w-24 before:rounded-full before:bg-white/72 after:absolute after:right-9 after:top-[-18px] after:h-20 after:w-20 after:rounded-full after:bg-white/66" />

        <span className="absolute left-[13%] top-[30%] h-8 w-8 rounded-full border border-cyan-200 bg-cyan-200/35 shadow-[0_0_28px_rgba(34,211,238,0.22)]" />
        <span className="absolute right-[18%] top-[22%] h-5 w-5 rounded-full border border-sky-200 bg-sky-200/45 shadow-[0_0_22px_rgba(56,189,248,0.24)]" />
        <span className="absolute bottom-[21%] left-[20%] h-4 w-4 rounded-full border border-cyan-200 bg-cyan-200/45" />
        <span className="absolute bottom-[34%] right-[12%] h-9 w-9 rounded-full border border-sky-200 bg-white/40 shadow-[0_0_28px_rgba(56,189,248,0.2)]" />

        <span className="absolute left-[24%] top-[13%] text-3xl font-black text-yellow-300/80">✦</span>
        <span className="absolute right-[24%] top-[16%] text-2xl font-black text-yellow-300/75">✦</span>
        <span className="absolute bottom-[18%] right-[30%] text-3xl font-black text-yellow-300/70">✦</span>
      </div>

      <header className="relative z-20 flex w-fit flex-col items-start gap-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-full focus:outline-none focus:ring-4 focus:ring-sky-200"
          aria-label="KIDIO home"
        >
          <img src="/assets/kidio-logo.png" alt="KIDIO" className="h-14 w-auto sm:h-16" />
        </button>
        <p className="pl-1 text-xs font-black uppercase tracking-[0.22em] text-[#22415f]/70">
          LITTLE STEPS, BIG DREAMS
        </p>
        <button
          type="button"
          onClick={() => navigate('/select-account')}
          className="inline-flex items-center gap-2 rounded-full bg-white/92 px-5 py-3 text-base font-black text-[#102d54] shadow-[0_14px_32px_rgba(43,128,190,0.16)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_38px_rgba(43,128,190,0.2)] focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-168px)] items-center justify-center py-8 lg:-mt-24 lg:min-h-screen lg:py-10">
        <div className="w-[calc(100vw-32px)] max-w-[640px] sm:max-w-[560px] lg:max-w-[640px]">
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-visible rounded-[40px] border border-white/90 bg-white px-5 py-8 shadow-[0_30px_90px_rgba(43,128,190,0.18)] sm:px-10 sm:py-10 lg:px-14 lg:py-12"
          >
            <div className="text-center">
              <div className="relative mx-auto mb-5 flex h-[142px] items-end justify-center sm:h-[188px] lg:h-[228px]">
                <div className="absolute bottom-0 left-1/2 h-[78px] w-[82%] max-w-[300px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.98)_0%,rgba(226,246,255,0.76)_58%,rgba(226,246,255,0)_74%)] shadow-[0_18px_32px_rgba(43,128,190,0.08)]" />
                <motion.div
                  animate={{ y: [0, -9, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <img
                    src="/assets/cow-kidlogin.png"
                    alt="KIDIO Cow Mascot"
                    className="h-auto w-[140px] object-contain drop-shadow-[0_18px_26px_rgba(43,128,190,0.22)] sm:w-[180px] lg:w-[220px]"
                    draggable={false}
                  />
                </motion.div>
              </div>
              <h1 className="mb-2 text-[38px] font-black leading-none text-[#102d54] sm:text-[42px] lg:text-[44px]">
                Hi there!
              </h1>
              <p className="text-lg font-semibold text-gray-500 sm:text-[22px]">
                Let’s get to know you
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-7">
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dff4ff] text-[#188bd3] shadow-[0_10px_20px_rgba(43,128,190,0.12)]">
                    <User className="h-5 w-5" />
                  </span>
                  <label className="text-xl font-black text-[#102d54]">
                    What’s your name?
                  </label>
                </div>
                <input
                  type="text"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  className="h-[60px] w-full rounded-[18px] border-2 border-[#66c8f4] bg-white px-5 text-lg font-semibold text-[#102d54] outline-none transition placeholder:text-gray-400 focus:border-[#1fa8ee] focus:shadow-[0_0_0_5px_rgba(47,173,238,0.16)]"
                  placeholder="Enter your name"
                  required
                  autoFocus
                />
              </section>

              <div className="border-t-2 border-dashed border-[#bde7fb]" />

              <section>
                <div className="mb-5 flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-500 shadow-[0_10px_20px_rgba(139,92,246,0.12)]">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <label className="text-xl font-black text-[#102d54]">
                      How old are you?
                    </label>
                    <p className="mt-1 text-base font-semibold text-gray-500">Choose your age.</p>
                  </div>
                </div>

                <input
                  value={kidAge}
                  onChange={() => undefined}
                  required
                  aria-label="Selected age"
                  className="pointer-events-none absolute h-px w-px opacity-0"
                  tabIndex={-1}
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {ageOptions.map((option) => {
                    const selected = kidAge === option.age;

                    return (
                      <motion.button
                        key={option.age}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setKidAge(option.age)}
                        className={`h-[68px] rounded-[18px] border-2 text-3xl font-black shadow-lg transition ${option.className} ${
                          selected
                            ? `scale-[1.05] ring-4 ${option.selectedClassName}`
                            : 'hover:border-[#76ccef] hover:shadow-xl'
                        }`}
                        aria-pressed={selected}
                      >
                        {option.age}
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              {/* Saved Kids Quick Login */}
              {savedKids.length > 0 && (
                <section>
                  <p className="mb-3 text-center font-semibold text-gray-500">Or choose quickly:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {savedKids.map((kid: any) => (
                      <motion.button
                        key={kid.name}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setKidName(kid.name);
                          localStorage.setItem('currentKid', kid.name);

                          // Check if there's a pending plan to purchase
                          const pendingPlan = sessionStorage.getItem('pendingPlan');
                          if (pendingPlan) {
                            sessionStorage.removeItem('pendingPlan');
                            navigate(`/checkout?plan=${pendingPlan}`);
                          } else {
                            navigate('/kid-dashboard');
                          }
                        }}
                        className="rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-4 text-lg font-bold text-gray-800 transition-all hover:shadow-lg"
                      >
                        {kid.name}
                      </motion.button>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex min-h-[58px] items-center justify-center rounded-2xl bg-[#e8f7ff] px-5 py-3 text-center text-base font-bold text-[#23506f] sm:text-lg">
                ⭐ We will create the perfect learning adventure for you!
              </div>

              <motion.button
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="h-[70px] w-full rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] text-2xl font-black text-white shadow-[0_20px_38px_rgba(8,119,242,0.28)] transition hover:shadow-[0_24px_44px_rgba(8,119,242,0.36)]"
              >
                Let’s Learn!
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
