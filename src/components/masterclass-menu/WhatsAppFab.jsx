import { HELP_LINK } from './menuTheme';

function WhatsAppFab({ hidden = false }) {
  return (
    <a
      href={`${HELP_LINK}?text=${encodeURIComponent('Hi, mujhe live masterclass ke baare mein jaankari chahiye.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp par chat kijiye"
      title="WhatsApp par chat kijiye"
      className={`fixed bottom-[20px] right-[16px] z-[70] flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition duration-300 hover:scale-105 hover:shadow-[0_14px_34px_rgba(37,211,102,0.55)] sm:bottom-[24px] sm:right-[24px] sm:h-[60px] sm:w-[60px] ${
        hidden ? 'pointer-events-none scale-75 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30 motion-reduce:hidden" aria-hidden="true" />
      <i className="fab fa-whatsapp relative text-[30px] sm:text-[32px]" aria-hidden="true" />
    </a>
  );
}

export default WhatsAppFab;
