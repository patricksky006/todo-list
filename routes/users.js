// users路由模組,帳號密碼資料庫

const express = require('express')
const router = express.Router()

const db = require('../models')
const user = db.user

router.post('/', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  if (!email || !password) {
    req.flash('error', 'email 及 password 為必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  return user.count({ where: { email } })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', '此信箱已註冊過，請重新註冊新信箱')
        return res.redirect('back')
      }

      return user.create({ name, email, password })
        .then((user) => {
          if (!user) {
            return res.redirect('back')
          }
          req.flash('success', '註冊成功')
          return res.redirect('/login')
        })

        .catch((error) => {
          error.errorMessage = '註冊失敗'
          next(error)
        })
    })
})

module.exports = router
