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

// Configure CORS to allow credentials and specific origins
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Add your frontend URL
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

app.use(cookieParser())
app.use(express.json())

// Connect to database with error handling
connectDB().catch(console.error)

// Load Swagger documentation
const swaggerDocument = YAML.load('./swagger.yaml')

const PORT = process.env.PORT || 8000

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


