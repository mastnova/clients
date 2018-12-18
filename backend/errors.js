module.exports = {
  rootExist: {
    status: 'error',
    code: 1,
    message: 'Root already exists'
  },
  notFound: {
    status: 'error',
    code: 2,
    message: 'requested URL not found'
  },
  authFailed: {
    status: 'error',
    code: 3,
    message: 'Wrong login or password',
  },
  invalidToken: {
    status: 'error',
    code: 4,
    message: 'Token is invalid',
  },
  notAllowed: {
    status: 'error',
    code: 5,
    message: "You don't have enough permissions",
  },
  userExist: {
    status: 'error',
    code: 6,
    message: "User with this login is already exist",
  },
};