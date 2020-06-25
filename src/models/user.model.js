import  mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import roles from './../helpers/roles'

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 128,
    required: true,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  age: {
    type: Number,
    minimum: 0,
  },
  role: {
    type: String,
    default: 'client',
    enum: roles,
  }
})

UserSchema.methods = {
  authenticate: function(plainText) {
    return bcrypt.compareSync(plainText, this.password)
  }
}

UserSchema.pre('save', function(next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    this.password = bcrypt.hashSync(this.password, salt)

    return next()
  } catch (error) {
    return next(error)
  }
})

export default mongoose.model('User', UserSchema)
