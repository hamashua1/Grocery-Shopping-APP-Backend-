import express from 'express'
import { getItems, postItems, deleteItems, deleteCategory, getCategory, getFruits, getVegetables, getMeat, getDrinks } from '../../controllers/itemController.js'
const router = express.Router()



// router fot GET endpoint
router.get('/api/items', getItems)



//route for POST endpoints
router.post('/api/items', postItems)


//route for delete endpoints
router.delete('/api/items/:id', deleteItems)

//route for delete endpoints
router.delete('/api/items/category/:id', deleteCategory)



//route for get endpoints
router.get('/api/categories', getCategory)


//route for get fruits
router.get('/api/category/Fruits',getFruits)

//route for get vegetables
router.get('/api/category/Vegetables', getVegetables )

//route for get meat
router.get('/api/category/Meat', getMeat)

//route for get drinks
router.get('/api/category/Drinks', getDrinks)

export default router

