import mongoose from 'mongoose'
const itemSchema = new mongoose.Schema({
id : {type : mongoose.Schema.Types.Mixed, required: true, unique: true },
name : {type : String , required :true},
category : {type: String, required : true},
completed : {type: Boolean, reqired: true},
createdAt : {type : Date, required : true}
})

export default itemSchema;
