import express from 'express'
import config from './config/index.js'
import cors from 'cors'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { serverRoutes } from './routers/index.js'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors("*"))


serverRoutes(app)


const argv = yargs(hideBin(process.argv))
    .default({
        modo: 'prod',
        puerto: 8080,
        debug: false
    })
    .alias({
        m: 'modo',
        p: 'puerto',
        d: 'debug',
    })
    .boolean('debug')
    .argv

//    console.log(argv)

//    console.log({ modo: argv.modo, puerto: argv.puerto, debug: argv.debug, otros: argv._ })


const PORT = argv.puerto

const server = app.listen(PORT, (err) => {
    if (err) {
        console.log("Error while starting server")
    } else {
        console.log(
            `Servidor http escuchando en el puerto ${server.address().port}
            Open link to http://127.0.0.1:${server.address().port}
            Process Pid Worker: ${process.pid}`)
    }
})


server.on('error', error => console.log(`Error en servidor ${error}`))