//users路由模組,帳號密碼資料庫

const express = require('express')
const router = express.Router()

const db = require('../models')
const user = db.user

router.get('/register', (req, res, next) =>{
  res.render('register')
})

router.get('/login', (req, res, next) =>{
  res.render('login')
})

router.post('/users', (req, res, next) =>{
  res.send('hello, post-users')
})

router.post('/login', (req, res, next) =>{
  res.send('hello, post-login')
})

router.post('/logout', (req, res, next) =>{
  res.send('hello, post-users')
})

module.exports = router