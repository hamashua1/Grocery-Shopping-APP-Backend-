import loginModel from '../schema/login.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'




export const postLogin = async(req,res)=>{
    try{
    const {name , email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const results = new loginModel({name,email,password: hashedPassword})
    await results.save()
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