require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    }
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../dist')));

app.use('/api', router);

// Serve any other file as dist for index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
