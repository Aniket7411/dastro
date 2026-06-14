import { useEffect, useState } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

const emptyBanner = { title: '', image: '', redirectLink: '', isActive: true };
const emptyMaterial = { courseId: '', title: '', fileType: 'PDF', fileUrl: '' };

function AdminContentManager() {
  const [courses, setCourses] = useState([]);
  const [banners, setBanners] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [bannerForm, setBannerForm] = useState(emptyBanner);
  const [materialForm, setMaterialForm] = useState(emptyMaterial);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const parseResponse = async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const [courseRes, bannerRes, materialRes] = await Promise.all([
        fetch(`${API_BASE}/api/courses`),
        fetch(`${API_BASE}/api/admin/banners`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/admin/course-materials`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const courseData = await parseResponse(courseRes);
      const bannerData = await parseResponse(bannerRes);
      const materialData = await parseResponse(materialRes);

      setCourses(courseData.courses || []);
      setBanners(bannerData.banners || []);
      setMaterials(materialData.materials || []);
    } catch (error) {
      toast.error(error.message || 'Failed to load content management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const saveBanner = async () => {
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) {
      toast.error('Banner title and image URL are required');
      return;
    }

    try {
      const url = editingBannerId
        ? `${API_BASE}/api/admin/banners/${editingBannerId}`
        : `${API_BASE}/api/admin/banners`;
      const method = editingBannerId ? 'PUT' : 'POST';
      await parseResponse(await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(bannerForm)
      }));

      toast.success(editingBannerId ? 'Banner updated' : 'Banner added');
      setBannerForm(emptyBanner);
      setEditingBannerId(null);
      loadContent();
    } catch (error) {
      toast.error(error.message || 'Failed to save banner');
    }
  };

  const saveMaterial = async () => {
    if (!materialForm.courseId || !materialForm.title.trim() || !materialForm.fileUrl.trim()) {
      toast.error('Course, material title and file URL are required');
      return;
    }

    try {
      const url = editingMaterialId
        ? `${API_BASE}/api/admin/course-materials/${editingMaterialId}`
        : `${API_BASE}/api/admin/course-materials`;
      const method = editingMaterialId ? 'PUT' : 'POST';
      await parseResponse(await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(materialForm)
      }));

      toast.success(editingMaterialId ? 'Material updated' : 'Material added');
      setMaterialForm(emptyMaterial);
      setEditingMaterialId(null);
      loadContent();
    } catch (error) {
      toast.error(error.message || 'Failed to save material');
    }
  };

  const deleteItem = async (kind, id) => {
    try {
      const endpoint = kind === 'banner' ? 'banners' : 'course-materials';
      await parseResponse(await fetch(`${API_BASE}/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }));
      toast.success(kind === 'banner' ? 'Banner deleted' : 'Material deleted');
      loadContent();
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const editBanner = (banner) => {
    setEditingBannerId(banner._id);
    setBannerForm({
      title: banner.title || '',
      image: banner.image || '',
      redirectLink: banner.redirectLink || '',
      isActive: banner.isActive !== false
    });
  };

  const editMaterial = (material) => {
    setEditingMaterialId(material._id);
    setMaterialForm({
      courseId: material.courseId?._id || material.courseId || '',
      title: material.title || '',
      fileType: material.fileType || 'PDF',
      fileUrl: material.fileUrl || ''
    });
  };

  if (loading) {
    return <div className="content-manager-loading">Loading banners and materials...</div>;
  }

  return (
    <div className="content-manager">
      <style>{`
        .content-manager {
          display: grid;
          gap: 1.25rem;
        }
        .content-admin-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem;
        }
        .content-admin-card {
          background: #fffaf4;
          border: 1px solid rgba(139, 74, 30, 0.12);
          border-radius: 14px;
          padding: 1rem;
        }
        .content-admin-card h4 {
          color: #2A0F02;
          font-family: var(--font-heading);
          margin-bottom: 0.85rem;
        }
        .content-admin-form {
          display: grid;
          gap: 0.75rem;
        }
        .content-admin-form input,
        .content-admin-form select {
          border: 1px solid rgba(139, 74, 30, 0.16);
          border-radius: 10px;
          padding: 0.72rem 0.85rem;
          width: 100%;
          background: #fff;
        }
        .content-check-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #5C2D12;
          font-weight: 700;
        }
        .content-check-row input {
          width: auto;
        }
        .content-list {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
          max-height: 24rem;
          overflow: auto;
        }
        .content-list-item {
          background: #fff;
          border: 1px solid rgba(139, 74, 30, 0.1);
          border-radius: 12px;
          padding: 0.85rem;
          display: grid;
          gap: 0.55rem;
        }
        .content-list-main {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .content-list-main strong {
          color: #2A0F02;
        }
        .content-list-main span,
        .content-list-item code {
          color: #77665c;
          font-size: 0.82rem;
          word-break: break-word;
        }
        .content-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .content-actions button,
        .content-admin-form button {
          border: 0;
          border-radius: 9px;
          padding: 0.55rem 0.85rem;
          font-weight: 800;
        }
        .content-primary {
          background: #8B4A1E;
          color: #fff;
        }
        .content-muted {
          background: #f3e7d9;
          color: #5C2D12;
        }
        .content-danger {
          background: #fff1f1;
          color: #c02b2b;
        }
        @media (max-width: 900px) {
          .content-admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div>
        <h3 className="section-title">Banners & Course Materials</h3>
        <p className="section-desc">Manage student dashboard promotions and downloadable course resources without developer changes.</p>
      </div>

      <div className="content-admin-grid">
        <section className="content-admin-card">
          <h4>{editingBannerId ? 'Edit Banner' : 'Add Student Banner'}</h4>
          <div className="content-admin-form">
            <input value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Banner title" required />
            <input value={bannerForm.image} onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })} placeholder="Image URL, e.g. /images/banner.webp" required />
            <input value={bannerForm.redirectLink} onChange={(e) => setBannerForm({ ...bannerForm, redirectLink: e.target.value })} placeholder="Redirect link, optional" />
            <label className="content-check-row">
              <input type="checkbox" checked={bannerForm.isActive} onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })} />
              Active on student dashboard
            </label>
            <div className="content-actions">
              <button className="content-primary" type="button" onClick={saveBanner}>{editingBannerId ? 'Update Banner' : 'Add Banner'}</button>
              {editingBannerId && <button className="content-muted" type="button" onClick={() => { setEditingBannerId(null); setBannerForm(emptyBanner); }}>Cancel</button>}
            </div>
          </div>

          <div className="content-list">
            {banners.length === 0 ? <span>No banners added yet.</span> : banners.map((banner) => (
              <div className="content-list-item" key={banner._id}>
                <div className="content-list-main">
                  <div>
                    <strong>{banner.title}</strong>
                    <span>{banner.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
                <code>{banner.image}</code>
                <div className="content-actions">
                  <button className="content-muted" type="button" onClick={() => editBanner(banner)}>Edit</button>
                  <button className="content-danger" type="button" onClick={() => deleteItem('banner', banner._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-admin-card">
          <h4>{editingMaterialId ? 'Edit Material' : 'Add Course Material'}</h4>
          <div className="content-admin-form">
            <select value={materialForm.courseId} onChange={(e) => setMaterialForm({ ...materialForm, courseId: e.target.value })} required>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option value={course._id} key={course._id}>{course.title}</option>
              ))}
            </select>
            <input value={materialForm.title} onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} placeholder="Material title" required />
            <select value={materialForm.fileType} onChange={(e) => setMaterialForm({ ...materialForm, fileType: e.target.value })}>
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="LINK">External Link</option>
              <option value="IMAGE">Image</option>
            </select>
            <input value={materialForm.fileUrl} onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })} placeholder="File URL, e.g. /uploads/file.pdf" required />
            <div className="content-actions">
              <button className="content-primary" type="button" onClick={saveMaterial}>{editingMaterialId ? 'Update Material' : 'Add Material'}</button>
              {editingMaterialId && <button className="content-muted" type="button" onClick={() => { setEditingMaterialId(null); setMaterialForm(emptyMaterial); }}>Cancel</button>}
            </div>
          </div>

          <div className="content-list">
            {materials.length === 0 ? <span>No course materials added yet.</span> : materials.map((material) => (
              <div className="content-list-item" key={material._id}>
                <div className="content-list-main">
                  <div>
                    <strong>{material.title}</strong>
                    <span>{material.courseId?.title || 'Course'}</span>
                  </div>
                  <span>{material.fileType}</span>
                </div>
                <code>{material.fileUrl}</code>
                <div className="content-actions">
                  <button className="content-muted" type="button" onClick={() => editMaterial(material)}>Edit</button>
                  <button className="content-danger" type="button" onClick={() => deleteItem('material', material._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminContentManager;
