import { TAILWIND_PAGE } from '../../utils/siteTokens';

/**
 * Wrap any new/migrated page in this component so Bootstrap global styles
 * do not affect layout, forms, or typography inside the page.
 *
 * @example
 * export default function MyPage() {
 *   return (
 *     <TailwindPage>
 *       <SEO ... />
 *       ...
 *     </TailwindPage>
 *   );
 * }
 */
export default function TailwindPage({ className = '', children }) {
  return <div className={[TAILWIND_PAGE, className].filter(Boolean).join(' ')}>{children}</div>;
}
