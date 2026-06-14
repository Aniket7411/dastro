import { useState, useEffect } from 'react';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({
    title: '', slug: '', content: '', excerpt: '', category: 'Vedic Astrology', image: '', tags: '', isPublished: false
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/blogs/admin`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (err) {
      toast.error('Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = currentBlog._id ? 'PUT' : 'POST';
    const url = currentBlog._id 
      ? `${API_BASE}/api/blogs/${currentBlog._id}` 
      : `${API_BASE}/api/blogs`;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...currentBlog,
          tags: typeof currentBlog.tags === 'string' ? currentBlog.tags.split(',').map(t => t.trim()) : currentBlog.tags
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(currentBlog._id ? 'Article Updated' : 'Article Published');
        setIsEditing(false);
        setCurrentBlog({ title: '', slug: '', content: '', excerpt: '', category: 'Vedic Astrology', image: '', tags: '', isPublished: false });
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error saving article');
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog({
      ...blog,
      tags: blog.tags.join(', ')
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('This action cannot be undone. Delete this article?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Article removed');
        fetchBlogs();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const toggleTag = (tag) => {
    const currentTags = currentBlog.tags ? currentBlog.tags.split(',').map(t => t.trim()) : [];
    if (currentTags.includes(tag)) {
      setCurrentBlog({...currentBlog, tags: currentTags.filter(t => t !== tag).join(', ')});
    } else {
      setCurrentBlog({...currentBlog, tags: [...currentTags, tag].filter(t => t).join(', ')});
    }
  };

  return (
    <div className="admin-blogs-container">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="topbar-title fs-4 mb-1">Content Studio</h2>
          <p className="text-muted small mb-0">Craft and manage cosmic wisdom for your audience</p>
        </div>
        <button 
          className="lf-btn py-2 px-4 m-0" 
          onClick={() => { setIsEditing(!isEditing); if(!isEditing) setCurrentBlog({ title: '', slug: '', content: '', excerpt: '', category: 'Vedic Astrology', image: '', tags: '', isPublished: false }); }}
        >
          {isEditing ? (
            <><i className="fas fa-arrow-left me-2"></i> Back to Catalog</>
          ) : (
            <><i className="fas fa-plus-circle me-2"></i> Create New Article</>
          )}
        </button>
      </div>

      {!isEditing && (
        <div className="search-bar mb-4" style={{ maxWidth: '400px', background: '#fff' }}>
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search articles by title, category, or tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {isEditing ? (
        <div className="blog-editor-card animate__animated animate__fadeIn">
          <div className="be-header">
            <div className="d-flex align-items-center gap-3">
              <div className="sb-logo-orb" style={{ width: '40px', height: '40px' }}>
                <i className="fas fa-pen-nib"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold">{currentBlog._id ? 'Edit Masterpiece' : 'Compose New Article'}</h5>
                <span className="text-muted small">Drafting in {currentBlog.category}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <label className="be-switch">
                <input 
                  type="checkbox" 
                  checked={currentBlog.isPublished} 
                  onChange={e => setCurrentBlog({...currentBlog, isPublished: e.target.checked})} 
                />
                <span className="fw-bold small">{currentBlog.isPublished ? 'Published' : 'Draft'}</span>
              </label>
            </div>
          </div>
          
          <div className="be-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Visual Preview Side */}
                <div className="col-lg-4 order-lg-2">
                  <div className="sticky-top" style={{ top: '20px', zIndex: 5 }}>
                    <label className="be-label">Cover Preview</label>
                    <img 
                      src={currentBlog.image || 'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?auto=format&fit=crop&q=80&w=800'} 
                      alt="preview" 
                      className="be-thumb mb-3"
                    />
                    <div className="lf-group mb-4">
                      <label className="be-label">Featured Image Source</label>
                      
                      {/* Option 1: URL */}
                      <div className="mb-3">
                        <span className="text-muted small d-block mb-2">Option A: Paste Image URL</span>
                        <div className="position-relative">
                          <i className="fas fa-link text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px' }}></i>
                          <input 
                            type="text" 
                            className="be-input" 
                            style={{ paddingLeft: '42px' }}
                            value={currentBlog.image?.startsWith('data:') ? '' : currentBlog.image || ''} 
                            onChange={e => setCurrentBlog({...currentBlog, image: e.target.value})} 
                            placeholder="Paste image URL here..." 
                          />
                        </div>
                      </div>

                      {/* Option 2: Upload */}
                      <div>
                        <span className="text-muted small d-block mb-2">Option B: Select from Device</span>
                        <div className="d-grid">
                          <label className="lf-btn py-2 px-3 m-0 text-center cursor-pointer" style={{ fontSize: '12.5px', background: 'rgba(59, 130, 246, 0.05)', color: 'var(--sb-accent)', border: '1px dashed var(--sb-accent)' }}>
                            <i className="fas fa-upload me-2"></i> Choose Local File
                            <input 
                              type="file" 
                              hidden 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setCurrentBlog({...currentBlog, image: reader.result});
                                    toast.success('Local file selected');
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {currentBlog.image && currentBlog.image.startsWith('data:') && (
                          <div className="mt-2 text-center">
                            <span className="text-success small"><i className="fas fa-check-circle me-1"></i> Local file ready</span>
                            <button 
                              type="button" 
                              className="btn btn-link btn-sm text-danger d-block mx-auto"
                              onClick={() => setCurrentBlog({...currentBlog, image: ''})}
                            >
                              Remove file
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <label className="be-label">Popular Tags</label>
                    <div className="d-flex flex-wrap gap-2">
                      {['Horoscope', 'Planets', 'Remedies', 'Zodiac', 'Spirituality', 'Predictions', 'Success', 'Karma'].map(tag => (
                        <span 
                          key={tag} 
                          className={`be-tag-chip ${currentBlog.tags.includes(tag) ? 'be-tag-chip--active' : ''}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editor Side */}
                <div className="col-lg-8 order-lg-1">
                  <div className="row g-4">
                    <div className="col-md-12">
                      <label className="be-label">Article Title</label>
                      <input 
                        type="text" 
                        className="be-input fs-5 fw-bold" 
                        value={currentBlog.title} 
                        onChange={e => setCurrentBlog({...currentBlog, title: e.target.value})} 
                        required 
                        placeholder="The Secret of 12th House..." 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="be-label">URL Slug</label>
                      <input 
                        type="text" 
                        className="be-input" 
                        value={currentBlog.slug} 
                        onChange={e => setCurrentBlog({...currentBlog, slug: e.target.value})} 
                        required 
                        placeholder="secret-of-12th-house" 
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="be-label">Category</label>
                      <select 
                        className="be-input be-select" 
                        value={currentBlog.category} 
                        onChange={e => setCurrentBlog({...currentBlog, category: e.target.value})}
                      >
                        <option value="Vedic Astrology">Vedic Astrology</option>
                        <option value="Numerology">Numerology</option>
                        <option value="Tarot Reading">Tarot Reading</option>
                        <option value="Zodiac Insights">Zodiac Insights</option>
                        <option value="Relationship Advice">Relationship Advice</option>
                        <option value="Spiritual Healing">Spiritual Healing</option>
                        <option value="Festivals & Muhurat">Festivals & Muhurat</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="be-label">Excerpt (Short Summary)</label>
                      <textarea 
                        className="be-input" 
                        rows="3" 
                        value={currentBlog.excerpt} 
                        onChange={e => setCurrentBlog({...currentBlog, excerpt: e.target.value})} 
                        placeholder="A magnetic hook for your readers..."
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="be-label">Main Content (Markdown Supported)</label>
                      <textarea 
                        className="be-input" 
                        rows="15" 
                        value={currentBlog.content} 
                        onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})} 
                        required 
                        placeholder="Deep dive into the cosmos..."
                        style={{ lineHeight: '1.6', fontSize: '15px' }}
                      ></textarea>
                    </div>
                    
                    <div className="col-12">
                      <label className="be-label">All Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        className="be-input" 
                        value={currentBlog.tags} 
                        onChange={e => setCurrentBlog({...currentBlog, tags: e.target.value})} 
                        placeholder="stars, planets, moon, remedies" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                <span className="text-muted small">Last autosaved: Just now</span>
                <div className="d-flex gap-3">
                  <button type="button" className="btn btn-link text-decoration-none text-muted" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button type="submit" className="lf-btn py-3 px-5 m-0">
                    <i className="fas fa-paper-plane me-2"></i> {currentBlog._id ? 'Update Content' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="leads-table-wrap animate__animated animate__fadeIn">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Article / Thumbnail</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5">
                    <div className="dash-loading">
                      <div className="dash-spin"></div>
                      <span>Loading catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-empty">
                      <i className="fas fa-feather fa-2x mb-3 d-block opacity-25"></i>
                      {searchTerm ? `No articles match "${searchTerm}"` : 'No articles found. Start writing!'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <div className="lead-name-cell">
                        <img 
                          src={blog.image || 'https://via.placeholder.com/60'} 
                          alt="thumb" 
                          className="rounded" 
                          style={{ width: '50px', height: '35px', objectFit: 'cover', border: '1px solid var(--border)' }} 
                        />
                        <div>
                          <div className="td-value text-truncate" style={{ maxWidth: '250px' }}>{blog.title}</div>
                          <div className="td-muted small">/{blog.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag--cyan">{blog.category}</span>
                    </td>
                    <td>
                      <div className="status-pill">
                        <div className={`dot ${blog.isPublished ? 'dot--green' : 'dot--amber'}`}></div>
                        <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="td-value">{new Date(blog.updatedAt).toLocaleDateString()}</div>
                      <div className="td-muted">{new Date(blog.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button className="topbar-icon-btn btn-sm" onClick={() => handleEdit(blog)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="topbar-icon-btn btn-sm text-danger" onClick={() => handleDelete(blog._id)} title="Delete">
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBlogs;
