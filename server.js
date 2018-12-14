var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const config = require('./config');

app.use(bodyParser.json({ strict: false }));
app.use(express.static(path.join(__dirname, config.get('static-dir'))));

app.use(cookieParser())
// app.use(session({
//   secret: config.get('session:secret'),
//   key: config.get('session:key'),
//   cookie: config.get('session:cookie')
// }));

require('./backend/routes')(app);

const port = process.env.PORT || config.get('port');
app.listen(port, () => {
	console.log(`listening on ${port}...`)
})