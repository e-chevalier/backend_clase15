import mongoose from "mongoose"

const messagesCollection = 'messages'

// const AuthorSchema = mongoose.Schema({
//     id: {type: String, require: true},
//     name: {type: String, require: true},
//     surname: {type: String, require: true},
//     age: {type: String, require: true},
//     alias: {type: String, require: true},
//     avatar: {type: String, require: true, max: 250}
// })

const MessagesSchema = mongoose.Schema({
    author: {
        id: {type: String, require: true},
        name: {type: String, require: true},
        surname: {type: String, require: true},
        age: {type: String, require: true},
        alias: {type: String, require: true},
        avatar: {type: String, require: true, max: 250}
    },
    text: {type: String, require: true, max:500},
    date: {type: String, require: true},
    id: {type: Number, require: true, unique: true}
})

export const messages = mongoose.model(messagesCollection, MessagesSchema)