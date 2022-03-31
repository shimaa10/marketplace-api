const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const OrderLines = mongoose.model("orderLines");

router.put("/cancel_line/:id", (req, res) => { 
    line_id = req.params.id;
    OrderLines.findById(line_id).then((line) => {
        if(!line) {
            return res.status(404).json({msg: "Item not found!"});
        }
        line.state = 'cancelled';
        line.save()
        .then(l => {
          res.send(l);
        });
    });
});

router.put("/ship_line/:id", (req, res) => { 
    line_id = req.params.id;
    OrderLines.findById(line_id).then((line) => {
        if(!line) {
            return res.status(404).json({msg: "Item not found!"});
        }
        line.state = 'shipped';
        line.save()
        .then(l => {
          res.send(l);
        });
    });
});

router.put("/deliver_line/:id", (req, res) => { 
    line_id = req.params.id;
    OrderLines.findById(line_id).then((line) => {
        if(!line) {
            return res.status(404).json({msg: "Item not found!"});
        }
        line.state = 'delivered';
        line.save()
        .then(l => {
          res.send(l);
        });
    });
});

module.exports = router;
