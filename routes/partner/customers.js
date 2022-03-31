const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Customers = mongoose.model("customers");

router.get("/", (req, res, next) => {
    return Customers.find().then((customer) => {
        res.send(customer);
    });
});
router.get('/search/:name', (req, res, next) => {
    Customers.find({ name: new RegExp(req.params.name, 'i') }, (err, result) => {
      if (err) res.sendStatus(400).json(err);
      res.send(result);
    });
});

// TEST: add new address
router.post("/add_address", (req, res) => {
    Customers.findById(req.body.customerId).then((customer) => {
        // check customer existence
        if (!customer)
            res.sendStatus(404).json({ customer: "No customer found!" });
        // Create the address
        Customers.findByIdAndUpdate(
            req.body.customerId,
            {
                $addToSet: {
                    addressBook: {
                        country: req.body.country,
                        street: req.body.street,
                        fullName: req.body.fullName,
                        phone: req.body.phone,
                        landmark: req.body.landmark,
                        building: req.body.building, 
                    },
                },
            },
            { new: true, useFindAndModify: false }
        )
            .exec()
            .then((result) => {
                res.send(result);
            });
        
    });
});

// TEST: Get all customer addresses
router.get("/:customerId", (req, res, next) => {
    return Customers.findById(req.params.customerId).then((customer) => {
        res.send(customer.addressBook);
    });
});


module.exports = router;