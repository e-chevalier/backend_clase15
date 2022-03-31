import { ContenedorMongoDB } from '../../containers/ContenedorMongoDB.js'
import * as modelCarts from '../../models/carts.js'

class CartsDaoMongoDB extends ContenedorMongoDB {

    constructor(){
        super(modelCarts.carts)
    }

}

export default CartsDaoMongoDB