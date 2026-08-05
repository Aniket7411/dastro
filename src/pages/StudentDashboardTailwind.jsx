import { useEffect, useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import useStudentDashboard, { computeDaysRemaining } from '../hooks/useStudentDashboard';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';
import DashboardAnnouncement from '../components/student-dashboard/DashboardAnnouncement';
import DashboardHero from '../components/student-dashboard/DashboardHero';
import DashboardCourseList from '../components/student-dashboard/DashboardCourseList';
import DashboardProfileSidebar from '../components/student-dashboard/DashboardProfileSidebar';
import {
  DashboardMaterialsPanel,
  DashboardOffersPanel,
  DashboardPromotions,
} from '../components/student-dashboard/DashboardPanels';
import DashboardLoading, { DashboardStats } from '../components/student-dashboard/DashboardStats';
import { DASHBOARD_ROOT, PAGE_WRAP } from '../components/student-dashboard/tokens';
import ProtectedScreenGuard from '../components/security/ProtectedScreenGuard';

const ANNOUNCEMENT_DISMISS_KEY = 'dismissedAnnouncementText';

export default function StudentDashboardTailwind() {
  const {
    profile,
    profileForm,
    profileEditMode,
    setProfileEditMode,
    passwordEditMode,
    setPasswordEditMode,
    passwordForm,
    savingProfile,
    savingPassword,
    enrolledCourses,
    courseValidity,
    banners,
    merchandise,
    newCourses,
    offers,
    materials,
    selectedCourseForMaterials,
    loading,
    loadingMaterials,
    studentName,
    handleLogout,
    handleProfileChange,
    handlePasswordChange,
    saveProfile,
    savePassword,
    resetPasswordForm,
    loadMaterials,
  } = useStudentDashboard();

  useEffect(() => {
    if (enrolledCourses.length > 0 && selectedCourseForMaterials === null) {
      loadMaterials(enrolledCourses[0].id);
    }
  }, [enrolledCourses, selectedCourseForMaterials, loadMaterials]);

  const { settings: siteSettings } = useSettings();
  const announcementText = siteSettings?.announcementText || '';
  const [dismissedAnnouncement, setDismissedAnnouncement] = useState(() => {
    try {
      return localStorage.getItem(ANNOUNCEMENT_DISMISS_KEY) || '';
    } catch {
      return '';
    }
  });
  const showAnnouncement = Boolean(announcementText) && announcementText !== dismissedAnnouncement;
  const dismissAnnouncement = () => {
    try {
      localStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, announcementText);
    } catch {
      // ignore storage errors
    }
    setDismissedAnnouncement(announcementText);
  };

  if (loading) return <DashboardLoading />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const completedCourses = enrolledCourses.filter((c) => Number(c.progress) >= 100).length;
  const activeCourses = enrolledCourses.filter(
    (c) => computeDaysRemaining(c.validTill) !== 'Expired',
  ).length;
  const avgProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((t, c) => t + (Number(c.progress) || 0), 0) / enrolledCourses.length,
      )
    : 0;

  const stats = [
    {
      label: 'Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      iconBg: 'bg-pink-100 text-pink-700',
      cardBg: 'bg-pink-50',
      topBorder: 'border-t-pink-300',
    },
    {
      label: 'Active',
      value: activeCourses,
      icon: GraduationCap,
      iconBg: 'bg-blue-100 text-blue-700',
      cardBg: 'bg-blue-50',
      topBorder: 'border-t-blue-300',
    },
    {
      label: 'Completed',
      value: completedCourses,
      icon: Sparkles,
      iconBg: 'bg-purple-100 text-purple-700',
      cardBg: 'bg-purple-50',
      topBorder: 'border-t-purple-400',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      iconBg: 'bg-orange-100 text-orange-700',
      cardBg: 'bg-orange-50',
      topBorder: 'border-t-orange-300',
    },
  ];

  const materialTabs = enrolledCourses.slice(0, 6);
  const promoItems = [...merchandise.slice(0, 3), ...newCourses.slice(0, 3)];
  const hasPromotions = banners.length > 0 || promoItems.length > 0 || newCourses.length > 0;

  return (
    <div className={DASHBOARD_ROOT}>
      <SEO title="Student Dashboard" description="Your courses, materials, and account." url="/dashboard" />
      <ProtectedScreenGuard label="Protected student dashboard" />

      {showAnnouncement && (
        <DashboardAnnouncement text={announcementText} onDismiss={dismissAnnouncement} />
      )}

      <DashboardHero
        greeting={greeting}
        studentName={studentName}
        enrolledCount={enrolledCourses.length}
        onLogout={handleLogout}
      />

      <DashboardStats stats={stats} />

      <main className={`pb-10 pt-4 sm:pb-12 sm:pt-5 ${PAGE_WRAP}`}>
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[272px_minmax(0,1fr)] xl:gap-7">
          <DashboardProfileSidebar
            studentName={studentName}
            profile={profile}
            profileForm={profileForm}
            profileEditMode={profileEditMode}
            setProfileEditMode={setProfileEditMode}
            passwordEditMode={passwordEditMode}
            setPasswordEditMode={setPasswordEditMode}
            passwordForm={passwordForm}
            savingProfile={savingProfile}
            savingPassword={savingPassword}
            enrolledCourses={enrolledCourses}
            completedCourses={completedCourses}
            avgProgress={avgProgress}
            onLogout={handleLogout}
            onProfileChange={handleProfileChange}
            onPasswordChange={handlePasswordChange}
            onSaveProfile={saveProfile}
            onSavePassword={savePassword}
            onResetPasswordForm={resetPasswordForm}
          />

          <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
            <DashboardCourseList
              enrolledCourses={enrolledCourses}
              courseValidity={courseValidity}
            />

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
              <DashboardMaterialsPanel
                materialTabs={materialTabs}
                selectedCourseForMaterials={selectedCourseForMaterials}
                materials={materials}
                loadingMaterials={loadingMaterials}
                onSelectCourse={loadMaterials}
              />
              <DashboardOffersPanel offers={offers} />
            </div>

            {hasPromotions && (
              <DashboardPromotions
                banners={banners}
                promoItems={promoItems}
                newCourses={newCourses}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
