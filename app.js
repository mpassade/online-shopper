const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')(session)

const logger = require('morgan');
require('dotenv').config()
require('./lib/passport')

const Category = require('./routes/admin/categories/models/Category')
const {getAllCategories} = require('./routes/admin/categories/utils/getAllCategories')

const userRouter = require('./routes/users/userRoutes');
const adminRouter = require('./routes/admin/adminRoutes')
const productRouter = require('./routes/admin/products/productRoutes')
const cartRouter = require('./routes/carts/cartRoutes')

const cartMiddleware = require('./routes/carts/middleware/cartMiddleware')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(getAllCategories)

app.use(
  session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
          url: process.env.MONGODB_URI,
          mongooseConnection: mongoose.connection,
          autoReconnect: true
      }),
      cookie: {
          secure: false,
          maxAge: 1000 * 60 * 60 * 24
      }
  })
)

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.errors = req.flash('errors')
  res.locals.perrors = req.flash('perrors')
  res.locals.messages = req.flash('messages')
  res.locals.success = req.flash('success')
  next()
})

app.use(cartMiddleware)
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)





mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected')
}).catch(err => {
  console.log(`MongoDB Error: ${err}`)
})

module.exports = app;
