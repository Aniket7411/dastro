import { WB_WRAP } from '../webinar/tokens';

function MentorSection() {
  const CREDENTIALS = [
    { value: '10k+', label: 'Students' },
    { value: '5000+', label: 'Consultations' },
    { value: 'Sony TV', label: 'Featured on' },
  ];

  return (
    <section className="py-6 sm:py-7 bg-slate-50">
      <div className={WB_WRAP}>
        <div className="mx-auto max-w-5xl rounded-[28px] bg-white px-4 py-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:px-5 sm:py-7 lg:px-7 lg:py-8">
          <div className="flex justify-center">
            <span className="rounded-full bg-[#EE6662] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
              YOUR MENTOR
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-6">
            <div className="order-1 mx-auto w-full max-w-[20rem] overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-sm shadow-slate-900/5 sm:max-w-sm md:max-w-md lg:order-2 lg:max-w-lg">
              <img
                src="/images/damini-new.jpg"
                alt="Face Reading Review"
                className="h-[220px] w-full object-contain object-center sm:h-[250px] md:h-[290px] lg:h-[330px] xl:h-[350px]"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="text-center md:text-left lg:order-1 order-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-[2.2rem]">
                Damini Shukla
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:mx-0 md:max-w-none">
                Vedic astrologer & face reading expert, lead astrologer at DS Astro Institute.
              </p>
              <div className="mx-auto mt-4 h-px w-16 rounded-full bg-slate-200 md:mx-0" />
              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {CREDENTIALS.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[84px] flex-col justify-center rounded-[18px] border border-slate-200 bg-slate-50 px-2 py-2 text-center shadow-sm sm:min-h-[108px] sm:rounded-[24px] sm:px-3 sm:py-3"
                  >
                    <p className="text-[1rem] font-extrabold tracking-tight text-slate-950 sm:text-xl">{item.value}</p>
                    <p className="mt-1 text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.28em]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}

export default MentorSection;
