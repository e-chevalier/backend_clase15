import fs, { stat } from 'node:fs'

class ContenedorFile {

    constructor(fileName) {
        this.fileName = fileName
    }

    /**
     * Métodoque busca el id máximo en el arhivo indicado.
     * @returns 
     */
    async getMaxid(){
        try {
            const stats = await fs.promises.stat(this.fileName)
            let res = 0

            if(stats.size){
                const elements = await this.getAll()
                // Initial values object with id:0 for empty array case.
                const max = elements.reduce((a,b) => Number(a.id) > Number(b.id) ? a:b, {id: 0} )
                res = Number(max.id)
            } else {
                console.log("getMaxId: ARCHIVO VACIO")
            }
            return res

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Métodoque recibe un objeto, lo guarda en el archivo indicado y retorna el id asignado.
     * @param {*} obj 
     * @returns 
     */
    async save( obj ) {

        try {
            const elements = await this.getAll()
            const max = Number(await this.getMaxid())
            elements.push({...obj, id: max + 1}) /* , timestamp: Date.now() */ 
            await fs.promises.writeFile(this.fileName, JSON.stringify(elements, null, 2))
            return max + 1

        } catch (error) {
            console.log("Error en save method: " + error)
        }
        
    }

    /**
     * Métodoque recibe un ID y devuelve el objeto con ese ID o null si no está.
     * @param {*} id 
     * @returns 
     */
    async getById( id ) {
        try {
            const stats = await fs.promises.stat(this.fileName)
            let res = null

            if(stats.size) {
                const elements = await this.getAll()
                const el = elements.find( el => el.id === id)
                el ? res = el: res = null
            } else {
                console.log("getById: ARCHIVO VACIO")
            }
            return res
            
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Método que retorna un array con los objetos presentese en el archivo indicado.
     * @returns 
     */
    async getAll() {
        try {
            const stats = await fs.promises.stat(this.fileName)
            let res = []

            if( stats.size ) {
                res = JSON.parse( await fs.promises.readFile(this.fileName, 'utf-8'))
            } else {
                console.log("getAll: ARCHIVO VACIO")
            }

            return res

        } catch (error) {
            console.log(error)            
        }
    }

    /**
     * Método que elimina del archivo el objeto indicado en el parametro ID
     * @param {*} id 
     */
    async deleteById( id ) {

        try {
            const elements = await this.getAll()
            await fs.promises.writeFile(this.fileName, JSON.stringify(elements.filter( el => el.id != id), null, 2))
                        
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2))            
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, newElement) {
        try {
            const elements = await this.getAll()
            let index = elements.findIndex(el => el.id == id)
            if ( index >= 0) {
                elements[index] = {...elements[index], ...newElement}
                await fs.promises.writeFile(this.fileName, JSON.stringify(elements, null, 2))
            }  
        } catch (error) {
            console.log(error)   
        }
    }

}

export { ContenedorFile }
