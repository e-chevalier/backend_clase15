import express from 'express'
import { datosController } from './controllers/datosController.js'

export const datosApi = (app) => {

    let router = express.Router()
    app.use('/datos', router)

    router.get('/', datosController.getDatos)

}
