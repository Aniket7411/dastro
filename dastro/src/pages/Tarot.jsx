import { useState } from 'react';
import API_BASE from '../utils/api';

function Tarot() {
  const [stage, setStage] = useState('input');
  const [question, setQuestion] = useState('');
  const [cardResult, setCardResult] = useState(null);
  const [error, setError] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const startRitual = (e) => {
    e.preventDefault();
    if (!question.trim()) { setError('Please focus your mind and enter a question.'); return; }
    setError('');
    setStage('shuffling');
    setTimeout(() => setStage('select'), 2800);
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

  const totalCards = 22;
  const cards = Array.from({ length: totalCards }, (_, i) => i);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      {/* Subtle background */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(198,132,63,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(101,37,12,0.03) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="mb-2 font-serif text-2xl font-black text-[#65250c] sm:text-3xl">The Mystic Tarot</h1>
          <div className="mx-auto mb-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#c6843f] to-[#9c5a1e]" />
          <p className="mx-auto max-w-md text-xs leading-relaxed text-[#9c847b] sm:text-sm">
            Unveil the hidden truths of your journey. Let the ancient wisdom of the Tarot illuminate your path today.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-sm rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stage: Input */}
        {stage === 'input' && (
          <div className="mx-auto max-w-sm">
            <div className="rounded-xl border border-[#f3e5d8] bg-[#fffdfa] p-5 shadow-[0_8px_24px_rgba(198,132,63,0.08)] sm:p-6">
              <div className="mb-3 text-center text-3xl">✨</div>
              <h3 className="mb-4 text-center font-serif text-base font-extrabold text-[#65250c]">
                What seeks your heart?
              </h3>
              <form onSubmit={startRitual} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-[0.6875rem] font-bold uppercase tracking-widest text-[#9c5a1e]">
                    Focus your intention
                  </label>
                  <input
                    type="text"
                    className="w-full border-0 border-b-2 border-[#f3e5d8] bg-transparent py-1.5 text-sm font-semibold text-[#65250c] outline-none transition-colors placeholder:text-[#c6843f]/40 focus:border-[#c6843f]"
                    placeholder="Enter your question here…"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-[#c6843f] to-[#9c5a1e] py-2 text-xs font-bold uppercase tracking-widest text-white shadow transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  Focus &amp; Shuffle Deck
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Stage: Shuffling / Select / Drawing */}
        {(stage === 'shuffling' || stage === 'select' || stage === 'drawing') && (
          <div className="text-center">
            <p className="mb-4 font-serif text-sm font-bold text-[#65250c] sm:text-base">
              {stage === 'shuffling' && 'Channeling your energy…'}
              {stage === 'select' && 'The deck is ready. Choose your card.'}
              {stage === 'drawing' && 'Revealing your destiny…'}
            </p>

            <div className={`deck-fan-container${stage === 'shuffling' ? ' is-shuffling' : ''}`}>
              {cards.map((idx) => {
                const offset = idx - (totalCards - 1) / 2;
                const angle = offset * 4;
                const yOffset = Math.abs(offset) * 2.5;
                const xOffset = offset * 10;
                const isSelected = selectedIdx === idx;

                let style = {};
                let cls = 'ritual-card-back';

                if (stage === 'shuffling') {
                  style = { transform: `translate(${Math.random() * 8 - 4}px, ${Math.random() * 8 - 4}px) rotate(${Math.random() * 8 - 4}deg)` };
                } else if (stage === 'select') {
                  style = { transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)` };
                } else if (stage === 'drawing') {
                  if (isSelected) {
                    style = { transform: 'translate(0px, -120px) scale(1.5) rotate(0deg)', zIndex: 100, opacity: 1 };
                    cls += ' selected-card';
                  } else {
                    style = { transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`, opacity: 0, pointerEvents: 'none' };
                  }
                }

                return (
                  <div key={idx} className={cls} style={style} onClick={() => drawCard(idx)}>
                    <div className="card-pattern" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage: Result */}
        {stage === 'result' && cardResult && (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Card visual */}
            <div className="flex shrink-0 flex-col items-center gap-4">
              <div className="result-card-container">
                <div className={`tarot-card-reveal${flipped ? ' flipped' : ''}`}>
                  <div className="tarot-card-front-side">
                    <div className="ritual-card-back selected-card static-back h-full w-full">
                      <div className="card-pattern" />
                    </div>
                  </div>
                  <div className="tarot-card-back-side">
                    <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                      <div className="text-4xl">{cardResult.symbol}</div>
                      <h4 className="font-serif text-base font-extrabold text-[#65250c]">{cardResult.name}</h4>
                      <span className={`rounded-full px-3 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-widest ${cardResult.orientation === 'Upright' ? 'bg-[#ffefd6] text-[#c6843f]' : 'bg-[#faf7f4] text-[#9c847b]'}`}>
                        {cardResult.orientation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={reset}
                className="rounded-full border border-[#f3e5d8] bg-[#fff8ef] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#9c5a1e] transition hover:bg-[#f3e5d8]"
              >
                Draw Another Card
              </button>
            </div>

            {/* Reading */}
            <div className="w-full min-w-0 flex-1 rounded-xl border border-[#f3e5d8] bg-white p-4 shadow-[0_2px_12px_rgba(198,132,63,0.06)] sm:p-5">
              <h2 className="mb-3 border-b border-[#faf7f4] pb-2.5 font-serif text-base font-extrabold text-[#65250c] sm:text-lg">
                Oracle's Revelation
              </h2>

              <div className="mb-3">
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-widest text-[#65250c]">Core Energy</span>
                <p className="text-xs leading-relaxed text-[#4a4a6a] sm:text-sm">{cardResult.meaning}</p>
              </div>

              <div className="mb-3">
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-widest text-[#65250c]">Your Reading</span>
                <p className="text-xs leading-relaxed text-[#4a372d] sm:text-sm">{cardResult.interpretation}</p>
              </div>

              <div className="rounded-lg border-l-4 border-[#c6843f] bg-[#faf7f4] p-3">
                <span className="mb-1 block text-[0.6rem] font-bold uppercase tracking-widest text-[#c6843f]">Divine Guidance</span>
                <p className="text-xs font-semibold italic leading-relaxed text-[#65250c] sm:text-sm">{cardResult.wisdom}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .deck-fan-container {
          position: relative;
          height: 320px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .ritual-card-back {
          position: absolute;
          width: 110px;
          height: 170px;
          background: #ffffff;
          border: 1px solid #f3e5d8;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(198,132,63,0.07);
          cursor: pointer;
          transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ritual-card-back:hover {
          border-color: #c6843f;
          box-shadow: 0 12px 28px rgba(198,132,63,0.18);
          transform: translateY(-12px) rotate(0deg) scale(1.08) !important;
          z-index: 200 !important;
        }

        .card-pattern {
          width: 78%;
          height: 78%;
          border: 1px solid #ffefd6;
          border-radius: 8px;
          background:
            radial-gradient(circle at 50% 50%, #ffefd6 2px, transparent 2px),
            repeating-conic-gradient(#fff 0deg 90deg, #faf7f4 90deg 180deg);
          background-size: 100% 100%, 14px 14px;
          opacity: 0.75;
        }

        .ritual-card-back::after {
          content: '✨';
          position: absolute;
          font-size: 22px;
          color: #c6843f;
          opacity: 0.35;
        }

        .selected-card {
          border-color: #c6843f !important;
          box-shadow: 0 16px 36px rgba(198,132,63,0.25) !important;
        }

        .is-shuffling .ritual-card-back {
          animation: shuffle 0.35s ease-in-out infinite alternate;
        }
        @keyframes shuffle {
          from { transform: rotate(-2deg) translateY(-2px); }
          to   { transform: rotate(2deg) translateY(2px); }
        }

        .result-card-container {
          width: 180px;
          height: 280px;
          perspective: 1200px;
          flex-shrink: 0;
        }

        .tarot-card-reveal {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }

        .tarot-card-reveal.flipped { transform: rotateY(180deg); }

        .tarot-card-front-side,
        .tarot-card-back-side {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 14px;
          overflow: hidden;
        }

        .tarot-card-front-side { transform: rotateY(0deg); }

        .tarot-card-back-side {
          background: #ffffff;
          border: 3px solid #c6843f;
          border-radius: 14px;
          transform: rotateY(180deg);
          box-shadow: 0 16px 40px rgba(101,37,12,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 480px) {
          .deck-fan-container { height: 260px; }
          .ritual-card-back { width: 82px; height: 128px; }
          .result-card-container { width: 150px; height: 235px; }
        }
      `}</style>
    </div>
  );
}

export default Tarot;
