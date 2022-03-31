import { ContenedorMongoDB } from '../../containers/ContenedorMongoDB.js'
import * as modelMessages from '../../models/messages.js'

class MessagesDaoMongoDB extends ContenedorMongoDB {

    constructor(){
        super(modelMessages.messages)
    }

}

export default MessagesDaoMongoDB