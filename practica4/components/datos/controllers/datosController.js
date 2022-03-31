import { datosService } from '../services/datosService.js'

class Datos {

    async getDatos(req, res, next) {
        try {
            await datosService.getDatos(req)
            res.send(`Servidor Express <span style="color: blueviolet;">(Nginx)</span> en ${req.socket.address().port} -
            <b>PID ${process.pid}</b> - ${ new Date().toLocaleDateString()}`)

        } catch (error) {
            console.log(error);
        }
    }

}

export let datosController = new Datos()
