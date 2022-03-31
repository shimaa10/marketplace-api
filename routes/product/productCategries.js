const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Categories = mongoose.model('productCategories');

// Process Add Category
router.post('/', (req, res) => {

  Categories.findOne({
    name: req.body.name
  }).then(category => {
    if(category){
      return res
            .status(409)
            .json({ email: "Product Category is already Created!" });
    } else {
      const newCategory = {
        name: req.body.name,
        parentCategory: req.body.parentCategory,
      }
    
      // Create Category
      new Categories(newCategory)
        .save()
        .then(category => {
          // res.redirect(`/${category.id}`);
          res.send(category);

        });
    }
  });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Categories.findOne({
    _id: req.params.id
  })
  .then(category => {

    // New values
    category.name = req.body.name;
    category.parentCategory = req.body.parentCategory;

    category.save()
      .then(category => {
        res.redirect('/');
      });
  });
});

// Delete Category
router.delete('/:id', (req, res) => {
  Categories.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/');
    });
});


router.get('/', (req, res, next) => {
  return Categories.find().then((category) => {
    res.send(category);
  });
});

module.exports = router;