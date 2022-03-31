const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Products = mongoose.model('products');

// Process Add Product
router.post('/', (req, res) => {
  productData = req.body;

  Products.findOne({
    code: productData.code
  }).then((product) => {
    if (product) {
      return res
        .status(409)
        .json({ email: "Product Code is already exists!" });
    } else {
      const newProduct = {
        name: req.body.name,
        category: req.body.category,
        img: req.body.img,
        price: req.body.price,
        code: req.body.code,
        weight: req.body.weight,
        dimension: req.body.dimension,
        // other thing is to add the review part
      }

      // Create Product
      new Products(newProduct)
        .save()
        .then(product => {
          // res.redirect(`/${product.id}`);
          res.send(product);
        });
    }
  });
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Products.findOne({
    _id: req.params.id
  })
    .then(product => {

      // New values
      product.name = req.body.name;
      product.category = req.body.category;
      product.img = req.body.img;
      product.price = req.body.price;
      product.code = req.body.code;
      product.weight = req.body.weight;
      product.dimension = req.body.dimension;
      product.seller = req.body.seller;

      product.save()
        .then(product => {
          res.send(product);
        });
    });
});

// Delete Product
router.delete('/:id', (req, res) => {
  Products.remove({ _id: req.params.id })
    .then(() => {
      res.send('Nothing');
    });
});


router.get('/', (req, res, next) => {
  return Products.find().then((product) => {
    console.log(product);
    res.send(product);
  });
});

router.get('/search/:name', (req, res, next) => {
  Products.find({ name: new RegExp(req.params.name, 'i') }, (err, result) => {
    if (err) res.sendStatus(400).json(err);
    res.send(result);
  });
});

router.get('/sellers/:sellerId', (req, res, next) => {
  return Products.find({
    seller: req.params.sellerId
  }).then((product) => {
    res.send(product);
  });
});

router.get('/categories/:categoryId', (req, res, next) => {
  return Products.find({
    category: req.params.categoryId
  }).then((product) => {
    res.send(product);
  });
});

router.get('/tags/:tagId', (req, res, next) => {
  return Products.find({
    tag: req.params.tagId
  }).then((product) => {
    res.send(product);
  });
});


module.exports = router;