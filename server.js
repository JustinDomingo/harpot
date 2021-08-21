const express = require('express')
const app = express()
const router = require('./router')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

let sessionOptions = session({
    secret: "Hello",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 8, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', router)

module.exports = app