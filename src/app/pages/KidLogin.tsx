import { useNavigate } from 'react-router';
import { createKidId } from '../utils/kidId';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Check, Languages, User } from 'lucide-react';
import { useState } from 'react';

const ageOptions = ['5', '6', '7', '8', '9', '10'] as const;

const experienceOptions = [
  {
    value: 'No',
    description: 'I am brand new',
    color: 'border-sky-200 bg-sky-50',
  },
  {
    value: 'A little',
    description: 'I know some words',
    color: 'border-violet-200 bg-violet-50',
  },
  {
    value: 'Yes',
    description: 'I can use English',
    color: 'border-amber-200 bg-amber-50',
  },
] as const;

type KidExperience = (typeof experienceOptions)[number]['value'];

export function KidLogin() {
  const navigate = useNavigate();
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [kidExperience, setKidExperience] = useState<KidExperience | ''>('');

  const canSubmit = Boolean(kidName.trim() && kidAge && kidExperience);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedName = kidName.trim();
    if (!normalizedName || !kidAge || !kidExperience) return;

    localStorage.setItem('currentKidName', normalizedName);
    localStorage.setItem('currentKidAge', kidAge);
    localStorage.setItem('currentKidId', createKidId());
    const normalizedExperience =
      kidExperience === 'No' ? 'no' : kidExperience === 'A little' ? 'little' : 'yes';
    localStorage.setItem('currentKidExperience', normalizedExperience);
    ['starter', 'explorer', 'builder', 'story', 'speaking'].forEach((pathKey) => {
      localStorage.removeItem(`kidioJourneyIndex:${pathKey}`);
    });

    if (normalizedExperience === 'no') {
      localStorage.setItem('kidioPath', 'starter');
      localStorage.setItem('kidioLevel', 'starter');
      localStorage.setItem('currentKidLevel', 'starter');
      localStorage.setItem('currentKidPath', 'starter');
      localStorage.setItem('currentKidPathLabel', 'Starter Adventure');
      localStorage.setItem('currentKidCurrentTopic', 'Rainbow Valley');
      console.log('Assigned KIDIO path:', 'starter');
      navigate('/kid-dashboard');
      return;
    }

    localStorage.removeItem('kidioPath');
    localStorage.removeItem('kidioLevel');
    localStorage.removeItem('currentKidLevel');
    localStorage.removeItem('currentKidPath');
    localStorage.removeItem('currentKidPathLabel');
    localStorage.removeItem('currentKidCurrentTopic');
    navigate('/placement');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[linear-gradient(135deg,#dff5ff_0%,#f3fbff_42%,#fff3df_100%)] px-4 py-5 text-[#102d54] sm:px-8 sm:py-7">
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

      <button
        type="button"
        onClick={() => navigate('/select-account')}
        className="relative z-20 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2.5 text-sm font-black text-[#102d54] shadow-[0_12px_28px_rgba(43,128,190,0.16)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-sky-200 sm:px-5 sm:py-3 sm:text-base"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      <main className="relative z-10 mx-auto flex w-full max-w-[680px] justify-center py-5 sm:py-7">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-[30px] border border-white/90 bg-white p-5 shadow-[0_30px_90px_rgba(43,128,190,0.18)] sm:rounded-[38px] sm:p-8 lg:p-10"
        >
          <div className="text-center">
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              src="/assets/kid-login-cow-mascot.png"
              alt="Kiki, the KIDIO mascot"
              className="mx-auto h-24 w-24 object-contain drop-shadow-[0_12px_18px_rgba(43,128,190,0.2)] sm:h-28 sm:w-28"
              draggable={false}
            />
            <h1 className="mt-2 text-3xl font-black leading-tight text-[#102d54] sm:text-4xl">
              Hi there!
            </h1>
            <p className="mt-1 text-base font-semibold text-gray-500 sm:text-lg">
              Let&apos;s get to know you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <User className="h-4.5 w-4.5" />
                </span>
                <label htmlFor="kid-name" className="text-lg font-black text-[#102d54] sm:text-xl">
                  What&apos;s your name?
                </label>
              </div>
              <input
                id="kid-name"
                type="text"
                value={kidName}
                onChange={(event) => setKidName(event.target.value)}
                className="h-14 w-full rounded-2xl border-2 border-sky-200 bg-white px-4 text-base font-semibold text-[#102d54] outline-none transition placeholder:text-gray-400 focus:border-sky-500 focus:shadow-[0_0_0_5px_rgba(47,173,238,0.14)] sm:px-5 sm:text-lg"
                placeholder="Enter your name"
                autoComplete="name"
                autoFocus
              />
            </section>

            <div className="border-t-2 border-dashed border-sky-100" />

            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Calendar className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#102d54] sm:text-xl">How old are you?</h2>
                  <p className="mt-0.5 text-sm font-semibold text-gray-500 sm:text-base">
                    Choose your age.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
                {ageOptions.map((age) => {
                  const selected = kidAge === age;

                  return (
                    <motion.button
                      key={age}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setKidAge(age)}
                      className={`h-14 rounded-2xl border-2 text-2xl font-black transition sm:h-16 ${
                        selected
                          ? 'scale-[1.05] border-violet-500 bg-gradient-to-br from-sky-100 to-violet-200 text-violet-900 shadow-[0_12px_24px_rgba(124,58,237,0.22)]'
                          : 'border-sky-100 bg-sky-50/70 text-[#234668] hover:border-sky-300 hover:bg-sky-100'
                      }`}
                      aria-pressed={selected}
                      aria-label={`Age ${age}`}
                    >
                      {age}
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <div className="border-t-2 border-dashed border-sky-100" />

            <section>
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Languages className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#102d54] sm:text-xl">
                    Have you learned English before?
                  </h2>
                  <p className="mt-0.5 text-sm font-semibold text-gray-500 sm:text-base">
                    This helps Kiki choose your path.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {experienceOptions.map((option) => {
                  const selected = kidExperience === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setKidExperience(option.value)}
                      className={`flex min-h-[82px] items-center gap-3 rounded-[20px] border-2 p-4 text-left transition ${
                        selected
                          ? 'scale-[1.02] border-violet-500 bg-gradient-to-br from-sky-100 to-violet-100 shadow-[0_14px_28px_rgba(124,58,237,0.18)]'
                          : `${option.color} hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md`
                      }`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-gray-300 bg-white text-transparent'
                        }`}
                        aria-hidden="true"
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </span>
                      <span>
                        <span className="block text-lg font-black text-[#102d54]">{option.value}</span>
                        <span className="block text-xs font-semibold text-gray-500">
                          {option.description}
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <div className="flex min-h-14 items-center justify-center rounded-2xl bg-[#e8f7ff] px-4 py-3 text-center text-sm font-bold text-[#23506f] sm:text-base">
              ⭐ We will create the perfect learning adventure for you!
            </div>

            <motion.button
              whileHover={canSubmit ? { y: -2, scale: 1.01 } : undefined}
              whileTap={canSubmit ? { scale: 0.98 } : undefined}
              type="submit"
              disabled={!canSubmit}
              className="h-16 w-full rounded-full bg-gradient-to-r from-[#29b8ff] to-[#0877f2] px-5 text-xl font-black text-white shadow-[0_18px_34px_rgba(8,119,242,0.28)] transition enabled:hover:shadow-[0_22px_40px_rgba(8,119,242,0.36)] disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none sm:text-2xl"
            >
              Start My Journey
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
