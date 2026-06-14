import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from '@/utils/toast';
import API_BASE from '../utils/api';
import { getContactValidationError, normalizeIndianMobile } from '../utils/validation';

export function normalizeCourse(entry) {
  if (!entry) return null;

  if (entry.course) {
    return {
      id: entry.course._id || entry.course.courseId || entry._id || entry.course.id,
      title: entry.course.title || entry.course.courseTitle || 'Untitled Course',
      thumbnail: entry.course.thumbnailUrl || entry.course.thumbnail || entry.course.image || '/images/vedic_thumbnail.png',
      description: entry.course.description || entry.course.shortDescription || entry.courseTitle || 'Your enrolled course',
      purchaseDate: entry.purchaseDate || entry.course.purchaseDate || entry.purchase_date,
      validTill: entry.validTill || entry.course.validTill || entry.course.valid_until || entry.validUntil,
      courseType: entry.course.courseType || entry.courseType || 'Recorded',
      progress: entry.course.progress ?? entry.progress ?? 0,
    };
  }

  return {
    id: entry.courseId || entry._id || entry.id,
    title: entry.courseTitle || entry.title || 'Untitled Course',
    thumbnail: entry.thumbnail || entry.courseThumbnail || '/images/vedic_thumbnail.png',
    description: entry.description || entry.summary || 'Your enrolled course',
    purchaseDate: entry.purchaseDate,
    validTill: entry.validTill || entry.valid_until || entry.validity,
    courseType: entry.courseType || 'Recorded',
    progress: entry.progress ?? 0,
  };
}

export function formatDashboardDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function computeDaysRemaining(validTill) {
  if (!validTill) return 'N/A';
  const end = new Date(validTill);
  const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? `${diff} day${diff === 1 ? '' : 's'}` : 'Expired';
}

export default function useStudentDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('studentToken');

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', mobile: '' });
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseValidity, setCourseValidity] = useState({});
  const [banners, setBanners] = useState([]);
  const [merchandise, setMerchandise] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [offers, setOffers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedCourseForMaterials, setSelectedCourseForMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const studentName = profile?.name || localStorage.getItem('studentName') || 'Student';
  const enrolledCourses = useMemo(() => courses.map(normalizeCourse).filter(Boolean), [courses]);

  const fetchSection = async (path) => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load');
    if (data.success === false) throw new Error(data.message || 'Failed to load');
    return data;
  };

  const loadCourseValidity = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE}/api/student/course/${courseId}/validity`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) return;
      const validity = data.validity || data.data || data;
      setCourseValidity((prev) => ({ ...prev, [courseId]: validity }));
    } catch {
      // Validity is optional.
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [profileData, courseData, bannerData, merchData, launchesData, offersData] = await Promise.all([
          fetchSection('/api/student/profile'),
          fetchSection('/api/student/courses'),
          fetchSection('/api/student/banners'),
          fetchSection('/api/student/merchandise'),
          fetchSection('/api/student/new-courses'),
          fetchSection('/api/student/offers'),
        ]);

        const profilePayload = profileData.profile || profileData.student || profileData.user || profileData;
        const loadedCourses = courseData.enrollments || courseData.courses || courseData.data || [];

        setProfile(profilePayload);
        setProfileForm({
          name: profilePayload.name || '',
          email: profilePayload.email || '',
          mobile: profilePayload.mobile || '',
        });
        setCourses(loadedCourses);
        setBanners(bannerData.banners || bannerData.data || []);
        setMerchandise(merchData.products || merchData.merchandise || merchData.data || []);
        setNewCourses(launchesData.courses || launchesData.newCourses || launchesData.data || []);
        setOffers(offersData.offers || offersData.data || []);

        const courseIds = loadedCourses.map((course) => normalizeCourse(course)?.id).filter(Boolean);
        await Promise.all(courseIds.map((courseId) => loadCourseValidity(courseId)));
      } catch (error) {
        const errorMessage = error.message || 'Unable to load student dashboard';
        toast.error(errorMessage);
        if (errorMessage.toLowerCase().includes('session') || errorMessage.toLowerCase().includes('token')) {
          localStorage.removeItem('studentToken');
          localStorage.removeItem('studentName');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate, token]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/student/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch {
      // Clear local session regardless.
    }
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    navigate('/login');
  };

  const handleProfileChange = (field) => (event) => {
    setProfileForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    const validationError = getContactValidationError(profileForm);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSavingProfile(true);
    const sanitizedProfile = {
      ...profileForm,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      mobile: normalizeIndianMobile(profileForm.mobile),
    };

    try {
      const response = await fetch(`${API_BASE}/api/student/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedProfile),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || 'Unable to update profile');
      const updatedProfile = data.profile || data.student || data.user || data;
      setProfile(updatedProfile);
      setProfileForm({
        name: updatedProfile.name || '',
        email: updatedProfile.email || '',
        mobile: updatedProfile.mobile || '',
      });
      setProfileEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const loadMaterials = async (courseId) => {
    if (!courseId) return;
    setLoadingMaterials(true);
    setSelectedCourseForMaterials(courseId);

    try {
      const response = await fetch(`${API_BASE}/api/student/course/${courseId}/materials`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || 'Failed to load course materials');
      setMaterials(data.materials || data.data || []);
    } catch (error) {
      toast.error(error.message || 'Unable to fetch materials');
      setMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  };

  return {
    profile,
    profileForm,
    profileEditMode,
    setProfileEditMode,
    savingProfile,
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
    saveProfile,
    loadMaterials,
  };
}
