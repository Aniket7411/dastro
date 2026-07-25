import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  TYPE,
} from '../webinar/tokens';

function WhoIsThisForSection() {
  const perfectFor = [
    "You meet new people daily — sales, HR, business, teaching",
    "You’re searching a life partner (or helping family search one!)",
    "You love psychology, astrology or people-watching",
    "You want a skill people actually pay ₹2,000–₹5,000 per reading for"
  ];
  const notFor = [
    "You want to judge or insult people — we teach reading with compassion"
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            Who Is This <span className={WB_HIGHLIGHT}>Masterclass For?</span>
          </h2>
        </div>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100" data-aos="fade-up">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <i className="fas fa-check text-xl"></i>
                    </div>
                    <h3 className={`${TYPE.h3} !text-green-800`}>Perfect for you if:</h3>
                </div>
                <ul className="space-y-3">
                    {perfectFor.map((item, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-sm sm:text-base">
                            <i className="fas fa-check-circle text-green-500 mt-1 shrink-0"></i>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <i className="fas fa-times text-xl"></i>
                    </div>
                    <h3 className={`${TYPE.h3} !text-red-800`}>Not for you if:</h3>
                </div>
                <ul className="space-y-3">
                    {notFor.map((item, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 text-sm sm:text-base">
                            <i className="fas fa-times-circle text-red-500 mt-1 shrink-0"></i>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
}

export default WhoIsThisForSection;
