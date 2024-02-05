import {
  Schema,
  model
} from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 15,
    max: 100
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  phone: Number,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const User = model('User', userSchema)

export default User