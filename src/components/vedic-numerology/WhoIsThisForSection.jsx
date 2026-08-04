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
    'Aap logon ko jaldi samajhna chahte hain - sales, HR, business, teaching',
    'Aapko astrology mein interest hai par chart aur calculation bhaari lagte hain',
    'Aap parent hain aur bachche ka nature aur strengths samajhna chahte hain',
    'Aap ek aisa skill chahte hain jo bina kisi tool ke, kahin bhi, kisi ke bhi saath chal jaaye',
  ];

  const notFor = [
    'Aap chahte hain koi number badal kar aapki kismat badal de - numbers direction batate hain, guarantee nahi',
    'Aap sirf apne naam ki correction karwana chahte hain - is masterclass mein calculation sikhayi jaati hai, correction methodology nahi',
    'Aap future ki exact dates chahte hain - ye character aur cycles padhna hai, bhavishyavani nahi',
    'Aap practice nahi karna chahte - numbers padhna repetition se aata hai',
  ];

  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={WB_SECTION_INTRO}>
          <h2 className={WB_INTRO_TITLE}>
            Who is this <span className={WB_HIGHLIGHT}>masterclass for</span>?
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
