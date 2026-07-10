import { SECTION_PY } from '../../utils/siteTokens';

/**
 * Standard page section — flex column with consistent vertical padding.
 * @example
 * <PageSection>
 *   <div className={PAGE_WRAP}>...</div>
 * </PageSection>
 */
export default function PageSection({ as: Tag = 'section', className = '', children }) {
  return <Tag className={[SECTION_PY, className].filter(Boolean).join(' ')}>{children}</Tag>;
}
