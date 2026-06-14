import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex min-h-[70vh] w-full items-center bg-site-bg font-body text-site-text">
      <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[34rem] rounded-[14px] border border-site-accent-dark/14 bg-white p-6 text-center shadow-[0_10px_24px_rgba(42,15,2,0.06)] sm:p-8 lg:p-10">
          <span className="mb-3 inline-block font-body text-xs font-extrabold uppercase tracking-[0.12em] text-site-accent-dark">
            404
          </span>
          <h1 className="mb-3 font-heading text-3xl font-extrabold text-site-primary sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mb-6 leading-relaxed text-site-muted">
            The page you are trying to open is not available. You can return to the website and
            continue from there.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center justify-center rounded-[9px] border border-site-primary bg-site-primary px-5 py-2.5 text-[0.9375rem] font-bold text-white no-underline transition hover:border-[#6b3514] hover:bg-[#6b3514]"
          >
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
