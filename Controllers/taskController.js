// Controllers get data from model & control what a route does (what gets sent back etc.)

import express from 'express'
import { getAllTasks, getTaskById, getTasksByFields, getTaskTags, addTask, addTaskTags, updateTask, deleteTaskById, deleteTasksByFields, deleteTaskTags, deleteAllTasks } from '../Models/taskModel.js'
import { getAllTags } from '../Models/tagModel.js'

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
                res.status(200).send(tasks)
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const tasks = await getTasksByFields(filters)
            if (tasks.length === 0) {
                res.status(404).json({ message: "No matching task(s) found" })
            } else {
                res.status(200).send(tasks)
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
})

// GET (by id / all tags associated with task)
router.get('/:filter', async (req, res) => {
    const filter = req.params.filter

    try {
        if (/^[0-9]+$/.test(filter)) {
            const task = await getTaskById(filter)
            if (task.length === 0) {
                res.status(404).json({ message: "No task found with this id" })
            } else {
                res.status(200).send(task)
            }
        } else {
            const tags = await getTaskTags(filter)
            if (tags.length === 0) {
                res.status(404).json({ message: "No task found with this description" })
            } else {
                res.status(200).send(tags)
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* -------------------------------------- */

// POST 
router.post('/', async (req, res) => {
    const categories = req.body
    const { tags } = req.body

    try {
        const newTask = await addTask(categories)
        if (!newTask) {
            res.status(400).json({ message: "Unable to create task" })
        } else {
            if (tags) {
                try {
                    // check validity of tags
                    const validTags = await getAllTags()
                    const tagsToAdd = []
                    let messageArr = []
                    let returnMessage = ""
                    for (const tag of tags) {
                        const isValid = validTags.find((validTag) => validTag.name === tag)
                        if (!isValid) {
                            messageArr.push(tag)
                            continue
                        }
                        tagsToAdd.push(tag)
                    }

                    // update junction table (task + tag) with valid tags
                    const newTags = await addTaskTags(newTask.insertId, tagsToAdd)
                    if (messageArr.length > 0) {
                        returnMessage = `Invalid tag(s): '${messageArr.join(", ")}'. \n Task added without these tags.`
                    } else {
                        returnMessage = 'New task and tags successfully added!'
                    }
                    res.status(201).json({ message: returnMessage })
                } catch (err) {
                    res.status(500).json({ message: err.message })
                }
            } else { // executes if request doesn't include tags
                res.status(201).json({ message: "New task successfully added! " })
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* -------------------------------------- */

// PATCH 
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const changes = req.body
    const { tags } = req.body

    try {
        const updatedTask = await updateTask(id, changes)
        if (updatedTask.affectedRows === 0) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
            if (tags) {
                try {
                    // delete existing entries from junction table
                    const deletedTaskTags = await deleteTaskTags(id)

                    // check validity of tags
                    const validTags = await getAllTags()
                    const tagsToAdd = []
                    let messageArr = []
                    let returnMessage = ""
                    for (const tag of tags) {
                        const isValid = validTags.find((validTag) => validTag.name === tag)
                        if (!isValid) {
                            messageArr.push(tag)
                            continue
                        }
                        tagsToAdd.push(tag)
                    }

                    // update junction table (task + tag) with valid tags
                    const newTags = await addTaskTags(id, tagsToAdd)
                    if (messageArr.length > 0) {
                        returnMessage = `Invalid tag(s): '${messageArr.join(", ")}'. \n Task updated without adding these tags.`
                    } else {
                        returnMessage = 'Task and tags successfully updated!'
                    }
                    res.status(200).json({ message: returnMessage })
                } catch (err) {
                    res.status(500).json({ message: err.message })
                }
            } else { // executes if request doesn't include tags
                res.status(200).json({ message: "Entry successfully updated" })
            }
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
        if (taskToDelete.affectedRows === 0) {
            res.status(404).json({ message: "No task found with this id" })
        } else {
            res.status(200).json({ message: `Task with id ${id} successfully deleted` })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// DELETE (all / by any field(s))
router.delete('/', async (req, res) => {
    const filters = Object.entries(req.query)

    if (filters.length === 0) {
        try {
            const result = await deleteAllTasks()
            if (result.affectedRows === 0) {
                res.status(204).send()
            } else {
                res.status(200).json({ message: "All tasks successfully deleted" })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const tasksToDelete = await deleteTasksByFields(filters)
            const affectedRows = tasksToDelete.affectedRows
            if (affectedRows === 0) {
                res.status(400).json({ message: "Invalid field value(s)" })
            } else {
                res.status(200).json({ message: `${affectedRows} task(s) successfully deleted` })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
})


export default router