import { usersMemory } from '../../../daos/index.js'

class Login {

    async getLogin(req) {

        try {
            return { status: "OK" }
        } catch (error) {
            console.log(error);
        }

    }

    async postLogin(req) {

        try {
            const { name, password } = req.body
            let response = {}

            const users = await usersMemory.getAll()
            const user = users.find(user => user.name == name)

            if (user && user.password  == password ) {

                if (req.session.counter) {
                    req.session.counter++

                } else {
                    req.session.counter = 0
                    req.session.username = user.name
                }

                response = { status: "OK" }

            } else {
                response = { status: "BAD" }
            }

            return response

        } catch (error) {
            console.log(error);
        }

    }

}

export let loginService = new Login()