import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as LocalStrategy } from 'passport-local'
import faker from 'faker'
import { fb_config } from './facebook.js'
import * as User from '../models/users.js'
import bCrypt from 'bcrypt'

export const serverPassport = (app) => {

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


    return passport

}

const createHash = (password) => {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


const isValidPassword = (user, password) => {
    return bCrypt.compareSync(password, user.password);
}


