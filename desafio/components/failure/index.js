import express from 'express'
import { failureController } from './controllers/failureController.js'

export const failureApi = (app) => {

    let router = express.Router()
    app.use('/api/failure', router)

    router.get('/', failureController.getFailure)

}
