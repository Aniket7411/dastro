import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.blog);
        } else {
          toast.error('Blog not found');
        }
      } catch (err) {
        toast.error('Error fetching blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="site-page">
        <div className="container site-container py-5 text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="site-page">
        <div className="container site-container py-5 text-center">
          <h2 className="site-title">Insight Not Found</h2>
          <p>The requested article could not be found.</p>
          <Link to="/blog" className="site-btn mt-3">Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="blog-detail-section site-page">
      <div className="container site-container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                <li className="breadcrumb-item active">{blog.title}</li>
              </ol>
            </nav>

            <header className="blog-detail-head">
              <span className="blog-detail-kicker">{blog.category}</span>
              <h1>{blog.title}</h1>
              <div className="blog-detail-meta">
                <div className="d-flex align-items-center">
                  <div className="blog-author-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <span>Astro Expert</span>
                </div>
                <span className="meta-dot">•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </header>

            {blog.image && (
              <figure className="blog-detail-image">
                <img src={blog.image} alt={blog.title} />
              </figure>
            )}

            <div
              className="blog-rich-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <footer className="blog-detail-footer">
              {blog.tags?.length > 0 && (
                <div className="tags mb-4">
                  <span className="me-2 fw-bold">Tags:</span>
                  {blog.tags.map(tag => (
                    <span key={tag} className="blog-tag">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="author-card">
                <div className="author-card-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h5 className="mb-1">About the Author</h5>
                  <p className="mb-0 text-muted">Our Astro Experts have decades of experience in Vedic sciences, helping students and seekers understand practical astrology.</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <style>{`
        .blog-detail-section {
          background: var(--site-bg);
        }

        .blog-detail-head {
          border-bottom: 1px solid var(--site-border);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .blog-detail-kicker,
        .blog-tag {
          display: inline-flex;
          align-items: center;
          border-radius: var(--radius-control);
          background: rgba(156, 83, 33, 0.08);
          color: var(--site-primary);
          font-weight: 700;
        }

        .blog-detail-kicker {
          padding: 0.45rem 0.8rem;
          margin-bottom: 0.9rem;
          font-size: var(--kicker-size);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .blog-detail-head h1 {
          font-family: var(--font-heading);
          color: var(--site-text);
          font-size: var(--h1-size);
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .blog-detail-meta {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
          color: var(--site-muted);
        }

        .blog-author-icon {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: #fff7ee;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.55rem;
          color: var(--site-primary);
        }

        .blog-detail-image {
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          margin: 0 0 2rem;
          border: 1px solid var(--site-border);
        }

        .blog-detail-image img {
          width: 100%;
          max-height: 28rem;
          object-fit: cover;
          display: block;
        }

        .blog-rich-content {
          font-size: var(--body-size);
          line-height: 1.75;
          color: var(--site-muted);
        }

        .blog-rich-content h1,
        .blog-rich-content h2,
        .blog-rich-content h3 {
          font-family: var(--font-heading);
          color: var(--site-text);
          margin-top: 1.8rem;
        }

        .blog-rich-content img {
          max-width: 100%;
          border-radius: var(--radius-card);
        }

        .blog-detail-footer {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--site-border);
        }

        .blog-tag {
          padding: 0.35rem 0.7rem;
          margin: 0 0.35rem 0.35rem 0;
          font-size: 0.86rem;
        }

        .author-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--site-surface);
          border: 1px solid var(--site-border);
          border-radius: var(--radius-card);
          padding: 1.1rem;
          box-shadow: var(--shadow-card);
        }

        .author-card-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: #fff7ee;
          color: var(--site-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        @media (max-width: 575px) {
          .author-card {
            align-items: flex-start;
          }

          .meta-dot {
            display: none;
          }
        }
      `}</style>
    </article>
  );
}

export default BlogDetail;
