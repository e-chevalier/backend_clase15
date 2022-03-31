import mongoose from "mongoose"

const usersCollection = 'users'

const UsersSchema = mongoose.Schema({
    id: {type: String, require: true, unique: true},
    username: {type: String, require: true, max:100},
    password: {type: String, require: true, max:100},
    email: {type: String, require: true, max:250},
    firstname: {type: String, require: true, max:100},
    lastname: {type: String, require: true, max:100},
    photo: {type: String, require: true, max:400}
})

const users = mongoose.model(usersCollection, UsersSchema)

export { users, UsersSchema }
