// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, getTaskById, getTaskByField, addTask, updateTask } from '../Models/taskModel.js'

const router = express.Router()

// GET (all / by field + value)
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

// GET (by id)
router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const task = await getTaskById(id)
        if (!task) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
            res.status(200).send(task)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST 
router.post('/', async (req, res) => {
    const { description, urgency, status, created_on, category } = req.body
    try {
        const newTask = await addTask(description, urgency, status, created_on, category)
        if (!newTask) {
            res.status(400).json({ message: "Unable to create task" })
        }
        res.status(201).send(newTask)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }  
})

// PATCH 
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const changes = req.body

    try {
        const task = await getTaskById(id)
        if (!task) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
           const updatedTask = await updateTask(id, changes)
           res.status(200).send(updatedTask)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


export default router