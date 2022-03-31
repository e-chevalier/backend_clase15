import { ContenedorFile } from "../../containers/ContenedorFile.js"

class CartsDaoFile extends ContenedorFile {

    constructor(){
        super('./DB/carts.json')
    }


}

export default CartsDaoFile