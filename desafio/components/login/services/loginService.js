class Login {

    async getLogin(req) {

        try {
            let response = {}

            const {retry} = req.query

            if (req.isAuthenticated()) {
                console.log("Usuario logueado")
                response = { status: "LOGGEDIN" }
            } else {
                console.log("Usuario no logueado")
                response = { status: "NOTLOGGEDIN", retry: retry }
            }

            return response

        } catch (error) {
            console.log(error);
        }

    }

    async postLogin(req) {

        try {
            
            let response = {status: 'OK', user: req.user}

            return response

        } catch (error) {
            console.log(error);
        }

    }

}

export let loginService = new Login()