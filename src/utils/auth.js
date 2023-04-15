import pkg from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string'
import bcrypt from'bcryptjs'
const { verify, sign } = pkg;

class Util {
  constructor() {
    this.statusCode = null
    this.type = null
    this.data = null
    this.message = null
  }

  checkPassword(p1, p2) {
    return !bcrypt.compareSync(p1, p2)
  }

  generateJwtToken(userObj) {
    var payload = { user: userObj }
    var newToken = sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION,
    })
    return newToken
  }

  generateToken(length = 64, type = 'url-safe') {
    return cryptoRandomString({ length, type })
  }

  decodeJwt(token) {
    return new Promise((accept, reject) => {
      verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err && err.name === 'JsonWebTokenError') reject('JWT_ERROR')
        else if (err && err.name === 'TokenExpiredError') reject('JWT_ERROR')
        accept(decoded)
      })
    })
  }

  setSuccess(data, statusCode = 200) {
    this.statusCode = statusCode
    this.data = data
    this.type = 'success'
    return this
  }

  send(res) {
    if (this.type === 'success') {
      return res.status(this.statusCode).json(this.data)
    }
    return res.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    })
  }

  static _formatEnumRawValue(val) {
    if (typeof val === 'string') return `'${val}'`
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
    if (typeof val === 'object' && Array.isArray(val))
      return `(${val.map((el) => `'${el}'`).join(', ')})`
    return val ? val : null
  }

  sleep(ms) {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, ms),
    )
  }
}

export default Util