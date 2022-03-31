import { ContenedorFireStore } from "../../containers/ContenedorFireStore.js"
import { db_firestore } from '../../utils/firestore/firestore.js'

class ProductsDaoFireStore extends ContenedorFireStore {

    constructor(){
        super(db_firestore, 'products')
    }


}

export default ProductsDaoFireStore