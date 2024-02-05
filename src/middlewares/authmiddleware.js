import jwt from 'jsonwebtoken'
import User from '../../DB/models/user.model.js'

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers
      
      if (!accesstoken)
        return next(new Error('please login first', { cause: 400 }))

      if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
        return next(new Error('invalid token prefix', { cause: 400 }))

      const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
      const decodedData = jwt.verify(token, process.env.PRIVATE_KEY)

      if (!decodedData || !decodedData.id)
        return next(new Error('invalid token payload', { cause: 400 }))
      const findUser = await User.findById(decodedData.id)
      if (!findUser)
        return next(new Error('please signUp first', { cause: 404 }))
      req.authUser = findUser
      next()
    } catch (error) {
      next(new Error('catch error in auth middleware', { cause: 500 }))
    }
  }
}
