import React, { useState } from 'react';
import { 
  User, Mail, Phone, BookOpen, FileText, Tag, Rocket, 
  Download, ArrowRight, LogOut, Edit2, CheckCircle, ExternalLink 
} from 'lucide-react';

export default function StudentDashboard() {
  // --- Mock Data ---
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    mobile: '+1 (555) 019-2834',
    status: 'Active'
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: 'My Courses', count: 3, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Materials Available', count: 12, icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Active Offers', count: 2, icon: Tag, color: 'bg-green-50 text-green-600' },
    { label: 'New Launches', count: 4, icon: Rocket, color: 'bg-orange-50 text-orange-600' },
  ];

  const courses = [
    {
      id: 'c1',
      title: 'Full-Stack React Masterclass',
      type: 'Development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60',
      description: 'Master modern React, Node.js, and deployment strategies from scratch.',
      purchaseDate: '2026-01-15',
      validTill: '2026-07-15',
      daysRemaining: 36,
      progress: 65,
    },
    {
      id: 'c2',
      title: 'UI/UX Design Fundamentals',
      type: 'Design',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&auto=format&fit=crop&q=60',
      description: 'Learn wireframing, prototyping, and user testing with Figma.',
      purchaseDate: '2026-02-10',
      validTill: '2026-04-10',
      daysRemaining: 0, // Expired
      progress: 100,
    }
  ];

  const materialsData = {
    c1: [
      { id: 'm1', title: 'React Hooks Cheat Sheet', fileType: 'PDF', url: '#' },
      { id: 'm2', title: 'Source Code: E-Commerce Project', fileType: 'ZIP', url: '#' },
      { id: 'm3', title: 'Deployment Checklist', fileType: 'PDF', url: '' }, // No URL example
    ],
    c2: [
      { id: 'm4', title: 'Figma Shortcut Guide', fileType: 'PDF', url: '#' },
    ]
  };

  const promotions = {
    banners: [
      { title: 'Join our Premium Discord Community!', link: '#', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60' }
    ],
    merchandise: [
      { title: 'Official Dev Hoodie', price: '$45.00', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop&q=60' }
    ],
    launches: [
      { title: 'Next-Gen AI & LLM Bootcamp', launchDate: 'July 1, 2026' }
    ]
  };

  const offers = [
    { title: 'Exclusive Alumni Discount', label: '25% OFF', validTill: '2026-06-30', description: 'Valid for your next advanced certification course or 1-on-1 expert consultation.' }
  ];

  // --- UI State Management ---
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);

  const handleCourseSelect = (id) => {
    setIsLoadingMaterials(true);
    setSelectedCourseId(id);
    setTimeout(() => setIsLoadingMaterials(false), 300); // Quick synthetic loading feel
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="student-dashboard-preview min-h-screen bg-gray-50 text-gray-800">
      
      {/* 1. STUDENT HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                Student Portal
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">Welcome back, {profile.name}!</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP ROW: Profile Details & Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. PROFILE / ACCOUNT DETAILS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {profile.status}
                </span>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900">{profile.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Mobile Number</p>
                      <p className="font-medium text-gray-900">{profile.mobile}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 rounded-xl transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
              ) : (
                /* EDIT PROFILE FORM */
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Mobile</label>
                    <input 
                      type="text" 
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
                      Save
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setEditForm({...profile}); setIsEditing(false); }}
                      className="flex-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* 3. STATS CARDS */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.count}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* MIDDLE SECTION: Courses & Course Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 4. MY COURSES SECTION */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Active Courses</h2>
            
            {courses.length === 0 ? (
              /* Empty State */
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center space-y-4">
                <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm transition">
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const isExpired = course.daysRemaining <= 0;
                  return (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full md:w-44 h-28 object-cover rounded-xl shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              {course.type}
                            </span>
                            <span className={`text-xs font-bold ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
                              {isExpired ? 'Expired' : `${course.daysRemaining} Days Left`}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mt-1">{course.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{course.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                          <div>Purchase Date: <span className="font-medium text-gray-700">{course.purchaseDate}</span></div>
                          <div>Valid Till: <span className="font-medium text-gray-700">{course.validTill}</span></div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-gray-400">Course Progress</span>
                            <span className="text-gray-900">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button 
                            disabled={isExpired}
                            className={`flex items-center gap-1 text-xs font-medium px-4 py-2 rounded-xl transition ${
                              isExpired 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-900 hover:bg-gray-800 text-white'
                            }`}
                          >
                            Continue Learning <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. COURSE MATERIALS SECTION */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Course Materials</h2>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              
              {/* Course Selector Buttons */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    className={`flex-1 text-xs font-medium py-1.5 px-3 rounded-lg transition text-center whitespace-nowrap ${
                      selectedCourseId === course.id 
                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {course.type}
                  </button>
                ))}
              </div>

              {/* Materials list */}
              {isLoadingMaterials ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs">Fetching materials...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {(!materialsData[selectedCourseId] || materialsData[selectedCourseId].length === 0) ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No structural files available for this selection.</p>
                  ) : (
                    materialsData[selectedCourseId].map((material) => (
                      <div key={material.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{material.title}</p>
                          <span className="inline-block text-[10px] font-extrabold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mt-0.5">
                            {material.fileType}
                          </span>
                        </div>
                        {material.url ? (
                          <a 
                            href={material.url}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition shrink-0"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-medium italic">Unavailable</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Promotions & Offers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 6. PROMOTIONS & NEW LAUNCHES */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Promotions & New Launches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Promotional Banner */}
              {promotions.banners.map((b, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group bg-gray-900 h-44 border border-gray-200">
                  <img src={b.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <span className="self-start text-[10px] font-bold tracking-wider uppercase bg-amber-500 text-white px-2 py-0.5 rounded">Community</span>
                    <div>
                      <h4 className="text-white font-bold text-base leading-tight mb-2">{b.title}</h4>
                      <a href={b.link} className="inline-flex items-center gap-1 text-xs text-indigo-300 font-semibold hover:underline">
                        Access Now <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Merch & New Course Drops Grid */}
              <div className="space-y-3 flex flex-col justify-between">
                {/* Merch */}
                {promotions.merchandise.map((m, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <img src={m.image} alt={m.title} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Campus Store</p>
                      <h4 className="text-sm font-bold text-gray-900">{m.title}</h4>
                      <p className="text-xs text-indigo-600 font-medium">{m.price}</p>
                    </div>
                  </div>
                ))}
                
                {/* New Course Launches */}
                {promotions.launches.map((l, i) => (
                  <div key={i} className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <Rocket className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 text-white" />
                    <span className="text-[9px] uppercase tracking-wider bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">Upcoming Launch</span>
                    <h4 className="text-sm font-bold mt-1 text-white">{l.title}</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">Launches on: {l.launchDate}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* 7. OFFERS & DISCOUNTS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Offers & Discounts</h2>
            <div className="space-y-4">
              {offers.map((offer, idx) => (
                <div key={idx} className="bg-white border-2 border-dashed border-emerald-200 rounded-2xl p-5 shadow-sm relative bg-gradient-to-b from-white to-emerald-550/5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {offer.label}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base mt-2.5">{offer.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {offer.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Valid until:</span>
                    <span className="font-bold text-red-500">{offer.validTill}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
