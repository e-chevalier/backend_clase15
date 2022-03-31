import { ContenedorMongoDB } from '../../utils/containers/ContenedorMongoDB.js'
import * as modelUsers from '../../models/users.js'

class UsersDaoMongoDB extends ContenedorMongoDB {

    constructor(){
        super(modelUsers.users)
    }

}

export default UsersDaoMongoDB