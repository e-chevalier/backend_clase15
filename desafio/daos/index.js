const container_type = process.env.npm_config_container_type ? process.env.npm_config_container_type : 'File'
console.log("------------------ OPCIONES DE CONTENEDOR --------------------------------")
console.log("npm run dev --container_type=[file, firestore, mongodb]")
console.log("--------------------------------------------------------------------------")
console.log("Container Type Selected : " + container_type)

async function dynamicImport(container_type) {

    // DAO MEMORY DEFAULT
    const { default: ProductsDaoMemory } = await import('./products/ProductsDaoMemory.js')
    const { default: MessagesDaoMemory } = await import('./messages/MessagesDaoMemory.js')

    console.log("PRODUCTS - Initializing container for Mysql")
    // KNEX Config
    const { config_db } = await import('../config/databaseKnex.js')
    const { default: ProductsDaoKnex } = await import('./products/ProductsDaoKnex.js')
    // PRODUCTS DAO KNEX MYSQL
    const productsContainer = new ProductsDaoKnex(config_db.mysql)
    await productsContainer.createTableProducts()
    // PRODUCTS DAO MEMORY
    const productsMemory = new ProductsDaoMemory(await productsContainer.getAll())

    // MONOGODB ATLAS CONNECTION
    const { connectMongodbAtlas } = await import('../utils/mongodbAtlas/mongodbAtlas.js')
    // Connnect to dabase
    await connectMongodbAtlas()


    if (container_type.toUpperCase() === 'firestore'.toUpperCase()) {
        console.log("MESSAGES - Initializing container for Firestore")
        const { default: MessagesDaoFireStore } = await import('./messages/MessagesDaoFireStore.js')

        // MESSAGES DAO FIRESTORE
        const messagesContainer = new MessagesDaoFireStore()
        const messagesMemory = new MessagesDaoMemory(await messagesContainer.getAll())

        return { productsContainer, productsMemory, messagesContainer, messagesMemory }

    } else if (container_type.toUpperCase() === 'mongodb'.toUpperCase()) {
        console.log("MESSAGES - Initializing container for MongoDB Atlas")
        const { default: MessagesDaoMongoDB } = await import('./messages/MessagesDaoMongoDB.js')
        // MONOGODB ATLAS CONNECTION
        const { connectMongodbAtlas } = await import('../utils/mongodbAtlas/mongodbAtlas.js')
        // Connnect to dabase
        await connectMongodbAtlas()
        // MESSAGES DAO MONGODB
        const messagesContainer = new MessagesDaoMongoDB()
        // PRODUCTS DAO MEMORY
        const messagesMemory = new MessagesDaoMemory(await messagesContainer.getAll())

        return { productsContainer, productsMemory, messagesContainer, messagesMemory }

    } else { // default File
        console.log("MESSAGES - Initializing container for File")
    
        const { default: MessagesDaoFile } = await import('./messages/MessagesDaoFile.js')
    
        // MESSAGES DAO FILE
        const messagesContainer = new MessagesDaoFile()

        // PRODUCTS DAO MEMORY
        const messagesMemory = new MessagesDaoMemory(await messagesContainer.getAll())

        return { productsContainer, productsMemory, messagesContainer, messagesMemory }
    }
}

const { productsContainer, productsMemory, messagesContainer, messagesMemory } = await dynamicImport(container_type)

export { productsContainer, productsMemory, messagesContainer, messagesMemory }
