import express from 'express'
import { viewOneController } from './controllers/viewOneController.js'
import { auth } from '../../utils/middleware/auth.js'

export const viewOneApi = (app) => {

    let router = express.Router()
    app.use('/api/viewOne', router)

    router.get('/', auth, viewOneController.getViewOne)

}
