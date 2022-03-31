import ProductsDaoFaker from '../../../daos/products/ProductsDaoFaker.js'

const productsDaoFaker = new ProductsDaoFaker()


class ViewProductsFaker {
       
    async getViewProductsFaker() {
        
        productsDaoFaker.createProductsFaker()
        let response = await productsDaoFaker.getAll()

        return { status: "OK", data: response}
    }
 
}

export let viewProductsFakerService = new ViewProductsFaker()