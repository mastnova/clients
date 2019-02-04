export function validate (value, type) {
  if (!type) return true;
  if (type === 'login') {
    const regexp = /^(?=.*[A-Za-z0-9]$)[A-Za-z][\_A-Za-z\d.-]{3,20}$/;
    if (regexp.test(value)) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Длина логина 4-20 символов. Можно использовать латинские буквы, цифры, тире, подчеркивание и точку' };
  } else if (type === 'password') {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
    if (regexp.test(value)) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Длина пароля 8-14 символов. Пароль должен содеражать заглавную и строчную буквы и цифру' };
  } else if (type === 'required') {
    if (value.length) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Заполните поле' };
  } else if (type === 'phone') {
    const regexp = /^\+7 \([0-9]{3}\) [0-9]{3} - [0-9]{2} - [0-9]{2}$/;
    if (regexp.test(value)) {
      return { isValid: true };
    }
    return { isValid: false, error: 'Введите корректный номер телефона' };
  }
  console.error('Unknown validation type');
}