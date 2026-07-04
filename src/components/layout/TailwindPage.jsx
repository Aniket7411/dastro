import { TAILWIND_PAGE } from '../../utils/siteTokens';

/**
 * Optional page wrapper — MainLayout already applies `tw-page` on all routes except Home.
 * Use this when you need extra page-level classes or on routes outside MainLayout.
 *
 * @example — typical new page (no wrapper needed):
 * export default function MyPage() {
 *   return (
 *     <>
 *       <SEO title="My Page" url="/my-page" />
 *       <PageSection>
 *         <div className={PAGE_WRAP}>
 *           <h1 className={TW_H1}>Title</h1>
 *           <p className={TW_BODY}>Body copy</p>
 *         </div>
 *       </PageSection>
 *     </>
 *   );
 * }
 */
export default function TailwindPage({ className = '', children }) {
  return <div className={[TAILWIND_PAGE, className].filter(Boolean).join(' ')}>{children}</div>;
}
