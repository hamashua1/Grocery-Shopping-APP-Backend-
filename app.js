import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"
import 'dotenv/config'
import connectDB from './database/mongodb.js'
import itemModel from './schema/item.js'
import loginModel from './schema/login.js'
import itemRoutes from './routes/item/api.js'

const app = express()
connectDB()
app.use(cors())
app.use(cookieParser())
const port = process.env.port || 8000
app.use(express.json())

// Use routes
app.use(itemRoutes)


app.listen(port, ()=> {
    console.log(`server is flying on port ${port}`)
})