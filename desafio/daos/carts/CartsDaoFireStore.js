import { ContenedorFireStore } from "../../containers/ContenedorFireStore.js"
import { db_firestore } from '../../utils/firestore/firestore.js'

class CartsDaoFireStore extends ContenedorFireStore {

    constructor(){
        super(db_firestore, 'carts')
    }


}

export default CartsDaoFireStore