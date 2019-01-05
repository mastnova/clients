var express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config');

app.use(bodyParser.json({ strict: false }));
app.use(express.static(path.join(__dirname, config.get('static-dir'))));

app.use(cookieParser())

require('./backend/routes')(app);

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, config.get('static-dir'), 'index.html'));
});


const port = config.get('port');
app.listen(port, () => {
	console.log(`listening on ${port}...`)
})