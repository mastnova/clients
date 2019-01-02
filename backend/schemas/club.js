const db = require('../db');

const schemaClub = new db.Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  owner: {
    type: db.Schema.ObjectId,
    require: true,
  },
  operators: {
    type: Array,
    require: true,
    default: [],
  },
  clientsCount: {
    type: Number,
    require: true,
    default: 0,
  },
  promotions: {
    type: Array,
    require: true,
    default: [],
  },
  created: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    require: true,
    default: 'active',
  }
});

schemaClub.methods.addOperator = function (opId) {
  this.operators.push(opId)
};

schemaClub.methods.removeOperator = function (opId) {
  this.operators = this.operators.filter(id !== opId);
};

schemaClub.methods.increaseClientsCounter = function () {
  this.clientsCount = this.clientsCount + 1;
};

schemaClub.methods.decreaseClientsCounter = function () {
  this.clientsCount = this.clientsCount - 1;
};

schemaClub.methods.changeStatus = function (status) {
  const states = ['active', 'blocked', 'removed'];
  if (states.includes(status)) {
    this.status = status;
  }
};

schemaClub.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = db.model('Club', schemaClub);