import Course from '../models/Course.js';
import CourseVideo from '../models/CourseVideo.js';
import Enrollment from '../models/Enrollment.js';
import Consultation from '../models/Consultation.js';
import User from '../models/User.js';
import CourseMaterial from '../models/CourseMaterial.js';
import Banner from '../models/Banner.js';
import Merchandise from '../models/Merchandise.js';
import Offer from '../models/Offer.js';
import { getBunnyPlaybackInfo } from '../utils/bunnyHelper.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  sendAdminNotificationEmail,
  sendConsultationConfirmationEmail,
  sendPasswordChangedEmail,
  sendPasswordResetEmail,
  formatEmailError,
  getEmailConfigStatus,
} from '../utils/sendEmail.js';
import { validateNewPassword } from '../utils/passwordValidation.js';

// 1. Student Authentication
export const studentLogin = async (req, res) => {
  const { email, mobile, password } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else if (mobile) {
      user = await User.findOne({ mobile: mobile.trim() });
    }

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'astro-admin-secret-2026',
      { expiresIn: '30d' }
    );

    const student = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
    };

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
      student,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const studentLogout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.name, otp);
    } catch (emailError) {
      const emailFailure = formatEmailError(emailError);
      console.error('Password reset email failed:', {
        ...emailFailure,
        config: getEmailConfigStatus(),
      });
      return res.status(503).json({
        success: false,
        ...emailFailure,
      });
    }

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('forgotPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while requesting password reset' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, token, newPassword } = req.body;
  try {
    const passwordError = validateNewPassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    const resetToken = String(token || otp || '').trim();
    if (!email || !resetToken) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid OTP or email' });

    if (!user.resetPasswordOTP || user.resetPasswordOTP !== resetToken) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
    }

    if (!user.resetPasswordExpires || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    try {
      await sendPasswordChangedEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Password changed notification email failed:', emailError.message);
    }

    res.json({ success: true, message: 'Password has been successfully reset. You can now login.' });
  } catch (error) {
    console.error('resetPassword error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while resetting password' });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const passwordError = validateNewPassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from your current password',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    try {
      await sendPasswordChangedEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Password changed notification email failed:', emailError.message);
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('changePassword error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to update password' });
  }
};

// 2. Student Profile
export const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const enrolledCoursesCount = await Enrollment.countDocuments({
      userId: user._id,
      isActive: true,
      validUntil: { $gte: new Date() },
    });

    res.json({
      success: true,
      profile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        enrolledCoursesCount,
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, mobile, profileImage } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (profileImage) user.profileImage = profileImage;
    
    await user.save();
    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: {
        studentId: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        profileImage: user.profileImage || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Purchased Courses
export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      userId: req.user.id,
      isActive: true,
      validUntil: { $gte: new Date() }
    }).populate('courseId');

    const mappedCourses = await Promise.all(enrollments.filter(e => e.courseId).map(async (e) => {
      const totalVideos = await CourseVideo.countDocuments({
        courseId: e.courseId._id,
        visibility: { $ne: 'public' },
      });
      const completedCount = e.progress && e.progress.completedVideos ? e.progress.completedVideos.length : 0;
      const progressPercent = totalVideos === 0 ? 0 : Math.round((completedCount / totalVideos) * 100);
      const accessApproved = e.accessApproved !== false;

      const completedVideos = e.progress?.completedVideos?.length || 0;

      const isLifetime = e.courseId.validityDays === 0;

      return {
        _id: e.courseId._id,
        title: e.courseId.title,
        thumbnailUrl: e.courseId.thumbnailUrl || '',
        progress: accessApproved ? progressPercent : 0,
        validUntil: e.validUntil ? e.validUntil.toISOString().split('T')[0] : null,
        totalVideos,
        completedVideos,
        courseId: e.courseId._id,
        courseTitle: e.courseId.title,
        thumbnail: e.courseId.thumbnailUrl || '',
        validTill: e.validUntil,
        courseType: e.courseId.courseType || 'Recorded',
        accessApproved,
        accessStatus: accessApproved ? 'approved' : 'pending',
        enrollmentId: e._id,
        isLifetime,
        purchaseDate: e.purchasedAt,
      };
    }));

    res.json({ success: true, courses: mappedCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
      isActive: true,
      validUntil: { $gte: new Date() }
    }).populate('courseId');

    if (!enrollment || !enrollment.courseId) {
      return res.status(403).json({ success: false, message: 'You do not have active access to this course.' });
    }

    const totalVideos = await CourseVideo.countDocuments({
      courseId,
      visibility: { $ne: 'public' },
    });
    const completedCount = enrollment.progress && enrollment.progress.completedVideos ? enrollment.progress.completedVideos.length : 0;
    const progressPercent = totalVideos === 0 ? 0 : Math.round((completedCount / totalVideos) * 100);
    const accessApproved = enrollment.accessApproved !== false;
    const isLifetime = enrollment.courseId.validityDays === 0;

    res.json({
      success: true,
      course: {
        courseId: enrollment.courseId._id,
        courseTitle: enrollment.courseId.title,
        thumbnail: enrollment.courseId.thumbnailUrl || '',
        purchaseDate: enrollment.purchasedAt,
        validTill: enrollment.validUntil,
        courseType: enrollment.courseId.courseType || 'Recorded',
        progress: accessApproved ? progressPercent : 0,
        accessApproved,
        accessStatus: accessApproved ? 'approved' : 'pending',
        totalLessons: totalVideos,
        isLifetime,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Course Videos
export const getCourseVideos = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
      isActive: true,
      validUntil: { $gte: new Date() }
    });

    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'You do not have active access to this course.' });
    }

    if (enrollment.accessApproved === false) {
      return res.status(403).json({
        success: false,
        code: 'PENDING_APPROVAL',
        message: 'Your enrollment is pending admin approval. Lesson videos unlock once approved.',
      });
    }

    const videos = await CourseVideo.find({ courseId, visibility: { $ne: 'public' } }).sort('sortOrder');
    
    const completedIds = enrollment.progress && enrollment.progress.completedVideos 
      ? enrollment.progress.completedVideos.map(id => id.toString()) 
      : [];

    const videoProgressMap = enrollment.progress?.videoProgress || new Map();

    const mappedVideos = await Promise.all(videos.map(async (video) => {
      let playbackUrl = null;
      let expiresAt = null;
      let otp = null;
      let playbackInfo = null;

      if (video.videoProvider === 'supabase' && video.videoUrl) {
        playbackUrl = video.videoUrl;
      } else if (video.bunnyVideoId) {
        try {
          const bunnyPlayback = getBunnyPlaybackInfo(video.bunnyVideoId, 7200);
          playbackUrl = bunnyPlayback.playbackUrl;
          expiresAt = bunnyPlayback.expiresAt;
        } catch (err) {
          console.error('Bunny playback URL error:', err.message);
        }
      } else if (video.vdoCipherVideoId && process.env.VDOCIPHER_API_SECRET) {
        try {
          const vdoRes = await fetch(`https://dev.vdocipher.com/api/videos/${video.vdoCipherVideoId}/otp`, {
            method: 'POST',
            headers: {
              Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ttl: 7200 }),
          });
          const vdoData = await vdoRes.json();
          if (vdoRes.ok) {
            otp = vdoData.otp;
            playbackInfo = vdoData.playbackInfo;
          }
        } catch (err) {
          console.error('VdoCipher API Error:', err);
        }
      }

      const progressSeconds = videoProgressMap.get?.(video._id.toString())
        ?? videoProgressMap[video._id.toString()]
        ?? 0;

      return {
        _id: video._id,
        title: video.title,
        sortOrder: video.sortOrder ?? 0,
        duration: video.duration || 0,
        videoProvider: video.videoProvider || (video.videoUrl ? 'supabase' : (video.vdoCipherVideoId ? 'vdocipher' : 'bunny')),
        bunnyVideoId: video.bunnyVideoId || undefined,
        vdocipherVideoId: video.vdoCipherVideoId || undefined,
        signedEmbedUrl: playbackUrl || undefined,
        otp: otp || undefined,
        playbackInfo: playbackInfo || undefined,
        isCompleted: completedIds.includes(video._id.toString()),
        progressSeconds: Number(progressSeconds) || 0,
      };
    }));

    res.json({ success: true, videos: mappedVideos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVideoProgress = async (req, res) => {
  try {
    const { videoId, courseId, progressSeconds, completed, isCompleted } = req.body;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
      isActive: true,
    });

    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled in this course.' });

    if (!enrollment.progress) enrollment.progress = { completedVideos: [], videoProgress: {} };
    if (!enrollment.progress.completedVideos) enrollment.progress.completedVideos = [];

    if (progressSeconds !== undefined && progressSeconds !== null) {
      if (!enrollment.progress.videoProgress || enrollment.progress.videoProgress instanceof Map === false) {
        const existing = enrollment.progress.videoProgress || {};
        enrollment.progress.videoProgress = new Map(Object.entries(existing));
      }
      enrollment.progress.videoProgress.set(String(videoId), Number(progressSeconds));
      enrollment.markModified('progress.videoProgress');
    }

    const hasCompletedField = req.body.hasOwnProperty('completed') || req.body.hasOwnProperty('isCompleted');
    if (hasCompletedField) {
      const markCompleted = completed === true || completed === 'true' || isCompleted === true || isCompleted === 'true';
      const isAlreadyCompleted = enrollment.progress.completedVideos.some((id) => id.toString() === videoId);
      if (markCompleted) {
        if (!isAlreadyCompleted) {
          enrollment.progress.completedVideos.push(videoId);
        }
      } else {
        enrollment.progress.completedVideos = enrollment.progress.completedVideos.filter(
          (id) => id.toString() !== videoId
        );
      }
    }

    await enrollment.save();

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Course Validity
export const getCourseValidity = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
      isActive: true
    }).populate('courseId', 'validityDays');

    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled.' });

    const isLifetime = enrollment.courseId?.validityDays === 0;
    const now = new Date();
    const validTill = enrollment.validUntil;
    const timeDiff = validTill.getTime() - now.getTime();
    const daysRemaining = isLifetime ? null : (timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0);

    res.json({
      success: true,
      validity: {
        validFrom: enrollment.purchasedAt
          ? enrollment.purchasedAt.toISOString().split('T')[0]
          : null,
        validTill: isLifetime ? null : validTill.toISOString().split('T')[0],
        daysRemaining,
        isLifetime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Course Materials
export const getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId,
      isActive: true,
      validUntil: { $gte: new Date() }
    });

    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled.' });

    const materials = await CourseMaterial.find({ courseId });
    const mapped = materials.map(m => ({
      materialId: m._id,
      title: m.title,
      fileType: m.fileType,
      fileUrl: m.fileUrl
    }));

    res.json({ success: true, materials: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Promotional Banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    const mapped = banners.map(b => ({
      bannerId: b._id,
      title: b.title,
      image: b.image,
      redirectLink: b.redirectLink || ''
    }));
    res.json({ success: true, banners: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Merchandise Promotions
export const getMerchandise = async (req, res) => {
  try {
    const merch = await Merchandise.find({ isActive: true });
    const mapped = merch.map(m => ({
      productId: m._id,
      title: m.title,
      image: m.image,
      price: m.price
    }));
    res.json({ success: true, merchandise: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 9. New Course Launches
export const getNewCourses = async (req, res) => {
  try {
    const newCourses = await Course.find({ isActive: true }).sort({ launchDate: -1, createdAt: -1 }).limit(5);
    const mapped = newCourses.map(c => ({
      courseId: c._id,
      title: c.title,
      thumbnail: c.thumbnailUrl || '',
      launchDate: c.launchDate || c.createdAt
    }));
    res.json({ success: true, newCourses: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Offers & Discounts
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      validTill: { $gte: new Date() },
      validFrom: { $lte: new Date() },
    }).sort({ priority: -1, validTill: 1 });
    const mapped = offers.map((o) => ({
      offerId: o._id,
      title: o.title,
      subtitle: o.subtitle || '',
      description: o.description || '',
      type: o.type || 'custom',
      discount: o.discount,
      discountValue: o.discountValue ?? 0,
      couponCode: o.couponCode || '',
      thumbnail: o.thumbnail || '',
      ctaLabel: o.ctaLabel || 'Claim Offer',
      ctaLink: o.ctaLink || '',
      validTill: o.validTill,
    }));
    res.json({ success: true, offers: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookCourseConsultation = async (req, res) => {
  try {
    const { courseId, preferredDatetime, notes, mobile } = req.body;

    const enrollment = await Enrollment.findOne({
      userId: req.user.id,
      courseId: courseId,
      isActive: true
    });

    if (!enrollment) {
      return res.status(403).json({ success: false, message: 'Active enrollment required to book consultation.' });
    }

    const existing = await Consultation.findOne({ userId: req.user.id, courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already booked a consultation for this course.' });
    }

    const fetchedUser = await User.findById(req.user.id);
    if (!fetchedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const consultation = await Consultation.create({
      name: fetchedUser.name,
      email: fetchedUser.email,
      mobile: mobile || fetchedUser.mobile || 'N/A',
      userId: req.user.id,
      courseId: courseId,
      preferredDatetime,
      notes,
      status: 'Pending',
    });

    // Send admin notification
    await sendAdminNotificationEmail(
      `New Course Consultation Request: ${fetchedUser.name}`,
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
        <h2 style="color: #6b4a44; margin-top: 0;">New Consultation Request! 🎉</h2>
        <p>A student has requested a consultation from within their course player.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${fetchedUser.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${fetchedUser.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Mobile:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${consultation.mobile}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;"><strong>Preferred Date & Time:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${preferredDatetime || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Notes:</strong></td>
            <td style="padding: 8px 0;">${notes || 'None'}</td>
          </tr>
        </table>
      </div>
      `
    );

    try {
      const bookedCourse = await Course.findById(courseId).select('title');
      await sendConsultationConfirmationEmail(
        fetchedUser.email,
        fetchedUser.name,
        bookedCourse?.title,
        preferredDatetime
      );
    } catch (emailError) {
      console.error('Consultation confirmation email error:', emailError.message);
    }

    res.status(201).json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 11. Student's own consultation bookings
export const getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user.id })
      .populate('courseId', 'title')
      .sort('-createdAt');

    const mapped = consultations.map((c) => ({
      _id: c._id,
      courseId: c.courseId?._id || c.courseId || null,
      courseTitle: c.courseId?.title || '',
      preferredDatetime: c.preferredDatetime,
      notes: c.notes,
      status: c.status,
      bookedAt: c.bookedAt || c.createdAt,
    }));

    res.json({ success: true, consultations: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
