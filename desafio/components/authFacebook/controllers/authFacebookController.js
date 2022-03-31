import { authFacebookService } from '../services/authFacebookService.js'

class AuthFacebook {
    async redirect(req, res, next) {
        try {
            let response = await authFacebookService.redirect()
            console.log(req.user)
            res.redirect('/api/main')
            
        } catch (error) {
            console.log(error)
        }

    }

}

export let authFacebookController = new AuthFacebook()
