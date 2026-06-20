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
      <SEO title={`${blog.title} | DS Astrology Blog`} description={blog.excerpt || blog.title} />

      <article className={`${SITE_CONTAINER} py-8 sm:py-10`}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-site-muted">
          <Link to="/" className="text-site-accent-dark no-underline hover:underline">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link to="/blog" className="text-site-accent-dark no-underline hover:underline">Blog</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="line-clamp-1 text-site-muted">{blog.title}</span>
        </nav>

        {/* ── Hero: two-col on lg ── */}
        <div className="mb-8 grid grid-cols-1 items-center gap-8 border-b border-site-accent-dark/12 pb-8 lg:mb-10 lg:grid-cols-2 lg:gap-12 lg:pb-10">

          {/* Left — category · title · excerpt · meta */}
          <div className="flex flex-col gap-4">
            <span className={`${BLOG_CHIP} self-start`}>{blog.category}</span>

            <h1 className="m-0 font-heading text-[clamp(1.625rem,3.2vw,2.5rem)] font-extrabold leading-[1.2] tracking-tight text-site-primary">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="m-0 text-base leading-relaxed text-site-muted sm:text-lg">
                {blog.excerpt}
              </p>
            )}

            {/* Author + date */}
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-site-muted">
              <span className="inline-flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/12 text-site-primary">
                  <User className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-semibold text-site-primary">{blog.author || 'Admin'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                {formatBlogDate(blog.createdAt, 'long')}
              </span>
            </div>
          </div>

          {/* Right — cover image */}
          {blog.image ? (
            <figure className="m-0 overflow-hidden rounded-2xl border border-site-accent-dark/12 shadow-md">
              <img
                src={blog.image}
                alt={blog.title}
                className="block aspect-[4/3] w-full object-cover"
                loading="eager"
              />
            </figure>
          ) : (
            /* Placeholder keeps grid stable when there's no image */
            <div className="hidden lg:block" aria-hidden="true" />
          )}
        </div>

        {/* ── Rich content ── */}
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
                Insights from DS Astrology on practical astrology, spiritual growth, and everyday guidance.
              </p>
            </div>
          </div>
        </footer>
      </article>
    </TailwindPage>
  );
}

export default BlogDetail;
