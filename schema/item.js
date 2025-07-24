import mongoose from 'mongoose'
const itemSchema = new mongoose.Schema({
id : {type : mongoose.Schema.Types.Mixed, required: true, unique: true },
name : {type : String , required :true},
category : {type: String, required : true},
completed : {type: Boolean, required: true},
createdAt : {type : Date, required : true}
})

const itemModel = mongoose.models.item || mongoose.model('item', itemSchema)

export default itemModel;
