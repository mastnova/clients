const accountSid = 'XXX';
const authToken = 'XXX';
const client = require('twilio')(accountSid, authToken);

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

function invArray(array) {
  if (Object.prototype.toString.call(array) == "[object Number]") {
    array = String(array);
  }
  if (Object.prototype.toString.call(array) == "[object String]") {
    array = array.split("").map(Number);
  }
  return array.reverse();
}

function generate(num) {
  let c = 0;
  const invertedArray = invArray(num);
  for (let i = 0; i < invertedArray.length; i++) {
    c = d[c][p[((i + 1) % 8)][invertedArray[i]]];
  }
  return inv[c];
}

function validate(value) {
  const num = parseInt(value);
  if (!num) return;
  let c = 0;
  const invertedArray = invArray(num);
  for (let i = 0; i < invertedArray.length; i++) {
    c = d[c][p[(i % 8)][invertedArray[i]]];
  }
  return (c === 0);
}

function randomBase() {
  return Math.floor((Math.random() * 899) + 100);
}

function createCode (phone) {
  const base = randomBase();
  const checksum = generate(base);
  const code = '' + base + checksum;

  const matches = phone.match(/\d+/g);
  const phoneNumber = '+' + matches.join('');
  client.messages
    .create({
      body: `Verification code: ${code}`,
      from: '+16502765742',
      to: phoneNumber,
    })
    .done();
}

module.exports = {
  createCode: createCode,
  validateCode: validate,
}
