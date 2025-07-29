import loginModel from '../Models/login.js'
import jwt from 'jsonwebtoken'
import { sendResetEmail } from '../services/emailService.js'

export const requestPasswordReset = async (req ,res) => {
   const {email} = req.body
   try{
    const results = await loginModel.findOne({email})
    if(!results) return res.status(404).json({message: 'user not found'})
      const token = jwt.sign({id:results._id}, process.env.JWT_RESET_SECRET, {expiresIn: '1h'})  
      await sendResetEmail(email,token)
      res.status(200).json({message:'password resent sent'})
    }catch(err){
        res.status(500).json({message: 'server error'})
    } 
}


export const resetPassword = async (req,res)=>{
    const {token} = req.params
    const {newPassword} = req.body
    try{
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET)
        const results = await loginModel.findById(decoded.id)
        if (!results) return res.status(404).json({message: 'user not found'})
        results.password = newPassword    
        await results.save()
        res.status(200).json({message : 'new password saved succesfully'})
}catch(err){
    res.status(400).json({message : 'invalid token '})
}
}


