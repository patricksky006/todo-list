//users路由模組,帳號密碼資料庫

const express = require('express')
const router = express.Router()

const db = require('../models')
const user = db.user

router.post('/', (req, res, next) =>{
  res.send('hello, post-users register finished')
})

module.exports = router