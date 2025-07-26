import express from 'express'
const router = express.Router()




//post endpoints

router.post('/api/login/register', postLogin)
router.post('/api/login/signIn',postSignIn )




export default router




