import express from 'express'
import { getItems, postItems, deleteItems, deleteCategory, getCategories, getCategoryItems } from '../../controllers/itemController.js'
import authenticate from '../../middleware/auth.js'

const router = express.Router()

router.get('/api/items', authenticate, getItems)
router.post('/api/items', authenticate, postItems)
router.delete('/api/items/category/:name', authenticate, deleteCategory)
router.delete('/api/items/:id', authenticate, deleteItems)
router.get('/api/categories', authenticate, getCategories)
router.get('/api/category/:name', authenticate, getCategoryItems)

export default router
