const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(cookieParser());
app.use(express.static('dist'));

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}!`));
