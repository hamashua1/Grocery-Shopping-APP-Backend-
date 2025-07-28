import itemModel from '../Models/item.js'



export const getItems = async (req,res)=>{
    try{
         const results = await itemModel.find()
         res.status(200).json(results)
    }catch(err){
         res.status(404).json({message:"couldn't fetch response"})
    }
    }

export const postItems = async(req,res)=>{
     try{
     const {name , category , completed} =req.body
     const item = new itemModel ({name, category, completed})
     await item.save()
     res.status(201).json({message:"item added succesfully", item})
     }catch(err){
         res.status(400).json({message:"items not added to database "})
     }
 }

 export const deleteItems = async (req,res)=>{
     try{
     const results = await itemModel.findByIdAndDelete(req.params.id)
     res.status(200).json({message:'deleted successfully', results})
     }catch(err){
         res.status(500).json({message:'item couldnt be deleted' })
     }
 }
 export const deleteCategory = async (req,res)=>{
     try{
     const results = await itemModel.findByIdAndDelete(req.params.id)
     res.status(200).json({message:'deleted successfully', results})
     }catch(err){
         res.status(500).json({message:'category couldnt be deleted' })
     }
 }
 export const getCategory = async(req,res)=> {
     try{
         const results = await itemModel.distinct('category')
         res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'couldnt retrieve category'})
     }
     }

    
export const getFruits = async(req,res)=>{
          try{
          const results= await itemModel.find({category: 'Fruits'})
          res.status(200).json(results)
          }catch(err){
              res.status(404).json({message:'fruits not found'})
          }
      }   
export const getVegetables = async(req,res)=>{
     try{
     const results= await itemModel.find({category: 'Vegetables'})
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'vegetables not found'})
     }
 }      
export const getMeat = async(req,res)=>{
     try{
     const results= await itemModel.find({category: 'Meat'})
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'meat not found'})
     }
 }

 export const getDrinks = async(req,res)=>{
     try{
     const results= await itemModel.find({category: 'Drinks'})
     res.status(200).json(results)
     }catch(err){
         res.status(404).json({message:'drinks not found'})
     }
 }

    
