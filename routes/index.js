// 此檔案為總路由器
const express = require('express') // 引用 Express
const router = express.Router() // 引用Express 路由器

const todos = require('./todos') // 宣告todos為引用todos.js
const users = require('./users') // 宣告users為引用users.js

router.use('/todos', todos) // 引用todos路由模組，設置'/todos'可避免路由重複，且將todos.js檔案中的路徑可省略/todos。
// 換句話說，我們直接在總路由器檢查網址前綴是否以 /todos 開頭，有的話才分流到 todos 模組裡，因此等下在設定 todos 模組時，裡面的路由清單不再需要處理前綴詞/todos

router.use('/users', users) // 引用users.js路由模組

router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router // 匯出路由器
