import { Link } from 'react-router-dom';
import {
  BadgePercent,
  Calendar,
  ChevronRight,
  Download,
  FileArchive,
  FileText,
  FolderOpen,
  GraduationCap,
  Loader2,
  Package,
  Rocket,
  Tag,
} from 'lucide-react';
import { formatDashboardDate } from '../../hooks/useStudentDashboard';
import { BTN, CARD, TYPE } from './tokens';
import { Pill, SectionHead } from './ui';

export function DashboardMaterialsPanel({
  materialTabs,
  selectedCourseForMaterials,
  materials,
  loadingMaterials,
  onSelectCourse,
}) {
  return (
    <section className="flex flex-col">
      <SectionHead
        icon={FolderOpen}
        title="Course materials"
        iconCls="bg-amber-100 text-amber-700"
      />
      <div className={`flex flex-1 flex-col ${CARD} overflow-hidden`}>
        <div className="overflow-x-auto border-b border-site-accent-dark/10 bg-site-bg/40">
          <div className="flex gap-2 p-3">
            {materialTabs.length === 0 ? (
              <Pill>No courses</Pill>
            ) : (
              materialTabs.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => onSelectCourse(course.id)}
                  className={`sd-btn shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-body text-xs font-bold transition ${
                    selectedCourseForMaterials === course.id
                      ? 'border-0 bg-site-primary text-white shadow-sm'
                      : 'border-0 bg-white text-site-muted shadow-sm hover:bg-amber-50 hover:text-site-primary'
                  }`}
                >
                  {course.title.length > 22 ? `${course.title.slice(0, 22)}…` : course.title}
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-5">
          {materials.length > 0 ? (
            <div className="space-y-2">
              {materials.map((item) => {
                const isZip = (item.fileType || '').toLowerCase().includes('zip');
                const FIcon = isZip ? FileArchive : FileText;
                const iconCls = isZip ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700';
                return (
                  <div
                    key={item.materialId || item.id || item.title}
                    className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 transition hover:border-site-accent/35 hover:bg-white"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                      <FIcon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`line-clamp-1 ${TYPE.cardTitleSm}`}>
                        {item.title || 'Course material'}
                      </p>
                      <p className={TYPE.fieldLabelPlain}>
                        {item.fileType || 'PDF'}
                      </p>
                    </div>
                    {item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${BTN.link} ${BTN.sm} ${BTN.primary}`}
                      >
                        <Download size={13} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-36 flex-col items-center justify-center text-center">
              {loadingMaterials ? (
                <>
                  <Loader2 size={28} className="animate-spin text-site-accent" />
                  <p className={`mt-3 ${TYPE.metaBold}`}>Loading…</p>
                </>
              ) : (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <FileText size={22} className="text-amber-400" />
                  </div>
                  <p className={TYPE.metaBold}>
                    {materialTabs.length
                      ? 'Select a course above'
                      : 'Enroll in a course to access materials'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function DashboardOffersPanel({ offers }) {
  return (
    <section className="flex flex-col">
      <SectionHead
        icon={BadgePercent}
        title="Available offers"
        iconCls="bg-emerald-100 text-emerald-700"
        badge={offers.length > 0 ? <Pill>{offers.length}</Pill> : null}
      />
      <div className={`flex flex-1 flex-col ${CARD} p-4 sm:p-5`}>
        {offers.length === 0 ? (
          <div className="flex min-h-36 flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Tag size={22} className="text-emerald-400" />
            </div>
            <p className={TYPE.metaBold}>No special offers right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <article
                key={offer.offerId || offer.id || offer.title}
                className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-4 transition hover:border-emerald-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={TYPE.cardTitleSm}>
                    {offer.title || 'Special offer'}
                  </p>
                  {offer.discount && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 font-body text-[10px] font-black text-emerald-700 ring-1 ring-emerald-200">
                      {offer.discount}
                    </span>
                  )}
                </div>
                {(offer.code || offer.couponCode) && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-site-accent bg-white px-2.5 py-1.5">
                    <Tag size={11} className="text-site-accent" />
                    <code className="font-price text-xs font-black tracking-wider text-site-accent-dark">
                      {offer.code || offer.couponCode}
                    </code>
                  </div>
                )}
                <p className={`mt-2.5 flex items-center gap-1 ${TYPE.meta}`}>
                  <Calendar size={11} />
                  Valid till {formatDashboardDate(offer.validTill)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function DashboardPromotions({ banners, promoItems, newCourses }) {
  return (
    <section>
      <SectionHead icon={Rocket} title="Updates & launches" iconCls="bg-purple-100 text-purple-700" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {banners.length > 0 && (
          <div className={CARD}>
            <div className="border-b border-site-accent-dark/10 px-5 py-3">
              <p className={TYPE.panelKicker}>
                Announcements
              </p>
            </div>
            <div className="space-y-3 p-4">
              {banners.map((banner) => (
                <a
                  key={banner.bannerId || banner.id}
                  href={banner.redirectLink || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-xl border border-site-accent-dark/12 no-underline transition hover:shadow-md"
                >
                  <img
                    src={banner.image || '/images/vedic_thumbnail.png'}
                    alt={banner.title}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className={TYPE.cardTitleSm}>
                      {banner.title || 'Announcement'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {promoItems.length > 0 && (
          <div className={CARD}>
            <div className="border-b border-site-accent-dark/10 px-5 py-3">
              <p className={TYPE.panelKicker}>
                Merchandise
              </p>
            </div>
            <div className="space-y-3 p-4">
              {promoItems.map((item, i) => (
                <div
                  key={item.productId || item.courseId || item.id || i}
                  className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 transition hover:border-site-accent/30 hover:bg-white"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      {item.price ? <Package size={20} /> : <Rocket size={20} />}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`line-clamp-1 ${TYPE.cardTitleSm}`}>
                      {item.title || item.name || 'Untitled'}
                    </p>
                    <p className={`mt-0.5 ${TYPE.meta}`}>
                      {item.price
                        ? `₹${item.price}`
                        : `Launch: ${formatDashboardDate(item.launchDate)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {newCourses.length > 0 && (
          <div className={`${CARD} sm:col-span-2 xl:col-span-1`}>
            <div className="border-b border-site-accent-dark/10 px-5 py-3">
              <p className={TYPE.panelKicker}>
                New courses
              </p>
            </div>
            <div className="space-y-2.5 p-4">
              {newCourses.slice(0, 5).map((c, i) => (
                <Link
                  key={c.courseId || c.id || i}
                  to="/recorded-courses"
                  className="flex items-center gap-3 rounded-xl border border-site-accent-dark/10 bg-site-bg/60 p-3 no-underline transition hover:border-emerald-200 hover:bg-emerald-50/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <GraduationCap size={17} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`line-clamp-1 ${TYPE.cardTitleSm}`}>
                      {c.title || 'New course'}
                    </p>
                    <p className={TYPE.priceSm}>
                      {c.price ? `₹${c.price}` : 'View details'}
                    </p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-site-muted" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
