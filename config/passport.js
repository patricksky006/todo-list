// passport 套件設定
const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

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

module.exports = passport