import itemModel from '../Models/item.js'

const VALID_CATEGORIES = ['Fruits', 'Vegetables', 'Meat', 'Drinks']

export const getItems = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
        const skip = (page - 1) * limit

        const filter = { userId: req.user.id }
        const [items, total] = await Promise.all([
            itemModel.find(filter).skip(skip).limit(limit),
            itemModel.countDocuments(filter)
        ])

        res.status(200).json({
            items,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        })
    } catch (err) {
        console.error('Get items error:', err)
        res.status(500).json({ message: "Couldn't fetch items." })
    }
}

export const postItems = async (req, res) => {
    try {
        const { name, category, completed } = req.body

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Item name is required.' })
        }
        if (!category || !VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}.` })
        }
        if (completed === undefined || typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Completed must be a boolean.' })
        }

        const item = new itemModel({ name: name.trim(), category, completed, userId: req.user.id })
        await item.save()
        res.status(201).json({ message: 'Item added successfully.', item })
    } catch (err) {
        console.error('Post item error:', err)
        res.status(500).json({ message: 'Item could not be added.' })
    }
}

export const deleteItems = async (req, res) => {
    try {
        const item = await itemModel.findOne({ _id: req.params.id, userId: req.user.id })
        if (!item) {
            return res.status(404).json({ message: 'Item not found.' })
        }
        await item.deleteOne()
        res.status(200).json({ message: 'Deleted successfully.', item })
    } catch (err) {
        console.error('Delete item error:', err)
        res.status(500).json({ message: "Item couldn't be deleted." })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { name } = req.params
        if (!VALID_CATEGORIES.includes(name)) {
            return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}.` })
        }
        const result = await itemModel.deleteMany({ category: name, userId: req.user.id })
        res.status(200).json({ message: `Deleted ${result.deletedCount} item(s) from ${name}.` })
    } catch (err) {
        console.error('Delete category error:', err)
        res.status(500).json({ message: "Category couldn't be deleted." })
    }
}

export const getCategory = async (req, res) => {
    try {
        const categories = await itemModel.distinct('category', { userId: req.user.id })
        res.status(200).json(categories)
    } catch (err) {
        console.error('Get categories error:', err)
        res.status(500).json({ message: "Couldn't retrieve categories." })
    }
}

export const getCategoryItems = async (req, res) => {
    try {
        const { name } = req.params
        if (!VALID_CATEGORIES.includes(name)) {
            return res.status(400).json({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}.` })
        }
        const items = await itemModel.find({ category: name, userId: req.user.id })
        res.status(200).json(items)
    } catch (err) {
        console.error('Get category items error:', err)
        res.status(500).json({ message: "Couldn't fetch category items." })
    }
}
