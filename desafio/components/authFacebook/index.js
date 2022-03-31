import express from 'express'
import { authFacebookController } from './controllers/authFacebookController.js'

export const authFacebookApi = (app, passport) => {

    let router = express.Router()
    app.use('/auth/facebook', router)

    router.get('/', passport.authenticate('facebook'))
    router.get('/callback', passport.authenticate('facebook', { successRedirect: '/api/viewOne', failureRedirect: '/api/failure'}))

}
