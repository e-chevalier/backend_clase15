import { ContenedorFireStore } from "../../containers/ContenedorFireStore.js"
import { db_firestore } from '../../utils/firestore/firestore.js'

class MessagesDaoFireStore extends ContenedorFireStore {

    constructor(){
        super(db_firestore, 'messages')
    }


}

export default MessagesDaoFireStore