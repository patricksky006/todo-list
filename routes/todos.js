// todos路由模組

const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1 // parseInt: 將字串轉換為整數數值
  const limit = 10
  const userId = req.user.id

  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    where: { userId }, //從資料庫找出此userId的資料
    offset: (page - 1) * limit,
    limit,
    raw: true
  })
    .then((todos) => res.render('todos', {
      todos,
      prev: page > 1 ? page - 1 : page,
      next: page + 1,
      page
    })) // 顯示todo清單的頁面
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
			    next(error)
    })
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'], //此userId是用來驗證身分
    raw: true
  })
    .then((todo) => {
      //驗證資料庫的有無
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }

      //驗證使用者是否傭有此資料庫的權限
      if (todo.userId !== userId) {
        req.flash('error', '無操作的權限')
        return res.redirect('/todos')
      }
      res.render('todo', { todo })
  })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
		  	next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      //驗證資料庫的有無
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }

      //驗證使用者是否擁有此資料庫的權限
      if (todo.userId !== userId) {
        req.flash('error', '無操作的權限')
        return res.redirect('/todos')
      }

      res.render('edit', { todo })
  })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
			  next(error)
    })
})

router.post('/', (req, res, next) => {
  const name = req.body.name // 接住從new.hbs中的提交的資料
  const userId = req.user.id //userId可以從passport擴充的req中取得
    console.log(name, userId)
  return Todo.create({ name, userId }) // 將資料放入在Todo資料庫中
    .then(() => {
      console.log(name, userId)
      req.flash('success', `新增資料名稱 ${name} 成功`) // 前者是Key，後者是值
      return res.redirect('/todos')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const { name, isComplete } = req.body
  const id = req.params.id // 接住網頁提交更改資料的ID
  const userId = req.user.id //userId可以從passport擴充的req中取得

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'] //此userId是用來驗證身分
  })
    .then((todo) => {
      //驗證資料庫的有無
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }

      //驗證使用者是否傭有此資料庫的權限
      if (todo.userId !== userId) {
        req.flash('error', '無操作的權限')
        return res.redirect('/todos')
      }
      return todo.update({ name, isComplete: isComplete === 'completed' })
        .then(() => {
          req.flash('success', '更新資料名稱成功')
          return res.redirect(`/todos/${id}`)
        })
  })
  
    .catch((error) => {
      error.errorMessage = '更新失敗'
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id //userId可以從passport擴充的req中取得

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId']
  })
    .then((todo) => {
      //驗證資料庫的有無
      if (!todo) {
        req.flash('error', '找不到資料')
        return res.redirect('/todos')
      }

      //驗證使用者是否擁有此資料庫的權限
      if (todo.userId !== userId) {
        req.flash('error', '無操作的權限')
        return res.redirect('/todos')
      }

      return todo.destroy({ where: { id } })
        .then(() => {
          req.flash('success', '刪除資料成功')
          return res.redirect('/todos')
        })
  })
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router
