import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ChevronRight } from 'lucide-react';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import TailwindPage from '../components/layout/TailwindPage';
import {
  SITE_BTN_PRIMARY,
  SITE_CONTAINER,
  SITE_TITLE,
} from '../utils/siteTokens';
import { fetchBlogBySlug, formatBlogDate } from '../utils/blogApi';
import { BLOG_CHIP } from '../components/blog/tokens';

function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBlogBySlug(slug);
        if (!cancelled) setBlog(data);
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || 'Blog not found');
          setBlog(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <TailwindPage>
        <div className={`${SITE_CONTAINER} py-16 text-center`}>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-site-accent border-t-transparent" />
          <p className="mt-3 text-sm text-site-muted">Loading article…</p>
        </div>
      </TailwindPage>
    );
  }

  if (!blog) {
    return (
      <TailwindPage>
        <div className={`${SITE_CONTAINER} py-16 text-center`}>
          <h2 className={SITE_TITLE}>Insight Not Found</h2>
          <p className="mt-2 text-site-muted">The requested article could not be found.</p>
          <Link to="/blog" className={`${SITE_BTN_PRIMARY} mt-4 inline-flex`}>
            Back to Blogs
          </Link>
        </div>
      </TailwindPage>
    );
  }

  return (
    <TailwindPage>
      <SEO title={`${blog.title} | DS Institute Blog`} description={blog.excerpt || blog.title} />

      <article className={`${SITE_CONTAINER} py-8 sm:py-10`}>
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 text-sm text-site-muted">
          <Link to="/" className="text-site-accent-dark no-underline hover:underline">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link to="/blog" className="text-site-accent-dark no-underline hover:underline">
            Blog
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="text-site-muted">{blog.title}</span>
        </nav>

        <header className="mb-6 border-b border-site-accent-dark/12 pb-5">
          <span className={`${BLOG_CHIP} mb-3`}>{blog.category}</span>
          <h1 className="m-0 mb-3 font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-tight text-site-primary">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-site-muted">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-site-accent/12 text-site-primary">
                <User className="h-4 w-4" aria-hidden="true" />
              </span>
              {blog.author || 'Admin'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {formatBlogDate(blog.createdAt, 'long')}
            </span>
          </div>
        </header>

        {blog.image && (
          <figure className="mb-6 overflow-hidden rounded-xl border border-site-accent-dark/12 shadow-sm">
            <img src={blog.image} alt={blog.title} className="block max-h-[28rem] w-full object-cover" />
          </figure>
        )}

        <div
          className="blog-rich-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <footer className="mt-8 border-t border-site-accent-dark/12 pt-6">
          {blog.tags?.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-site-primary">Tags:</span>
              {blog.tags.map((tag) => (
                <span key={tag} className={BLOG_CHIP}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-start gap-3 rounded-xl border border-site-accent-dark/12 bg-white p-4 shadow-sm sm:items-center sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-site-accent/12 text-site-primary">
              <User className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="m-0 mb-1 font-heading text-base font-bold text-site-primary">
                About {blog.author || 'the Author'}
              </h2>
              <p className="m-0 text-sm leading-relaxed text-site-muted">
                Insights from DS Institute on practical astrology, spiritual growth, and everyday guidance.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </TailwindPage>
  );
}

export default BlogDetail;
