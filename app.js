import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())
const port = 8000
app.use(express.json())














app.listen(port, ()=> {
    console.log(`server is flying on port ${port}`)
})