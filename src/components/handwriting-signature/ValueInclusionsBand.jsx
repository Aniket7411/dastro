import {
  WB_WRAP,
  WB_SECTION,
  WB_SECTION_INTRO,
  WB_INTRO_TITLE,
  WB_HIGHLIGHT,
  TYPE,
} from '../webinar/tokens';

function ValueInclusionsBand() {
  const inclusions = [
    { text: "2 live sessions Damini Ma'am ke saath - 2 din, 2 ghante roz, Zoom par", icon: 'fa-video' },
    { text: "Dono din ki full recording - jitni baar chahe dekhiye", icon: 'fa-play-circle' },
    { text: "Dono din ke PDF notes - simple English mein", icon: 'fa-file-pdf' },
    { text: "Apni handwriting aur signature ki live reading class ke andar", icon: 'fa-signature' },
    { text: "Ek graphotherapy correction jo aap usi raat se practice kar sakte hain", icon: 'fa-pen-nib' },
    { text: "WhatsApp group support - sample bhejiye, doubts poochhiye", icon: 'fa-comments' }
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_INTRO} mb-6 sm:mb-8`}>
          <h2 className={WB_INTRO_TITLE}>
            ₹499 mein aapko <span className={WB_HIGHLIGHT}>mil raha hai:</span>
          </h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
          {inclusions.map((item, idx) => (
            <div key={idx} className="relative overflow-hidden rounded-[14px] bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-5 flex items-center gap-4" data-aos="fade-up">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#EE6662]">
                <i className={`fas ${item.icon} text-lg`}></i>
              </div>
              <p className={`${TYPE.lead} !m-0 !text-[15px]`}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ValueInclusionsBand;
