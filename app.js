const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const port = 3000

const db = require('./models')
const Todo = db.Todo

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req,res) => {
  res.render('index') //首頁
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
      .then((todos) => res.render('todos', { todos })) //顯示todo清單的頁面
      .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((err) => res.status(422).json(err))
})

app.post('/todos', (req, res) => {
  const name = req.body.name //接住從new.hbs中的提交的資料
  return Todo.create( { name } ) // 將資料放入在Todo資料庫中
      .then(() => res.redirect('/todos')) // 重新渲染網頁
      .catch((err) => console.log(err))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
      .then((todo) => res.render('edit', { todo }))
  
})

app.put('/todos/:id', (req, res) =>{
  const body = req.body // 接住網頁提交更改的資料
  const id = req.params.id // 接住網頁提交更改資料的ID

  return Todo.update({ name: body.name }, {where: { id }})
    .then(() => res.redirect(`/todos/${id}`))
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.destroy({ where: { id }})
    .then(() => res.redirect('/todos'))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`) //監聽伺服器
})