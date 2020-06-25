import { Router } from 'express'

import { list, create, read, update, remove, productById } from './../controllers/product.controller'
import { authorize, verifyToken } from './../helpers/authorize'

const router = Router()

router.route('/api/products')
  .get(verifyToken, authorize(['client', 'admin']), list)
  .post(verifyToken, authorize('admin'), create)

router.route('/api/products/:productId')
  .get(verifyToken, authorize(['client', 'admin']), read)
  .put(verifyToken, authorize('admin'), update)
  .delete(verifyToken, authorize('admin'), remove)

router.param('productId', productById)

export default router
