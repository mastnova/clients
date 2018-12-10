const API = {
  hasRoot: '/api/has_root',
  createUser: {
    method: 'POST',
    url: '/api/user',
  }
};
async function hasRoot() {
  const response = await fetch(API.hasRoot);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
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
  if (response.status !== 200) throw Error(body.message);
  return body
}

export default {
  hasRoot,
  createUser,
};