import express from 'express'
import { postRegister, postSignIn, postLogout } from '../../controllers/loginController.js'
import authenticate from '../../middleware/auth.js'
const router = express.Router()

//endpoints

router.post('/api/login/register', postRegister)
router.post('/api/login/signIn', postSignIn)
router.post('/api/logout', authenticate, postLogout)




export default router




