class Failure {

    async getFailure(req) {
        try {

            const { status_code } = req.query
            let message = ''

            switch (status_code) {
                case '401':
                    message = 'Es necesario autenticar para obtener la respuesta solicitada.'
                    break
                case '403':
                    message = 'El cliente no posee los permisos necesarios para cierto contenido, por lo que el servidor está rechazando otorgar una respuesta apropiada.'
                    break
                case '404':
                    message = 'El servidor no pudo encontrar el contenido solicitado.'
                    break
                case '900':
                    message = 'Fallo la registración del usuario.'
                    break
                default:
                    message = 'Error desconocido. El codigo de error no corresponde a ninguno de los conocidos.'
            }

            return { status: "OK", message: message }
        } catch (error) {
            console.log(error)
        }
    }

}

export let failureService = new Failure()