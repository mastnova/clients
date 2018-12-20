import { PAGE_URL } from '../constants';

function login() {
  sessionStorage.setItem('userHasAuth', 'true');
}

function logout () {
  sessionStorage.setItem('userHasAuth', '');
  document.location = PAGE_URL.login;
}

function hasAuth () {
  return !!sessionStorage.getItem('userHasAuth');
}

function setRole (role) {
  sessionStorage.setItem('userRole', role);
}

function getRole() {
  return sessionStorage.getItem('userRole');
}

export default {
  login,
  logout,
  hasAuth,
  setRole,
  getRole,
};