
class Registration {

    async getRegistration() {
        try {

            return { status: "OK" }
            
        } catch (error) {
            console.log(error)
        }
    }

    async postRegistration(req) {
        try {

            let response = { status: 'OK' }
            return response

        } catch (error) {
            console.log(error)
        }
    }

}

export let registrationService = new Registration()