const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Customers = mongoose.model("customers");

const confirmOrder = require("../../models/Order").confirm;


// Add to cart
// url: /carts
// params: product,qty, customerId,price
router.post("/", (req, res) => {
    console.log("\n>> Add Cart:\n", req.body);

    // check if the product already exists on customer cart if yes just update the qty.
    Customers.findById(req.body.customerId).then((customer) => {
        console.log("ENTER THE First");
        if (!customer)
            res.sendStatus(404).json({ customer: "No customer found!" });
        var cartItem = customer.cart.filter(
            (item) => item.product == req.body.product
        );
        if (cartItem.length > 0) {
            console.log(cartItem[0]._id);
            toUpdate = cartItem[0]._id
            newQty = cartItem[0].qty + parseInt(req.body.qty)
            Customers
                .findOneAndUpdate(
                    {_id:req.body.customerId, "cart._id":toUpdate},
                    { $set: { "cart.$.qty": newQty } },
                    {useFindAndModify: false, new: true}
                )
                .exec()
                .then((result) => res.send(result))
                .catch(err => res.send(err));
        } else {
            Customers.findByIdAndUpdate(
                req.body.customerId,
                {
                    $addToSet: {
                        cart: {
                            product: req.body.product,
                            qty: req.body.qty,
                            price: req.body.price,
                        },
                    },
                },
                { new: true, useFindAndModify: false }
            )
                .exec()
                .then((result) => {
                    res.send(result);
                });
        }
    });
});

// this route here to update just the qty from cart itself.
router.put("/:id", (req, res) => {
    Customers.findOneAndUpdate(
        {"cart._id":req.params.id},
        { $set: { "cart.$.qty": req.body.qty } },
        {useFindAndModify: false, new: true})
    .exec()
    .then((result) => res.send(result))
    .catch(err => res.send(err));
});

router.delete("/:id", (req, res) => {
    console.log("\n>> Delete Cart:\n", req.body);

    Customers.findByIdAndUpdate(
        req.body.customerId,
        {
            $pull: {
                cart: {
                    _id: req.params.id,
                },
            },
        },
        { muti: false }
    )
        .exec()
        .then((result) => res.send(result));
});

router.get("/:customerId", (req, res, next) => {
    return Customers.findById(req.params.customerId).then((customer) => {
        console.log(customer);
        res.send(customer.cart);
    });
});

router.post("/confirm_cart/:customerId", async (req, res) => {
    let custId = req.params.customerId;
    console.log(custId)
    if (custId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("PMS");
        let a = await Customers.findOne({_id: custId})
        if(!a) return res.status(404).json({msg:"Item not found!"});
        console.log(a);
        confirmOrder(a, req.body);
        res.send("Order Created!");
        
    } else {
        console.log("ERROR WITH THE ID");
    }
})

router.post("/wishlist", (req, res) => {
    console.log("\n>> Add WishList:\n", req.body);

    Customers.findByIdAndUpdate(
        req.body.customerId,
        {
            $addToSet: {
                wishlist: {
                    product: req.body.product,
                    qty: req.body.qty,
                    price: req.body.price,
                },
            },
        },
        { new: true, useFindAndModify: false }
    )
        .exec()
        .then((result) => res.send(result));
});

router.delete("/wishlist/:id", (req, res) => {
    Customers.findByIdAndUpdate(
        req.body.customerId,
        {
            $pull: {
                wishlist: {
                    _id: req.params.id,
                },
            },
        },
        { muti: false }
    )
        .exec()
        .then((result) => res.send(result));
});

router.get("/wishlist/:customerId", (req, res, next) => {
    return Customers.findById(req.params.customerId).then((customer) => {
        res.send(customer.wishlist);
    });
});

module.exports = router;
