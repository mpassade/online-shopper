const Cart = require('../models/Carts');
module.exports = {
  createUserCart: (req, res) => {
    let cart = new Cart();
    cart.owner = req.user._id;
    cart.save((error) => {
      if (error) {
        return res
          .status(500)
          .json({ confirmation: 'failure', message: error });
      } else {
        return res.redirect('/api/users');
      }
    });
  }
};