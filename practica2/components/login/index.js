import express from 'express'
import { loginController } from './controllers/loginController.js'

export const loginApi = (app) => {

    let router = express.Router()
    app.use('/api/login', router)

    router.get('/', loginController.getLogin)
    router.post('/', loginController.postLogin)

}
