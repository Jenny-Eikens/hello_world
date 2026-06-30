// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, getTaskByField, addTask, updateTask } from '../Models/taskModel.js'

const router = express.Router()

router.get('/', async (req, res) => {
    // const { field, value } = req.query -> Warum funktioniert das nicht?
    const [field, value] = Object.entries(req.query).flat()

    if (!field || !value) {
        try {
            const tasks = await getAllTasks()
            res.status(200).send(tasks[0])
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const task = await getTaskByField(field, value)
            if (!task) {
                res.status(404).json({ message: "No matching task(s) found"})
            }
            res.status(200).send(task)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
})

router.post('/', async (req, res) => {
    const { description, urgency } = req.body
    try {
        const newTask = await addTask(description, urgency)
        if (!newTask) {
            res.status(400).json({ message: "Unable to create task" })
        }
        res.status(201).send(newTask)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }  
})

router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const changes = req.body

    let updatedTask
    for (let key in changes) {
        if (task[key] === changes[key]) {
            continue
        }
        updatedTask = await updateTask(id, key, changes[key])
    }
    res.status(200).send(updatedTask)
})


export default router