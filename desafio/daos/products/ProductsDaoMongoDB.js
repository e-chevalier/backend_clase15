import { ContenedorMongoDB } from '../../containers/ContenedorMongoDB.js'
import * as modelProducts from '../../models/products.js'

class ProductsDaoMongoDB extends ContenedorMongoDB {

    constructor(){
        super(modelProducts.products)
    }

}

export default ProductsDaoMongoDB