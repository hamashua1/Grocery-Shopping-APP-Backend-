import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import connectDB from './database/mongodb.js'
import itemRoutes from './routes/item/api.js'
import authRoutes from './routes/auth/api.js'
import emailRoutes from './routes/email/api.js'

const app = express()
connectDB()

// Load Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml')

app.use(cors())
app.use(cookieParser())
const PORT = process.env.PORT || 8000
app.use(express.json())

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// API info route
app.get('/', (req, res) => {
    res.json({
        message: 'Grocery Shopping App Backend API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            authentication: ['/api/login/register', '/api/login/signIn', '/api/logout'],
            passwordReset: ['/api/auth/request-reset', '/api/auth/reset-password'],
            items: ['/api/items', '/api/categories'],
            categories: ['/api/category/Fruits', '/api/category/Vegetables', '/api/category/Meat', '/api/category/Drinks']
        }
    })
})

// Use routes
app.use(itemRoutes)
app.use(authRoutes)
app.use(emailRoutes)


app.listen(PORT, ()=> {
    console.log(`server is flying on port ${PORT}`)
})


