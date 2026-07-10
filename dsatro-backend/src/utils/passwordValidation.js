export const MIN_PASSWORD_LENGTH = 6;

export const validateNewPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return 'New password is required';
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return '';
};
