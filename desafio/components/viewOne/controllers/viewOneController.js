import { viewOneService } from '../services/viewOneService.js'

class ViewOne {
    async getViewOne(req, res, next) {
        
        try {
            let { status, data } = await viewOneService.getViewOne(req)
            res.render('main', data )
        } catch (error) {
            console.log(error);
        }
    }

}

export let viewOneController = new ViewOne()
