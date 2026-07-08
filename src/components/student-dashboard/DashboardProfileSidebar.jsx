import {
  Lock,
  Loader2,
  LogOut,
  PenLine,
  Save,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { BTN, CARD, INPUT, TYPE } from './tokens';
import { BtnOutline, BtnPrimary, Pill, ProgressBar } from './ui';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function DashboardProfileSidebar({
  studentName,
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
  completedCourses,
  avgProgress,
  onLogout,
  onProfileChange,
  onPasswordChange,
  onSaveProfile,
  onSavePassword,
  onResetPasswordForm,
}) {
  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-[9rem]">
      <div className={`${CARD} overflow-hidden`}>
        <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-transparent px-4 pb-3.5 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-site-accent-dark to-site-accent font-body text-sm font-black text-white shadow-md ring-2 ring-white ring-offset-2 ring-offset-amber-50/60">
              {initials(studentName) || <UserRound size={20} />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`break-words ${TYPE.cardTitle}`}>{studentName}</h2>
              <p className={`mt-0.5 ${TYPE.metaBold}`}>Student account</p>
            </div>
            <Pill active>Active</Pill>
          </div>
        </div>

        <div className="border-t border-site-accent-dark/10 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5">
          <dl className="m-0 space-y-2.5">
            {[
              ['Name', profile?.name || '—'],
              ['Email', profile?.email || '—'],
              ['Mobile', profile?.mobile || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className={TYPE.fieldLabelPlain}>{k}</dt>
                <dd className="mt-0.5 break-all font-body text-sm font-semibold text-site-primary">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-site-accent-dark/10 pt-3">
            <BtnOutline onClick={() => setProfileEditMode((o) => !o)}>
              <PenLine size={14} />
              {profileEditMode ? 'Cancel Edit' : 'Edit Profile'}
            </BtnOutline>
            <BtnOutline
              onClick={() => {
                setPasswordEditMode((open) => {
                  if (open) onResetPasswordForm();
                  return !open;
                });
                setProfileEditMode(false);
              }}
            >
              <Lock size={14} />
              {passwordEditMode ? 'Cancel' : 'Change Password'}
            </BtnOutline>
            <BtnPrimary className="hidden lg:inline-flex" onClick={onLogout}>
              <LogOut size={14} />
              Logout
            </BtnPrimary>
          </div>
        </div>
      </div>

      {passwordEditMode && (
        <div className={`${CARD} p-4 sm:p-5`}>
          <h3 className={TYPE.cardTitleSm}>Change password</h3>
          <p className={`mb-4 mt-1 ${TYPE.metaBold}`}>
            Use at least 6 characters. You&apos;ll stay signed in after updating.
          </p>
          <form onSubmit={onSavePassword} className="space-y-3">
            {[
              ['currentPassword', 'Current password'],
              ['newPassword', 'New password'],
              ['confirmPassword', 'Confirm new password'],
            ].map(([field, label]) => (
              <label key={field} className="block">
                <span className={TYPE.fieldLabel}>{label}</span>
                <input
                  type="password"
                  value={passwordForm[field]}
                  onChange={onPasswordChange(field)}
                  className={INPUT}
                  autoComplete={field === 'currentPassword' ? 'current-password' : 'new-password'}
                  required
                />
              </label>
            ))}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <BtnPrimary type="submit" disabled={savingPassword}>
                {savingPassword ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Lock size={14} />
                )}
                {savingPassword ? 'Updating…' : 'Update password'}
              </BtnPrimary>
              <BtnOutline
                type="button"
                onClick={() => {
                  onResetPasswordForm();
                  setPasswordEditMode(false);
                }}
              >
                <X size={14} />
                Cancel
              </BtnOutline>
            </div>
          </form>
        </div>
      )}

      {profileEditMode && (
        <div className={`${CARD} p-4 sm:p-5`}>
          <h3 className={TYPE.cardTitleSm}>Edit profile</h3>
          <p className={`mb-4 mt-1 ${TYPE.metaBold}`}>
            Update your account details.
          </p>
          <form onSubmit={onSaveProfile} className="space-y-3">
            {['name', 'email', 'mobile'].map((field) => (
              <label key={field} className="block">
                <span className={TYPE.fieldLabel}>{field}</span>
                <input
                  type={field === 'email' ? 'email' : field === 'mobile' ? 'tel' : 'text'}
                  value={profileForm[field]}
                  onChange={onProfileChange(field)}
                  className={INPUT}
                  placeholder={
                    field === 'mobile'
                      ? '10-digit number'
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  inputMode={field === 'mobile' ? 'numeric' : undefined}
                  maxLength={field === 'mobile' ? 10 : undefined}
                  required
                />
              </label>
            ))}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <BtnPrimary type="submit" disabled={savingProfile}>
                {savingProfile ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {savingProfile ? 'Saving…' : 'Save'}
              </BtnPrimary>
              <BtnOutline type="button" onClick={() => setProfileEditMode(false)}>
                <X size={14} />
                Cancel
              </BtnOutline>
            </div>
          </form>
        </div>
      )}

      {enrolledCourses.length > 0 && (
        <div className={`${CARD} overflow-hidden`}>
          <div className="flex items-center justify-between px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
            <h3 className={TYPE.cardTitleSm}>Overall progress</h3>
            <span className={TYPE.priceLg}>{avgProgress}%</span>
          </div>
          <div className="px-4 sm:px-5">
            <ProgressBar value={avgProgress} />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-site-accent-dark/8 px-4 py-3 sm:px-5">
            <p className={TYPE.meta}>
              {completedCourses} of {enrolledCourses.length} course
              {enrolledCourses.length !== 1 ? 's' : ''} completed
            </p>
            {avgProgress === 100 && (
              <span className="inline-flex items-center gap-1 font-body text-[10px] font-bold text-emerald-600">
                <Sparkles size={11} />
                All done!
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
