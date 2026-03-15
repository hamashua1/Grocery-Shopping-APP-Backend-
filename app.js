import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import connectDB from './database/mongodb.js'
import itemRoutes from './routes/item/api.js'
import authRoutes from './routes/auth/api.js'
import emailRoutes from './routes/email/api.js'

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

app.use(cookieParser())
app.use(express.json())

// Rate limiter for auth and password reset endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
})

app.use('/api/login/signIn', authLimiter)
app.use('/api/login/register', authLimiter)
app.use('/api/auth/request-reset', authLimiter)
app.use('/api/auth/reset-password', authLimiter)

connectDB().catch(console.error)

const swaggerDocument = YAML.load('./swagger.yaml')

const PORT = process.env.PORT || 8000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
    res.json({
        message: 'Grocery Shopping App Backend API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            authentication: ['/api/login/register', '/api/login/signIn', '/api/logout'],
            passwordReset: ['/api/auth/request-reset', '/api/auth/reset-password/:token'],
            items: ['/api/items', '/api/categories'],
            categories: ['/api/category/:name']
        }
    })
})

app.use(itemRoutes)
app.use(authRoutes)
app.use(emailRoutes)

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
