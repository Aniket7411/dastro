import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hash, Heart, Moon, Sparkles, Star, Sun, Compass } from 'lucide-react';
import KundaliTool from '../components/tools/KundaliTool';
import HoroscopeTool from '../components/tools/HoroscopeTool';
import MoonTool from '../components/tools/MoonTool';
import ZodiacFinder from '../components/tools/ZodiacFinder';

const tools = [
  {
    id: 'kundali',
    name: 'Kundali / Birth Chart',
    desc: 'Generate your Vedic birth chart with detailed planetary positions.',
    Icon: Star,
    badge: 'Popular',
    image: '/images/kundali_birth_chart.jpg',
  },
  {
    id: 'horoscope',
    name: 'Daily Horoscope',
    desc: 'Read your personalised daily cosmic predictions by sun sign.',
    Icon: Sun,
    image: '/images/daily_horoscope.jpg',
  },
  {
    id: 'love',
    name: 'Love Compatibility',
    desc: 'Vedic synastry to reveal your celestial compatibility score.',
    Icon: Heart,
    badge: 'Trending',
    link: '/love',
    image: '/images/love_compatibility.jpg',
  },
  {
    id: 'numerology',
    name: 'Numerology Calculator',
    desc: 'Discover your radical, destiny, and name numbers.',
    Icon: Hash,
    link: '/numerology',
    image: '/images/numerology.jpg',
  },
  {
    id: 'tarot',
    name: 'Tarot Reading',
    desc: 'Draw a Major Arcana card for ancient wisdom and guidance.',
    Icon: Sparkles,
    link: '/tarot',
    image: '/images/tarot.jpg',
  },
  {
    id: 'moon',
    name: 'Moon Sign Calculator',
    desc: 'Find your Vedic moon sign and emotional blueprint.',
    Icon: Moon,
    image: '/images/moon_sign.jpg',
  },
  {
    id: 'zodiac',
    name: 'Sun Sign Calculator',
    desc: 'Know your zodiac sun sign from your exact date of birth.',
    Icon: Compass,
    image: '/images/sun_sign.jpg',
  },
];

function ToolCard({ tool, onActivate }) {
  const { Icon } = tool;

  const inner = (
    <div className="group relative flex h-full flex-row items-center rounded-2xl border border-[rgba(139,74,30,0.11)] bg-white p-4 shadow-[0_2px_12px_rgba(42,15,2,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(139,74,30,0.3)] hover:shadow-[0_12px_30px_rgba(139,74,30,0.12)] sm:p-5 gap-4 sm:gap-5 overflow-hidden">

      {/* Left Side: Image/Icon */}
      <div className="flex shrink-0 items-center justify-center">
        {tool.image ? (
          <div className="relative h-36 w-36 sm:h-40 sm:w-40 flex shrink-0 items-center justify-center">
            <div className="relative h-full w-full transition-all duration-700 group-hover:-translate-y-2 z-10">
              <img src={tool.image} alt={tool.name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        ) : (
          <div className="relative h-36 w-36 sm:h-40 sm:w-40">
            <div className="absolute inset-0 rounded-xl bg-[#fff8ef] transition-all duration-700 group-hover:-translate-y-2 opacity-80 blur-md"></div>
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border-[3px] border-white bg-[#fff8ef] text-[#9c5a1e] shadow-[0_8px_20px_rgba(139,74,30,0.15)] transition-all duration-700 group-hover:-translate-y-2 group-hover:bg-[#9c5a1e] group-hover:text-white group-hover:shadow-[0_12px_25px_rgba(139,74,30,0.25)] z-10">
              <Icon className="h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] transition-transform duration-700 group-hover:scale-110" strokeWidth={2} />
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Content */}
      <div className="flex flex-1 flex-col justify-center">
        {tool.badge && (
          <span className="mb-2 w-max rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.1em] text-[#9c5a1e] shadow-sm">
            {tool.badge}
          </span>
        )}
        <h3 className="mb-1.5 text-[1rem] sm:text-[1.125rem] font-extrabold leading-tight text-[#3d1a06]">
          {tool.name}
        </h3>
        <p className="mb-4 text-xs sm:text-[0.8125rem] leading-relaxed text-[#7a5c4f]">
          {tool.desc}
        </p>

        <div className="relative mt-auto w-max group/btn cursor-pointer">
          {/* Magical glowing aura */}
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#9c5a1e] via-[#e8b368] to-[#9c5a1e] opacity-50 blur-[2px] transition-all duration-500 group-hover/btn:-inset-1 group-hover/btn:opacity-100 group-hover/btn:blur-md"></div>
          
          {/* Button Face */}
          <span className="relative flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-[#9c5a1e] shadow-[inset_0_0_0_1px_rgba(156,90,30,0.2)] transition-all duration-300 group-hover/btn:bg-[#fffdfa] group-hover/btn:text-[#7a4211]">
            Access Tool
            <ArrowRight className="h-4 w-4 text-[#d99648] transition-transform duration-300 group-hover/btn:translate-x-1.5 group-hover/btn:text-[#9c5a1e]" strokeWidth={3} />
          </span>
        </div>
      </div>
    </div>
  );

  if (tool.link) {
    return (
      <Link to={tool.link} className="!no-underline block h-full" aria-label={tool.name}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onActivate(tool.id)}
      className="block h-full w-full text-left"
      aria-label={tool.name}
    >
      {inner}
    </button>
  );
}

function FreeTools() {
  const [activeTool, setActiveTool] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTool]);

  const activeToolData = tools.find(t => t.id === activeTool);

  if (activeTool === 'kundali') {
    return <KundaliTool onBack={() => setActiveTool(null)} image={activeToolData?.image} />;
  }
  if (activeTool === 'horoscope') {
    return <HoroscopeTool onBack={() => setActiveTool(null)} image={activeToolData?.image} />;
  }
  if (activeTool === 'moon') {
    return <MoonTool onBack={() => setActiveTool(null)} image={activeToolData?.image} />;
  }
  if (activeTool === 'zodiac') {
    return <ZodiacFinder onBack={() => setActiveTool(null)} image={activeToolData?.image} />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fffdf9]">

      {/* Hero — compact */}
      <div className="relative overflow-hidden border-b border-[rgba(139,74,30,0.09)] bg-gradient-to-b from-[#fff8ef] to-[#fffdf9] py-3 sm:py-4 lg:py-5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(198,132,63,0.06) 0%, transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-[90rem] px-4 text-center sm:px-6 lg:px-12">
          <span className="mb-1.5 inline-block rounded-full border border-[rgba(139,74,30,0.14)] bg-[#fff3e0] px-3.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-[#9c5a1e]">
            Explore the Cosmos
          </span>
          <h1 className="mx-auto mb-1.5 max-w-lg font-heading text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold leading-tight text-[#3d1a06]">
            Free Astrology Tools
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[#7a5c4f] sm:max-w-none sm:whitespace-nowrap sm:text-[0.9375rem]">
            Discover your chart, signs, compatibility, and daily guidance — all free.
          </p>
        </div>
      </div>

      {/* Tools grid */}
      <div className="mx-auto max-w-[90rem] px-4 py-5 sm:px-6 sm:py-6 lg:px-12 lg:py-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {tools.map((tool, idx) => (
            <div
              key={tool.id}
              style={{ animation: `fadeSlideUp 0.4s ease ${idx * 0.06}s both` }}
            >
              <ToolCard tool={tool} onActivate={setActiveTool} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-xl border border-[rgba(139,74,30,0.12)] bg-gradient-to-br from-[#9c5a1e] to-[#65250c] p-6 text-center sm:p-8">
          <h2 className="mb-2 font-heading text-lg font-extrabold text-white sm:text-xl">
            Want a personal consultation?
          </h2>
          <p className="mx-auto mb-5 max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
            Speak directly with our expert astrologers for in-depth guidance on your birth chart, career, love, and life path.
          </p>
          <Link
            to="/book-consultation"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wide text-[#9c5a1e] !no-underline shadow transition hover:-translate-y-0.5 hover:shadow-md sm:text-sm"
          >
            Book a Consultation
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default FreeTools;
