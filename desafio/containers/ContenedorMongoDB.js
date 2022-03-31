
class ContenedorMongoDB {

    constructor(db_collection) {
        this.db = db_collection
    }

    /**
     * Métodoque busca el id máximo en el arhivo indicado.
     * @returns 
     */
    async getMaxid() {
        try {
            let tmp = await this.db.find({}, { 'id': 1, '_id': 0 }).sort({ id: -1 }).limit(1)
            let res = tmp.length ? tmp[0].id : 0
            console.log(res)
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
    async save(obj) {

        try {
            //console.log(obj)
            const max = Number(await this.getMaxid())
            await this.db.create({ ...obj, id: max + 1}) /* , timestamp: Date.now()  */
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
            let tmp = await this.db.find({ 'id': id }, { '_id': 0, '__v': 0 })

            let res = tmp.length ? tmp[0] : null
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

            let res = await this.db.find({}, { '_id': 0, '__v': 0 }).lean()
            return res

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Método que elimina del archivo el objeto indicado en el parametro ID
     * @param {*} id 
     */
    async deleteById(id) {

        try {
            await this.db.deleteOne({ 'id': id })
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            await this.db.deleteMany({})
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, prod) {
        try {
            await this.db.findOneAndUpdate({ 'id': id }, prod)
        } catch (error) {
            console.log(error)
        }
    }

}

export { ContenedorMongoDB }
