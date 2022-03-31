const auth = (req, res, next) => {

    if( req.isAuthenticated()) {
        return next()
    } else {
        return res.redirect('/api/failure?status_code=401');
    }

}

export {auth}