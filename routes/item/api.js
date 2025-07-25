import express from 'express'
import itemModel from '../../schema/item.js'
const router = express.Router()



// router fot GET endpoint
router.get('/api/items', async (req,res)=>{
try{
     const results = await itemModel.find()
     res.status(200).json(results)
}catch(err){
     res.status(404).json({message:"couldn't fetch response"})
}
})


//route for POST endpoints
router.post('/api/items', async(req,res)=>{
    try{
    const {name , category , completed} =req.body
    const item = new itemModel ({name, category, completed})
    await item.save()
    res.status(201).json({message:"item added succesfully", item})
    }catch(err){
        res.status(401).json({message:"items not added to database "})
    }
})


//route for delete endpoints
router.delete('/api/items/:id', async (req,res)=>{
    try{
    const results = await itemModel.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'deleted successfully', results})
    }catch(err){
        res.status(500).json({message:'item couldnt be deleted' })
    }
})


//route for delete endpoints
router.delete('/api/items/category/:id', async (req,res)=>{
    try{
    const results = await itemModel.findByIdAndDelete(req.params.id)
    res.status(200).json({message:'deleted successfully', results})
    }catch(err){
        res.status(500).json({message:'category couldnt be deleted' })
    }
})



//route for get endpoints
router.get('/api/categories', async(req,res)=> {
try{
    const results = await itemModel.find()
    res.status(200).json(results)
}catch(err){
    res.status(404).json({message:'couldnt retrieve category'})
}
})


//route for get fruits
router.get('/api/category/Fruits', async(req,res)=>{
    try{
    const results= await itemModel.find()
    res.status(200).json(results)
    }catch(err){
        res.status(404).json({message:'fruits not found'})
    }
})

//route for get vegetables
router.get('/api/category/Vegetables', async(req,res)=>{
    try{
    const results= await itemModel.find()
    res.status(200).json(results)
    }catch(err){
        res.status(404).json({message:'vegetables not found'})
    }
})

//route for get meat
router.get('/api/category/Meat', async(req,res)=>{
    try{
    const results= await itemModel.find()
    res.status(200).json(results)
    }catch(err){
        res.status(404).json({message:'meat not found'})
    }
})

//route for get drinks
router.get('/api/category/Drinks', async(req,res)=>{
    try{
    const results= await itemModel.find()
    res.status(200).json(results)
    }catch(err){
        res.status(404).json({message:'meat not found'})
    }
})

export default router

