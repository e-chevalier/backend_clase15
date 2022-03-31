import { Database } from '../config/databaseKnex.js'
import { dataProducts } from '../config/mockups_data.js'

class ContenedorKnex {

    static db_knex

    constructor(knex_options, table_name) {

        this.knex_options = knex_options
        this.table_name = table_name
        this.db_knex = knex_options.client === 'mysql' ? new Database(knex_options).clientMysql : new Database(knex_options).clientSqlite3
    
    }

    insertData = async (table_name, data) => {
        try {
            
            let existsTable = await this.db_knex.schema.hasTable(table_name);
            if (existsTable) {
                await this.db_knex.from(table_name).insert(data);
            } else {
                console.log("TABLE DONT EXISTS " + table_name)
            }

        } catch (error) {
            console.log(error);
        }
    }

    createTableProducts = async () => {
        try {
            let existsTable = await this.db_knex.schema.hasTable("products");
            if (!existsTable) {
                await this.db_knex.schema.createTable("products", table => {
                    //table.bigincrements("_id").primary(),
                        table.bigInteger("id").unique(),
                        table.string("title", 100),
                        table.float("price"),
                        table.string("thumbnail", 450)
                });
                await this.insertData('products', dataProducts)
            } else {
                console.log(`Esta tabla ya existe: products`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    /**
    * Métodoque busca el id máximo en el arhivo indicado.
    * @returns 
    */
    async getMaxid() {
        try {
            let max_id = await this.db_knex.from(this.table_name).max('id')
            return Object.values(max_id[0])[0]

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
            let max_id = await this.getMaxid()

            if(obj.products && this.knex_options.client === 'mysql' ) {
                obj = Object.assign(obj, {products: JSON.stringify(obj.products)})
            }

            await this.insertData(this.table_name, { ...obj, id: Number(max_id) + 1 }) /*, timestamp: Date.now()*/
            //console.table(await this.db_knex.from(this.table_name))
            return max_id + 1

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
            let res = await this.db_knex.from(this.table_name).where('id', id)
            return res.length ? res[0] : null

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
            let res = await this.db_knex.from(this.table_name)
            //console.table(await this.db_knex.from(this.table_name))
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
            let response = await this.db_knex.from(this.table_name).where("id", "=", id).del()
            //console.table(await this.db_knex.from(this.table_name))
            return response

        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Método que elimina todos los objetos presentes en el archivo.
     */
    async deleteAll() {
        try {
            let response = await this.db_knex.from(this.table_name).del()
            //console.table(await this.db_knex.from(this.table_name))
            return response
        } catch (error) {
            console.log(error)
        }

    }

    async updateById(id, obj) {
        try {

            if(obj.products && this.knex_options.client === 'mysql' ) {
                obj = Object.assign(obj, {products: JSON.stringify(obj.products)})
            }

            let response = await this.db_knex.from(this.table_name).where("id", "=", id).update(obj)
            //console.table(await this.db_knex.from(this.table_name))
            return response
        } catch (error) {
            console.log(error)
        }
    }

}

export { ContenedorKnex }
