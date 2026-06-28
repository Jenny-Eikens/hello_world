// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, getTaskByColumn, addTask } from '../Models/taskModel.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const { column, value } = req.query

    if (!column || !value) {
        try {
            const tasks = await getAllTasks()
            return res.status(200).send(tasks[0])
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
    try {
        const task = await getTaskByColumn(column, value)
        if (!task) {
            res.status(404).json({ message: "No matching task(s) found"})
        }
        res.status(200).send(task)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    const { description, urgency } = req.body
    const newTask = await addTask(description, urgency)
    res.status(201).send(newTask)
})


export default router