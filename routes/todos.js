// todos路由模組

const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo


router.get('/', (req, res) => {
  try {
    const message = req.flash('success')
    const deleteSuccess = req.flash('deleteSuccess')
    const deletedError = req.flash('deletedError')

     return Todo.findAll({
        attributes: ['id', 'name', 'isComplete'],
        raw: true
     })
        .then((todos) => res.render('todos', { todos, message, deleteSuccess, deletedError })) //顯示todo清單的頁面
        .catch((error) => {
          console.error(error)
          req.flash('error','資料取得失敗')
          return res.redirect('back')
        })
  } catch (error) {
        console.error(error)
	    	req.flash('error', '伺服器錯誤')
		    return res.redirect('back')
  }
  
})

router.get('/new', (req, res) => {
  try {
    return res.render('new', { error: req.flash('error')})
  } catch (error) {
        console.error(error)
	    	req.flash('error', '伺服器錯誤')
		    return res.redirect('back')
  }
  
})

router.get('/:id', (req, res) => {
  try {
    const id = req.params.id
    const updatedSuccess = req.flash('updatedSuccess')
  
    return Todo.findByPk(id, {
        attributes: ['id', 'name', 'isComplete'],
        raw: true
  })
    .then((todo) => res.render('todo', { todo, updatedSuccess }))
    .catch((error) => {
        console.error(error)
				req.flash('error', '資料取得失敗:(')
				return res.redirect('back')
    })
  } catch (error) {
        console.error(error)
		    req.flash('error', '伺服器錯誤')
	    	return res.redirect('back')
  }
  
})

router.post('/', (req, res) => {
  try {
    const name = req.body.name //接住從new.hbs中的提交的資料
    return Todo.create( { name } ) // 將資料放入在Todo資料庫中
      .then(() => {
        req.flash('success', `新增資料名稱 ${ name } 成功`) //前者是Key，後者是值
        return res.redirect('/todos')
      }) 
      .catch((error) => {
        console.log(error)
        req.flash('error', '新增失敗!')
        return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', '新增失敗:(')
    return res.redirect('back')
  }
  
})

router.get('/:id/edit', (req, res) => {
  try {
    const id = req.params.id
    const updatedError = req.flash('updatedError')

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
      .then((todo) => res.render('edit', { todo, updatedError }))
      .catch((error) => {
        console.error(error)
				req.flash('error', '資料取得失敗:(')
				return res.redirect('back')
      })
  } catch (error) {
    console.error(error)
		req.flash('error', '伺服器錯誤')
		return res.redirect('back')
  }
  
  
})

router.put('/:id', (req, res) =>{
  try {
    const { name, isComplete } = req.body
    const id = req.params.id // 接住網頁提交更改資料的ID

     return Todo.update({ name, isComplete: isComplete === 'completed' }, {where: { id }})
       .then(() => {
          req.flash('updatedSuccess',`更新資料名稱成功`)
          return res.redirect(`/todos/${id}`)
  })
       .catch((error) => {
          console.log(error)
          req.flash('updatedError', '更新失敗!')
          return res.redirect('back')
      })
  } catch (error) {
    console.log(error)
    req.flash('error', '伺服器錯誤')
    return res.redirect('back')
  }
  
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    return Todo.destroy({ where: { id }})
      .then(() => {
       req.flash('deleteSuccess',`刪除資料成功`)
        return res.redirect('/todos')
       })
      .catch((error) => {
          console.log(error)
          req.flash('deletedError', '刪除失敗!')
          return res.redirect('back')
  })
  } catch (error) {
    console.log(error)
    req.flash('error', '刪除失敗:(')
    return res.redirect('back')
  }
  })

  module.exports = router