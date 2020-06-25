import  mongoose from 'mongoose'

mongoose.Promise = global.Promise;

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
})

export default mongoose.model('Product', ProductSchema)
