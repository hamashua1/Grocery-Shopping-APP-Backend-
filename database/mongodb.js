//connection to database

import mongoose from 'mongoose'
const connectDB = async ()=> {
    
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
        await mongoose.connect(`${mongoURI}/grocesory-shop`)
        console.log('MongoDB Connected Successfully')
}
export default connectDB


