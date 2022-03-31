import { datosApi } from "../components/datos/index.js"


export const serverRoutes = (app) => {
    datosApi(app)

    app.get("/", (req, res, next) => {
        res.send(`Servidor express PORT ${req.socket.address().port} - PID ${process.pid} - Fecha y hora: ${new Date().toLocaleString()}`)
    })
    /**
    * Undefined endpoint
    */
    app.all('*', (req, res, next) => {
        res.json({ error: -2, descripcion: `Ruta ${req.url} método ${req.method} no implementada.` })
    })
}