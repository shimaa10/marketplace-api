const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductTags = mongoose.model('productTags');

// Process Add tag
router.post('/', (req, res) => {

  ProductTags.findOne({
    name: req.body.name
  }).then(tag => {
    if(tag){
      return res
            .status(409)
            .json({ email: "Product tag is already Created!" });
    } else {
      const newTag = {
        name: req.body.name,
      }
    
      // Create tag
      new ProductTags(newTag)
        .save()
        .then(tag => {
          // res.redirect(`/${tag.id}`);
          res.send(tag);

        });
    }
  });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  ProductTags.findOne({
    _id: req.params.id
  })
  .then(tag => {

    // New values
    tag.name = req.body.name;

    tag.save()
      .then(tag => {
        res.redirect('/');
      });
  });
});

// Delete tag
router.delete('/:id', (req, res) => {
  ProductTags.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/');
    });
});

module.exports = router;