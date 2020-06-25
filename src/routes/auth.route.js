import { Router } from 'express'
import { logIn, logOut } from './../controllers/auth.controller'

const router = Router()

router.route('/auth/log-in')
  .post(logIn)

router.route('/auth/log-out')
  .post(logOut)

export default router
