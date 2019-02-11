const db = require('../db');

const schemaPromotion = new db.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  club: {
    type: db.Schema.ObjectId,
    require: true,
  },
  created: {
    type: Date,
    require: true,
    default: Date.now
  },
  status: {
    type: String,
    require: true,
    default: 'active',
    match: /^(active|blocked|removed)$/,
  },
});

schemaPromotion.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

schemaPromotion.methods.result = function () {
  const doc = this.toObject();
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
  return doc;
}

module.exports = db.model('Promotion', schemaPromotion);