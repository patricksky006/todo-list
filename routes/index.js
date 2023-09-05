// 此檔案為總路由器
const express = require('express') // 引用 Express
const router = express.Router() // 引用Express 路由器

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const user = db.user

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return user.findOne({
		attributes: ['id', 'name', 'email', 'password'],
		where: { email: username },
		raw: true
	})
    .then((user) => {
			if (!user || user.password !== password) {
				return done(null, false, { message: 'email 或密碼錯誤' })
			}
			return done(null, user)
		})
		.catch((error) => {
			error.errorMessage = '登入失敗'
			done(error)
		})
}))

passport.serializeUser((user, done) => {
	const { id, name, email } = user
	return done(null, { id, name, email })
})

const todos = require('./todos') // 宣告todos為引用todos.js
const users = require('./users') // 宣告users為引用users.js

router.use('/todos', todos) // 引用todos路由模組，設置'/todos'可避免路由重複，且將todos.js檔案中的路徑可省略/todos。
// 換句話說，我們直接在總路由器檢查網址前綴是否以 /todos 開頭，有的話才分流到 todos 模組裡，因此等下在設定 todos 模組時，裡面的路由清單不再需要處理前綴詞/todos

router.use('/users', users) // 引用users.js路由模組

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/register', (req, res, next) => {
  res.render('register')
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/todos',
	failureRedirect: '/login',
	failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  res.send('hello, post-users logout finished')
})
module.exports = router // 匯出路由器
