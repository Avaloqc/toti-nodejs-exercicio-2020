const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

/*
tasks.create({
  description:'Cenoura',
  done: false,
})*/

app.set('view engine', 'ejs')

// List tasks
app.get('/tasks', async (req, res) => {
  await tasks.findAll().then((fetchedData) => {
    res.json(fetchedData)
  })
})

// Create task
app.post('/tasks', async (req, res) => {
  const body = req.body
  await tasks.create({description: body.description, done: body.done})
  res.json(body)
}) 

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  await tasks.findByPk(taskId).then((fetchedData) => {
    res.json(fetchedData)
  })
  res.send({ action: 'Showing task', taskId: taskId })
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId)
  task.update({description: body.description, done: body.done})
  res.send({ action: 'Updating task', taskId: taskId })
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  await tasks.destroy({ where: { id: taskId} })
  res.send({ action: 'Deleting task', taskId: taskId })
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
