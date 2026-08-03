import { WB_WRAP } from '../webinar/tokens';

function MentorSection() {
  const CREDENTIALS = [
    { value: '10k+', label: 'Students' },
    { value: '5000+', label: 'Consultations' },
    { value: 'Sony TV', label: 'Featured on' },
  ];

  return (
    <section className="py-3 sm:py-7 bg-slate-50">
      <div className={WB_WRAP}>
        <div className="mx-auto max-w-5xl rounded-[28px] bg-white px-4 py-4 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:px-5 sm:py-7 lg:px-7 lg:py-8">
          <div className="flex justify-center">
            <span className="rounded-full bg-[#EE6662] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
              YOUR MENTOR
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-6">
            <div className="group order-1 mx-auto w-full max-w-[20rem] overflow-hidden rounded-[26px] bg-transparent shadow-[0_14px_34px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,23,42,0.16)] sm:max-w-sm md:max-w-md lg:order-2 lg:max-w-lg">
              <img
                src="/updatedmentor.webp"
                alt="Face Reading Review"
                className="h-[220px] w-full scale-[1.06] object-cover object-top transition duration-500 group-hover:scale-[1.1] sm:h-[250px] md:h-[290px] lg:h-[330px] xl:h-[350px]"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="text-center md:text-left lg:order-1 order-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[2.2rem]">
                Damini Shukla
              </h2>
              <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-6 sm:mt-3 sm:leading-7 text-slate-600 md:mx-0 md:max-w-none">
                Vedic astrologer & face reading expert, lead astrologer at DS Astro Institute.
              </p>
              <div className="mx-auto mt-3 h-px sm:mt-4 w-16 rounded-full bg-slate-200 md:mx-0" />
              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-6 sm:gap-3">
                {CREDENTIALS.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[62px] flex-col justify-center rounded-[14px] border border-slate-200 bg-slate-50 px-1.5 py-1.5 text-center shadow-sm sm:min-h-[108px] sm:rounded-[24px] sm:px-3 sm:py-3"
                  >
                    <p className="text-[0.95rem] font-extrabold tracking-tight text-slate-950 sm:text-xl">{item.value}</p>
                    <p className="mt-0.5 text-[8px] font-semibold uppercase leading-tight tracking-[0.12em] text-slate-500 sm:mt-2 sm:text-[10px] sm:tracking-[0.28em]">
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
