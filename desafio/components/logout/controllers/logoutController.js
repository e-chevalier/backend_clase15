import { logoutService } from '../services/logoutService.js'

class Logout {

    async getLogout(req, res, next) {
        try {
            let response = await logoutService.getLogout(req)
            res.render('logout', {username: response.username})   
        } catch (error) {
            console.log(error);
        }
    }

}

export let logoutController = new Logout()
