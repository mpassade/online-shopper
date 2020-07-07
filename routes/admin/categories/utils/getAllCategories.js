const Category = require('../models/Category')

module.exports = {
    getAllCategories: (req, res, next) => {
        Category.find({}, (err, categories) => {
          if (err) return next(err)
        //   console.log(categories)
          res.locals.categories = categories
          next()
        })
      }
}