
class ContenedorFireStore {

    constructor(db, collectionPath) {
        this.db = db
        this.collectionPath = collectionPath
        //this.collName = collectionName
    }

    /**
     * Métodoque busca el id máximo en el arhivo indicado.
     * @returns 
     */
    async getMaxid() {
        try {
            const snapshot = await this.db.collection(this.collectionPath).orderBy('id', 'desc').limit(1).get()
                .then(data => data.docs.map(prod => ({ id: prod.id, ...prod.data() })))

            let res = snapshot.length ? snapshot[0].id : 0
            
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
            const max = Number(await this.getMaxid())
            await this.db.collection(this.collectionPath).add({ ...obj, id: max + 1}) /*, timestamp: Date.now() */
                .catch(err => console.log(err));

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
            const snapshot = await this.db.collection(this.collectionPath).where('id', '==', Number(id)).get()
                .then(data => data.docs.map(prod => ({ id: prod.id, ...prod.data() })))

            let res = snapshot.length ? snapshot[0] : null
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

            const snapshot = await this.db.collection(this.collectionPath).get()
                .then(data => data.docs.map(prod => ({ id: prod.id, ...prod.data() })))

            return snapshot

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
            const snapshot = await this.db.collection(this.collectionPath).where('id', '==', Number(id)).get()
            snapshot.forEach(doc => doc.ref.delete())

        } catch (error) {
            console.log(error)
        }

    }


    async deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            this.deleteQueryBatch(db, query, resolve);
        });
    }


    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            const query = await this.db.collection(this.collectionPath).orderBy('__name__').limit(25)

            return new Promise((resolve, reject) => {
                this.deleteQueryBatch(this.db, query, resolve).catch(reject);
            })
            
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, prod) {
        try {
            const snapshot = await this.db.collection(this.collectionPath).where('id', '==', Number(id)).get()
            snapshot.forEach(doc => doc.ref.update(prod))

        } catch (error) {
            console.log(error)
        }
    }

}

export { ContenedorFireStore }
