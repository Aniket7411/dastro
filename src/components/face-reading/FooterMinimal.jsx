import { Link } from 'react-router-dom';

function FooterMinimal() {
  return (
    <footer className="border-t border-white/10 bg-[#2A1647] text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start lg:px-8">
        
        {/* Contact Info */}
        <div className="text-center md:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#EE6662]">Contact Support</p>
          <div className="space-y-2 text-sm font-medium text-slate-400">
            <p>
              <i className="fab fa-whatsapp mr-2 text-green-400 text-lg align-middle"></i>
              <a href="https://wa.me/919005575577" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition">
                +91 90055 75577
              </a>
            </p>
            <p>
              <i className="fas fa-envelope mr-2 text-[#EE6662] text-lg align-middle"></i>
              <a href="mailto:info@dsastrology.com" className="hover:text-white hover:underline transition">
                info@dsastrology.com
              </a>
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#EE6662]">Connect With Us</p>
            <p className="text-sm font-bold text-white mb-3">@Dsastrounfiltered</p>
            <div className="flex items-center justify-center gap-5 text-2xl">
                <a href="https://www.instagram.com/dsastrounfiltered/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#EE6662] transition hover:-translate-y-1">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/@dsastrounfiltered" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#EE6662] transition hover:-translate-y-1">
                    <i className="fab fa-youtube"></i>
                </a>
                <a href="https://www.facebook.com/dsastrounfiltered/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#EE6662] transition hover:-translate-y-1">
                    <i className="fab fa-facebook"></i>
                </a>
            </div>
        </div>

        {/* Links & Copyright */}
        <div className="text-center md:text-right">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium md:justify-end mb-4">
            <Link className="text-slate-400 hover:text-white transition hover:underline" to="/privacy-policy">Privacy Policy</Link>
            <Link className="text-slate-400 hover:text-white transition hover:underline" to="/terms-and-conditions">Terms of Service</Link>
            <Link className="text-slate-400 hover:text-white transition hover:underline" to="/refund-policy">Refund Policy</Link>
          </div>
          <p className="mb-0 text-xs font-medium text-slate-500">&copy; {new Date().getFullYear()} DS Astrology. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default FooterMinimal;
