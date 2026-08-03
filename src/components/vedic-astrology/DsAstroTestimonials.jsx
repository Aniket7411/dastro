import { useEffect, useMemo, useRef, useState } from 'react';

const CONTENT = {
  videos: [
    // { name: 'Neha Verma', role: 'HR Professional, Lucknow', len: '0:38', quote: '"Sab kuch match hua. Itna accurate kaise?"', src: '', poster: '' },
    // { name: 'Rohit Mishra', role: 'Business owner, Kanpur', len: '0:52', quote: '"Client ka chehra padhkar hi samajh aa gaya."', src: '', poster: '' },
    // { name: 'Anjali Singh', role: 'Teacher, Varanasi', len: '0:41', quote: '"Damini maam ne itna simple bana diya."', src: '', poster: '' },
    // { name: 'Sameer Khan', role: 'Sales manager, Delhi', len: '1:04', quote: '"Interview mein hi candidate samajh jata hoon."', src: '', poster: '' },
    // { name: 'Priya Tiwari', role: 'Homemaker, Gorakhpur', len: '0:33', quote: '"2 din mein 160+ points seekh liye."', src: '', poster: '' },
    { name: 'Ankita Soni', role: 'House wife, Lucknow', len: '0:10', quote: '"Mujhe masterclass se bahut kuch seekhne ko mila."', src: '/IMG_4605.mp4', poster: '' },
    { name: 'Khushi', role: 'PHD student, Bihar', len: '0:24', quote: '"Bohot detail mein har topic ko explain kiya gaya."', src: '/IMG_4609.mp4', poster: '' },
    { name: 'Priyanshi', role: 'Lawyer, Jhansi', len: '0:30', quote: '"Mera experience bohot badhiya raha. Highly recommended!"', src: '/IMG_4611.MP4', poster: '' },
    { name: 'Harsh', role: 'IT professional, Hyderabad', len: '1:05', quote: '"Face reading ki techniques bohot practical hain."', src: '/IMG_4613.mp4', poster: '' },
    { name: 'Sakshi', role: 'BA student, Lucknow', len: '', quote: '"Masterclass ne meri soch badal di."', src: '/IMG_4621.MP4', poster: '' },
    { name: 'Akanksha', role: 'B Com student, Lucknow', len: '', quote: '"Itna practical content pehle kabhi nahi dekha."', src: '/IMG_4622.MP4', poster: '' },
    { name: 'Devendra', role: 'Entrepreneur, Delhi', len: '', quote: '"Awesome experience! Highly recommended."', src: '/IMG_5247_compressed.mp4', poster: '' },
  ],
  messages: [
    { name: 'Ritu', phone: '***** 4471', date: '2 Aug', chat: [{ side: 'them', text: 'Maam aaj ka session bahut accha tha. Face structure wala part maine notebook mein likh liya.', time: '8:14 pm' }, { side: 'me', text: 'Bahut acche Ritu ji! Kal practice ke liye 5 photos laayiye.', time: '8:20 pm' }] },
    { name: 'Arun', phone: '***** 9032', date: '2 Aug', chat: [{ side: 'them', text: 'Rs 499 mein itna content, honestly expect nahi kiya tha. Recording bhi mil gayi.', time: '9:02 pm' }] },
    { name: 'Shalini', phone: '***** 1188', date: '3 Aug', chat: [{ side: 'them', text: 'Kal maine apne bhai ka face read kiya aur uska nature exactly wahi nikla jo aapne bataya tha.', time: '11:40 am' }, { side: 'me', text: 'Yehi practice se aata hai.', time: '12:05 pm' }] },
    { name: 'Deepak', phone: '***** 7756', date: '3 Aug', chat: [{ side: 'them', text: 'Zoom link time par mil gaya, koi problem nahi hui. Support team ka response fast tha.', time: '7:31 pm' }] },
    { name: 'Fatima', phone: '***** 2604', date: '3 Aug', chat: [{ side: 'them', text: 'Mujhe lagta tha astrology sirf kundli hoti hai. Chehre se bhi itna pata chalta hai, ye nayi baat seekhi.', time: '10:12 pm' }] },
    { name: 'Manoj', phone: '***** 5519', date: '4 Aug', chat: [{ side: 'them', text: 'PDF notes ke liye thank you. Simple English mein hai isliye padhne mein aasani hui.', time: '9:18 am' }] },
    { name: 'Kavita', phone: '***** 3390', date: '4 Aug', chat: [{ side: 'them', text: 'Full course ka detail bhej dijiye please, main join karna chahti hoon.', time: '1:44 pm' }, { side: 'me', text: 'Ji bilkul, counsellor aapko call karenge.', time: '1:52 pm' }] },
    { name: 'Imran', phone: '***** 8827', date: '4 Aug', chat: [{ side: 'them', text: '2 ghante kaise nikal gaye pata hi nahi chala. Boring bilkul nahi tha.', time: '8:47 pm' }] },
    { name: 'Sunita', phone: '***** 6142', date: '5 Aug', chat: [{ side: 'them', text: 'Meri beti ne bhi saath baithkar dekha, use bhi interest aa gaya.', time: '6:29 pm' }] },
    { name: 'Vikas', phone: '***** 4008', date: '5 Aug', chat: [{ side: 'them', text: 'Doubt session mein maam ne mera sawaal detail mein solve kiya. Personal attention mila.', time: '9:55 pm' }] },
    { name: 'Pooja', phone: '***** 7263', date: '6 Aug', chat: [{ side: 'them', text: 'Recording 2 baar dekhi. Har baar kuch naya samajh aata hai.', time: '3:21 pm' }] },
    { name: 'Harish', phone: '***** 9471', date: '6 Aug', chat: [{ side: 'them', text: 'Paisa vasool. Doston ko bhi bata diya, agla batch kab hai?', time: '7:08 pm' }] },
  ],
};

function initials(name) {
  return name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();
}

function useColumnCount() {
  const [count, setCount] = useState(() => (typeof window !== 'undefined' && window.innerWidth >= 860 ? 3 : 2));

  useEffect(() => {
    const sync = () => setCount(window.innerWidth >= 860 ? 3 : 2);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  return count;
}

function VideoCard({ video, isActive, onPlay, onStop }) {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.muted = false;
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive]);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!video.src) return;
    if (isActive) {
      onStop();
    } else {
      onPlay();
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    setIsMuted(false);
    onStop();
  };

  const handleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setIsMuted(next);
  };

  return (
    <div className={`ds-vcard${isActive ? ' is-playing' : ''}`} role="listitem">
      {!isActive && <p className="ds-card-quote">{video.quote}</p>}
      <div className="ds-thumb">
        {video.src ? (
          <video ref={videoRef} loop playsInline preload="metadata" poster={video.poster || undefined} src={`${video.src}#t=0.001`} onEnded={onStop} />
        ) : video.poster ? (
          <img src={video.poster} alt={`${video.name} testimonial thumbnail`} loading="lazy" />
        ) : (
          <div className="ds-poster"><span>{initials(video.name)}</span></div>
        )}
        {isActive && (
          <div className="ds-vcontrols">
            <button className="ds-vc-btn" type="button" onClick={handleStop} aria-label="Back">
              <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <button className="ds-vc-btn" type="button" onClick={handlePlay} aria-label="Pause">
              <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button className="ds-vc-btn" type="button" onClick={handleMute} aria-label="Toggle sound">
              {isMuted
                ? <svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                : <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>
              }
            </button>
          </div>
        )}
        <button className="ds-play" type="button" onClick={handlePlay} aria-label={isActive ? 'Pause' : `Play video by ${video.name}`}>
          {isActive
            ? <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          }
        </button>
        {!isActive && <span className="ds-len">{video.len}</span>}
      </div>
      {!isActive && (
        <div className="ds-student">
          <b>{video.name}</b>
          <span />
          <small>{video.role}</small>
        </div>
      )}
    </div>
  );
}

function MessageCard({ message, index, onOpen, inert = false }) {
  return (
    <button className="ds-shot" type="button" onClick={() => !inert && onOpen(index)} aria-label={`Enlarge message from ${message.name}`}>
      <div className="ds-bar">
        <span className="ds-av">{initials(message.name)}</span>
        <span className="ds-who"><b>{message.name}</b><small>{message.phone}</small></span>
      </div>
      <div className="ds-paper">
        {message.img ? (
          <img src={message.img} alt={`WhatsApp message from ${message.name}`} loading="lazy" />
        ) : (
          message.chat.map((chat) => (
            <div key={`${chat.text}-${chat.time}`} className={`ds-bub ${chat.side === 'me' ? 'me' : 'them'}`}>
              {chat.text}
              <span className="ds-time">{chat.time}{chat.side === 'me' && <svg viewBox="0 0 24 24"><path d="M18 7l-1.4-1.4-6.6 6.6-2.6-2.6L6 11l4 4z" /><path d="M22 7l-1.4-1.4-6.6 6.6-1.2-1.2-1.4 1.4 2.6 2.6z" /></svg>}</span>
            </div>
          ))
        )}
      </div>
      <div className="ds-foot"><b>{message.date}</b><span>masterclass batch</span><span className="ds-zoom">Enlarge</span></div>
    </button>
  );
}

function Lightbox({ lightbox, onClose, onMove }) {
  if (!lightbox) return null;
  const list = lightbox.mode === 'video' ? CONTENT.videos : CONTENT.messages;
  const item = list[lightbox.index];

  return (
    <div className="ds-lb on" role="dialog" aria-modal="true" aria-label="Review" onClick={onClose}>
      <div className="ds-lb-body" onClick={(event) => event.stopPropagation()}>
        <button className="ds-lb-x" type="button" onClick={onClose} aria-label="Close">x</button>
        <button className="ds-lb-nav p" type="button" onClick={() => onMove(-1)} aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15.4 4.6 8 12l7.4 7.4 1.4-1.4L10.8 12l6-6z" /></svg></button>
        <button className="ds-lb-nav n" type="button" onClick={() => onMove(1)} aria-label="Next"><svg viewBox="0 0 24 24"><path d="M8.6 4.6 16 12l-7.4 7.4-1.4-1.4L13.2 12l-6-6z" /></svg></button>
        {lightbox.mode === 'video' ? (
          item.src ? <video controls autoPlay playsInline poster={item.poster || undefined} src={item.src} /> : <div className="ds-lb-placeholder">Video file not set yet<br /><small>Update CONTENT.videos src later</small></div>
        ) : (
          <div className="ds-lb-shot"><MessageCard message={item} index={lightbox.index} onOpen={() => {}} inert /></div>
        )}
        <p className="ds-lb-cap"><b>{item.name}</b>{lightbox.mode === 'video' ? item.role : item.date}</p>
      </div>
    </div>
  );
}

function DsAstroTestimonials({ onJoinNow }) {
  const railRef = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false); // eslint-disable-line
  const [playingIndex, setPlayingIndex] = useState(null);
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => Array.from({ length: columnCount }, (_, column) => CONTENT.messages.filter((_, index) => index % columnCount === column)),
    [columnCount],
  );

  useEffect(() => {
    if (!lightbox) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    const card = rail?.querySelector('.ds-vcard');
    if (!rail || !card) return;
    rail.scrollBy({ left: direction * (card.offsetWidth + 14) * 2, behavior: 'smooth' });
  };

  const moveLightbox = (step) => {
    setLightbox((current) => {
      if (!current) return current;
      const list = current.mode === 'video' ? CONTENT.videos : CONTENT.messages;
      return { ...current, index: (current.index + step + list.length) % list.length };
    });
  };

  return (
    <section className="ds-proof" aria-labelledby="proof-head">
      <style>{styles}</style>
      <div className="ds-wrap">
        <p className="ds-eyebrow"><span className="ds-dot" />Real students · unedited</p>
        <h2 className="ds-head" id="proof-head">Humein mat suniye. <em>Unhe suniye.</em></h2>
        <p className="ds-sub">Jinhone masterclass attend ki, apne shabdon mein, apne camera par.</p>
        <div className="ds-rule" />
      </div>

      <div className="ds-videos">
        <div className="ds-wrap">
          <div className="ds-block-label"><h3>Video reviews</h3><span className="ds-count">{CONTENT.videos.length} reviews</span><span className="ds-hint">Swipe ?</span></div>
          <p className="ds-sound"><svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" /></svg>Tap a card to play. Swipe to see more.</p>
        </div>
        <div className="ds-rail-outer">
          <div
            className="ds-rail"
            ref={railRef}
            role="list"
            aria-label="Student video reviews"
          >
            {CONTENT.videos.map((video, index) => (
              <VideoCard
                key={`${video.name}-${index}`}
                video={video}
                isActive={playingIndex === index}
                onPlay={() => setPlayingIndex(index)}
                onStop={() => setPlayingIndex(null)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ds-wa">
        <div className="ds-wrap"><div className="ds-block-label"><h3>Straight from our WhatsApp</h3><span className="ds-count">{CONTENT.messages.length} messages</span><span className="ds-hint">Tap to enlarge</span></div></div>
        <div className="ds-wa-shell">
          <div className={`ds-wa-cols ${showAll ? 'open paused' : ''}`}>
            {columns.map((column, columnIndex) => {
              const items = showAll ? column : [...column, ...column];
              return <div key={columnIndex} className={`ds-wa-col ${columnIndex % 2 ? 'down' : 'up'}`} style={{ animationDelay: `-${columnIndex * 7}s` }}>{items.map((message, localIndex) => <MessageCard key={`${message.name}-${localIndex}`} message={message} index={CONTENT.messages.indexOf(message)} onOpen={(index) => setLightbox({ mode: 'message', index })} />)}</div>;
            })}
          </div>
        </div>
        <div className="ds-wrap">
          <div className="ds-wa-actions"><button className="ds-btn-ghost" type="button" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll}>{showAll ? 'Show less' : 'Show all messages'}</button></div>
          {/* <p className="ds-privacy"><svg viewBox="0 0 24 24"><path d="M12 1 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-4zm0 10.9h5c-.4 3.6-2.6 6.9-5 7.7V12z" /></svg><span>Shared with each student's permission. Numbers and profile photos are masked before publishing.</span></p> */}
        </div>
      </div>

      <div className="ds-cta"><div className="ds-cta-in"><p>Aap bhi seekhiye <span>2 din, live on Zoom</span></p><button className="ds-btn-cta" type="button" onClick={onJoinNow}>Join Masterclass <span className="price">Rs 499</span><span className="strike">Rs 1,999</span></button></div></div>

      <Lightbox lightbox={lightbox} onClose={() => setLightbox(null)} onMove={moveLightbox} />
    </section>
  );
}

const styles = `
.ds-proof{--ink:#2B1B4E;--ink-soft:#63548A;--coral:#E4695B;--cream:#FBF8F3;--page:#F6F4FA;--card:#FFFFFF;--line:#E8E4F2;--wa-green:#0F6B5C;--wa-bubble:#DCF8C6;--wa-paper:#ECE5DD;--gold:#E9A13B;--plum:#22103F;--font-display:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;--font-body:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;--r-lg:22px;--r-md:14px;--shadow:0 18px 40px -22px rgba(43,27,78,.28);padding:60px 0 0;background:linear-gradient(180deg,var(--page) 0%,var(--cream) 78%,var(--cream) 100%);overflow:hidden;font-family:var(--font-body);color:var(--ink-soft)}
.ds-proof *{box-sizing:border-box}.ds-wrap{max-width:1180px;margin:0 auto;padding:0 20px}.ds-eyebrow{display:flex;align-items:center;justify-content:center;gap:10px;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--coral);margin:0 0 14px}.ds-dot{width:6px;height:6px;border-radius:50%;background:var(--coral);animation:dsPulse 2.4s ease-in-out infinite}@keyframes dsPulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.25)}}.ds-head{text-align:center;margin:0 auto 10px;max-width:760px;font-family:var(--font-display);font-weight:800;color:var(--ink);font-size:clamp(28px,6.4vw,50px);line-height:1.08;letter-spacing:-.02em}.ds-head em{font-style:normal;color:var(--coral)}.ds-sub{text-align:center;max-width:520px;margin:0 auto;font-size:clamp(14px,3.6vw,17px);line-height:1.6;color:var(--ink-soft)}.ds-rule{width:64px;height:3px;border-radius:2px;background:var(--coral);margin:20px auto 0}.ds-block-label{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:0 0 18px}.ds-block-label h3{margin:0;font-family:var(--font-display);font-weight:800;color:var(--ink);font-size:clamp(26px,6vw,40px);letter-spacing:-.02em}.ds-count{font-size:13px;font-weight:600;color:var(--coral);background:rgba(228,105,91,.10);padding:4px 10px;border-radius:100px;white-space:nowrap}.ds-hint{font-size:13px;color:#9A90B4;margin-left:auto}.ds-videos{padding:44px 0 8px}.ds-rail-outer{position:relative;margin:0 -20px}.ds-rail{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 20px 24px;-webkit-overflow-scrolling:touch;scrollbar-width:none}.ds-rail::-webkit-scrollbar{display:none}.ds-vcard{position:relative;flex:0 0 auto;width:min(69vw,244px);aspect-ratio:9/16;scroll-snap-align:center;border:0;padding:0;margin:0;cursor:pointer;border-radius:var(--r-lg);overflow:hidden;background:#2B1B4E;box-shadow:var(--shadow);transition:transform .35s cubic-bezier(.2,.7,.3,1)}.ds-vcard:hover{transform:translateY(-5px)}.ds-vcard:focus-visible{outline:3px solid var(--coral);outline-offset:3px}.ds-vcard video,.ds-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.ds-poster{display:grid;place-items:center;background:radial-gradient(120% 90% at 30% 12%,#4A2E78 0%,#2B1B4E 60%,#1B1033 100%)}.ds-poster span{font-family:var(--font-display);font-weight:800;font-size:40px;color:rgba(255,255,255,.30);letter-spacing:.04em}.ds-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,40,.86) 0%,rgba(20,10,40,.18) 42%,rgba(20,10,40,.06) 70%)}.ds-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.85);display:grid;place-items:center;box-shadow:0 4px 16px rgba(0,0,0,.3);transition:transform .3s,opacity .3s}.ds-play svg{width:19px;height:19px;fill:#fff;margin-left:3px}.ds-vcard.is-playing .ds-play{opacity:0;transform:translate(-50%,-50%) scale(.7)}.ds-len{position:absolute;top:12px;right:12px;font-size:11px;font-weight:700;color:#fff;background:rgba(20,10,40,.6);backdrop-filter:blur(6px);padding:4px 8px;border-radius:100px;letter-spacing:.03em}.ds-meta{position:absolute;left:14px;right:14px;bottom:14px;text-align:left}.ds-meta b{display:block;font-family:var(--font-display);font-size:15px;font-weight:700;color:#fff;letter-spacing:-.01em}.ds-meta small{display:block;font-size:12px;color:rgba(255,255,255,.72);margin-top:2px}.ds-quote{display:block;font-size:12.5px;line-height:1.45;color:#fff;margin:0 0 8px;font-weight:500}.ds-tag{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7BE0B0;margin-bottom:7px}.ds-tag svg{width:11px;height:11px;fill:#7BE0B0}.ds-arrow{position:absolute;top:calc(50% - 12px);transform:translateY(-50%);z-index:3;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:#fff;cursor:pointer;display:none;place-items:center;box-shadow:0 8px 20px -8px rgba(43,27,78,.3)}.ds-arrow svg{width:16px;height:16px;fill:var(--ink)}.ds-arrow.prev{left:4px}.ds-arrow.next{right:4px}@media(min-width:860px){.ds-arrow{display:grid}.ds-rail{padding-left:52px;padding-right:52px}}.ds-sound{display:flex;align-items:center;justify-content:center;gap:7px;font-size:12.5px;color:#9A90B4;margin:0 0 4px}.ds-sound svg{width:14px;height:14px;fill:#9A90B4}.ds-wa{padding:34px 0 0}.ds-wa-shell{position:relative;margin:0 -20px;padding:0 20px}.ds-wa-cols{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;height:560px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 8%,#000 88%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 8%,#000 88%,transparent 100%)}@media(min-width:860px){.ds-wa-cols{grid-template-columns:repeat(3,1fr);gap:18px;height:640px}}.ds-wa-col{display:flex;flex-direction:column;gap:14px;will-change:transform}.ds-wa-col.down{animation:dsDriftDown 46s linear infinite}.ds-wa-col.up{animation:dsDriftUp 46s linear infinite}.ds-wa-cols:hover .ds-wa-col,.ds-wa-cols.paused .ds-wa-col{animation-play-state:paused}@keyframes dsDriftUp{from{transform:translateY(0)}to{transform:translateY(-50%)}}@keyframes dsDriftDown{from{transform:translateY(-50%)}to{transform:translateY(0)}}.ds-wa-cols.open{height:auto;-webkit-mask-image:none;mask-image:none}.ds-wa-cols.open .ds-wa-col{animation:none}.ds-shot{border:0;padding:0;margin:0;width:100%;text-align:left;cursor:zoom-in;background:var(--card);border-radius:var(--r-md);overflow:hidden;box-shadow:0 8px 22px -14px rgba(43,27,78,.36);transition:transform .3s,box-shadow .3s}.ds-shot:hover{transform:scale(1.022);box-shadow:0 14px 30px -14px rgba(43,27,78,.42)}.ds-shot:focus-visible{outline:3px solid var(--coral);outline-offset:3px}.ds-bar{display:flex;align-items:center;gap:8px;background:var(--wa-green);padding:8px 10px}.ds-av{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.26);display:grid;place-items:center;font-size:10px;font-weight:700;color:#fff;flex:0 0 auto}.ds-who{min-width:0}.ds-who b{display:block;font-size:11.5px;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ds-who small{font-size:9.5px;color:rgba(255,255,255,.66)}.ds-paper{background:var(--wa-paper);padding:10px 10px 12px;display:flex;flex-direction:column;gap:6px;min-height:74px}.ds-paper img{width:100%;display:block;border-radius:6px}.ds-bub{max-width:88%;padding:7px 9px 6px;border-radius:8px;font-size:12.5px;line-height:1.42;color:#111B21;box-shadow:0 1px 1px rgba(0,0,0,.09);position:relative;word-break:break-word}.ds-bub.them{background:#fff;align-self:flex-start;border-top-left-radius:2px}.ds-bub.me{background:var(--wa-bubble);align-self:flex-end;border-top-right-radius:2px}.ds-time{display:block;text-align:right;font-size:9.5px;color:#667781;margin-top:3px}.ds-time svg{width:12px;height:12px;fill:#53BDEB;vertical-align:-2px;margin-left:2px}.ds-foot{display:flex;align-items:center;gap:6px;padding:8px 10px;border-top:1px solid var(--line);font-size:10.5px;color:#9A90B4}.ds-foot b{color:var(--ink);font-weight:600}.ds-zoom{margin-left:auto;color:var(--coral);font-weight:700}.ds-wa-actions{display:flex;justify-content:center;margin:22px 0 0}.ds-btn-ghost{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--ink);background:#fff;border:1px solid var(--line);cursor:pointer;padding:12px 22px;border-radius:100px;box-shadow:0 6px 18px -12px rgba(43,27,78,.4)}.ds-btn-ghost:hover{border-color:var(--coral);color:var(--coral)}.ds-privacy{display:flex;gap:8px;align-items:flex-start;max-width:620px;margin:16px auto 0;font-size:11.5px;line-height:1.5;color:#9A90B4;text-align:left}.ds-privacy svg{width:13px;height:13px;fill:#9A90B4;flex:0 0 auto;margin-top:2px}.ds-cta{margin:46px 0 0;background:var(--plum);background-image:radial-gradient(90% 140% at 8% 0%,#3B1A52 0%,transparent 58%)}.ds-cta-in{max-width:1180px;margin:0 auto;padding:26px 20px 30px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}.ds-cta p{margin:0;font-family:var(--font-display);font-weight:700;color:#fff;font-size:clamp(17px,4.4vw,23px);letter-spacing:-.01em}.ds-cta p span{color:var(--gold)}.ds-btn-cta{display:inline-flex;align-items:center;gap:12px;text-decoration:none;background:linear-gradient(96deg,#F0B04A,#E4834A);color:#2A1200;font-family:var(--font-display);font-weight:800;font-size:16px;padding:15px 26px;border:0;border-radius:100px;box-shadow:0 12px 28px -12px rgba(233,161,59,.7);cursor:pointer}.ds-btn-cta .price{font-size:19px}.ds-btn-cta .strike{font-weight:600;font-size:13px;opacity:.6;text-decoration:line-through}.ds-btn-cta:hover{filter:brightness(1.05)}.ds-lb{position:fixed;inset:0;z-index:10000;display:none;background:rgba(16,8,32,.93);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:18px}.ds-lb.on{display:flex}.ds-lb-body{position:relative;max-width:min(94vw,420px);width:100%;max-height:88vh;display:flex;flex-direction:column;align-items:center;gap:12px}.ds-lb-body video{width:100%;max-height:78vh;border-radius:18px;background:#000;display:block}.ds-lb-shot{width:100%;max-height:80vh;overflow-y:auto;border-radius:14px}.ds-lb-cap{font-size:13px;color:rgba(255,255,255,.78);text-align:center}.ds-lb-cap b{color:#fff;display:block;font-family:var(--font-display);font-size:15px}.ds-lb-x{position:absolute;top:-46px;right:0;width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:21px;cursor:pointer;line-height:1;display:grid;place-items:center}.ds-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.16);cursor:pointer;display:grid;place-items:center}.ds-lb-nav svg{width:16px;height:16px;fill:#fff}.ds-lb-nav.p{left:-52px}.ds-lb-nav.n{right:-52px}.ds-lb-placeholder{aspect-ratio:9/16;border-radius:18px;display:grid;place-items:center;background:radial-gradient(120% 90% at 30% 12%,#4A2E78,#1B1033);color:rgba(255,255,255,.5);font-size:13px;text-align:center;padding:20px}@media(max-width:600px){.ds-lb-nav.p{left:2px}.ds-lb-nav.n{right:2px}.ds-lb-nav{background:rgba(255,255,255,.22)}}@media(prefers-reduced-motion:reduce){.ds-proof *{animation:none!important;transition:none!important}.ds-wa-cols{height:auto;-webkit-mask-image:none;mask-image:none}}
/* Moving thumbnail testimonial carousel */
.ds-rail-outer{margin:0;overflow:hidden}.ds-rail{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:20px;-webkit-overflow-scrolling:touch;padding:6px 20px 24px;gap:14px;scrollbar-width:none}.ds-rail::-webkit-scrollbar{display:none}.ds-vcontrols{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;gap:6px;padding:8px 10px;background:linear-gradient(to bottom,rgba(0,0,0,.55) 0%,transparent 100%);z-index:4}.ds-vc-btn{width:28px;height:28px;border:0;padding:0;background:rgba(0,0,0,.28);border-radius:50%;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(4px);flex:0 0 auto}.ds-vc-btn svg{width:14px;height:14px;fill:#fff}.ds-vc-btn:last-child{margin-left:auto}.ds-vcard.is-playing .ds-thumb{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:unset;border-radius:8px}.ds-vcard.is-playing .ds-play{opacity:.5}.ds-vcard.is-playing{padding:0}.ds-vcard{display:flex;flex-direction:column;justify-content:space-between;position:relative;flex:0 0 auto;width:min(55vw,220px);scroll-snap-align:start;min-height:280px;aspect-ratio:auto;border:2px solid rgba(228,105,91,.42);border-radius:10px;background:linear-gradient(180deg,#FFF7F1 0%,#F8ECE6 100%);color:#2B1B4E;padding:16px 12px 14px;box-shadow:0 14px 30px -20px rgba(43,27,78,.38),inset 0 0 0 1px rgba(255,255,255,.72);overflow:hidden}.ds-vcard:hover{transform:translateY(-4px);border-color:rgba(228,105,91,.72);box-shadow:0 18px 36px -20px rgba(228,105,91,.42),inset 0 0 0 1px rgba(255,255,255,.8)}.ds-card-quote{margin:0 0 16px;font-family:var(--font-display);font-size:20px;font-weight:800;line-height:1.1;letter-spacing:-.03em;color:#2B1B4E}.ds-thumb{position:relative;width:100%;aspect-ratio:1/1;border-radius:6px;overflow:hidden;background:#F2DCD3;box-shadow:inset 0 0 0 1px rgba(228,105,91,.18)}.ds-thumb video,.ds-thumb img,.ds-thumb .ds-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.ds-thumb .ds-poster{background:radial-gradient(120% 90% at 30% 12%,#F6C99A 0%,#E4695B 58%,#2B1B4E 100%)}.ds-thumb .ds-poster span{font-size:34px;color:rgba(255,255,255,.62)}.ds-len{top:7px;right:7px;background:rgba(29,36,29,.68);font-size:10px}.ds-student{margin-top:16px;text-align:left}.ds-student b{display:block;font-family:var(--font-display);font-size:15px;font-weight:900;line-height:1.05;color:#2B1B4E}.ds-student span{display:block;width:78px;height:2px;margin:6px 0 7px;background:linear-gradient(90deg,#E4695B,#E9A13B)}.ds-student small{display:block;font-size:11px;font-weight:800;line-height:1.15;color:#63548A}.ds-arrow{display:none!important}@media(min-width:480px){.ds-vcard{width:min(48vw,240px);min-height:300px;padding:18px 14px 16px}.ds-card-quote{font-size:21px}.ds-student b{font-size:16px}.ds-student small{font-size:11.5px}}@media(min-width:860px){.ds-rail{padding-left:24px;padding-right:24px;scroll-padding-inline:24px}.ds-vcard{width:200px;min-height:320px;padding:20px 14px 18px}.ds-card-quote{font-size:22px}.ds-student b{font-size:17px}.ds-student small{font-size:12px}}@media(min-width:1180px){.ds-vcard{width:220px;min-height:340px}}@media(prefers-reduced-motion:reduce){.ds-rail{overflow-x:auto}}
`;

export default DsAstroTestimonials;
