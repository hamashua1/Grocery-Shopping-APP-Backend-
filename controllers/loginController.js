import loginModel from '../Models/login.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const postLogin = async(req,res)=>{
    try{
    const {name , email, password } = req.body
    // Remove manual hashing - it's now handled by the model's pre-save middleware
    const results = new loginModel({name,email,password})
    await results.save()
    res.status(201).json({message: 'info added to database', results})
    }catch(err){
        res.status(400).json({message : "couldnt add to database"})
    }
}

export const postSignIn =  async(req,res)=>{
    try{
      const {email, password } = req.body

      const results = await loginModel.findOne({email})
      if(!results){
        return res.status(404).json({message:"email not found"})
      }  
      
      // Use the model's comparePassword method instead of manual bcrypt.compare
      const isPasswordCorrect = await results.comparePassword(password)

      if(!isPasswordCorrect){
        return res.status(404).json({message : 'password mismatch'})
      }  
      const token = jwt.sign({id: results._id}, process.env.JWT_SECRET, {expiresIn :'1h'})
      res.cookie('token', token , 
      {httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
      maxAge: 60 * 60 * 1000})
      res.status(200).json({message: 'sign in successful', results , isPasswordCorrect})
    }
    catch(err){
        res.status(500).json({message: "sign in failed"})
    }
}

export const postLogout = async (req ,res)=>{
    req.session.destroy(err => {
    if (err) return res.status(500).json({message: 'logout failed'})
    res.ClearCookie('token')
        res.status(200).json({message: 'logout successfully'})
    })
}


