import express from 'express'
import { logoutController } from './controllers/logoutController.js'

export const logoutApi = (app) => {

    let router = express.Router()
    app.use('/api/logout', router)

    router.get('/', logoutController.getLogout)
}
