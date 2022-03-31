const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Orders = mongoose.model("orders");


router.put("/confirm_order/:id", (req, res) => { 
    order_id = req.params.id;
    Orders.findById(order_id).then((order) => {
        if(!order) {
            return res.status(404).json({msg: "Order not found!"});
        }
        order.state = 'confirmed';
        order.save()
        .then(l => {
          res.send(l);
        });
    });
});

router.put("/cancel_order/:id", (req, res) => { 
    order_id = req.params.id;
    Orders.findById(order_id).then((order) => {
        if(!order) {
            return res.status(404).json({msg: "Order not found!"});
        }
        order.state = 'cancelled';
        order.save()
        .then(l => {
          res.send(l);
        });
    });
});

module.exports = router;