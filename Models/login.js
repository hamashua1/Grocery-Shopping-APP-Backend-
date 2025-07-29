import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const loginSchema = new mongoose.Schema({
name : {type : String , required :true},
email: {type: String, required : true, unique: true},
password : {type: String, required: true},
verifyOtp : {type : String, default :''},
verifyOtpExpireAt :{ type: Number, default: 0 },
isAccountVerified : {type : Boolean, default: false},
resetOtp : {type: String,default: ''},
resetOtpExpireAt: {type : Number , default: 0}
})

// Add bcrypt pre-save middleware to automatically hash passwords
loginSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Add method to compare passwords
loginSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const loginModel = mongoose.models.login || mongoose.model('login', loginSchema)

export default loginModel






