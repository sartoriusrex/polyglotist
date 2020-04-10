require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const origin = {
  origin: isProduction ? 'https://www.polyglotist.com' : '*',
};
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors(origin));
app.use(limiter);
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../dist')));

app.use('/api', router);

// Serve any other file as dist for index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
