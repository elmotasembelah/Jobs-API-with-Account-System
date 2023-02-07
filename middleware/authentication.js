const userSchema = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors/index')

const authenticationMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')) 
        throw new UnauthenticatedError ('no token provided')

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {userId, name} = decoded
        req.user = {userId, name} 
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authintication invalid')
    }
}

module.exports = authenticationMiddleWare

