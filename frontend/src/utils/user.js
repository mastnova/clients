import { PAGE_URL } from '../constants';

function login() {
  sessionStorage.setItem('userHasAuth', 'true');
}

function logout () {
  sessionStorage.setItem('userHasAuth', '');
  document.location = PAGE_URL.login;
}

export default {
  login,
  logout,
};