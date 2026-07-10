import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  formatEmailError,
  getEmailConfigStatus,
} from '../utils/sendEmail.js';
import { validateNewPassword } from '../utils/passwordValidation.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const inputEmail = (email || '').toLowerCase().trim();
    const inputPassword = (password || '').trim();

    const user = await User.findOne({ email: inputEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(inputPassword, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'astro-admin-secret-2026';
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // included email for backwards compatibility with adminAuth if needed
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail, role: 'admin' });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not registered as an admin' });
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

    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });
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
