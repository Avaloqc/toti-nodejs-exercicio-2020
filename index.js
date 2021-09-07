const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', 'views')

// List tasks
app.get('/tasks', async (req, res) => {
  await tasks.findAll().then(fetchedData => {
  const json = fetchedData
  res.render('tasks', json)
  })
})


// Create task
app.post('/tasks', async (req, res) => {
  const body = req.body
  await tasks.create({ description: body.description, done: body.done })
  res.json(body)
})

// Show task 
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId)
  if (!task) {
    return res.status(400).json({ error: 'Tarefa não encontrada' });
  } else {
    res.json(task)
  }
  
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const body = req.body;
  const task = await tasks.findByPk(taskId)
  if (!task) {
    return res.status(400).json({ error: 'Tarefa não encontrada' });
  }
  task.update({description: body.description, done: body.done })
  res.send({ action: 'Updating task', taskId: taskId })
})

// Delete tasks
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.destroy({ where: { id: taskId } })
  if (!task) {
    return res.status(400).json({ error: 'Tarefa não encontrada' });
  }
  else {res.send({ action: 'Deleting task', taskId: taskId })}
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
