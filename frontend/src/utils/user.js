import { PAGE_URL } from '../constants';

function login() {
  sessionStorage.setItem('userHasAuth', 'true');
}

function logout () {
  sessionStorage.clear();
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

function setData(name, value) {
  sessionStorage.setItem(name, value);
}

function getData(name) {
  return sessionStorage.getItem(name);
}

export default {
  login,
  logout,
  hasAuth,
  setRole,
  getRole,
  setData,
  getData,
};