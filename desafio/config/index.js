import 'dotenv/config'

let config = {
    port: process.env.PORT
}

let db = {
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_NAME
}

export { config, db }