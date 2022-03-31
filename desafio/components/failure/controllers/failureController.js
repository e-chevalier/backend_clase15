import { failureService } from '../services/failureService.js'

class Failure {
    async getFailure(req, res, next) {
        try {
            let {status, message} = await failureService.getFailure(req)

            res.render('failure', { message_status: message })

        } catch (error) {
            console.log(error)
        }

    }

}

export let failureController = new Failure()
