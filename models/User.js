const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide a username"],
        minLengh: 3,
        maxLengh: 50,
    },
    email: {
        type: String,
        required: [true, "please provide an email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "please provide valid email",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        minLengh: 3,
        maxLengh: 50,
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
    createtoken;
};

userSchema.methods.comparePasswords = function (inputPassword) {
    const isMatch = bcrypt.compare(inputPassword, this.password);
    return isMatch;
};
module.exports = mongoose.model("user", userSchema);
