import user from './utils/user';

const API = {
  hasRoot: {
    method: 'GET',
    url: '/api/root',
  },
  createUser: {
    method: 'POST',
    url: '/api/user',
  },
  login: {
    method: 'POST',
    url: '/api/login',
  },
  getUsers: {
    method: 'GET',
    url: '/api/users',
  }
};

async function request(url, method = 'GET', data) {
  const params = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  };
  if (data) {
    params.body = JSON.stringify(data);
  }
  const response = await fetch(url, params);
  const body = await response.json();
  if (response.status !== 200) {
    console.error(body.message);
    if (body.code === 4) {
      user.logout();
    }
    return { isOk: false, data: body };
  }
  return { isOk: true, data: body };
}

async function hasRoot() {
  const response = await request(API.hasRoot.url);
  return response.data;
}

async function createUser(user) {
  const response = await request(API.createUser.url, API.createUser.method, user);
  if (response.isOk) {
    return true;
  }
  return false;
}

async function login(logPass) {
  const response = await request(API.login.url, API.login.method, logPass);
  if (response.isOk) {
    user.login();
  }
  return response;
}

async function getUsers() {
  const response = await request(API.getUsers.url);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

export default {
  hasRoot,
  createUser,
  login,
  getUsers,
};