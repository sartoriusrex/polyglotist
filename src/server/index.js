const express = require('express');
const path = require('path');
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
app.use(express.static(path.join(__dirname, '../../dist')));

app.use('/api', router);

// Serve any other file as dist for index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
