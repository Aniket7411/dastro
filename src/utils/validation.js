export const normalizeIndianMobile = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

export const isValidIndianMobile = (value = '') => /^[6-9]\d{9}$/.test(normalizeIndianMobile(value));

export const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

export const MIN_PASSWORD_LENGTH = 6;

export const isValidPassword = (value = '') => String(value).length >= MIN_PASSWORD_LENGTH;

export const getPasswordValidationError = (password, confirmPassword) => {
  if (!isValidPassword(password)) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
};

export const isValidName = (value = '') => String(value).trim().length >= 2;

export const getContactValidationError = ({ name, email, phone, mobile } = {}) => {
  if (name !== undefined && !isValidName(name)) return 'Please enter your full name.';
  if (email !== undefined && !isValidEmail(email)) return 'Please enter a valid email address.';
  const phoneValue = phone ?? mobile;
  if (phoneValue !== undefined && !isValidIndianMobile(phoneValue)) {
    return 'Please enter a valid 10-digit Indian mobile number.';
  }
  return '';
};
