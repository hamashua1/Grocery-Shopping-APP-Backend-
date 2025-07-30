import express from 'express'
import {requestPasswordReset,resetPassword} from '../../controllers/emailController.js'
const router = express.Router()

router.post('/api/auth/request-reset', requestPasswordReset)
router.post('/api/auth/reset-password/:token', resetPassword)

export default router
  