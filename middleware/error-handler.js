const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, please try again later",
    };

    if (err.code && err.code === 11000) {
        customError.statusCode = 400;
        customError.msg = `Duplicate value enterd for ${Object.keys(
            err.keyValue
        )} field, please choose another value`;
    }

    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === "CastError") {
        customError.msg = `No item found with the id : ${err.value}, please try another id`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
