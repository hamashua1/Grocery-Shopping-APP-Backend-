import mongoose from 'mongoose'
const loginSchema = new mongoose.Schema({
name : {type : String , required :true},
email: {type: String, required : true, unique: true},
password : {type: String, reqired: true, unique : true},
verifyOtp : {type : String, default :''}
})

export default loginSchema;


