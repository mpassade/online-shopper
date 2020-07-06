const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../routes/users/models/User');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});

const authenticatePassword = async (req, user, inputPassword, done) => {
    const exists = await bcrypt.compare(inputPassword, user.password)

    if(!exists){
        console.log('Invalid Login')
        return done(null, false, req.flash('errors', 'Check email or password'))
    }

    return done(null, user)
}

const verifyCallback = async (req, email, password, done) => {
    await User.findOne({email}, (err,user) => {
        try {
            if (!user){
                console.log('No user found')
                return done(null, false, req.flash('errors', 'No user found'))
            }
            authenticatePassword(req,user,password,done)
        } catch (error) {
            done(error, null)
        }
    })
}

passport.use(
    'local-login',
    new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    verifyCallback
    )
);