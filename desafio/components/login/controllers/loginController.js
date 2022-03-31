import { loginService } from '../services/loginService.js'

class Login {

    async getLogin(req, res, next) {
        try {
            let {status, retry} = await loginService.getLogin(req)

            if ( status == "LOGGEDIN" ) {
                res.redirect('/api/viewOne')
            } else {
                res.render('login', {retry: retry})
            }
            
        } catch (error) {
            console.log(error);
        }
    }


    async postLogin(req, res, next) {
        try {
            const { user } = await loginService.postLogin(req)

            res.redirect('/api/viewOne')
            
        } catch (error) {
            console.log(error);
        }
    }

}

export let loginController = new Login()
