
class AuthFacebook {

    async redirect() {
        try {
            console.log(`test`)
            // LOGIC HERE

            return { status: "OK" }
        } catch (error) {
            console.log(error)
        }
    }

}

export let authFacebookService = new AuthFacebook()