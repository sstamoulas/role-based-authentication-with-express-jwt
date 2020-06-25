import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

import User from './../models/user.model'
import { generateAccessToken } from './../helpers/authorize'

export const userById = async (id) => {
  return await User.findById(id).select('name lastname role').exec()
}

export const logIn = (req, res) => {
  User.findOne({
    'username': req.body.username
  }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: 'User not found'
      })
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({
        error: 'Username and password don\'t match.'
      })
    }

    const token = generateAccessToken(user)

    res.cookie('t', token, {
      expire: new Date() + 9999
    })

    return res.json({
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        username: user.username 
      }
    })
  })
}

export const logOut = (req, res) => {
  res.clearCookie('t')
  return res.status(200).json({
    message: 'logged out'
  })
}
