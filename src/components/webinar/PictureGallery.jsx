import {
  WB_WRAP,
  WB_HIGHLIGHT,
  WB_SECTION,
  WB_SUBTITLE,
  WB_TITLE,
  WB_UNDERLINE,
  TYPE,
} from './tokens';

const galleryImages = [
  { url: '/images/horocurty.jpg', title: 'Live Webinar Session' },
  { url: '/images/horocurty03.jpg', title: 'Interactive Learning' },
  { url: '/images/ruiy-img01.jpg', title: 'Mentorship Program' },
  { url: '/images/bg-bannerpic.jpg', title: 'Student Community' },
  { url: '/images/cosmic_blueprint.png', title: 'Vedic Insights' },
];

const PictureGallery = () => {
  return (
    <section className={`${WB_SECTION} bg-[#fdfaff]`}>
      <div className={WB_WRAP}>
        <div className="text-center">
          <h5 className={WB_SUBTITLE}>Memories</h5>
          <h2 className={WB_TITLE}>
            Glimpses of Our <span className={WB_HIGHLIGHT}>Webinars</span>
          </h2>
          <div className={WB_UNDERLINE} />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3">
          {galleryImages.map((img, idx) => (
            <div
              key={img.title}
              className="group relative aspect-[16/10] w-[calc(50%_-_5px)] overflow-hidden rounded-lg border border-slate-200 shadow-sm sm:w-[calc(50%_-_6px)] md:w-[calc(33.333%_-_8px)]"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#3B2261]/90 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100 sm:p-6">
                  <div>
                    <h4 className="!m-0 font-heading !text-base !font-bold !text-white sm:!text-lg">
                      {img.title}
                    </h4>
                    <p className={`${TYPE.caption} !mt-1 !text-[#EE6662]`}>Experience the Magic</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PictureGallery;
