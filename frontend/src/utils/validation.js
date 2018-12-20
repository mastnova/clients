export function isValid (value, type) {
  if (!type) return true;
  if (type === 'login') {
    if (value.length) {
      return true;
    }
    return false;
  } else if (type === 'password') {
    if (value.length > 1) {
      return true;
    }
    return false;
  } else if (type === 'required') {
    if (value.length) {
      return true;
    }
    return false;
  }
  console.error('Unknown validation type');
}