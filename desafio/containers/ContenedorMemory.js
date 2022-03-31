

class ContenedorMemory {

    constructor() {
        this.storage = []
    }

    /**
     * Método que busca el id máximo en el storage
     * @returns 
     */
    async getMaxid() {
        try {
            const max = this.storage.reduce((a, b) => Number(a.id) > Number(b.id) ? a : b, { id: 0 })
            return Number(max.id)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Métodoque recibe un objeto, lo guarda en el storage y retorna el id asignado.
     * @param {*} newElement 
     * @returns 
     */
    async save(newElement) {

        try {
            const max = Number(await this.getMaxid())
            this.storage.push({ ...newElement, id: max + 1 }) /*, timestamp: Date.now()*/
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
    async getById(id) {
        try {
            const element = this.storage.find(e => e.id === Number(id))
            return element ? element : null

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Método que retorna un array con los objetos presentes en el storage.
     * @returns 
     */
    async getAll() {
        try {
            return this.storage
        } catch (error) {
            console.log(error)
        }
    }

    
    /**
     * Método que elimina del storage el objeto indicado en el parametro ID
     * @param {*} id 
     * @returns old index on storage - -1 Fail, >=0 Success
     */

    async deleteById(id) {

        try {
            let index = this.storage.findIndex(e => e.id === Number(id))

            if (index >= 0) {
                this.storage.splice(index, 1)
            }

            return index

        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            this.storage.length = 0
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, newElement) {
        try {
            let index = this.storage.findIndex(e => e.id === Number(id))
            if (index >= 0) {
                this.storage[index] = {...this.storage[index], ...newElement}
            }
        } catch (error) {
            console.log(error)
        }
    }

}

export { ContenedorMemory }
