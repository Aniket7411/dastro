import { useState, useEffect } from 'react';
import API_BASE from '../utils/api';

function Tarot() {
  const [stage, setStage] = useState('input'); // 'input', 'shuffling', 'select', 'drawing', 'result'
  const [question, setQuestion] = useState('');
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const startRitual = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please focus your mind and enter a question.');
      return;
    }
    setError('');
    setStage('shuffling');
    
    // Simulate shuffle duration
    setTimeout(() => {
      setStage('select');
    }, 2800);
  };

  const drawCard = async (idx) => {
    if (stage !== 'select') return;
    setSelectedIdx(idx);
    setStage('drawing');
    setCardResult(null);
    setFlipped(false);
    
    try {
      const res = await fetch(`${API_BASE}/api/tarot/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'The cosmic connection was lost.');
      
      setCardResult(data.card);
      
      // Wait for card to animate to center, then flip
      setTimeout(() => {
        setFlipped(true);
        setTimeout(() => setStage('result'), 600);
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Failed to draw a card.');
      setStage('input');
    }
  };

  const reset = () => {
    setStage('input');
    setCardResult(null);
    setSelectedIdx(null);
    setFlipped(false);
    setQuestion('');
  };

  // Generate 22 Major Arcana cards for the fan
  const totalCards = 22;
  const cards = Array.from({ length: totalCards }, (_, i) => i);

  return (
    <section className="tarot-ritual-container fade-in">
      {/* Mystical Background Overlay - Light Theme */}
      <div className="mystical-bg-light"></div>
      
      <div className="container position-relative z-index-2 py-5" style={{ minHeight: '85vh' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="tarot-title">The Mystic Tarot</h1>
          <div className="title-separator mx-auto"></div>
          <p className="tarot-subtitle">Unveil the hidden truths of your journey. Seek divine clarity and let the ancient wisdom of the Tarot illuminate your path today.</p>
        </div>

        {error && <div className="alert alert-danger text-center mx-auto" style={{maxWidth: '500px', borderRadius: '12px'}}>{error}</div>}

        {/* Stage 1: Input */}
        {stage === 'input' && (
          <div className="row justify-content-center mt-5">
            <div className="col-md-6 text-center">
              <div className="ritual-input-box p-4 p-md-5">
                <div className="tarot-icon-large mb-4">✨</div>
                <h3 className="mb-4" style={{ fontFamily: 'Playfair Display', color: '#65250c', fontWeight: 800 }}>What seeks your heart?</h3>
                <form onSubmit={startRitual}>
                  <div className="mb-4">
                    <label className="reading-label">Focus your intention</label>
                    <input 
                      type="text" 
                      className="mystic-input" 
                      placeholder="Enter your question here..." 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="mystic-btn w-100">
                    Focus &amp; Shuffle Deck
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2, 3, 4: Shuffling, Select, Drawing */}
        {(stage === 'shuffling' || stage === 'select' || stage === 'drawing') && (
          <div className="ritual-arena text-center">
            <h3 className="ritual-prompt mb-5">
              {stage === 'shuffling' && "Channeling your energy..."}
              {stage === 'select' && "The deck is ready. Choose your card."}
              {stage === 'drawing' && "Revealing your destiny..."}
            </h3>
            
            <div className={`deck-fan-container ${stage === 'shuffling' ? 'is-shuffling' : ''}`}>
              {cards.map((idx) => {
                // Calculate fan spread
                const offset = idx - (totalCards - 1) / 2;
                const angle = offset * 4.5; 
                const yOffset = Math.abs(offset) * 3;
                const xOffset = offset * 12;
                
                let isSelected = selectedIdx === idx;
                
                let style = {};
                let className = "ritual-card-back";
                
                if (stage === 'shuffling') {
                  style = { transform: `translate(${Math.random()*10 - 5}px, ${Math.random()*10 - 5}px) rotate(${Math.random()*10 - 5}deg)` };
                } else if (stage === 'select') {
                  style = { transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)` };
                } else if (stage === 'drawing') {
                  if (isSelected) {
                    style = { 
                      transform: `translate(0px, -150px) scale(1.6) rotate(0deg)`,
                      zIndex: 100,
                      opacity: 1 
                    };
                    className += " selected-card";
                  } else {
                    style = { 
                      transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,
                      opacity: 0,
                      pointerEvents: 'none'
                    };
                  }
                }

                return (
                  <div 
                    key={idx} 
                    className={className} 
                    style={style}
                    onClick={() => drawCard(idx)}
                  >
                    <div className="card-pattern"></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage 5: Result */}
        {stage === 'result' && cardResult && (
          <div className="row justify-content-center result-arena fade-in-slow">
            <div className="col-md-5 col-lg-4 text-center mb-4 mb-md-0">
              <div className="result-card-container mx-auto">
                <div className={`tarot-card-reveal ${flipped ? 'flipped' : ''}`}>
                  <div className="tarot-card-inner">
                    <div className="tarot-card-front-side">
                      <div className="ritual-card-back selected-card static-back">
                        <div className="card-pattern"></div>
                      </div>
                    </div>
                    <div className="tarot-card-back-side">
                      <div className="card-content">
                        <div className="card-symbol">{cardResult.symbol}</div>
                        <h4 className="card-title">{cardResult.name}</h4>
                        <div className={`card-badge ${cardResult.orientation === 'Upright' ? 'bg-upright' : 'bg-reversed'}`}>
                          {cardResult.orientation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button onClick={reset} className="mystic-outline-btn mt-5">
                Draw Another Card
              </button>
            </div>
            
            <div className="col-md-7 col-lg-6">
              <div className="reading-panel p-4 p-md-5">
                <h2 className="reading-heading mb-4">Oracle's Revelation</h2>
                
                <div className="meaning-block mb-4">
                  <span className="reading-label">Core Energy</span>
                  <p className="fs-5" style={{ color: '#4a4a6a', marginBottom: 0 }}>{cardResult.meaning}</p>
                </div>
                
                <div className="interpretation-block mb-4">
                  <span className="reading-label">Your Reading</span>
                  <p className="reading-text">{cardResult.interpretation}</p>
                </div>
                
                <div className="wisdom-block p-4 mt-4">
                  <span className="reading-label text-warning">Divine Guidance</span>
                  <p className="wisdom-text mb-0">{cardResult.wisdom}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        :root {
          --cosmic-accent: #c6843f;
          --cosmic-accent-dark: #9c5a1e;
          --cosmic-accent-deep: #65250c;
          --cosmic-gradient: linear-gradient(135deg, #c6843f, #9c5a1e, #65250c);
          --cosmic-accent-soft: #ffefd6;
          --cosmic-text: #65250c;
          --cosmic-text-muted: #9c847b;
          --glass-border: #f3e5d8;
          --premium-shadow: 0 15px 35px rgba(198,132,63,0.08);
          --cosmic-bg: #ffffff;
          --cosmic-white: #ffffff;
        }

        .tarot-ritual-container {
          background: #ffffff;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding: 60px 0 80px;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .mystical-bg-light {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(198,132,63,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(101,37,12,0.03) 0%, transparent 50%);
        }

        .tarot-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(3rem, 7vw, 4.8rem);
          color: #65250c;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .title-separator {
          width: 80px;
          height: 3px;
          background: linear-gradient(to right, #c6843f, #9c5a1e);
          border-radius: 50px;
          margin: 20px auto;
        }

        .tarot-subtitle {
          color: #9c847b;
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
          font-weight: 500;
        }

        .ritual-input-box {
          background: #fffdfa;
          border: 1px solid #f3e5d8;
          border-radius: 30px;
          padding: 60px 45px !important;
          box-shadow: 
            0 25px 50px rgba(198,132,63,0.1),
            inset 0 0 0 10px #fffdfa,
            inset 0 0 0 11px #f3e5d8;
          position: relative;
        }

        .tarot-icon-large {
          font-size: 4.5rem;
          color: #c6843f;
          margin-bottom: 25px;
          filter: drop-shadow(0 8px 15px rgba(198,132,63,0.3));
        }

        .mystic-input {
          width: 100%;
          background: #ffffff;
          border: none;
          border-bottom: 2px solid #f3e5d8;
          border-radius: 0;
          color: #65250c;
          font-size: 1.2rem;
          padding: 12px 0;
          text-align: left;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .mystic-input:focus {
          outline: none;
          border-color: #c6843f;
          background: transparent;
        }

        .mystic-btn {
          background: linear-gradient(to right, #c6843f, #9c5a1e);
          color: #fff;
          border: none;
          padding: 18px;
          border-radius: 50px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-size: 14px;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(198,132,63,0.2);
        }

        .mystic-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(198,132,63,0.3);
        }

        .ritual-prompt {
          color: #65250c;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: 0.5px;
          font-family: 'Playfair Display', serif;
        }

        .deck-fan-container {
          position: relative;
          height: 450px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .ritual-card-back {
          position: absolute;
          width: 145px;
          height: 220px;
          background: #ffffff;
          border: 1px solid #f3e5d8;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(198,132,63,0.08);
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ritual-card-back:hover {
          border-color: #c6843f;
          box-shadow: 0 15px 35px rgba(198,132,63,0.2);
          transform: translateY(-15px) rotate(0deg) scale(1.1) !important;
          z-index: 200 !important;
        }

        .card-pattern {
          width: 80%;
          height: 80%;
          border: 1px solid #ffefd6;
          border-radius: 12px;
          background: 
            radial-gradient(circle at 50% 50%, #ffefd6 2px, transparent 2px),
            repeating-conic-gradient(#fff 0deg 90deg, #faf7f4 90deg 180deg);
          background-size: 100% 100%, 15px 15px;
          opacity: 0.8;
        }

        .ritual-card-back::after {
          content: '✨';
          position: absolute;
          font-size: 32px;
          color: #c6843f;
          opacity: 0.4;
        }

        .selected-card {
          border-color: #c6843f !important;
          box-shadow: 0 20px 45px rgba(198,132,63,0.3) !important;
        }

        /* Result Card Styling */
        .result-card-container {
          width: 260px;
          height: 400px;
          perspective: 1500px;
        }

        .tarot-card-reveal {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }

        .tarot-card-reveal.flipped {
          transform: rotateY(180deg);
        }

        .tarot-card-front-side, .tarot-card-back-side {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          overflow: hidden;
        }

        .tarot-card-front-side {
          transform: rotateY(0deg);
        }

        .tarot-card-back-side {
          background: #ffffff;
          border: 4px solid #c6843f;
          border-radius: 20px;
          transform: rotateY(180deg);
          box-shadow: 0 25px 60px rgba(101,37,12,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 25px;
        }

        .card-symbol {
          font-size: 56px;
          margin-bottom: 20px;
          filter: drop-shadow(0 5px 10px rgba(0,0,0,0.1));
        }

        .card-title {
          font-size: 22px;
          font-weight: 800;
          color: #65250c;
          margin-bottom: 15px;
          font-family: 'Playfair Display', serif;
        }

        .card-badge {
          display: inline-block;
          padding: 6px 20px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .bg-upright {
          background: #ffefd6;
          color: #c6843f;
          border: 1px solid #f3e5d8;
        }

        .bg-reversed {
          background: #faf7f4;
          color: #9c847b;
          border: 1px solid #f3e5d8;
        }

        .reading-panel {
          background: #ffffff;
          border: 1px solid #f3e5d8;
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(198,132,63,0.06);
          height: 100%;
        }

        .reading-heading {
          font-family: 'Playfair Display', serif;
          color: #65250c;
          font-weight: 900;
          font-size: 2rem;
          border-bottom: 1px solid #faf7f4;
          padding-bottom: 20px;
        }

        .reading-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #65250c;
          margin-bottom: 12px;
          text-align: left;
        }

        .reading-text {
          color: #4a372d;
          font-weight: 500;
          line-height: 1.9;
          font-size: 1.1rem;
        }

        .wisdom-block {
          background: #faf7f4;
          border-left: 5px solid #c6843f;
          border-radius: 20px;
          padding: 25px;
        }

        .wisdom-text {
          color: #65250c;
          font-weight: 700;
          font-style: italic;
          line-height: 1.8;
        }

        .mystic-outline-btn {
          background: #ffefd6;
          border: 1px solid #f3e5d8;
          color: #9c5a1e;
          padding: 14px 35px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 14px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .mystic-outline-btn:hover {
          background: #c6843f;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(198,132,63,0.25);
        }

        @media (max-width: 768px) {
          .tarot-title { font-size: 2.5rem; }
          .deck-fan-container { height: 380px; }
          .ritual-card-back { width: 110px; height: 170px; }
          .result-card-container { width: 220px; height: 340px; }
        }
      `}</style>
    </section>
  );
}

export default Tarot;