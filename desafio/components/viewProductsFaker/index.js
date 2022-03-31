import express from 'express'
import { viewProductsFakerController } from './controllers/viewProductsFakerController.js'
import { auth } from '../../utils/middleware/auth.js'

export const viewProductsFakerApi = (app) => {

    let router = express.Router()
    app.use('/api/productos-test', router)

    router.get('/', auth, viewProductsFakerController.getViewProductsFaker)

}
