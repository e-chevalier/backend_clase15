import { ContenedorFile } from "../../containers/ContenedorFile.js"

class ProductsDaoFile extends ContenedorFile {

    constructor(){
        super('./DB/productos.json')
    }


}

export default ProductsDaoFile