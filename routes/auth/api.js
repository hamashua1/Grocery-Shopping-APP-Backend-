import express from 'express'
const router = express.Router()

//endpoints

router.post('/api/login/register', postLogin)
router.post('/api/login/signIn',postSignIn )
router.post('/api/logout', postLogout )




export default router




