// main imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");

// import the keys
const keys = require("./config/keys");

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === "production";

// import models schemas
require("./models/User");
require("./models/Seller");
require("./models/Customer");
require("./models/Product");
require("./models/ProductCategory");
require("./models/ProductTag");
require("./models/OrderLine");
require("./models/Order");



require('./config/passport');

//connect to db
mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connected!");
    });

// import routes
const usersRoutes = require("./routes/auth/users");
const productsRoutes = require("./routes/product/products");
const categorisRoutes = require("./routes/product/productCategries");
const tagsRoutes = require("./routes/product/productTags");
const cartRoutes = require("./routes/product/carts");
const orderRoutes = require("./routes/order/orders");
const orderLineRoutes = require("./routes/order/orderLines");
const sellerRoutes = require("./routes/partner/sellers");
const customerRoutes = require("./routes/partner/customers");

// app instance
const app = express();

// <<<=== middlewares section
//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//cors
app.use(cors());

//session
app.use(express.static(path.join(__dirname, "public")));
var sess = {
    secret: "Nutikad-Session",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
};

if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

//errorhandling
if (!isProduction) {
    app.use(errorHandler());
}

//Error handlers & middlewares
if (!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

// end of middlewares ===>>>

//port
const port = (process.env.PORT = process.env.PORT || 5000);

// user routes
app.use("/users", usersRoutes);

app.use("/products", productsRoutes);

app.use("/category", categorisRoutes);

app.use("/tag", tagsRoutes);

app.use("/cart", cartRoutes);

app.use("/order", orderRoutes);

app.use("/orderLine", orderLineRoutes);

app.use("/seller", sellerRoutes);

app.use("/customer", customerRoutes);


//listening
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
