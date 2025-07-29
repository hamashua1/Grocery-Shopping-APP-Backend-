import express from 'express'
import { postLogin, postSignIn, postLogout } from '../../controllers/loginController.js'
const router = express.Router()

//endpoints

router.post('/api/login/register', postLogin)
router.post('/api/login/signIn',postSignIn )
router.post('/api/logout', postLogout )




export default router




