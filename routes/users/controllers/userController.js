const User = require('../models/User')
const {validationResult} = require('express-validator')

module.exports = {
    // register: (req, res, next) => {
    //     const errors = validationResult(req)
    //     if (!errors.isEmpty()){
    //         req.flash('errors', 'Password must be at least 6 characters')
    //         // return res.status(422).json({errors: errors.array()})
    //         return res.redirect('/api/users/register')
    //     }

    //     User.findOne({email: req.body.email})
    //     .then(user => {
    //         if (user){
    //             req.flash('errors', 'User already exists')
    //             return res.redirect('/api/users/register')
    //             // return res.status(401).send('User already exists')
    //         }
    //         const newUser = new User()
    //         newUser.email = req.body.email
    //         newUser.password = req.body.password
    //         newUser.profile.name = req.body.name
            
    //         newUser.save().then(savedUser => {
    //             req.login(savedUser, (err) => {
    //                 if (err){
    //                     return res.status(400).json({confirmation: false, message: err})
    //                 } else {
    //                     res.redirect('/api/users')
    //                 }
    //             })
    //         })
    //     })
    //   }

    register: async(req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(422).json({errors: errors.array()})
        }

        try {
            const { name, email, password } = req.body
            let user = await User.findOne({email})
            // if (user) return res.status(401).json({message: 'User already exists'})
            if (user){
                req.flash('errors', 'User Already Exists')
                return res.redirect('/api/users/register')
            }

            user = await new User({profile: {name}, email, password})
            await user.save()
            await req.login(user, (err) => {
                if (err) return res.status(400).json({confirmation: false, message: err})
                res.redirect(301, '/api/users')
            })

            

    
        } catch (error) {
            return res.status(500).json({message: 'Failed', error})
        }
    },

    updatePassword: (params, id) => {
        return new Promise((resolve, reject) => {
          User.findById(id)
            .then((user) => {
              const { oldPassword, newPassword, repeatNewPassword } = params;
              if (!oldPassword || !newPassword || !repeatNewPassword) {
                reject('All Inputs Must Be Filled');
              } else if (newPassword !== repeatNewPassword) {
                reject('New Password Do Not Match');
              } else {
                bcrypt
                  .compare(oldPassword, user.password)
                  .then((match) => {
                    if (!match) {
                      reject('Password Not Updated');
                    } else {
                      user.password = newPassword;
                      user
                        .save()
                        .then((user) => {
                          resolve(user);
                        })
                        .catch((err) => reject(err));
                    }
                  })
                  .catch((err) => reject(err));
              }
            })
            .catch((err) => reject(err));
        });
      },
}