import { WB_WRAP, WB_SECTION, WB_SECTION_INTRO, WB_INTRO_TITLE, WB_HIGHLIGHT, TYPE } from '../webinar/tokens';
import { HUB_INCLUSIONS } from '../../data/masterclassHubData';

function HubValueBand() {
  return (
    <section className={`${WB_SECTION} bg-[#FAF9F6]`}>
      <div className={WB_WRAP}>
        <div className={`${WB_SECTION_INTRO} mb-6 sm:mb-8`}>
          <h2 className={WB_INTRO_TITLE}>
            Every ₹499 masterclass <span className={WB_HIGHLIGHT}>includes:</span>
          </h2>
        </div>
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {HUB_INCLUSIONS.map((item) => (
            <div
              key={item.text}
              className="relative flex items-center gap-4 overflow-hidden rounded-[14px] border border-slate-200/60 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
              data-aos="fade-up"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-[#EE6662]">
                <i className={`fas ${item.icon} text-lg`} aria-hidden="true" />
              </div>
              <p className={`${TYPE.lead} !m-0 !text-[15px]`}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HubValueBand;
