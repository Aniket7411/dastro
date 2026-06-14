import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import KundaliTool from '../components/tools/KundaliTool';
import HoroscopeTool from '../components/tools/HoroscopeTool';
import MoonTool from '../components/tools/MoonTool';
import ZodiacFinder from '../components/tools/ZodiacFinder';

function FreeTools() {
  const [activeTool, setActiveTool] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTool]);

  const tools = [
    { id: 'kundali', name: 'Kundali / Birth Chart', desc: 'Generate your free birth chart', icon: 'fa-star' },
    { id: 'horoscope', name: 'Daily Horoscope', desc: 'Read your daily predictions', icon: 'fa-sun' },
    { id: 'love', name: 'Love Calculator', desc: 'Check compatibility with your partner', icon: 'fa-heart', link: '/love' },
    { id: 'numerology', name: 'Numerology Calculator', desc: 'Calculate your life path number', icon: 'fa-calculator', link: '/numerology' },
    { id: 'tarot', name: 'Tarot Reading', desc: 'Draw a card for guidance', icon: 'fa-magic', link: '/tarot' },
    { id: 'moon', name: 'Moonsign Calculator', desc: 'Find your moon sign', icon: 'fa-moon' },
    { id: 'zodiac', name: 'Sun Sign Calculator', desc: 'Know your zodiac sign', icon: 'fa-certificate' },
  ];

  const handleBack = () => setActiveTool(null);

  if (activeTool === 'kundali') return <section className="tools-container"><KundaliTool onBack={handleBack} /></section>;
  if (activeTool === 'horoscope') return <section className="tools-container"><HoroscopeTool onBack={handleBack} /></section>;
  if (activeTool === 'moon') return <section className="tools-container"><MoonTool onBack={handleBack} /></section>;
  if (activeTool === 'zodiac') return <section className="tools-container"><ZodiacFinder onBack={handleBack} /></section>;

  return (
    <section className="freetools-section site-page">
      <div className="site-container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-4 fade-in">
            <span className="site-kicker">Explore The Cosmos</span>
            <h1 className="site-title site-title-lg mt-1 mb-3">Free Astrology Tools</h1>
            <p className="site-subtitle mx-auto">Use simple astrology calculators and guidance tools to understand your chart, signs, compatibility, and daily direction.</p>
          </div>
        </div>
        
        <div className="row g-3 g-lg-4 justify-content-center">
          {tools.map((tool, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4 fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="tool-card site-card h-100 d-flex flex-column">
                <div className="tool-icon-wrapper mx-auto">
                  <i className={`fas ${tool.icon}`}></i>
                </div>
                <h4 className="tool-name">{tool.name}</h4>
                <p className="tool-desc flex-grow-1">{tool.desc}</p>
                
                <div className="mt-3">
                  {tool.link ? (
                    <Link to={tool.link} className="site-btn site-btn-outline tool-action w-100">Access Tool <i className="fas fa-arrow-right ms-2"></i></Link>
                  ) : (
                    <button 
                      className="site-btn site-btn-outline tool-action w-100"
                      onClick={() => setActiveTool(tool.id)}
                    >
                      Access Tool <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .freetools-section {
          background: var(--site-bg);
          min-height: 80vh;
          padding: clamp(2.4rem, 5vw, 4rem) 0 clamp(3rem, 6vw, 5rem);
        }

        .tool-card {
          padding: clamp(1.25rem, 3vw, 1.75rem);
          text-align: left;
        }
        
        .tool-card:hover {
          transform: translateY(-5px);
        }
        
        .tool-icon-wrapper {
          width: 3.25rem;
          height: 3.25rem;
          background: var(--site-accent-soft);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 1rem;
          border: 1px solid rgba(200, 131, 42, 0.18);
          transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }
        
        .tool-card:hover .tool-icon-wrapper {
          background: var(--site-primary);
          border-color: var(--site-primary);
          transform: translateY(-2px);
        }
        
        .tool-card:hover .tool-icon-wrapper i {
          color: #fff !important;
        }
        
        .tool-icon-wrapper i {
          color: var(--site-accent-dark);
          font-size: 1.25rem;
          transition: color 0.25s ease;
        }
        
        .tool-name {
          color: var(--site-text);
          font-weight: 800;
          font-size: var(--h3-size);
          line-height: 1.25;
          margin-bottom: 0.65rem;
          font-family: var(--font-heading);
        }
        
        .tool-desc {
          color: var(--site-text-muted);
          font-size: 0.96rem;
          line-height: 1.55;
          margin-bottom: 0;
        }

        .tool-action {
          border-radius: var(--radius-control);
          font-size: 0.82rem;
          letter-spacing: 0.04rem;
          text-transform: uppercase;
        }

        .fade-in { animation: fadeIn 0.5s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        
        .tools-container {
          background-color: var(--site-bg);
          min-height: 100vh;
          padding: clamp(1.5rem, 4vw, 3rem) var(--page-pad-x);
        }

        @media (max-width: 640px) {
          .freetools-section {
            padding-top: 2rem;
          }

          .tool-card {
            padding: 1.1rem;
          }
        }
      `}</style>
    </section>
  );
}

export default FreeTools;
