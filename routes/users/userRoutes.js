const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('./models/User')
const {check, validationResult} = require('express-validator')
const {
  register, updatePassword
} = require('./controllers/userController')
const userValidation = require('./middleware/userValidation')
const {checkLogin, validateLogin} = require('./middleware/checkLogin')

const checkPassword = [
  check('oldPassword', 'Please include a valid password').isLength({min: 6}),
  check('newPassword', 'Please include a valid password').isLength({min: 6}),
  check('repeatNewPassword', 'Please include a valid password').isLength({min: 6})
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  res.render('main/home');
});



router.post(
  '/register', 
  userValidation,
  register
)

router.get('/register', (req, res) => {
  if (req.isAuthenticated()){
    return res.redirect('/api/users')
  }
  res.render('auth/register')
})

router.get('/login', (req, res) => {
  if (req.isAuthenticated()){
    return res.redirect('/api/users')
  }
  return res.render('auth/login')
})

router.post(
  '/login', 
  checkLogin,
  validateLogin,
  passport.authenticate('local-login', {
  successRedirect: '/api/users',
  failureRedirect: '/api/users/login',
  failureFlash: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/api/users/login')
})

router.get('/profile', (req,res) => {
  res.render('auth/profile')
})

router.get('/update-profile', (req, res) => {
  return res.render('auth/update-profile')
})

router.put('/update-password', checkPassword, (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()})
  }
  try {
    updatePassword(req.body, req.user._id)
    .then(() => {
      return res.redirect('/api/users/profile')
    })
    .catch(err => {
      console.log(err)
      req.flash('errors', 'Unable to update user')
      return res.redirect('/api/users/update-profile')
    })
  } catch (error) {
    console.log(error)
  }
})
module.exports = router;
