const { pbkdf2Sync } = require('crypto')
const { buildResponse } = require('./utils')
const { sign, verify } = require('jsonwebtoken')

function createToken(username, id) {
    const token = sign({ username, id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
        audience: 'serverless'
    })
    console.log('Generated token:', token);

    return token

}


async function authorize(event) {

    const { authorization } = event.headers
    if (!authorization) {
        return buildResponse(401, {
            body: JSON.stringify({ error: 'missing authorization headers' })
        })

    }

    const [type, token] = authorization.split(' ')
    if (type != 'Bearer' || !token) {
        return buildResponse(401, {
            body: JSON.stringify({ error: 'Unsoported authorization type' })
        })
    }

    const decodedToken = verify(token, process.env.JWT_SECRET, {
        audience: 'serverless'
    })

    if (!decodedToken) {
        return buildResponse(401, {
            body: JSON.stringify({ error: 'invalid token' })
        })
    }
    return decodedToken
}

function makeHash(password) {
    return pbkdf2Sync(password, process.env.SALT, 100000, 64, 'sha512').toString('hex');
}

module.exports = {
    authorize,
    createToken,
    makeHash
}