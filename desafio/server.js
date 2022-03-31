import express from 'express'
import cors from 'cors'
import { Server as IOServer } from 'socket.io'
import { config } from './config/index.js'
import { config as configAtlas } from './config/mongodbAtlas.js'
import { fb_config } from './config/facebook.js'
import { engine } from 'express-handlebars';
import { serverRoutes } from './routes/index.js'
import { normalize, schema } from "normalizr"
import util from 'util'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import * as User from './models/users.js'
import https from 'https'
import fs from 'fs'
import bCrypt from 'bcrypt'
import faker from 'faker'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { productsMemory, productsContainer, messagesMemory, messagesContainer } from './daos/index.js'

// console.log("PRODUCTS MYSQL")
// console.table(await productsContainer.getAll())
// console.log("PRODUCTS MEMORY")
// console.table(await productsMemory.getAll())


// console.log("MESSAGES CONTAINER")
// console.log(await messagesContainer.getAll())
// console.log("MESSAGES MEMORY")
// console.log(await messagesMemory.getAll())

const app = express()
// SERVER HTTPS
const credentials = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const httpsServer = https.createServer(credentials, app);
const io = new IOServer(httpsServer)


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


// CONFIG PASSPORT FACEBOOK

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: fb_config.facebookid,
    clientSecret: fb_config.facebooksecret,
    callbackURL: fb_config.facebook_callback,
    profileFields: ['id', 'emails', 'displayName', 'picture']
},
    (accessToken, refreshToken, profile, done) => {

        process.nextTick(() => {

            const newUser = {
                username: profile.displayName,
                email: "No tiene.",
                password: "No tiene",
                firstname: profile.displayName.split(' ')[0],
                lastname: profile.displayName.split(' ')[1],
                photo: profile.photos[0].value
            }

            User.users.findOneAndUpdate({ id: profile.id }, newUser, { new: true, upsert: true, lean: true }, (err, user) => {
                if (err) {
                    console.log("Error in login FacebookStrategy")
                    return done(err)
                }

                return done(null, user)
            })

        })

    })
)

// Passport middlewares
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    User.users.findById({ _id: id }, done).lean()
});

// CONFIG PASSPORT LOCAL

passport.use('login', new LocalStrategy(
    (username, password, done) => {

        User.users.findOne({ username: username }, (err, user) => {

            if (err) {
                console.log("Error in login LocalStrategy")
                return done(err)
            }

            if (!user) {
                console.log("User Not Found with username: " + username);
                return done(null, false)
            }

            if (!isValidPassword(user, password)) {
                console.log("Invalid Password");
                return done(null, false)
            }

            return done(null, user)
        })

    })
)

passport.use('signup', new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
        User.users.findOne({ username: username }, (err, user) => {

            if (err) {
                console.log("Error en signup LocalStrategy " + err);
                return done(err)
            }

            if (user) {
                console.log('User already exists');
                return done(null, false)
            }

            const newUser = {
                id: req.body.username,
                username: username,
                password: createHash(password),
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                photo: faker.image.imageUrl(50, 50, 'people', false, true)
                //photo: "https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_morango-128.png"
            }

            User.users.create(newUser, (err, userWithId) => {
                if (err) {
                    console.log('Error in Saving user: ' + err);
                    return done(err);
                }
                console.log(user)
                console.log('User Registration succesful');
                return done(null, userWithId);
            });
        })
    })
)


const createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


const isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.password);
}



serverRoutes(app, passport)

const argv = yargs(hideBin(process.argv))
    .default({
        puerto: 8080
    })
    .alias({
        p: 'puerto'
    })
    .argv


const PORT = argv.puerto

const server = httpsServer.listen(PORT, 'localhost', (err) => {
    if (err) {
        console.log("Error while starting server")
    } else {
        console.log(`Servidor https escuchando en el puerto ${server.address().port}
                 Open link to https://localhost:${server.address().port}`)
    }
})

server.on('error', error => console.log(`Error en servidor ${error}`))




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


const print = obj => {
    console.log(util.inspect(obj, false, 12, true))
}

/**
 * SOCKETS
 */

io.on('connection', (socket) => {
    // Emit all Products and Messages on connection.

    (async () => {
        io.sockets.emit('products', await productsMemory.getAll())

        let messagesOriginal = await messagesMemory.getAll()
        let messagesNormalized = normalize({ id: 'messages', messages: messagesOriginal }, messagesSchema)

        io.sockets.emit('messages', messagesNormalized)
        console.log('¡Nuevo cliente conectado!')  // - Pedido 1
    })()

    socket.on('newProduct', (prod) => {

        if (Object.keys(prod).length !== 0 && !Object.values(prod).includes('')) {

            (async () => {
                await productsContainer.save(prod)
                await productsMemory.save(prod)
                io.sockets.emit('products', await productsMemory.getAll())
            })()

        }
    })

    socket.on('newMessage', (data) => {

        if (Object.keys(data).length !== 0 && re.test(data.author.id) && !Object.values(data.author).includes('') && data.text !== '') {
            (async () => {
                await messagesMemory.save(data)
                await messagesContainer.save(data)

                let messagesOriginal = await messagesMemory.getAll()
                let messagesNormalized = normalize({ id: 'messages', messages: messagesOriginal }, messagesSchema)
                io.sockets.emit('messages', messagesNormalized)

            })()
        }
    })

})











