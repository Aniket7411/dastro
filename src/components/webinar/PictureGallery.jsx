const galleryImages = [
  { url: '/images/horocurty.jpg', title: 'Live Webinar Session' },
  { url: '/images/horocurty03.jpg', title: 'Interactive Learning' },
  { url: '/images/ruiy-img01.jpg', title: 'Mentorship Program' },
  { url: '/images/bg-bannerpic.jpg', title: 'Student Community' },
  { url: '/images/cosmic_blueprint.png', title: 'Vedic Insights' },
 
];

const PictureGallery = () => {
  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header text-center">
          <h5 className="section-subtitle">Memories</h5>
          <h2 className="section-title">Glimpses of Our <span className="text-highlight">Webinars</span></h2>
          <div className="header-underline mx-auto"></div>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="gallery-item" data-aos="zoom-in" data-aos-delay={idx * 100}>
              <div className="gallery-img-wrapper">
                <img src={img.url} alt={img.title} />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h4>{img.title}</h4>
                    <p>Experience the Magic</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .gallery-section {
          padding: 100px 0;
          background: #fdfaff;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 50px;
        }
        .gallery-item {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 4/3;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .gallery-img-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
          transition: 0.5s;
        }
        .gallery-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.5s;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(59, 34, 97, 0.9), transparent);
          display: flex;
          align-items: flex-end;
          padding: 30px;
          opacity: 0;
          transition: 0.4s;
        }
        .overlay-content h4 {
          color: #fff;
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 5px;
        }
        .overlay-content p {
          color: var(--brand-coral, #EE6662);
          font-size: 0.9rem;
          font-weight: 700;
        }
        .gallery-item:hover .gallery-img-wrapper img {
          transform: scale(1.1);
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }
        @media (max-width: 991px) {
          .gallery-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 576px) {
          .gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};

export default PictureGallery;
