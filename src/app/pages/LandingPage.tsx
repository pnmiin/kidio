import { useNavigate } from "react-router";
import {
  BookOpen,
  Check,
  ChevronRight,
  Facebook,
  Globe2,
  Headset,
  Heart,
  Instagram,
  MessageCircle,
  Music2,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Youtube,
} from "lucide-react";
import { PageBackground } from "../../components/PageBackground";

const navItems = [
  { label: "Home", target: "top" },
  { label: "Lessons", target: "lessons" },
  { label: "Levels", target: "levels" },
  { label: "Parents", target: "parents" },
  { label: "Pricing", target: "pricing" },
  { label: "About", target: "footer" },
];

const featureCards = [
  {
    title: "Watch",
    description: "Fun videos & animated stories",
    image: "/assets/feature-watch-video.png",
    color: "text-sky-500 border-sky-200",
  },
  {
    title: "Listen",
    description: "Songs, sounds & native pronunciation",
    image: "/assets/feature-listen-audio.png",
    color: "text-violet-500 border-violet-200",
  },
  {
    title: "Speak",
    description: "Practice speaking with confidence",
    image: "/assets/feature-speak-microphone.png",
    color: "text-emerald-500 border-emerald-200",
  },
  {
    title: "Play",
    description: "Exciting games that build skills",
    image: "/assets/feature-play-game.png",
    color: "text-orange-500 border-orange-200",
  },
] as const;

const pathSteps = [
  {
    title: "Pick a level",
    description: "Choose the perfect level for your child.",
    image: "/assets/learning-path-pick-level.png",
    badge: "bg-[#0877f2]",
  },
  {
    title: "Learn by playing",
    description: "Fun lessons & activities they'll love.",
    image: "/assets/learning-path-play-lesson.png",
    badge: "bg-violet-500",
  },
  {
    title: "Earn stars",
    description: "Complete missions and earn awesome rewards.",
    image: "/assets/learning-path-earn-stars.png",
    badge: "bg-emerald-500",
  },
  {
    title: "Parents track progress",
    description: "See growth, celebrate wins, and stay involved.",
    image: "/assets/parent_kid.png",
    badge: "bg-orange-500",
  },
] as const;

const learningLevels = [
  {
    title: "Age 5",
    subtitle: "First English words",
    description: "Friendly sounds, colors, animals, and hello words.",
    image: "/assets/age5.png",
    bg: "from-emerald-100 to-green-50",
    accent: "text-emerald-600",
    dot: "bg-emerald-400",
  },
  {
    title: "Age 6",
    subtitle: "Basic vocabulary",
    description: "Everyday words for family, school, food, and play.",
    image: "/assets/age6.png",
    bg: "from-sky-100 to-blue-50",
    accent: "text-sky-600",
    dot: "bg-sky-400",
  },
  {
    title: "Age 7",
    subtitle: "Simple sentences",
    description: "Short answers, simple questions, and classroom phrases.",
    image: "/assets/age7.png",
    bg: "from-violet-100 to-purple-50",
    accent: "text-violet-600",
    dot: "bg-violet-400",
  },
  {
    title: "Age 8",
    subtitle: "Reading confidence",
    description: "Story words, sight words, and guided reading practice.",
    image: "/assets/age8.png",
    bg: "from-amber-100 to-orange-50",
    accent: "text-orange-600",
    dot: "bg-orange-400",
  },
  {
    title: "Age 9",
    subtitle: "Grammar building",
    description: "Useful patterns, tenses, and stronger sentence habits.",
    image: "/assets/age9.png",
    bg: "from-yellow-100 to-amber-50",
    accent: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  {
    title: "Age 10",
    subtitle: "Real conversation skills",
    description: "Natural speaking practice for real-life situations.",
    image: "/assets/age10.png",
    bg: "from-pink-100 to-rose-50",
    accent: "text-pink-600",
    dot: "bg-pink-400",
  },
] as const;

const pricingPlans = [
  {
    name: "Explorer",
    price: "Free",
    period: "Basic access",
    action: "Get Started",
    onClick: "select" as const,
    benefits: ["Limited lessons", "Basic progress", "Up to 1 child"],
  },
  {
    name: "Fluent Pro",
    price: "69,000",
    period: "VND/month",
    action: "Start Free Trial",
    onClick: "pro" as const,
    popular: true,
    benefits: [
      "All lessons",
      "Detailed reports",
      "Up to 2 children",
      "Cancel anytime",
    ],
  },
  {
    name: "Premium",
    price: "690,000",
    period: "VND/year",
    action: "Go Premium",
    onClick: "premium" as const,
    benefits: [
      "All Pro features",
      "Up to 4 children",
      "Priority support",
      "Save 2 months",
    ],
  },
];

const footerSocialLinks = [
  {
    label: "Facebook",
    Icon: Facebook,
    className: "bg-sky-100 text-sky-600 hover:bg-sky-200",
  },
  {
    label: "Instagram",
    Icon: Instagram,
    className: "bg-pink-100 text-pink-500 hover:bg-pink-200",
  },
  {
    label: "YouTube",
    Icon: Youtube,
    className: "bg-rose-100 text-rose-500 hover:bg-rose-200",
  },
  {
    label: "TikTok",
    Icon: Music2,
    className: "bg-violet-100 text-violet-500 hover:bg-violet-200",
  },
];

const footerColumns = [
  {
    title: "Explore",
    Icon: BookOpen,
    iconClassName: "bg-violet-100 text-violet-500",
    underlineClassName: "from-violet-300 to-sky-300",
    dotClassName: "bg-violet-300",
    links: ["Lessons", "Games", "Rewards", "Levels"],
  },
  {
    title: "Parents",
    Icon: Heart,
    iconClassName: "bg-pink-100 text-pink-500",
    underlineClassName: "from-pink-300 to-rose-300",
    dotClassName: "bg-pink-300",
    links: ["Progress", "Safety", "Reports", "Family"],
  },
  {
    title: "Company",
    Icon: UsersRound,
    iconClassName: "bg-emerald-100 text-emerald-500",
    underlineClassName: "from-emerald-300 to-teal-300",
    dotClassName: "bg-emerald-300",
    links: ["About Us", "Careers", "Press", "Contact"],
  },
  {
    title: "Support",
    Icon: Headset,
    iconClassName: "bg-orange-100 text-orange-500",
    underlineClassName: "from-orange-300 to-amber-300",
    dotClassName: "bg-orange-300",
    links: ["Help Center", "Billing", "Privacy", "Terms"],
  },
];

function SkyObjectField() {
  return (
    <div className="hero-sky-objects" aria-hidden="true">
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-back cloud-soft-left"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-back cloud-top-right"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-back cloud-mascot-back"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-mid cloud-left-bottom"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-mid cloud-center-bottom"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-mid cloud-right-bottom"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-front cloud-front-left"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-front cloud-front-center"
        draggable={false}
      />
      <img
        src="/assets/cloud.png"
        alt=""
        className="hero-cloud cloud-front cloud-front-right"
        draggable={false}
      />
      <div>
        <img
          src="/assets/balloon.png"
          alt=""
          className="hero-balloon"
          draggable={false}
        />
      </div>
      <img
        src="/assets/rainbow.png"
        alt=""
        className="hero-rainbow"
        draggable={false}
      />
      {[
        "sparkle-one",
        "sparkle-two",
        "sparkle-three",
        "sparkle-four",
        "sparkle-five",
        "sparkle-six",
        "sparkle-seven",
        "sparkle-eight",
      ].map((className, index) => (
        <img
          key={className}
          src={`/assets/decorative-star-${index + 1}.png`}
          alt=""
          className={`hero-sparkle ${className}`}
          draggable={false}
        />
      ))}
    </div>
  );
}

function PricingCard({ plan }: { plan: (typeof pricingPlans)[number] }) {
  const navigate = useNavigate();
  const isPro = plan.name === "Fluent Pro";
  const isPremium = plan.name === "Premium";

  const handleClick = () => {
    if (plan.onClick === "select") {
      navigate("/select-account");
      return;
    }

    const currentParent = localStorage.getItem("currentParent");
    const currentKid = localStorage.getItem("currentKid");
    if (currentParent || currentKid) {
      navigate(`/checkout?plan=${plan.onClick}`);
    } else {
      sessionStorage.setItem("pendingPlan", plan.onClick);
      navigate("/select-account");
    }
  };

  return (
    <div
      className={`relative rounded-[22px] border p-5 text-center ${
        isPro
          ? "border-[#139dff] bg-gradient-to-b from-[#20a6ff] to-[#0877f2] text-white shadow-[0_18px_36px_rgba(0,119,242,0.26)] md:-mt-5 md:min-h-[285px]"
          : isPremium
            ? "border-emerald-100 bg-emerald-50/70 text-[#102d54]"
            : "border-sky-100 bg-white text-[#102d54]"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-yellow-300 px-4 py-1 text-xs font-black text-[#102d54]">
          Most Popular
        </span>
      )}
      <p
        className={`text-xs font-black ${isPro ? "text-white/86" : "text-[#102d54]"}`}
      >
        {plan.name}
      </p>
      <h3
        className={`mt-3 text-3xl font-black ${isPremium ? "text-emerald-600" : ""}`}
      >
        {plan.price}
      </h3>
      <p
        className={`text-xs font-bold ${isPro ? "text-white" : "text-[#61758a]"}`}
      >
        {plan.period}
      </p>
      <ul className="mt-5 space-y-3 text-left text-xs font-bold">
        {plan.benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-2">
            <Check
              className={`h-4 w-4 ${isPro ? "text-white" : "text-emerald-500"}`}
            />
            {benefit}
          </li>
        ))}
      </ul>
      <button
        onClick={handleClick}
        className={`mt-5 w-full rounded-full px-4 py-3 text-xs font-black transition-colors ${
          isPro
            ? "bg-white text-[#0877f2]"
            : isPremium
              ? "bg-emerald-500 text-white"
              : "border border-[#0877f2] bg-white text-[#0877f2]"
        }`}
      >
        {plan.action}
      </button>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  const scrollToSection = (target: string) => {
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(target);
    if (!element) return;
    const navOffset = 96;
    const top =
      element.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <PageBackground variant="landing" className="text-[#102d54]">
      <header className="relative z-50 h-auto bg-[#8ed8ff] px-3 pt-4 sm:px-8 sm:pt-7 lg:px-12">
        <nav className="mx-auto flex max-w-[1440px] flex-col gap-3 rounded-[28px] border border-white/70 bg-white/82 px-4 py-3 shadow-[0_18px_45px_rgba(43,128,190,0.13)] lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:px-5 lg:py-3.5">
          <div className="flex w-full items-center justify-between gap-3 lg:contents lg:w-auto">
            <button
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center rounded-full focus:outline-none focus:ring-4 focus:ring-sky-200 lg:order-1"
              aria-label="KIDIO home"
            >
              <img
                src="/assets/kidio-logo.png"
                alt="KIDIO"
                className="h-10 w-auto sm:h-12"
              />
            </button>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:order-3">
              <button
                onClick={() => navigate("/select-account")}
                className="inline-flex rounded-[18px] border border-white bg-white px-3 py-2.5 text-xs font-black text-[#0877f2] shadow-[0_12px_26px_rgba(42,119,190,0.12)] transition-colors hover:bg-sky-50 sm:px-6 sm:py-3 sm:text-sm"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/select-account")}
                className="inline-flex rounded-[18px] bg-gradient-to-r from-[#1891ff] to-[#006bff] px-3 py-2.5 text-xs font-black text-white shadow-[0_14px_28px_rgba(0,112,255,0.25)] transition-colors hover:from-[#0d85f4] hover:to-[#005ee0] sm:px-6 sm:py-3 sm:text-sm"
              >
                <span className="hidden sm:inline">Start Free Trial</span>
                <span className="sm:hidden">Start</span>
              </button>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-1.5 lg:order-2 lg:w-auto lg:flex-nowrap lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className={`relative rounded-full px-2.5 py-1.5 text-[11px] font-extrabold transition hover:text-[#0877f2] sm:px-3 sm:text-xs lg:px-4 lg:py-2 lg:text-sm ${
                  item.label === "Home" ? "text-[#0877f2]" : "text-[#092b50]"
                }`}
              >
                {item.label}
                {item.label === "Home" && (
                  <span className="absolute bottom-0 left-0 right-0 mx-auto h-1 w-8 rounded-full bg-[#0877f2]" />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main
        id="top"
        className="overflow-x-hidden bg-[linear-gradient(180deg,#8edaff_0%,#dff5ff_31%,#f8fdff_64%,#ffffff_100%)] px-5 pb-14 pt-0 sm:px-8 lg:px-12"
      >
        <section className="relative -mx-5 min-h-[760px] overflow-hidden bg-[linear-gradient(180deg,#8ed8ff_0%,#c9f2ff_62%,#f6fbff_100%)] sm:-mx-8 lg:-mx-12">
          <div className="relative mx-auto grid min-h-[760px] max-w-[1440px] grid-cols-1 overflow-visible px-5 pt-8 sm:px-8 lg:grid-cols-[46%_54%] lg:items-center lg:px-[72px] lg:pt-10">
            <SkyObjectField />

            <div className="relative z-20 ml-0 w-full max-w-[620px] pb-8 pt-6 sm:pt-8 lg:ml-[56px] lg:pb-12 lg:pt-0">
              <h1 className="mb-7 max-w-2xl text-5xl font-extrabold leading-[1.05] text-[#102d54] sm:text-[56px] lg:text-[64px]">
                Learn English
                <br />
                Through{" "}
                <span className="bg-gradient-to-r from-[#ff5c9f] to-[#ff7db9] bg-clip-text text-transparent">
                  Games
                </span>{" "}
                &
                <br />
                <span className="bg-gradient-to-r from-[#03a566] to-[#20c987] bg-clip-text text-transparent">
                  Adventures
                </span>
              </h1>
              <p className="max-w-[580px] text-lg font-semibold leading-[1.65] text-[#24415f]">
                Interactive lessons, fun activities, and lovable characters help
                your child speak confidently and fall in love with English.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/select-account")}
                  className="inline-flex items-center justify-center gap-2 rounded-[24px] bg-gradient-to-r from-[#ff4d93] to-[#ff7ab0] px-8 py-4 text-base font-black text-white shadow-[0_18px_32px_rgba(255,77,147,0.28)]"
                >
                  Start Free Trial
                  <Sparkles className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollToSection("lessons")}
                  className="inline-flex items-center justify-center gap-3 rounded-[24px] border-2 border-[#9bd3ff] bg-white/78 px-8 py-4 text-base font-black text-[#0877f2] shadow-[0_16px_28px_rgba(43,128,190,0.12)]"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Watch Video
                </button>
              </div>
            </div>

            <div className="relative z-10 h-[360px] w-full lg:h-[600px]">
              {[
                "left-[240px] top-[70px] w-5 opacity-[0.45]",
                "right-[150px] top-[70px] w-6 opacity-[0.55]",
                "left-[310px] top-[230px] w-5 opacity-50",
                "right-[40px] top-[350px] w-5 opacity-[0.48]",
              ].map((className, index) => (
                <img
                  key={className}
                  src={`/assets/decorative-star-${index + 1}.png`}
                  alt=""
                  className={`absolute z-[2] object-contain ${className}`}
                  draggable={false}
                />
              ))}
              <img
                src="/assets/cloud.png"
                alt=""
                className="pointer-events-none absolute left-[-20px] top-[105px] z-[3] w-[220px] object-contain opacity-[0.42]"
                draggable={false}
              />
              <img
                src="/assets/cloud.png"
                alt=""
                className="pointer-events-none absolute right-[15px] top-[145px] z-[3] w-[165px] object-contain opacity-50"
                draggable={false}
              />
              <img
                src="/assets/cloud.png"
                alt=""
                className="pointer-events-none absolute bottom-[30px] left-[15px] z-[4] w-[195px] object-contain opacity-55"
                draggable={false}
              />
              <img
                src="/assets/castle.png"
                alt=""
                className="absolute bottom-[250px] right-[-70px] z-[5] w-[220px] object-contain"
                draggable={false}
              />
              <div className="absolute bottom-[20px] left-1/2 w-[340px] -translate-x-1/2 lg:bottom-[65px] lg:left-auto lg:right-[40px] lg:w-[520px] lg:translate-x-0">
                <div className="absolute left-[-18px] top-[18px] z-[30] w-[190px] rounded-[30px] bg-white px-5 py-4 text-center shadow-[0_18px_38px_rgba(43,128,190,0.15)] max-[1280px]:left-[-4px] max-[1280px]:top-[10px] max-[1280px]:w-[175px] max-[1024px]:left-[16px] max-[1024px]:top-[8px] max-[1024px]:w-[160px] max-[900px]:hidden">
                  <p className="text-[18px] font-black text-[#102d54]">
                    Hi there!
                  </p>
                  <p className="mx-auto mt-3 max-w-[9rem] text-[12px] font-extrabold leading-[1.25] text-[#21435f]">
                    I'm Kiki! Let's learn English together!
                  </p>
                  <span className="absolute -right-3 bottom-8 h-9 w-9 bg-white" />
                </div>
                <img
                  src="/assets/mascot-island.png"
                  alt="cow mascot"
                  className="relative z-[6] w-full object-contain"
                />
              </div>
              <img
                src="/assets/cloud.png"
                alt=""
                className="pointer-events-none absolute bottom-[-15px] left-[210px] z-[4] w-[230px] object-contain opacity-55"
                draggable={false}
              />
              <img
                src="/assets/cloud.png"
                alt=""
                className="pointer-events-none absolute right-[-25px] top-[20px] z-[3] w-[205px] object-contain opacity-45"
                draggable={false}
              />
            </div>
          </div>
        </section>

        <section
          id="lessons"
          className="relative z-20 mx-auto mt-8 max-w-[1440px] lg:mt-12"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feature) => (
              <div
                key={feature.title}
                className="group flex min-h-[180px] items-center gap-5 rounded-[28px] border border-white/85 bg-white/92 p-6 shadow-[0_20px_42px_rgba(43,128,190,0.13)] transition-colors hover:border-sky-200"
              >
                <img
                  src={feature.image}
                  alt=""
                  className="h-24 w-24 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-black text-[#102d54]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#38536d]">
                    {feature.description}
                  </p>
                </div>
                <button
                  onClick={() => scrollToSection("levels")}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-[0_10px_20px_rgba(43,128,190,0.11)] transition-colors ${feature.color}`}
                  aria-label={`${feature.title} lessons`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] py-11">
          <h2 className="text-center text-3xl font-black text-[#102d54]">
            <span className="mr-5 text-yellow-300">*</span>A magical path for
            every little learner
            <span className="ml-5 text-yellow-300">*</span>
          </h2>
          <div className="relative mt-8 grid gap-6 lg:grid-cols-4">
            <div className="absolute left-[11%] right-[11%] top-1/2 hidden border-t-4 border-dotted border-[#9bd3ff] lg:block" />
            {pathSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative z-10 flex min-h-[150px] items-center gap-5 rounded-[24px] border border-white/85 bg-white/92 p-5 shadow-[0_18px_38px_rgba(43,128,190,0.11)] transition-colors hover:border-sky-200"
              >
                <span
                  className={`absolute -top-3 left-5 flex h-9 w-9 items-center justify-center rounded-full ${step.badge} text-base font-black text-white shadow-[0_10px_18px_rgba(43,128,190,0.16)]`}
                >
                  {index + 1}
                </span>
                <img
                  src={step.image}
                  alt=""
                  className="h-20 w-20 shrink-0 object-contain"
                />
                <div>
                  <h3 className="font-black text-[#102d54]">{step.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-5 text-[#38536d]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div
            id="levels"
            className="rounded-[32px] border border-white/85 bg-white/92 p-6 shadow-[0_22px_48px_rgba(43,128,190,0.12)] lg:col-span-2"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-[#102d54]">
                Learning Levels <span className="text-yellow-300">✨</span>
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-[#526b82]">
                Find the perfect learning path for your child's age.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {learningLevels.map((level) => (
                <div
                  key={level.title}
                  className={`flex min-h-[260px] flex-col rounded-[28px] bg-gradient-to-b ${level.bg} p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_18px_32px_rgba(43,128,190,0.13)] transition-colors hover:outline hover:outline-2 hover:outline-white`}
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-white/58 shadow-[inset_0_8px_16px_rgba(255,255,255,0.72)]">
                    <img
                      src={level.image}
                      alt=""
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  <h3 className={`mt-4 text-lg font-black ${level.accent}`}>
                    {level.title}
                  </h3>
                  <p className="mt-1 text-xs font-black text-[#102d54]">
                    {level.subtitle}
                  </p>
                  <p className="mt-3 flex-1 text-xs font-semibold leading-5 text-[#38536d]">
                    {level.description}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${level.dot}`} />
                    <span
                      className={`h-2 w-2 rounded-full ${level.dot} opacity-60`}
                    />
                    <span
                      className={`h-2 w-2 rounded-full ${level.dot} opacity-35`}
                    />
                    <span className="ml-1 text-sm text-yellow-400">★</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 text-xs font-black text-[#38536d] sm:grid-cols-3">
              {[
                "Aligned with CEFR",
                "Fun for all ages",
                "Track progress easily",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-4 py-3 text-center shadow-[0_10px_18px_rgba(43,128,190,0.08)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            id="parents"
            className="rounded-[28px] border border-white/85 bg-white/92 p-6 shadow-[0_22px_48px_rgba(43,128,190,0.12)]"
          >
            <h2 className="mb-5 text-xl font-black text-[#102d54]">
              Why Parents Love KIDIO
            </h2>
            <ul className="space-y-4">
              {[
                "Safe, ad-free learning environment",
                "Curriculum designed by experts",
                "Progress reports & achievements",
                "Works on any device, anytime",
                "Builds confidence & real skills",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm font-bold text-[#38536d]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-[22px] border border-sky-100 bg-white p-4 shadow-[0_12px_28px_rgba(43,128,190,0.09)]">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/parent-community-rating-star.png"
                  alt=""
                  className="h-14 w-14 rounded-2xl object-contain"
                />
                <div>
                  <p className="text-sm font-black text-[#102d54]">
                    Join thousands of parents
                  </p>
                  <p className="text-xs font-bold text-[#61758a]">
                    who trust KIDIO
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-black text-amber-400">
                ***** <span className="ml-2 text-[#102d54]">4.9/5</span>
              </p>
            </div>
          </div>

          <div
            id="pricing"
            className="rounded-[28px] border border-white/85 bg-white/92 p-5 shadow-[0_22px_48px_rgba(43,128,190,0.12)]"
          >
            <h2 className="mb-5 text-center text-xl font-black text-[#102d54]">
              Simple Pricing for Happy Families
            </h2>
            <div className="grid items-end gap-3 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-[1440px] pb-4 pt-9">
          <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-r from-violet-50 via-pink-50 to-sky-50 px-8 py-8 shadow-[0_22px_48px_rgba(43,128,190,0.12)] lg:flex-row">
            <div className="flex items-center gap-6">
              <img
                src="/assets/learning-path-earn-stars.png"
                alt=""
                className="h-24 w-24 object-contain"
              />
              <div>
                <h2 className="text-3xl font-black text-[#102d54]">
                  Start your child's English adventure today!
                </h2>
                <p className="mt-2 text-lg font-semibold text-[#38536d]">
                  7-day free trial - Cancel anytime - No credit card required
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/select-account")}
                className="rounded-[24px] bg-gradient-to-r from-[#ff4d93] to-[#ff7ab0] px-8 py-4 text-base font-black text-white shadow-[0_16px_30px_rgba(255,77,147,0.26)]"
              >
                Start Free Trial
              </button>
              <img
                src="/assets/start-learning-backpack.png"
                alt=""
                className="hidden h-28 w-28 object-contain md:block"
              />
            </div>
          </div>
        </section>
      </main>
      <footer
        id="footer"
        className="relative overflow-hidden rounded-t-[42px] bg-gradient-to-b from-[#dff4ff] via-[#edfaff] to-[#fff8ec] px-4 pb-8 pt-24 text-[#17324f] sm:px-6"
      >
        <svg
          className="absolute left-0 top-0 h-24 w-full text-white/78"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0h1440v58c-84 28-150 10-232 22-113 17-174 50-301 26-86-16-135-43-235-28-109 16-156 58-284 33-87-17-131-45-230-35-68 7-109 24-158 10V0Z"
            fill="currentColor"
          />
        </svg>
        <span
          className="pointer-events-none absolute left-[5%] top-24 h-8 w-20 rounded-full bg-white/72 shadow-[32px_3px_0_rgba(255,255,255,0.5),62px_0_0_rgba(255,255,255,0.36)]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute right-[7%] top-28 h-9 w-24 rounded-full bg-white/66 shadow-[38px_2px_0_rgba(255,255,255,0.46),72px_0_0_rgba(255,255,255,0.32)]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-[42%] top-20 h-6 w-14 rounded-full bg-white/48 shadow-[24px_1px_0_rgba(255,255,255,0.36)] max-md:hidden"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-[18%] top-44 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(251,191,36,0.6)]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute right-[24%] bottom-24 h-1.5 w-1.5 rounded-full bg-pink-300 shadow-[0_0_16px_rgba(244,114,182,0.55)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-white/90 bg-gradient-to-br from-white/92 via-[#f8fdff]/90 to-[#eaf8ff]/88 p-6 shadow-[0_24px_58px_rgba(43,173,238,0.16)] md:p-8 lg:p-12">
            <div
              className="absolute -right-8 bottom-0 hidden h-28 w-32 lg:block"
              aria-hidden="true"
            >
              <div className="absolute bottom-0 right-0 h-16 w-32 rounded-full bg-transparent/80 shadow-[inset_0_10px_18px_rgba(255,255,255,0.8),0_12px_24px_rgba(43,173,238,0.12)]" />
              <img
                src="/assets/mascot.png"
                alt=""
                className="absolute bottom-7 right-6 h-24 w-auto"
              />
              <Heart className="absolute right-24 top-2 h-5 w-5 fill-pink-300 text-pink-400" />
            </div>

            <div className="grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[1.35fr_repeat(4,1fr)_0.36fr]">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="mx-auto inline-flex rounded-[28px] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_30px_rgba(43,173,238,0.14)] sm:mx-0">
                  <img
                    src="/images/kidio-logo.png"
                    alt="KIDIO"
                    className="h-24 w-auto"
                  />
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#2BADEE]">
                  Little Steps, Big Dreams
                </p>
                <p className="mx-auto mt-4 max-w-sm text-base font-semibold leading-7 text-slate-600 sm:mx-0">
                  English games, adventures, and confidence-building practice
                  for curious kids.
                </p>
                <div className="mt-6 flex justify-center gap-3 sm:justify-start">
                  {footerSocialLinks.map(({ label, Icon, className }) => (
                    <a
                      key={label}
                      href="#top"
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection("top");
                      }}
                      className={`flex h-11 w-11 items-center justify-center rounded-full ${className} shadow-[0_10px_20px_rgba(43,173,238,0.11)] transition-colors`}
                      aria-label={label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {footerColumns.map(
                ({
                  title,
                  Icon,
                  iconClassName,
                  underlineClassName,
                  dotClassName,
                  links,
                }) => (
                  <div
                    key={title}
                    className="relative px-1 sm:px-5 lg:border-l lg:border-sky-100/80"
                  >
                    <div
                      className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName} shadow-[0_10px_18px_rgba(43,173,238,0.1)] sm:mx-0`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-black text-[#17324f]">{title}</h3>
                    <span
                      className={`mx-auto mt-2 block h-1 w-10 rounded-full bg-gradient-to-r ${underlineClassName} sm:mx-0`}
                    />
                    <ul className="mt-5 space-y-3 text-sm font-bold text-slate-600">
                      {links.map((link) => (
                        <li key={link}>
                          <a
                            href={
                              link === "Help Center"
                                ? "/customer-support"
                                : "#top"
                            }
                            onClick={(event) => {
                              event.preventDefault();
                              if (link === "Help Center") {
                                navigate("/customer-support");
                                return;
                              }
                              scrollToSection("top");
                            }}
                            className="inline-flex items-center gap-2 transition-colors hover:text-[#2BADEE]"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${dotClassName}`}
                            />
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}

              <div className="hidden lg:block" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-[999px] border border-white/90 bg-white/82 p-3 text-sm font-bold text-slate-600 shadow-[0_14px_34px_rgba(43,173,238,0.12)] md:grid-cols-3 md:items-center">
            <span className="px-4 py-2 text-center md:text-left">
              Copyright 2026 KIDIO. All rights reserved.
            </span>
            <span className="inline-flex items-center justify-center gap-2 border-y border-sky-100 px-4 py-2 text-emerald-700 md:border-x md:border-y-0">
              <ShieldCheck className="h-4 w-4" />
              Safe learning for children
            </span>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[#238FCC] transition-colors hover:text-[#0877f2]">
              <Globe2 className="h-4 w-4" />
              English
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>

      <button
        onClick={() => navigate("/customer-support")}
        className="absolute bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#2BADEE] to-emerald-300 text-white shadow-[0_18px_36px_rgba(43,173,238,0.34)] transition-colors hover:from-[#1f9bd9] hover:to-emerald-400"
        title="AI Support"
      >
        <MessageCircle className="h-8 w-8" />
      </button>
    </PageBackground>
  );
}
