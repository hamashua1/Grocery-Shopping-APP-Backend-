import mongoose from 'mongoose'
const loginSchema = new mongoose.Schema({
name : {type : String , required :true},
email: {type: String, required : true, unique: true},
password : {type: String, required: true, unique : true},
verifyOtp : {type : String, default :''},
verifyOtpExpireAt :{ type: Number, default: 0 },
isAccountVerified : {type : Boolean, default: false},
resetOtp : {type: String,default: ''},
resetOtpExpireAt: {type : Number , default: 0}

})

const loginModel = mongoose.models.login || mongoose.model('login', loginSchema)

export default loginModel




