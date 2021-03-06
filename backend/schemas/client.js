const db = require('../db');
const moment = require('moment');

const schemaClient = new db.Schema({
  phone: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  promotions: {
    type: Array,
    require: true,
    default: [],
  },
  club: {
    type: db.Schema.ObjectId,
    require: true,
  },
  creator: {
    login: {
      type: String,
      require: true,
    },
    avatar: {
      type: Number,
      require: true,
    }
  },
  created: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    require: true,
    default: 'active',
  },
  removed: {
    type: Date
  }
});

schemaClient.methods.addPromotion = function (promotion) {
  this.promotions.push({ ...promotion, date: moment().toString()})
};

schemaClient.methods.hasPromotion = function (id) {
  const currentDay = moment().format('DD.MM.YYYY');
  const promotions = this.promotions.map(promo => ({...promo, date: moment(promo.date).format('DD.MM.YYYY')}));
  const promo = promotions.filter(promo => promo.id === id && promo.date === currentDay)
  return !!promo.length
};

schemaClient.methods.getPromotion = function (id) {
  return this.promotions.find(promo => promo.id === id);
};

schemaClient.methods.changeStatus = function (status) {
  const states = ['active', 'removed'];
  if (states.includes(status)) {
    this.status = status;
    if (status === 'removed') {
      this.removed = Date.now();
    }
  }
};

schemaClient.methods.changeName = function (name) {
  if (name) {
    this.name = name;
  }
};

schemaClient.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = db.model('Client', schemaClient);