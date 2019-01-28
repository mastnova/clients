export function validate (value, type) {
  if (!type) return true;
  if (type === 'login') {
    if (value.length) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Заполните поле' };
  } else if (type === 'password') {
    if (value.length > 1) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Заполните поле' };
  } else if (type === 'required') {
    if (value.length) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Заполните поле' };
  } else if (type === 'phone') {
    const regexp = /^\+7 \([0-9]{3}\) [0-9]{3} - [0-9]{2} - [0-9]{2}$/;
    return regexp.test(value);
  }
  console.error('Unknown validation type');
}