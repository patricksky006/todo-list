// 此檔案為總路由器
const express = require('express') // 引用 Express
const router = express.Router() // 引用Express 路由器
const bcrypt = require('bcryptjs')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const db = require('../models')
const user = db.user

passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return user.findOne({
		attributes: ['id', 'name', 'email', 'password'],
		where: { email: username },
		raw: true
	})
    .then((user) => {
			if (!user ) {
				return done(null, false, { message: '使用者不存在' })
			}
			return bcrypt.compare(password, user.password)
				.then((isMatch) => {
					if (!isMatch) {
						return done(null, false, { message: 'email 或密碼錯誤' })
					}
					return done(null, user)
				})
		})
		.catch((error) => {
			error.errorMessage = '登入失敗'
			done(error)
		})
}))

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID, //機密資料，所以須設定為環境變數
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET, //機密資料，所以須設定為環境變數
  callbackURL: process.env.FACEBOOK_CALLBACK_URL, //機密資料，所以須設定為環境變數
	profileFields: ['id', 'displayName', 'email']
},(accessToken, refreshToken, profile, done) => {
	const email = profile.emails[0].value
	const name = profile.displayName

	return user.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
})
.then((foundUser) => {
    if (foundUser) {
        return done(null, foundUser);
    } else {
        const randomPwd = Math.random().toString(36).slice(-8);
        return bcrypt.hash(randomPwd, 10)
            .then((hash) => {
                user.create({ name, email, password: hash })
                    .then((createdUser) => {
                        done(null, { id: createdUser.id, name: createdUser.name, email: createdUser.email });
                    })
                    .catch((error) => {
                        error.errorMessage = '註冊失敗';
                        done(error);
                    });
            })
            .catch((error) => {
                error.errorMessage = '密碼雜湊錯誤';
                done(error);
            });
    }
})
.catch((error) => {
    error.errorMessage = '查找用戶錯誤';
    done(error);
});

}))

passport.serializeUser((user, done) => {
	const { id, name, email } = user
	return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
	done(null, { id: user.id })
})

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
