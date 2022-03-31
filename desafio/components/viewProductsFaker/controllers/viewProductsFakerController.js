import { viewProductsFakerService } from '../services/viewProductsFakerService.js'

class ViewProductsFaker {
    async getViewProductsFaker(req, res, next) {
        let response = await viewProductsFakerService.getViewProductsFaker()
        
        const fakeApi = () => response.data

        res.render('main_faker', {productos: fakeApi(), isEmpty: fakeApi().length? false:true})
    }
    
}

export let viewProductsFakerController = new ViewProductsFaker()
