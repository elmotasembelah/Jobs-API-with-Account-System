const userSchema = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
    const newUser = await userSchema.create(req.body);
    const token = newUser.createJWT();
    res.status(StatusCodes.CREATED).json({ token, user: newUser.username });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError("please provide an email and a password");

    const user = await userSchema.findOne({ email });
    if (!user) throw new UnauthenticatedError("wrong email");

    const isPasswordCorrect = user.comparePasswords(password);
    if (!isPasswordCorrect) throw new UnauthenticatedError("wrong passowrd");

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ username: user.username, token });
};

module.exports = {
    register,
    login,
};
