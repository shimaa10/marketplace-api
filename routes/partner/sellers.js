const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Sellers = mongoose.model("sellers");

router.get("/", (req, res, next) => {
    return Sellers.find().then((seller) => {
        res.send(seller);
    })
});

router.get('/search/:name', (req, res, next) => {
    Sellers.find({ name: new RegExp(req.params.name, 'i') }, (err, result) => {
      if (err) res.sendStatus(400).json(err);
      res.send(result);
    });
  });


module.exports = router;