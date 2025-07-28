import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
name : {type : String , required :true},
category : {type: String, required : true},
completed : {type: Boolean, required: true}
}, {
timestamps: true  // This automatically adds createdAt and updatedAt fields
})

const itemModel = mongoose.models.item || mongoose.model('item', itemSchema)

export default itemModel;
