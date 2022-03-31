import { ContenedorMemory } from "../../containers/ContenedorMemory.js"
import faker from 'faker'

class ProductsDaoFaker extends ContenedorMemory {

    constructor(storage = []){
        super()
        this.storage = storage
    }

    createProductsFaker = (qty = 5) => {
    
        this.storage.length = 0

        for (let i = 0; i < qty; i++) {
            let prod = {
                id: i + 1,
                title: faker.commerce.productName(),
                price: faker.commerce.price(),
                thumbnail: `${faker.image.food(32,32,true)}`
            }
    
            this.storage.push(prod)
        }
    }

}

export default ProductsDaoFaker