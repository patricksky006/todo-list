const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const passport = require('passport')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.SESSION_SECRET)

const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const router = require('./routes') // 引用路由器，index.js可以不寫，預設require會找index
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)
app.use(router) // 將 request 導入路由器
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`) // 監聽伺服器
})
