const db = require('../db');
const crypt = require('crypto');

const generateAvatar = () => {
  const max = 15;
  return Math.floor(Math.random() * max) + 1;
}

const schemaUser = new db.Schema({
  login: {
    type: String,
    require: true,
    unique: true,
  },
  avatar: {
    type: Number,
    require: true,
    default: generateAvatar
  },
  role: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    default: 'active',
  },
  clubId: {
    type: db.Schema.ObjectId,
  },
  parent: {
    type: db.Schema.ObjectId,
  },
  hash: {
    type: String,
    require: true,
  },
  salt: {
    type: String,
    require: true,
  },
  iteration: {
    type: Number,
    require: true,
  },
  created: {
    type: Date,
    default: Date.now
  },
  token: {
    type: String,
    require: true,
  }
});

schemaUser.virtual('password')
  .set(function (data) {
    this.salt = String(Math.random());
    this.iteration = parseInt(Math.random() * 10 + 2);
    this.hash = this.getHash(data);
    this.token = this.generateToken();
  })
  .get(function () {
    return this.hash;
  })

schemaUser.methods.getHash = function (password) {
  c = crypt.createHmac('sha1', this.salt);
  for (var i = 0; i < this.iteration; i++) {
    c.update(password);
  }
  return c.digest('hex');
};

schemaUser.methods.generateToken = function () {
  return crypt.randomBytes(64).toString('hex');
}

schemaUser.methods.passwordIsValid = function (password) {
  return this.getHash(password) === this.hash;
};

schemaUser.methods.changeStatus = function (status) {
  const states = ['active', 'blocked', 'removed'];
  if (states.includes(status)) {
    this.status = status;
  }
};

schemaUser.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = db.model('User', schemaUser);