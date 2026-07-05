import express from 'express'

const router = express.Router()

import { getAllUsers, getUserById, getUsersByFields, addUser, updateUser } from '../Models/userModel.js'

// GET (all / by any field(s))
router.get('/', async (req, res) => {
    const filters = Object.entries(req.query)

    if (filters.length === 0) {
        try {
            const users = await getAllUsers()
            if (users.length === 0) {
                res.status(204).send()
            } else {
            res.status(200).send(users)
        }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    } else {
        try {
            const users = await getUsersByFields(filters)
            if (users.length === 0) {
                res.status(404).json({ message: "No matching user(s) found" })
            } else {
                res.status(200).send(users)
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
})

// GET (by id)
router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const user = await getUserById(id)
        if (!user) {
            res.status(404).json({ message: "No user found with this id" })
        } else {
            res.status(200).send(user)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* -------------------------------------- */

// POST 
router.post('/', async (req, res) => {
    const fields = req.body

    try {
        const newUser = await addUser(fields)
        if (!newUser) {
            res.status(400).json({ message: "Unable to create new user" })
        } else {
            res.status(201).json({ message: "New user successfully added!" })
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

    try {
        const updatedUser = await updateUser(id, changes)
        if (updatedUser[0].affectedRows === 0) {
            res.status(404).json({ message: "No user found with this id" })
        } else {
            res.status(200).send(updatedUser)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* -------------------------------------- */
// DELETE 


export default router