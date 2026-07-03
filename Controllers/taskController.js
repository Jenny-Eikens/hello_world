// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, getTaskById, getTasksByFields, addTask, updateTask, deleteTaskById, deleteTaskByFields, deleteAllTasks } from '../Models/taskModel.js'

const router = express.Router()

// GET (all / by any field(s))
router.get('/', async (req, res) => {
    const filters = Object.entries(req.query)

    if (filters.length === 0) {
        try {
            const tasks = await getAllTasks()
            if (tasks.length === 0) {
                res.status(204).send()
            } else {
                res.status(200).send(tasks[0])
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const tasks = await getTasksByFields(filters)
            if (tasks.length === 0) {
                res.status(404).json({ message: "No matching task(s) found"})
            } else {
                res.status(200).send(tasks)
            }
        } catch (err) {
            console.log(err)
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

/* -------------------------------------- */

// POST 
router.post('/', async (req, res) => {
    const categories = req.body
    try {
        const newTask = await addTask(categories)
        if (!newTask) {
            res.status(400).json({ message: "Unable to create task" })
        }
        res.status(201).send(newTask)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }  
})

/* -------------------------------------- */

// PATCH 
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const changes = req.body

    try {
        const updatedTask = await updateTask(id, changes)
        if (updatedTask[0].affectedRows === 0) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
            res.status(200).send(updatedTask)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* -------------------------------------- */

// DELETE (by id)
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const taskToDelete = await deleteTaskById(id)
        if (taskToDelete[0].affectedRows === 0) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
            res.status(200).send(taskToDelete)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// DELETE (all / by any field(s))
router.delete('/', async (req, res) => {
    const fields = req.body

    if (!fields) {
        try {
            const result = await deleteAllTasks()
            if (result[0].affectedRows === 0) {
                res.status(204).send()
            } else {
                res.status(200).send(result)
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const taskToDelete = await deleteTaskByFields(fields)
            console.log(taskToDelete[0].affectedRows === 0)
            if (taskToDelete[0].affectedRows === 0) {
                res.status(400).json({ message: "Invalid field value(s)" })
            } else {
                res.status(200).send(taskToDelete)
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
})


export default router