import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function validityBadgeCls(dateStr) {
  if (!dateStr) return 'bg-slate-100 text-slate-600 border-slate-200';
  const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'bg-red-50 text-red-600 border-red-200';
  if (days <= 7) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

function formatValidityDate(dateStr) {
  if (!dateStr) return 'No date set';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ValidityModal({ course, studentName, onClose, onSaved }) {
  const [newDate, setNewDate] = useState(
    course.validUntil ? new Date(course.validUntil).toISOString().slice(0, 10) : ''
  );
  const [saving, setSaving] = useState(false);

  const submitValidity = async (isoDate) => {
    if (!isoDate) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/admin/enrollments/${course.enrollmentId}/validity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ validUntil: isoDate }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Course validity updated.');
        onSaved();
      } else {
        toast.error(data.message || 'Failed to update validity');
      }
    } catch (err) {
      toast.error('Network error while updating validity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <h3 className="text-base font-bold text-slate-900">Edit course validity</h3>
        <p className="mt-1 text-sm text-slate-500">
          {studentName} &middot; <span className="font-semibold text-slate-700">{course.title}</span>
        </p>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
            Valid until
          </span>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </label>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={saving}
            onClick={() => submitValidity(todayISODate())}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <i className="fas fa-ban" />
            Revoke access now
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving || !newDate}
              onClick={() => submitValidity(newDate)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-save" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [validityModal, setValidityModal] = useState(null); // { studentName, course }

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.users);
      } else {
        toast.error(data.message || 'Failed to fetch students');
      }
    } catch (err) {
      toast.error('Network Error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.mobile && student.mobile.includes(searchTerm))
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="admin-leads-content">
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center gap-3">
          <div>
            <h5 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary, #1a1a2e)' }}>
              Registered Students
            </h5>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)' }}>
              {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="search-bar" style={{ background: 'var(--surface)', minWidth: '240px' }}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search name, email, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <button onClick={fetchStudents} className="topbar-icon-btn" title="Refresh" style={{ height: '42px', width: '42px' }}>
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-table-shell" style={{ minHeight: '400px' }}>
        <div className="admin-table-shell__bar">
          <div>
            <div className="admin-table-shell__title">Student Registry</div>
            <div className="admin-table-shell__subtitle">Registered learners and course enrollments</div>
          </div>
          {!isLoading && (
            <div className="admin-table-shell__count">
              <strong>{filteredStudents.length}</strong>
              <span>student{filteredStudents.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        <div className="admin-table-scroll">
        <table className="admin-table leads-table w-100" style={{ minWidth: '700px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Courses Enrolled</th>
              <th>Registered On</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6">
                  <div className="dash-loading py-5">
                    <div className="dash-spin"></div>
                    <span className="ms-2">Fetching students...</span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-users fa-3x mb-3 opacity-25"></i>
                    <p className="mb-0">{searchTerm ? `No students matching "${searchTerm}"` : 'No students registered yet'}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const courses = student.enrolledCourses || student.courses || [];
                const isExpanded = expandedId === student._id;
                return (
                  <>
                    <tr key={student._id} style={{ cursor: courses.length > 0 ? 'pointer' : 'default' }}
                      onClick={() => courses.length > 0 && setExpandedId(isExpanded ? null : student._id)}
                    >
                      <td style={{ color: 'var(--text-secondary, #6b7280)', fontSize: '0.82rem' }}>{idx + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8B4A1E, #C8832A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                          }}>
                            {(student.name || 'S')[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{student.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>{student.email || 'N/A'}</td>
                      <td style={{ fontSize: '0.88rem' }}>{student.mobile || 'N/A'}</td>
                      <td>
                        {courses.length > 0 ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#059669',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700
                          }}>
                            <i className="fas fa-book-open" style={{ fontSize: '10px' }}></i>
                            {courses.length} course{courses.length !== 1 ? 's' : ''}
                            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '9px' }}></i>
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem'
                          }}>
                            No courses
                          </span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)' }}>{formatDate(student.createdAt)}</td>
                    </tr>
                    {isExpanded && courses.length > 0 && (
                      <tr key={`${student._id}-expand`}>
                        <td colSpan="6" style={{ background: '#fffbf5', padding: '0.75rem 1rem 0.75rem 3.5rem', borderTop: 'none' }}>
                          <div className="flex flex-wrap gap-2">
                            {courses.map((c, ci) => (
                              <span
                                key={ci}
                                className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-amber-800/20 bg-white px-3 py-1.5 text-sm font-semibold text-amber-900"
                              >
                                <i className="fas fa-play-circle text-[10px] text-amber-600" />
                                {c.title || c.courseTitle || c}
                                {c.enrollmentId && (
                                  <>
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${validityBadgeCls(c.validUntil)}`}>
                                      {formatValidityDate(c.validUntil)}
                                    </span>
                                    <button
                                      type="button"
                                      title="Edit validity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setValidityModal({ studentName: student.name, course: c });
                                      }}
                                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-100"
                                    >
                                      <i className="fas fa-pen text-[11px]" />
                                    </button>
                                  </>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
        </div>
        {!isLoading && filteredStudents.length > 0 && (
          <div className="admin-table-footer">
            <span>
              Showing <strong>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''}
              {searchTerm && <> matching &ldquo;{searchTerm}&rdquo;</>}
              {filteredStudents.length !== students.length && (
                <> of <strong>{students.length}</strong> total</>
              )}
            </span>
          </div>
        )}
      </div>

      {validityModal && (
        <ValidityModal
          course={validityModal.course}
          studentName={validityModal.studentName}
          onClose={() => setValidityModal(null)}
          onSaved={() => {
            setValidityModal(null);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
}

export default AdminStudents;
