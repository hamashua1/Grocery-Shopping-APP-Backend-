import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from './database/mongodb.js'
import itemRoutes from './routes/item/api.js'
import loginRoutes from './routes/auth/api.js'

const app = express()
connectDB()
app.use(cors())
app.use(cookieParser())
const PORT = process.env.PORT || 8000
app.use(express.json())

// Use routes
app.use(itemRoutes)
app.use(loginRoutes)


app.listen(PORT, ()=> {
    console.log(`server is flying on port ${PORT}`)
})