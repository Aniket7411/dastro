import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Calendar, User, ArrowRight } from 'lucide-react';
import toast from '@/utils/toast';
import SEO from '../components/SEO';
import TailwindPage from '../components/layout/TailwindPage';
import {
  SITE_CONTAINER,
  SITE_KICKER,
  SITE_TITLE_LG,
  SITE_SUBTITLE,
  TW_FIELD_INPUT,
} from '../utils/siteTokens';
import {
  BLOG_CATEGORIES,
  fetchBlogs,
  formatBlogDate,
  blogExcerpt,
} from '../utils/blogApi';
import {
  BLOG_WRAP,
  BLOG_CARD,
  BLOG_SIDEBAR_CARD,
  BLOG_CHIP,
  BLOG_SEARCH,
  BLOG_CATEGORY_BTN,
  BLOG_CATEGORY_BTN_ACTIVE,
} from '../components/blog/tokens';

const TRENDING = ['vedic', 'relationship', 'career', 'remedies'];

function BlogCard({ post, index }) {
  const chip = formatBlogDate(post.createdAt, 'chip');

  return (
    <article className={BLOG_CARD} data-aos="fade-up" data-aos-delay={index * 80}>
      <div className="grid md:grid-cols-[11rem_1fr]">
        <Link to={`/blog/${post.slug}`} className="relative block min-h-[10rem] overflow-hidden md:min-h-full">
          <img
            src={post.image || 'https://via.placeholder.com/400x250?text=Blog'}
            alt={post.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {chip && (
            <div className="absolute bottom-3 left-3 rounded-full bg-white px-2.5 py-1 text-center text-xs font-bold shadow-sm">
              <span className="block text-site-accent-dark">{chip.day}</span>
              <span className="block text-[0.65rem] uppercase text-site-muted">{chip.month}</span>
            </div>
          )}
        </Link>
        <div className="flex flex-col p-4 sm:p-5">
          <span className={`${BLOG_CHIP} mb-2 w-fit`}>{post.category}</span>
          <h2 className="m-0 mb-2 font-heading text-lg font-extrabold leading-snug text-site-primary transition group-hover:text-site-accent-dark sm:text-xl">
            <Link to={`/blog/${post.slug}`} className="!text-inherit no-underline">
              {post.title}
            </Link>
          </h2>
          <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-site-muted">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {formatBlogDate(post.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {post.author || 'Admin'}
            </span>
          </div>
          {blogExcerpt(post) && (
            <p className="m-0 mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-site-muted">
              {blogExcerpt(post)}
            </p>
          )}
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 font-body text-sm font-bold text-site-accent-dark no-underline transition hover:gap-2"
          >
            Continue Reading <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadBlogs = useCallback(async (category, search) => {
    setIsLoading(true);
    try {
      const hasFilter = category !== 'All' || Boolean(search?.trim());
      const [fullList, filtered] = await Promise.all([
        hasFilter ? fetchBlogs() : fetchBlogs({ category, search }),
        fetchBlogs({
          category: category === 'All' ? undefined : category,
          search: search || undefined,
        }),
      ]);

      setAllBlogs(hasFilter ? fullList : filtered);
      setBlogs(filtered);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.AOS) window.AOS.refresh();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadBlogs(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery, loadBlogs]);

  const categoryCounts = BLOG_CATEGORIES.map((name) => ({
    name,
    count: allBlogs.filter((b) => b.category === name).length,
  }));

  const recentPosts = allBlogs.slice(0, 3);
  const tagSet = new Set();
  allBlogs.forEach((b) => (b.tags || []).forEach((t) => tagSet.add(t)));
  const popularTags = [...tagSet].slice(0, 8);

  const isEmpty = !isLoading && blogs.length === 0;
  const noPublished = isEmpty && !searchQuery && selectedCategory === 'All' && allBlogs.length === 0;

  return (
    <TailwindPage>
      <SEO
        title="Cosmic Blog | DS Institute"
        description="Explore Vedic astrology, numerology, tarot, and spiritual wisdom for modern life."
      />

      <header className={`${SITE_CONTAINER} pt-10 pb-6 text-center sm:pt-12 sm:pb-8`}>
        <p className={SITE_KICKER}>Wisdom &amp; Insights</p>
        <h1 className={SITE_TITLE_LG}>Cosmic Blog</h1>
        <p className={`${SITE_SUBTITLE} mx-auto mt-3 max-w-2xl`}>
          Explore ancient wisdom for modern life challenges
        </p>
      </header>

      <div className={`${BLOG_WRAP} pb-12 sm:pb-16`}>
        <div className={`${BLOG_SIDEBAR_CARD} mb-6`} data-aos="fade-up">
          <h2 className="m-0 mb-3 text-center font-heading text-lg font-extrabold text-site-primary">
            Search Astro Knowledge
          </h2>
          <div className="relative mx-auto max-w-2xl">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles, planetary movements, or remedies…"
              className={`${TW_FIELD_INPUT} ${BLOG_SEARCH} w-full`}
              aria-label="Search blog articles"
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-site-primary text-white"
              onClick={() => (searchInput ? setSearchInput('') : null)}
              aria-label={searchInput ? 'Clear search' : 'Search'}
            >
              {searchInput ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-site-muted">Trending:</span>
            {TRENDING.map((term) => (
              <button
                key={term}
                type="button"
                className="m-0 cursor-pointer rounded-full border-0 bg-site-accent/12 px-2.5 py-1 font-body text-xs font-semibold capitalize text-site-accent-dark transition hover:bg-site-accent hover:text-white"
                onClick={() => setSearchInput(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:gap-8">
          <main>
            <p className="m-0 mb-4 text-sm text-site-muted">
              Showing <strong className="text-site-primary">{blogs.length}</strong> articles
            </p>

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-site-accent border-t-transparent" />
                <p className="mt-3 text-sm text-site-muted">Loading articles…</p>
              </div>
            ) : isEmpty ? (
              <div className={`${BLOG_SIDEBAR_CARD} py-10 text-center`}>
                {noPublished ? (
                  <>
                    <h3 className="m-0 font-heading text-xl font-bold text-site-primary">No published articles yet</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-site-muted">
                      New posts appear here once they are published from the admin dashboard (not saved as drafts).
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="m-0 font-heading text-xl font-bold text-site-primary">No articles found</h3>
                    <p className="mt-2 text-sm text-site-muted">
                      Try different keywords or browse another category.
                    </p>
                    <button
                      type="button"
                      className="mt-4 rounded-full border border-site-primary bg-transparent px-4 py-2 font-body text-sm font-bold text-site-primary"
                      onClick={() => {
                        setSearchInput('');
                        setSelectedCategory('All');
                      }}
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {blogs.map((post, idx) => (
                  <BlogCard key={post._id || post.slug} post={post} index={idx} />
                ))}
              </div>
            )}
          </main>

          <aside className="space-y-4">
            <div className={BLOG_SIDEBAR_CARD}>
              <h3 className="m-0 mb-3 border-b border-site-accent-dark/15 pb-2 font-heading text-base font-extrabold text-site-primary">
                Categories
              </h3>
              <ul className="m-0 list-none p-0">
                <li>
                  <button
                    type="button"
                    className={selectedCategory === 'All' ? BLOG_CATEGORY_BTN_ACTIVE : BLOG_CATEGORY_BTN}
                    onClick={() => setSelectedCategory('All')}
                  >
                    <span>All Articles</span>
                    <span className="rounded-full bg-site-accent/12 px-2 py-0.5 text-xs font-bold text-site-accent-dark">
                      {allBlogs.length}
                    </span>
                  </button>
                </li>
                {categoryCounts.map((cat) => (
                  <li key={cat.name}>
                    <button
                      type="button"
                      className={selectedCategory === cat.name ? BLOG_CATEGORY_BTN_ACTIVE : BLOG_CATEGORY_BTN}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <span>{cat.name}</span>
                      <span className="rounded-full bg-site-accent/12 px-2 py-0.5 text-xs font-bold text-site-accent-dark">
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {recentPosts.length > 0 && (
              <div className={BLOG_SIDEBAR_CARD}>
                <h3 className="m-0 mb-3 border-b border-site-accent-dark/15 pb-2 font-heading text-base font-extrabold text-site-primary">
                  Recent Posts
                </h3>
                <div className="flex flex-col gap-3">
                  {recentPosts.map((post) => (
                    <Link
                      key={post._id || post.slug}
                      to={`/blog/${post.slug}`}
                      className="flex gap-3 no-underline transition hover:opacity-80"
                    >
                      <img
                        src={post.image || 'https://via.placeholder.com/80'}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="m-0 line-clamp-2 font-heading text-sm font-bold leading-snug text-site-primary">
                          {post.title}
                        </p>
                        <p className="m-0 mt-1 text-xs text-site-muted">{formatBlogDate(post.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {popularTags.length > 0 && (
              <div className={BLOG_SIDEBAR_CARD}>
                <h3 className="m-0 mb-3 border-b border-site-accent-dark/15 pb-2 font-heading text-base font-extrabold text-site-primary">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="m-0 cursor-pointer rounded-full border-0 bg-site-accent/12 px-2.5 py-1 font-body text-xs font-semibold text-site-accent-dark transition hover:bg-site-accent hover:text-white"
                      onClick={() => setSearchInput(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </TailwindPage>
  );
}

export default Blog;
