import { useEffect, useState } from 'react';
import { EyeOff, ShieldAlert } from 'lucide-react';

const NOTICE_MS = 3200;
const SHIELD_MS = 6500;

export default function ProtectedScreenGuard({ label = 'Protected student content' }) {
  const [notice, setNotice] = useState('');
  const [shielded, setShielded] = useState(false);

  useEffect(() => {
    let noticeTimer;
    let shieldTimer;

    const pauseVideos = () => {
      document.querySelectorAll('video').forEach((video) => {
        if (!video.paused) video.pause();
      });
    };

    const showNotice = (message) => {
      setNotice(message);
      window.clearTimeout(noticeTimer);
      noticeTimer = window.setTimeout(() => setNotice(''), NOTICE_MS);
    };

    const showShield = (message, duration = SHIELD_MS) => {
      pauseVideos();
      setShielded(true);
      showNotice(message);
      window.clearTimeout(shieldTimer);
      shieldTimer = window.setTimeout(() => setShielded(false), duration);
    };

    const blockEvent = (event, message) => {
      event.preventDefault();
      event.stopPropagation();
      showShield(message);
      return false;
    };

    const handleKeyDown = (event) => {
      const key = event.key || '';
      const lowerKey = key.toLowerCase();
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const isPrintScreen = key === 'PrintScreen';
      const isSaveOrPrint = ctrlOrMeta && ['s', 'p', 'u'].includes(lowerKey);
      const isDevTools =
        key === 'F12' ||
        (ctrlOrMeta && event.shiftKey && ['i', 'j', 'c'].includes(lowerKey));
      const isScreenClip =
        (event.metaKey && event.shiftKey && ['3', '4', '5', 's'].includes(lowerKey)) ||
        (event.ctrlKey && event.shiftKey && lowerKey === 's');
      const isGameBarRecord = event.altKey && lowerKey === 'r';

      if (isGameBarRecord) {
        return blockEvent(
          event,
          'Screen recording shortcut is restricted. Course video has been hidden.',
        );
      }

      if (isPrintScreen || isSaveOrPrint || isDevTools || isScreenClip) {
        return blockEvent(
          event,
          'Screen capture, download and inspect shortcuts are restricted.',
        );
      }

      return undefined;
    };

    const handleContextMenu = (event) =>
      blockEvent(event, 'Right click is disabled on protected student pages.');
    const handleCopy = (event) =>
      blockEvent(event, 'Copying protected course content is disabled.');
    const handleDrag = (event) =>
      blockEvent(event, 'Dragging protected course content is disabled.');
    const handleBlur = () => {
      showShield('Protected content hidden while this window is not active.', 9000);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        showShield('Protected content hidden while this tab is not active.', 9000);
      }
    };

    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia?.bind(navigator.mediaDevices);
    if (originalGetDisplayMedia) {
      try {
        navigator.mediaDevices.getDisplayMedia = async () => {
          showShield('Screen sharing is not allowed on protected course pages.', 9000);
          throw new DOMException('Screen capture is not allowed on this page.', 'NotAllowedError');
        };
      } catch {
        // Some browsers expose getDisplayMedia as read-only.
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCopy, true);
    document.addEventListener('dragstart', handleDrag, true);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCopy, true);
      document.removeEventListener('dragstart', handleDrag, true);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearTimeout(noticeTimer);
      window.clearTimeout(shieldTimer);
      if (originalGetDisplayMedia) {
        try {
          navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
        } catch {
          // ignore restore failures
        }
      }
    };
  }, []);

  return (
    <>
      {notice && (
        <div className="fixed left-1/2 top-20 z-[10000] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-2 rounded-full bg-site-primary px-4 py-2.5 text-center font-body text-xs font-bold text-white shadow-xl sm:text-sm">
          <ShieldAlert size={15} className="shrink-0 text-site-accent" />
          <span>{notice}</span>
        </div>
      )}

      {shielded && (
        <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-3 bg-black/92 px-5 text-center text-white backdrop-blur-md">
          <EyeOff size={38} className="text-site-accent" />
          <p className="m-0 font-heading text-xl font-extrabold sm:text-2xl">{label}</p>
          <p className="m-0 max-w-md font-body text-sm font-semibold leading-relaxed text-white/75">
            Recording, screenshots and screen sharing are not allowed. Return to the active course window to continue.
          </p>
        </div>
      )}
    </>
  );
}