import { Server as IOServer } from 'socket.io'
import { normalize, schema } from "normalizr"
import { productsMemory, productsContainer, messagesMemory, messagesContainer } from '../daos/index.js'


/**
 *  Regular expression for check email
 */

const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i


/**
 * Normalizr Schemas 
 * 
 */

const authorSchema = new schema.Entity('author')

const messageSchema = new schema.Entity('message', {
    author: authorSchema
})

const messagesSchema = new schema.Entity('messages', {
    messages: [messageSchema]
})


export const serverSocketsEvents = (httpsServer) => {

    const io = new IOServer(httpsServer)


    io.on('connection', (socket) => {
        // Emit all Products and Messages on connection.

        (async () => {
            //io.sockets.emit('products', await productsMemory.getAll())
            io.sockets.emit('products', await productsContainer.getAll())

            //let messagesOriginal = await messagesMemory.getAll()
            let messagesOriginal = await messagesContainer.getAll()
            let messagesNormalized = normalize({ id: 'messages', messages: messagesOriginal }, messagesSchema)

            io.sockets.emit('messages', messagesNormalized)
            console.log('¡Nuevo cliente conectado! PID: ' + process.pid)  // - Pedido 1
        })()

        socket.on('newProduct', (prod) => {

            if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {

                (async () => {
                    await productsContainer.save(prod)
                    await productsMemory.save(prod)
                    io.sockets.emit('products', await productsContainer.getAll())
                    //io.sockets.emit('products', await productsMemory.getAll())
                })()

            }
        })

        socket.on('newMessage', (data) => {

            if (Object.keys(data).length !== 0 && re.test(data.author.id) && !Object.values(data.author).includes('') && data.text !== '') {
                (async () => {
                    await messagesMemory.save(data)
                    await messagesContainer.save(data)

                    //let messagesOriginal = await messagesMemory.getAll()
                    let messagesOriginal = await messagesContainer.getAll()
                    let messagesNormalized = normalize({ id: 'messages', messages: messagesOriginal }, messagesSchema)
                    io.sockets.emit('messages', messagesNormalized)
                    console.log('¡NUEVO MENSAJE EMITIDO A TODOS LOS SOCKETS! PID: ' + process.pid)  // - Pedido 1
                })()
            }
        })

    })

    return io
}