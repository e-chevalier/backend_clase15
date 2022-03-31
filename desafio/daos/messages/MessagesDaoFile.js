import { ContenedorFile } from "../../containers/ContenedorFile.js"

class MessagesDaoFile extends ContenedorFile {

    constructor(){
        super('./DB/messages.json')
    }


}

export default MessagesDaoFile