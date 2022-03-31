import express from 'express'
import { loginController } from './controllers/loginController.js'

export const loginApi = (app, passport) => {

    let router = express.Router()
    app.use('/api/login', router)

    router.get('/', loginController.getLogin)
    router.post('/', passport.authenticate('login', { failureRedirect: '/api/login?retry=1'}), loginController.postLogin)
}
