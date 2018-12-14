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
async function hasRoot() {
  const response = await fetch(API.hasRoot.url);
  const body = await response.json();
  if (response.status !== 200) console.error(body.message);
  return body;
}

async function createUser(user) {
  const params = {
    method: API.createUser.method,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(user),
  };
  const response = await fetch(API.createUser.url, params);
  const body = await response.json();
  if (response.status !== 200) {
    console.error(body.message);
    return false;
  }
    return true;
}

async function login(logPass) {
  const params = {
    method: API.login.method,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(logPass),
  };
  const response = await fetch(API.login.url, params);
  const body = await response.json();
  if (response.status !== 200) {
    console.error(body.message);
    return false;
  }
    sessionStorage.setItem('userHasAuth', 'true');
    return true;
}

async function getUsers() {
  const response = await fetch(API.getUsers.url);
  const body = await response.json();
  if (response.status !== 200) {
    console.error(body.message);
    if (body.code === 4) {
      sessionStorage.setItem('userHasAuth', '');
    }
    return null;
  }
  return body;
}

export default {
  hasRoot,
  createUser,
  login,
  getUsers,
};