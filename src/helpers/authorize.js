import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

export const generateAccessToken = (user) => {
  return jwt.sign(user.toObject(), process.env.JWT_SECRET)
}

// param roles: string or array of strings
export const authorize = (roles = []) => {
  if (typeof roles === 'string') {
      roles = [roles];
  }

  return [
    // authenticate JWT token and attach auth to request object (req.auth)
    expressJwt({ 
      secret: process.env.JWT_SECRET,
      requestProperty: 'auth' 
    }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.auth.role)) {

          // user's role is not authorized
          return res.status(401).json({ message: 'Unauthorized' });
      }
      
      next();
    }
  ];
}


export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if(typeof bearerHeader !== undefined) {
    const [bearer, bearerToken] = bearerHeader.split(' ')

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
      if(err) return res.sendStatus(403)

      req.auth = authData
      
      next()
    })
  }
  else {
    res.sendStatus(403)
  }
}