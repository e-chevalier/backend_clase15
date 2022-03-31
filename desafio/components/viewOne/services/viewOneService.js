class ViewOne {

    async getViewOne(req) {
        try {

            if (req.isAuthenticated()) {

                if (req.session.counter) {
                    req.session.counter++
                } else {
                    req.session.counter = 1
                }

            } 
                        
            console.log(req.user)
            return { status: "OK", data: {...req.user, counter: req.session.counter} }
        } catch (error) {
            console.log(error);
        }
    }

}

export let viewOneService = new ViewOne()