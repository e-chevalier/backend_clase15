import { ContenedorKnex } from "../../containers/ContenedorKnex.js"

class ProductsDaoKnex extends ContenedorKnex {

    constructor(knex_options){
        super(knex_options, 'products')
    }
    
}

export default ProductsDaoKnex