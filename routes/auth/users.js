//imports
const mongoose = require("mongoose");
// const gravatar = require("gravatar");
const passport = require("passport");
const router = require("express").Router();
const auth = require("./auth");
// const Users = mongoose.model("Users");

const Users = require("../../models/User").User;
const Sellers = require("../../models/Seller").Seller;
const Customers = require("../../models/Customer").customers;
const validate = require("../../models/User").validate;

//import validator
// const validateRegisterInput = require("../../validation/register");

// //user model
// const User = mongoose.model("users");

// //register
// router.post("/register", (req, res) => {
//     const { errors, isValid } = validateRegisterInput(req.body);

//     // check validation
//     if (!isValid) {
//         return res.status(400).json(errors);
//     }
//     User.findOne({ email: req.body.email }).then((user) => {
//         if (user) {
//             errors.email = "Email already Exist";
//             return res.status(400).json(errors);
//         } else {
//             const avatar = gravatar.url(req.body.email, {
//                 s: "200",
//                 r: "r",
//                 d: "mm",
//             });
//             //get registiration data
//             const newUser = {
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 email: req.body.email,
//                 password: req.body.password,
//             };

//             //create new user
//             new User(newUser).save().then((user) => {
//                 res.send(user);
//             });
//         }
//     });
// });

//POST new user route (optional, everyone has access)
router.post("/", auth.optional, (req, res) => {
    const userData = req.body;

    // if (!user.email) {
    //     return res.status(422).json({
    //         errors: {
    //             email: "is required",
    //         },
    //     });
    // }

    // if (!user.password) {
    //     return res.status(422).json({
    //         errors: {
    //             password: "is required",
    //         },
    //     });
    // }

    // console.log(user);
    // validate the request body first
    const { error } = validate(userData);
    if (error) return res.status(400).send(error.details[0].message);

    Users.findOne({
        email: userData.email,
    }).then((user) => {
        if (user) {
            return res
                .status(409)
                .json({ email: "Email is already registered!" });
        } else {
            const finalUser = new Users(userData);

            finalUser.setPassword(userData.password);
            finalUser.save().then((userNew) => {
                userData.name =
                    (userData.firstName || "") +
                    " " +
                    (userData.lastName || "");
                userData.user = userNew._id;
                if (userNew.userType == "seller") {
                    new Sellers(userData).save().then((seller) => {
                        Users.updateOne(
                            { _id: userNew._id },
                            {
                                seller: seller._id,
                                profile: seller._id,
                            },
                            { useFindAndModify: false },
                            function (err, doc) {
                                if (err) return res.send(500, { error: err });
                                console.log(doc);
                                Users.findById(userNew._id).then(ru => res.json({ user: ru.toAuthJSON() }));
                            }
                        );
                    });
                } else if (userNew.userType == "customer") {
                    new Customers(userData).save().then((customer) => {
                        Users.updateOne(
                            { _id: userNew._id },
                            {
                                customer: customer._id,
                                profile: customer._id,
                            },
                            { useFindAndModify: false },
                            function (err, doc) {
                                if (err) return res.send(500, { error: err });
                                console.log(doc);
                                Users.findById(userNew._id).then(ru => res.json({ user: ru.toAuthJSON() }));
                            }
                        );
                    });
                }
            });
        }
    });
});

//POST login route (optional, everyone has access)
router.post("/login", auth.optional, (req, res, next) => {
    const user = req.body;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: "is required",
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: "is required",
            },
        });
    }

    return passport.authenticate(
        "local",
        { session: false },
        (err, passportUser, info) => {
            if (err) {
                return next(err);
            }

            if (passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();

                return res.json({ user: user.toAuthJSON() });
            }
            return res.status(400).send(info);
        }
    )(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get("/current", auth.required, (req, res, next) => {
    const user_id = req.payload.id;

    return Users.findById(user_id).then((user) => {
        if (!user) {
            return res.sendStatus(400);
        }

        return res.json({ user: user.toAuthJSON() });
    });
});

//POST change password, required
router.post("/password", auth.required, (req, res) => {
    const user_id = req.payload.id;
    Users.findById(user_id).then((user) => {
        if (!user) {
            res.sendStatus(400);
        } else {
            user.changePassword(req.body).then((isDone) => {
                if (isDone) {
                    return res.sendStatus(200);
                }
                return res.sendStatus(401);
            });
        }
    });
});

//TODO: Blacklisted tokens
//GET user logout, required
router.get("/logout", auth.required, (req, res, next) => {
    req.logout();
    res.sendStatus(200);
});

// deactivate user
router.get("/deactivate", auth.required, (req, res, next) => {});

// reset password || forget password

//edit user
router.put("/", auth.required, (req, res, next) => {
    const userData = req.body;
    Users.update(userData).then((err, user) => {
        if (err) res.status(400).send(err);
        return res.send(user.toAuthJSON());
    });
    // TODO: update functionality
});

module.exports = router;
