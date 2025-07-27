import loginModel from '../schema/login.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'




export const postLogin = async(req,res)=>{
    try{
    const {name , email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const results = new loginModel({name,email,password: hashedPassword})
    await results.save()
    const token = jwt.sign({id: results._id}, process.env.JWT_SECRET, {expiresIn :'1hr'})
    res.cookie('token', token , 
    {httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
    maxAge: 60 * 60 * 1000})
    res.status(201).json({message: 'info added to database', results})
    }catch(err){
        res.status(400).json({message : "couldnt add to database"})
    }
}

export const postSignIn =  async(req,res)=>{
    try{
      const {email, password } = req.body
      const results = new loginModel({email,password})
      await results.save()
    }catch(err){
        res.status(400).json({message: "sign in failed"})
    }
}