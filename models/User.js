// imports
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Joi = require("joi");

// TODO: Argon2

const Schema = mongoose.Schema;

// user schema
const UsersSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    salt: {
        type: String,
    },
    hash: {
        type: String,
    },
    profile: {
        type: String,
    },
    lastLogin: {
        type: Date,
    },
    date: {
        type: Date,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customers'
    },
    userType:{
        type: String,
        enum: [
            'customer',
            'seller',
            'admin'
        ],
        default: 'customer'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'sellers'
    }
});

// methods
UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
};

UsersSchema.methods.validatePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
};

UsersSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
        {
            email: this.email,
            id: this._id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        },
        "secret"
    );
};

UsersSchema.methods.toAuthJSON = function () {
    res =  {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
        profile: this.profile,
        name: this.userType == 'seller'? this.seller.name : this.customer. name,
        mobile: this.userType == 'seller'? this.seller.mobile : this.customer.mobile 
    };
    return res;
};

UsersSchema.methods.changePassword = passwords => {
    if (this.validatePassword(passwords.oldPassword) && Joi.validate(passwords, {
        newPassword: Joi.string().min(3).max(255).required(),
        confirmPassword: Joi.string().required().valid(passwords.newPassword),
    })) {
        this.setPassword(passwords.newPassword);
        return true;
    }
    return false;
}

const User = mongoose.model("users", UsersSchema);

//function to validate user
function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
        password2: Joi.string().valid(user.password).required(),
        userType: Joi.string().required()
    };

    if(Joi.validate(user, schema)){
        if (user.userType == 'seller'){
            return validateSellerData({
                mobile: user.mobile,
                address: user.address
            })
        }
        return true;
    } 
    return false;
}

function validateSellerData(profileData) {
    return Joi.validate(profileData, {
        mobile: Joi.string().length(10).required(),
        address: Joi.string().required()
    });
}

module.exports.User = User;
module.exports.validate = validateUser;
