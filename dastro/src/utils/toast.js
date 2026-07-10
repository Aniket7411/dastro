import { toast as notify } from 'react-toastify';

const defaultOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

function toastMessage(message, options = {}) {
  const { icon, duration, ...rest } = options;
  const content = icon ? `${icon} ${message}` : message;
  return notify.info(content, {
    ...defaultOptions,
    autoClose: duration ?? defaultOptions.autoClose,
    ...rest,
  });
}

toastMessage.success = (message, options = {}) =>
  notify.success(message, { ...defaultOptions, ...options });

toastMessage.error = (message, options = {}) =>
  notify.error(message, { ...defaultOptions, ...options });

toastMessage.loading = (message, options = {}) =>
  notify.loading(message, { ...defaultOptions, autoClose: false, ...options });

export default toastMessage;
export { toastMessage as toast };
