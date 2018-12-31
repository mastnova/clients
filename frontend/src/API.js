import { PAGE_URL } from './constants';

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
  getAgents: {
    method: 'GET',
    url: '/api/agents',
  },
  getClients: {
    method: 'GET',
    url: '/api/clients/',
  },
  getClient: {
    method: 'GET',
    url: '/api/client/',
  },
  createClient: {
    method: 'POST',
    url: '/api/client',
  },
  createClub: {
    method: 'POST',
    url: '/api/club',
  },
  getClubs: {
    method: 'GET',
    url: '/api/clubs/',
  },
  getClub: {
    method: 'GET',
    url: '/api/club/',
  },
  getOperators: {
    method: 'GET',
    url: '/api/operators/',
  },
  createPromotion: {
    method: 'POST',
    url: '/api/promotion/',
  },
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
  let body;
  try {
    body = await response.json();
  } catch {
    console.error('request has been finished with error');
    return { isOk: false, data: {}};
  }
  if (response.status !== 200) {
    console.error(body.message);
    if (body.code === 4) {
      sessionStorage.clear();
      document.location = PAGE_URL.login;
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
  return response;
}

async function login(logPass) {
  const response = await request(API.login.url, API.login.method, logPass);
  return response;
}

async function getAgents() {
  const response = await request(API.getAgents.url);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function getClients(id) {
  const response = await request(API.getClients.url + id);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function getClient(id) {
  const response = await request(API.getClient.url + id);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function createClient(client) {
  const response = await request(API.createClient.url, API.createClient.method, client);
  return response;
}

async function createClub(club) {
  const response = await request(API.createClub.url, API.createClub.method, club);
  return response;
}

async function getClubs(id = '') {
  const response = await request(API.getClubs.url + id);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function getClub(id) {
  const response = await request(API.getClub.url + id);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function getOperators(clubId) {
  const response = await request(API.getOperators.url + clubId);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function createPromotion(clubId, promo) {
  const response = await request(API.createPromotion.url + clubId, API.createPromotion.method, promo);
  return response;
}

export default {
  hasRoot,
  createUser,
  login,
  getAgents,
  getClients,
  getClient,
  createClient,
  createClub,
  getClubs,
  getClub,
  getOperators,
  createPromotion,
};