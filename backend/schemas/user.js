const db = require('../db');
const crypt = require('crypto');

const schemaUser = new db.Schema({
  login: {
    type: String,
    require: true,
    unique: true,
  },
  role: {
    type: String,
    require: true,
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
    default: Date.now()
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

schemaUser.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = db.model('User', schemaUser);