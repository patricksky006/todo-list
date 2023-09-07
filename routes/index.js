// 此檔案為總路由器
const express = require('express') // 引用 Express
const router = express.Router() // 引用Express 路由器
const passport = require('passport')

const todos = require('./todos') // 宣告todos為引用todos.js
const users = require('./users') // 宣告users為引用users.js
const authHandler = require('../middlewares/auth-handler')

router.use('/todos', authHandler, todos) // 引用todos路由模組，設置'/todos'可避免路由重複，且將todos.js檔案中的路徑可省略/todos。
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

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] })) //當使用者訪問該路徑時，Passport 將觸發 Facebook 策略的身份驗證流程，並請求取得使用者的資訊授權。

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {  //在處理 Facebook 登入成功後的重新定向，若驗證成功或失敗就導到相對應頁面。
	successRedirect: '/todos',
	failureRedirect: '/login',
	failureFlash: true
}))

router.post('/logout', (req, res) => {
	req.logout((error) => {
		if (error) {
			next(error)
		}

		return res.redirect('/login')
	})
})

module.exports = router // 匯出路由器
