import express from 'express'

const router = express.Router()

import { addTag } from '../Models/tagModel.js'

// GET (all)
// GET (by id)

/* -------------------------------------- */

// POST
router.post('/', async (req, res) => {
    const { name } = req.body

    try {
        const newTag = await addTag(name)
        res.status(201).json({ message: "New tag successfully added!" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router