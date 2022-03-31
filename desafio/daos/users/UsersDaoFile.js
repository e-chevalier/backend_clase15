import { ContenedorFile } from "../../utils/containers/ContenedorFile.js"

class UsersDaoFile extends ContenedorFile {

    constructor(){
        super('./DB/users.json')
    }


}

export default UsersDaoFile