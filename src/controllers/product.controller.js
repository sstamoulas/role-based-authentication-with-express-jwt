import _ from 'lodash'
import Product from './../models/product.model'
import errorHandler from './../helpers/dbErrorHandler'
import { userById } from './../controllers/auth.controller'

export const productById = (req, res, next, id) => {
  let query = Product.findById(id)
  .select('name price description')

  query.lean().populate('created_by', "name lastname")

  query.exec((err, product) => {
    if (err || !product){
      return res.status(400).json({
        error: 'Product not found'
      })
    }

    req.product = product
    next()
  })
}

export const create = (req, res, next) => {
  req.body.created_by = req.auth._id
  const product = new Product(req.body)

  product.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.status(200).json({
      message: 'Successfully created product!'
    })
  })
}

export const read = (req, res) => {
  if(req.auth.role !== 'admin') {
    req.product.created_by = undefined
  }

  return res.json(req.product)
}

export const list = (req, res) => {
  Product.find((err, products) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }

    res.json(products)
  })
  .select('name price')
}

export const update = async (req, res, next) => {
  let product = await Product.findOneAndUpdate(req.product, req.body, {
    new: true
  })

  res.json(product)
}

export const remove = async (req, res, next) => {
  let product = await Product.findOneAndDelete(req.product)

  res.json(product)
}
