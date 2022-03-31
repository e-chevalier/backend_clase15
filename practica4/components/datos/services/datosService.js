class Datos {

    async getDatos(req) {

        try {
            return { status: "OK" }
        } catch (error) {
            console.log(error);
        }

    }


}

export let datosService = new Datos()