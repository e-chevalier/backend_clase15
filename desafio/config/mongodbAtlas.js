import 'dotenv/config'

let config = {
    db_pass: process.env.MONGODBATLAS_DB_PASS,
    db_domain: process.env.MONGODBATLAS_DB_DOMAIN,
    db_name: process.env.MONGODBATLAS_DB_NAME,
    db_user: process.env.MONGODBATLAS_DB_USER
}

export { config }