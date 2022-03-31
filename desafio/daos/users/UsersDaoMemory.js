import { ContenedorMemory } from "../../utils/containers/ContenedorMemory.js"

class UsersDaoMemory extends ContenedorMemory {

    constructor(storage = []){
        super()
        this.storage = storage
    }


}

export default UsersDaoMemory