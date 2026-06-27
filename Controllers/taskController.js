// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, addTask } from '../Models/taskModel.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const [tasks] = await getAllTasks()
    res.status(200).send('Task controller works!' + tasks)
})

router.post('/', async (req, res) => {
    const { description, urgency } = req.body
    const newTask = await addTask(description, urgency)
    console.log('Params: ', req.params)
    console.log('Body: ', req.body)
    res.status(201).send('New task added! \n' + newTask)
})

export default router