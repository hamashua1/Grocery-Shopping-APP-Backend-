import itemModel from '../schema/item.js'


getItems = async (req,res)=>{
    try{
         const results = await itemModel.find()
         res.status(200).json(results)
    }catch(err){
         res.status(404).json({message:"couldn't fetch response"})
    }
    }

postItems = async(req,res)=>{
     try{
     const {name , category , completed} =req.body
     const item = new itemModel ({name, category, completed})
     await item.save()
     res.status(201).json({message:"item added succesfully", item})
     }catch(err){
         res.status(401).json({message:"items not added to database "})
     }
 }

 deleteItems = async (req,res)=>{
     try{
     const results = await itemModel.findByIdAndDelete(req.params.id)
     res.status(200).json({message:'deleted successfully', results})
     }catch(err){
         res.status(500).json({message:'item couldnt be deleted' })
     }
 }
 deleteCategory = async (req,res)=>{
     try{
     const results = await itemModel.findByIdAndDelete(req.params.id)
     res.status(200).json({message:'deleted successfully', results})
     }catch(err){
         res.status(500).json({message:'category couldnt be deleted' })
     }
 }
 getCategory = async(req,res)=> {
     try{
         const results = await itemModel.find()
         res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'couldnt retrieve category'})
     }
     }
getFruits = async(req,res)=>{
          try{
          const results= await itemModel.find()
          res.status(200).json(results)
          }catch(err){
              res.status(404).json({message:'fruits not found'})
          }
      }   
getVegetables = async(req,res)=>{
     try{
     const results= await itemModel.find()
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'vegetables not found'})
     }
 }      
getMeat = async(req,res)=>{
     try{
     const results= await itemModel.find()
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'meat not found'})
     }
 }

 getDrinks = async(req,res)=>{
     try{
     const results= await itemModel.find()
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'drinks not found'})
     }
 }

    
