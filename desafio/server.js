import express from 'express'
import cors from 'cors'
import { Server as IOServer } from 'socket.io'
import { config as configAtlas } from './config/mongodbAtlas.js'
import { engine } from 'express-handlebars';
import { serverRoutes } from './routes/index.js'
import { normalize, schema } from "normalizr"
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { serverPassport } from './config/passport.js'
import cluster from 'cluster'
import fs from 'fs'
import https from 'https'
import { Server as HttpServer } from 'http'
import os from 'os'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { productsMemory, productsContainer, messagesMemory, messagesContainer } from './daos/index.js'
import { setupMaster, setupWorker } from "@socket.io/sticky";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";


const app = express()
// SERVER HTTPS
const credentials = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};


// Middlewares
app.use(cors("*"));
app.use(cookieParser())
// Settings
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static('node_modules/bootstrap/dist'))


// defino el motor de plantilla
app.engine('.hbs', engine({
    extname: ".hbs",
    defaultLayout: 'index.hbs',
    layoutDir: "views/layouts/",
    partialsDir: "views/partials/"
})
)

app.set('views', './views'); // especifica el directorio de vistas
app.set('view engine', '.hbs'); // registra el motor de plantillas


const httpsServer = https.createServer(credentials, app);
const io = new IOServer(httpsServer)

// const httpServer = new HttpServer(app)
// const io = new IOServer(httpServer)


// CONFIG SESION WITH MONGO STORE
const advanceOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const DB_PASS = configAtlas.db_pass
const DB_DOMAIN = configAtlas.db_domain
const DB_NAME = configAtlas.db_name
const DB_USER = configAtlas.db_user


app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority`,
        mongoOptions: advanceOptions
    }),
    secret: 'secreto',
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
        httpOnly: false,
        secure: true,
        maxAge: 600 * 1000,
        sameSite: 'none'
    }
}))


// CONFIG PASSPORTS
const passport = serverPassport(app)


serverRoutes(app, passport)


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

/**
 * SOCKETS
 */

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



const numCPUs = os.cpus().length

const argv = yargs(hideBin(process.argv))
    .default({
        modo: 'FORK',
        puerto: 8080
    })
    .alias({
        m: 'modo',
        p: 'puerto'
    })
    .argv

const PORT = argv.puerto

if (argv.modo.toUpperCase() == 'CLUSTER') {

    if (cluster.isPrimary) {
        console.log(`Master Cluster PID ${process.pid} is running.`)

        // setup sticky sessions
        setupMaster(httpsServer, {
            loadBalancingMethod: "least-connection",
        });

        // setup connections between the workers
        setupPrimary();

        // FORK WORKER
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died.`)
            cluster.fork()
        })

    } else {

        const server = httpsServer.listen(PORT, (err) => {
            if (err) {
                console.log("Error while starting server")
            } else {
                console.log(
                    `
                    ------------------------------------------------------------
                    WORKER ${server.address().port}  Process Pid: ${process.pid}
                    Open link to https://localhost:${server.address().port}     
                    -------------------------------------------------------------
                    `
                )
            }
        })


        // use the cluster adapter
        io.adapter(createAdapter());

        // setup connection with the primary process
        setupWorker(io);

        server.on('error', error => console.log(`Error en servidorProcess Pid: ${process.pid}: ${error}`))

    }


} else {

    const server = httpsServer.listen(PORT, 'localhost', (err) => {
        if (err) {
            console.log("Error while starting server")
        } else {
            console.log(
                `
                ------------------------------------------------------------
                Servidor http escuchando en el puerto ${server.address().port}
                Open link to https://localhost:${server.address().port}      
                -------------------------------------------------------------
                `
            )
        }
    })

    server.on('error', error => console.log(`Error en servidor ${error}`))

}











