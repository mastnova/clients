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
  changeUserStatus: {
    method: 'PUT',
    url: '/api/user',
  },
  getAgents: {
    method: 'GET',
    url: '/api/agents',
  },
  removeAgent: {
    method: 'DELETE',
    url: '/api/agent/',
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
  removeClient: {
    method: 'PUT',
    url: '/api/client',
  },
  clientIsExist: {
    method: 'POST',
    url: '/api/client/is_exist',
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
  changeClubStatus: {
    method: 'PUT',
    url: '/api/club',
  },
  getOperators: {
    method: 'GET',
    url: '/api/operators/',
  },
  removeOperator: {
    method: 'DELETE',
    url: '/api/operator/',
  },
  createPromotion: {
    method: 'POST',
    url: '/api/promotion/',
  },
  changeClubName: {
    method: 'PUT',
    url: '/api/club/name',
  },
  changeClientName: {
    method: 'PUT',
    url: '/api/client/name',
  },
  changeUser: {
    method: 'PUT',
    url: '/api/user/update',
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

async function removeAgent(id) {
  const response = await request(API.removeAgent.url + id, API.removeAgent.method);
  if (response.isOk) {
    return true;
  }
  return false;
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

async function removeClient(id) {
  const params = { id, status: 'removed' };
  const response = await request(API.removeClient.url, API.removeClient.method, params);
  if (response.isOk) {
    return true;
  }
  return false;
}

async function clientIsExist(client) {
  const response = await request(API.clientIsExist.url, API.clientIsExist.method, client);
  return response.data.is_exist;
}

async function createClub(club) {
  const response = await request(API.createClub.url, API.createClub.method, club);
  return response;
}

async function getClubs(id = '', status) {
  const response = await request(`${API.getClubs.url}${id}${status ? '/' + status : ''}`);
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

async function blockClub(id) {
  const params = { id, status: 'blocked' };
  const response = await request(API.changeClubStatus.url, API.changeClubStatus.method, params);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function removeClub(id) {
  const params = { id, status: 'removed' };
  const response = await request(API.changeClubStatus.url, API.changeClubStatus.method, params);
  if (response.isOk) {
    return true;
  }
  return false;
}

async function activateClub(id) {
  const params = { id, status: 'active' };
  const response = await request(API.changeClubStatus.url, API.changeClubStatus.method, params);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function blockUser(id) {
  const params = { id, status: 'blocked' };
  const response = await request(API.changeUserStatus.url, API.changeUserStatus.method, params);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function removeUser(id) {
  const params = { id, status: 'removed' };
  const response = await request(API.changeUserStatus.url, API.changeUserStatus.method, params);
  if (response.isOk) {
    return response.data;
  }
  return null;
}

async function activateUser(id) {
  const params = { id, status: 'active' };
  const response = await request(API.changeUserStatus.url, API.changeUserStatus.method, params);
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

async function removeOperator(id) {
  const response = await request(API.removeOperator.url + id, API.removeOperator.method);
  if (response.isOk) {
    return true;
  }
  return false;
}

async function createPromotion(clubId, promo) {
  const response = await request(API.createPromotion.url + clubId, API.createPromotion.method, promo);
  return response;
}

async function changeClubName(id, name) {
  const body = { id, name };
  const response = await request(API.changeClubName.url, API.changeClubName.method, body);
  return response.data;
}

async function changeClientName(id, name) {
  const body = { id, name };
  const response = await request(API.changeClientName.url, API.changeClientName.method, body);
  return response.data;
}

async function changeUser(id, login, password) {
  const body = { id, login, password };
  const response = await request(API.changeUser.url, API.changeUser.method, body);
  return response;
}

export default {
  hasRoot,
  createUser,
  login,
  getAgents,
  removeAgent,
  getClients,
  getClient,
  createClient,
  removeClient,
  clientIsExist,
  createClub,
  getClubs,
  getClub,
  blockClub,
  removeClub,
  activateClub,
  blockUser,
  removeUser,
  activateUser,
  getOperators,
  removeOperator,
  createPromotion,
  changeClubName,
  changeClientName,
  changeUser,
};