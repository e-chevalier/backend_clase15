import express from 'express'
import { registrationController } from './controllers/registrationController.js'

export const registrationApi = (app, passport) => {

    let router = express.Router()
    app.use('/api/registration', router)

    router.get('/', registrationController.getRegistration)
    router.post('/', passport.authenticate('signup', { failureRedirect: '/api/failure?status_code=900' }),
        registrationController.postRegistration)

}
