const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const assert = require('assert');
const flash = require('connect-flash');
require('dotenv').config();

const indexRouter = require('./routes');
const v1 = require('./routes/v1');
const { sequelize } = require('./models');

const passportConfig = require('./passport');

const app = express();
passportConfig(passport);
sequelize.sync();

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false, // session initialize when the session is saved.
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 3600000
  },
  //store: store, // for security
  rolling: true // when user do something (like move page), session will be renewal
});

app.set('port', process.env.PORT || 8001);

///////test/////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
///////test/////////

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(flash());
app.use(helmet.hsts({
  maxAge: 10886400000,
  includeSubDomains: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/v1', v1);

app.listen(app.get('port'), () => {
  console.log(app.get('port'), ' 번 포트에서 대기 중');
})
