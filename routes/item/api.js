import express from 'express'
import { getItems, postItems, deleteItems, deleteCategory, getCategory, getFruits, getVegetables, getMeat, getDrinks } from '../../controllers/itemController.js'
const router = express.Router()

// router endpoints
router.get('/api/items', getItems)
router.post('/api/items', postItems)
router.delete('/api/items/:id', deleteItems)
router.delete('/api/items/category/:id', deleteCategory)
router.get('/api/categories', getCategory)
router.get('/api/category/Fruits', getFruits)
router.get('/api/category/Vegetables', getVegetables)
router.get('/api/category/Meat', getMeat)
router.get('/api/category/Drinks', getDrinks)

export default router

