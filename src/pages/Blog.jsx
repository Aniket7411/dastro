import React, { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';


function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (window.AOS) {
      window.AOS.refresh();
    }
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/blogs`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error while fetching blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = blogs.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: 'Vedic Astrology', count: blogs.filter(b => b.category === 'Vedic Astrology').length },
    { name: 'Numerology', count: blogs.filter(b => b.category === 'Numerology').length },
    { name: 'Tarot Reading', count: blogs.filter(b => b.category === 'Tarot Reading').length },
    { name: 'Palmistry', count: blogs.filter(b => b.category === 'Palmistry').length },
    { name: 'Vastu Shastra', count: blogs.filter(b => b.category === 'Vastu Shastra').length },
    { name: 'Zodiac Insights', count: blogs.filter(b => b.category === 'Zodiac Insights').length },
    { name: 'Relationship Advice', count: blogs.filter(b => b.category === 'Relationship Advice').length },
    { name: 'Career Guidance', count: blogs.filter(b => b.category === 'Career Guidance').length },
    { name: 'Spiritual Healing', count: blogs.filter(b => b.category === 'Spiritual Healing').length },
    { name: 'Festivals & Muhurat', count: blogs.filter(b => b.category === 'Festivals & Muhurat').length }
  ];

  const recentPosts = blogs.slice(0, 3);

  const tags = ['Zodiac', 'Future', 'Horoscope', 'Planets', 'Vedic', 'Remedies'];

  return (
    <>
      {/* Hero Banner */}
      <section className="blog-hero">
        <div className="hero-overlay"></div>
        <div className="container position-relative z-2">
          <div className="text-center" data-aos="fade-down">
            <h5 className="section-subtitle">✨ Wisdom & Insights ✨</h5>
            <h1 className="hero-title mb-3">Cosmic <span className="text-gradient">Blog</span></h1>
            <p className="hero-subtitle">Explore ancient wisdom for modern life challenges</p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="blog-content-section py-5">
        <div className="container">
            {/* Search Bar & Stats Section */}
            <div className="row justify-content-center mb-5" data-aos="fade-up">
              <div className="col-lg-10">
                <div className="premium-search-card p-4">
                  <div className="text-center mb-4">
                    <h5 className="sidebar-title m-0" style={{border: 'none', fontSize: '1.6rem'}}>🔍 Search Astro Knowledge</h5>
                  </div>
                  <div className="search-box mb-3" style={{maxWidth: '800px', margin: '0 auto'}}>
                    <input 
                      type="text" 
                      className="search-input py-3" 
                      placeholder="Search for articles, planetary movements, or remedies..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery ? (
                      <button className="search-btn" onClick={() => setSearchQuery('')}><i className="fas fa-times"></i></button>
                    ) : (
                      <button className="search-btn"><i className="fas fa-search"></i></button>
                    )}
                  </div>
                  <div className="trending-tags text-center mt-3">
                    <span className="me-2 text-muted small fw-bold">TRENDING:</span>
                    {['Financial', 'Relationship', 'Career', 'Health'].map((tag, i) => (
                      <span key={i} className="badge-trending me-2" onClick={() => setSearchQuery(tag)}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5">
              {/* Left - Blog Posts */}
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-up">
                  <h5 className="result-count m-0">📖 Showing <span className="fw-bold">{filteredPosts.length}</span> articles</h5>
                </div>

              <div className="blog-list">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-3">Gazing at the stars for articles...</p>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post, idx) => (
                    <div className="blog-card mb-4" key={post._id} data-aos="fade-up" data-aos-delay={idx * 100}>
                      <div className="row g-0">
                        <div className="col-md-4">
                          <div className="blog-img-wrapper">
                            <img src={post.image || 'https://via.placeholder.com/400x250'} alt={post.title} />
                            <div className="date-chip">
                              <span className="day">{new Date(post.createdAt).getDate()}</span>
                              <span className="month">{new Date(post.createdAt).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <div className="blog-body p-4">
                            <span className="category-badge mb-2 d-inline-block">
                              📍 {post.category}
                            </span>
                            <h3 className="blog-title mb-2">{post.title}</h3>
                            <div className="blog-meta mb-3">
                              <span><i className="far fa-calendar-alt me-1"></i> {new Date(post.createdAt).toLocaleDateString()}</span>
                              <span className="ms-3"><i className="far fa-user me-1"></i> Astro Expert</span>
                            </div>
                            <p className="blog-excerpt">{post.excerpt}</p>
                            <a href={`/blog/${post.slug}`} className="read-more">Continue Reading →</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results-blog text-center py-5" data-aos="zoom-in">
                    <i className="fas fa-search-minus mb-3" style={{fontSize: '4rem', color: '#FF8C42', opacity: 0.5}}></i>
                    <h3>No articles found for "{searchQuery}"</h3>
                    <p className="text-muted">Try searching with different keywords or browse our categories.</p>
                    <button className="btn mystic-btn-outline mt-3" onClick={() => setSearchQuery('')}>Clear Search</button>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              <nav className="mt-5" data-aos="fade-up">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled"><a className="page-link" href="#">← Prev</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">Next →</a></li>
                </ul>
              </nav>
            </div>

            {/* Right Sidebar */}
            <div className="col-lg-4">
              <aside className="blog-sidebar">


                {/* Categories */}
                <div className="sidebar-card mb-4" data-aos="fade-left" data-aos-delay="100">
                  <h4 className="sidebar-title">📂 Categories</h4>
                  <ul className="category-list">
                    {categories.map((cat, idx) => (
                      <li key={idx}>
                        <a href="#">
                          <span>{cat.name}</span>
                          <span className="count">{cat.count}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="sidebar-card mb-4" data-aos="fade-left" data-aos-delay="200">
                  <h4 className="sidebar-title">🕒 Recent Posts</h4>
                  <div className="recent-list">
                    {recentPosts.map((post, idx) => (
                      <a href="#" key={idx} className="recent-item">
                        <div className="recent-img">
                          <img src={post.image} alt={post.title} />
                        </div>
                        <div className="recent-info">
                          <h6 className="recent-title">{post.title}</h6>
                          <span className="recent-date">{post.date}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="sidebar-card" data-aos="fade-left" data-aos-delay="300">
                  <h4 className="sidebar-title">🏷️ Popular Tags</h4>
                  <div className="tags-wrapper">
                    {tags.map((tag, idx) => (
                      <a href="#" key={idx} className="tag">{tag}</a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');

        /* Hero Section */
        .blog-hero {
          position: relative;
          padding: 100px 0 60px;
          background: linear-gradient(135deg, #FFF8F0 0%, #FFF5EB 100%);
          text-align: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 100%, rgba(255, 107, 53, 0.06), transparent 60%);
        }

        .section-subtitle {
          color: #FF8C42;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 800;
          font-size: 1rem;
          margin-bottom: 15px;
          display: inline-block;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.2rem, 7vw, 4.8rem);
          font-weight: 800;
          color: #1A1A2E;
          margin-bottom: 15px;
        }

        .text-gradient {
          background: linear-gradient(135deg, #FF8C42, #FF6B35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: #4A5568;
          font-weight: 500;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        /* Blog Content */
        .blog-content-section {
          background: #FFFFFF;
          padding: 60px 0 80px;
        }

        .result-count {
          font-size: 1.1rem;
          color: #4A5568;
          font-weight: 500;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        /* Blog Card */
        .blog-card {
          background: #FFFFFF;
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1px solid #F0E6DC;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: #FF8C42;
        }

        .blog-img-wrapper {
          position: relative;
          height: 100%;
          min-height: 240px;
          overflow: hidden;
          border-radius: 20px 0 0 20px;
        }

        .blog-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .blog-card:hover .blog-img-wrapper img {
          transform: scale(1.05);
        }

        .date-chip {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: #FFFFFF;
          padding: 8px 16px;
          border-radius: 40px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          font-weight: 700;
        }

        .date-chip .day {
          font-size: 1.3rem;
          font-weight: 800;
          color: #FF6B35;
        }

        .date-chip .month {
          font-size: 0.85rem;
          text-transform: uppercase;
          color: #6B7280;
        }

        .blog-body {
          padding: 24px;
        }

        .category-badge {
          background: #FFF5EB;
          color: #FF8C42;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 30px;
          letter-spacing: 0.5px;
        }

        .blog-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: #1A1A2E;
          line-height: 1.3;
          transition: color 0.3s;
        }

        .blog-card:hover .blog-title {
          color: #FF6B35;
        }

        .blog-meta {
          font-size: 0.95rem;
          color: #6B7280;
          font-weight: 500;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .blog-meta i {
          color: #FF8C42;
        }

        .blog-excerpt {
          font-size: 1.25rem;
          color: #4A5568;
          line-height: 1.7;
          margin-bottom: 15px;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .read-more {
          color: #FF6B35;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
        }

        .read-more:hover {
          color: #E85D2C;
          transform: translateX(5px);
        }

        /* Sidebar */
        .sidebar-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #F0E6DC;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .sidebar-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #1A1A2E;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #FF8C42;
          display: inline-block;
        }

        /* Search Box */
        .search-box {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 14px 50px 14px 18px;
          border: 2px solid #F0E6DC;
          border-radius: 50px;
          font-size: 1.05rem;
          transition: all 0.3s;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .search-input:focus {
          outline: none;
          border-color: #FF8C42;
          box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
        }

        .search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #FF8C42;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .search-btn:hover {
          background: #FF6B35;
        }

        .premium-search-card {
          background: #FFFFFF;
          border-radius: 30px;
          border: 1.5px solid #F0E6DC;
          box-shadow: 0 15px 40px rgba(255, 140, 66, 0.08);
          transition: all 0.3s ease;
        }

        .premium-search-card:hover {
          border-color: #FF8C42;
          box-shadow: 0 20px 50px rgba(255, 140, 66, 0.12);
        }

        .top-search-wrapper {
          position: relative;
          z-index: 10;
        }

        .badge-trending {
          background: rgba(255, 140, 66, 0.08);
          color: #FF8C42;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .badge-trending:hover {
          background: #FF8C42;
          color: #FFF;
        }

        /* Category List */
        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list li a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          color: #4A5568;
          text-decoration: none;
          font-size: 1.2rem;
          font-weight: 600;
          border-bottom: 1px solid #F0E6DC;
          transition: all 0.3s;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .category-list li a:hover {
          color: #FF6B35;
          transform: translateX(5px);
        }

        .category-list .count {
          background: #FFF5EB;
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #FF8C42;
        }

        /* Recent Posts */
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .recent-item {
          display: flex;
          gap: 14px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .recent-item:hover {
          transform: translateX(5px);
        }

        .recent-img {
          width: 65px;
          height: 65px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .recent-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recent-info {
          flex: 1;
        }

        .recent-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1A1A2E;
          margin-bottom: 5px;
          line-height: 1.4;
          font-family: 'Playfair Display', serif;
        }

        .recent-date {
          font-size: 0.85rem;
          color: #6B7280;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        /* Tags */
        .tags-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag {
          padding: 8px 18px;
          background: #FFF5EB;
          color: #FF8C42;
          text-decoration: none;
          border-radius: 30px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .tag:hover {
          background: #FF8C42;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* Pagination */
        .pagination {
          gap: 10px;
        }

        .pagination .page-link {
          background: #FFFFFF;
          border: 1px solid #F0E6DC;
          color: #4A5568;
          padding: 10px 20px;
          border-radius: 50px !important;
          font-weight: 600;
          transition: all 0.3s;
        }

        .pagination .page-link:hover {
          background: #FF8C42;
          border-color: #FF8C42;
          color: white;
        }

        .pagination .page-item.active .page-link {
          background: #FF8C42;
          border-color: #FF8C42;
          color: white;
        }

        .pagination .page-item.disabled .page-link {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .blog-hero {
          padding: clamp(3.5rem, 7vw, 5rem) 0 clamp(2.5rem, 5vw, 3.75rem);
          background: var(--site-bg);
        }

        .hero-overlay {
          display: none;
        }

        .section-subtitle {
          color: var(--site-primary);
          letter-spacing: 0.14em;
          font-size: var(--kicker-size);
          margin-bottom: 0.8rem;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: var(--h1-size);
          color: var(--site-text);
        }

        .hero-subtitle,
        .result-count,
        .blog-meta,
        .blog-excerpt,
        .category-list li a,
        .recent-date {
          font-family: var(--font-body);
        }

        .hero-subtitle {
          font-size: var(--body-size);
          color: var(--site-muted);
        }

        .blog-content-section {
          background: var(--site-bg);
          padding: clamp(2.5rem, 6vw, 4rem) 0;
        }

        .premium-search-card,
        .blog-card,
        .sidebar-card,
        .no-results-blog {
          border-radius: var(--radius-card);
          border: 1px solid var(--site-border);
          box-shadow: var(--shadow-card);
          background: var(--site-surface);
        }

        .premium-search-card {
          padding: clamp(1rem, 3vw, 1.35rem) !important;
        }

        .premium-search-card:hover,
        .blog-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-card-hover);
        }

        .blog-img-wrapper {
          min-height: 13.5rem;
          border-radius: var(--radius-card) 0 0 var(--radius-card);
        }

        .date-chip {
          border-radius: var(--radius-control);
          padding: 0.45rem 0.7rem;
        }

        .date-chip .day {
          font-size: 1rem;
          color: var(--site-primary);
        }

        .blog-body {
          padding: clamp(1rem, 3vw, 1.35rem) !important;
        }

        .category-badge,
        .badge-trending,
        .category-list .count,
        .tag {
          border-radius: var(--radius-control);
          color: var(--site-primary);
          background: rgba(156, 83, 33, 0.08);
        }

        .blog-title {
          font-family: var(--font-heading);
          font-size: clamp(1.25rem, 2.4vw, 1.65rem);
          color: var(--site-text);
        }

        .blog-excerpt {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--site-muted);
        }

        .read-more {
          color: var(--site-primary);
          font-size: 0.92rem;
        }

        .sidebar-card {
          padding: clamp(1rem, 3vw, 1.25rem);
        }

        .sidebar-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          color: var(--site-text);
          margin-bottom: 1rem;
          padding-bottom: 0.7rem;
          border-bottom-color: rgba(156, 83, 33, 0.18);
        }

        .search-input {
          border-radius: var(--radius-control);
          border-color: var(--site-border);
          font-size: 0.95rem;
        }

        .search-btn {
          background: var(--site-primary);
        }

        .category-list li a {
          font-size: 0.95rem;
        }

        .recent-title {
          font-family: var(--font-heading);
          font-size: 1rem;
        }

        .pagination .page-link {
          border-radius: var(--radius-control) !important;
          color: var(--site-muted);
        }

        /* Responsive */
        @media (max-width: 991px) {
          .blog-hero {
            padding: 120px 0 50px;
          }
          
          .blog-img-wrapper {
            min-height: 220px;
            border-radius: 20px 20px 0 0;
          }
          
          .blog-card .row {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .blog-title {
            font-size: 1.2rem;
          }
          
          .sidebar-card {
            padding: 20px;
          }
          
          .pagination .page-link {
            padding: 6px 14px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}

export default Blog;
