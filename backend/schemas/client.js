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
    type: String,
    require: true,
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

schemaClient.methods.addPromotion = function (promotion) {
  this.promotions.push({ ...promotion, date: moment().toString()})
};

schemaClient.methods.hasPromotion = function (id) {
  const currentDay = moment().format('DD.MM.YYYY');
  const promotions = this.promotions.map(promo => ({...promo, date: moment(promo.date).format('DD.MM.YYYY')}));
  const promo = promotions.filter(promo => promo.id === id && promo.date === currentDay)
  return !!promo.length
};

schemaClient.methods.changeStatus = function (status) {
  const states = ['active', 'removed'];
  if (states.includes(status)) {
    this.status = status;
  }
};

schemaClient.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = db.model('Client', schemaClient);