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
    { text: 'Aap apni kundli har baar kisi aur se padhwate hain aur ab khud samajhna chahte hain' },
    { text: 'Aapne astrology ke baare mein bahut suna hai par kabhi structured tarike se seekha nahi' },
    { text: 'Aap tarot, numerology ya face reading karte hain aur Jyotish ki foundation add karna chahte hain' },
    { text: 'Aap ghar walon aur doston ki kundli samajhna chahte hain - sirf apni nahi' },
  ];

  const notFor = [
    { text: 'Aap chahte hain koi bata de ki shaadi kab hogi ya paisa kab aayega - ye seekhne ki class hai, consultation nahi' },
    { text: 'Aap do din mein astrologer ban jaana chahte hain - foundation 2 din mein banti hai, mahaarat mein waqt lagta hai' },
    { text: 'Aap ratna, upay aur remedies ki list chahte hain - ye masterclass chart padhna sikhati hai' },
    { text: 'Aap practice nahi karna chahte - kundli padhna repetition se aata hai' },
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
                            <span>{item.text}</span>
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
                            <span>{item.text}</span>
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
