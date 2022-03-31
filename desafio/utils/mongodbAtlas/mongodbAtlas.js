import mongoose from "mongoose"
import { config } from '../../config/mongodbAtlas.js'

const DB_PASS = config.db_pass
const DB_DOMAIN = config.db_domain
const DB_NAME = config.db_name
const DB_USER = config.db_user

const connectMongodbAtlas = async () => {
    try {
        const URL = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority`
        const options = { useNewUrlParser: true, useUnifiedTopology: true }
        await mongoose.connect(URL, options)
        console.log('MongoDB connected!!')
    } catch (err) {
        console.log('Failed to connect to MongoDB', err)
    }
}

export { connectMongodbAtlas }