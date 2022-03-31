class Logout {

    async getLogout(req) {

        try {

            let username = req.user?.username

            if (req.session) {

                req.logOut()

                req.session.destroy(error => {
                    if (!error) {
                        //res.json({ status: "Logout OK" })
                        console.log(`{ status: "Logout OK - ${username}" }`)

                    } else {
                        //res.json({ status: "Logout Error", body: error })
                        console.log(`{ status: "Logout Error - ${username}", body: error }`)
                    }
                })
            }

            return { status: "OK" , username: username}

        } catch (error) {
            console.log(error);
        }

    }


}

export let logoutService = new Logout()