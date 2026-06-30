import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Logo } from './Logo';

export function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 92;
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-sky-100 shadow-[0_8px_30px_rgba(43,173,238,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Logo />
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: 'Lessons', sectionId: 'features' },
            { label: 'Parents', sectionId: 'parents' },
            { label: 'Ages', sectionId: 'ages' },
            { label: 'Price', sectionId: 'pricing' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.sectionId)}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative cursor-pointer transition-colors duration-300 text-[15px] font-semibold"
              style={{
                color: hoveredItem === item.label ? '#2BADEE' : '#333',
              }}
            >
              {item.label}
              <span
                className="absolute bottom-[-4px] left-0 h-[2px] bg-[#2BADEE] transition-all duration-300"
                style={{
                  width: hoveredItem === item.label ? '100%' : '0%',
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/parent-login')}
            className="kidio-cta-secondary px-4 sm:px-5 py-2 text-sm"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/parent-login')}
            className="kidio-cta-primary px-4 sm:px-5 py-2 text-sm"
          >
            <span className="hidden sm:inline">Start Free Trial</span>
            <span className="sm:hidden">Start</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
