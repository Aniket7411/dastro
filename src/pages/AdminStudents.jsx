import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {courses.map((c, ci) => (
                              <span key={ci} style={{
                                background: '#fff', border: '1px solid rgba(200, 131, 42, 0.25)',
                                borderRadius: '8px', padding: '4px 12px', fontSize: '0.8rem',
                                color: '#8B4A1E', fontWeight: 600
                              }}>
                                <i className="fas fa-play-circle me-1" style={{ fontSize: '10px', color: '#C8832A' }}></i>
                                {c.title || c.courseTitle || c}
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
    </div>
  );
}

export default AdminStudents;
