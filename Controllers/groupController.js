import express from 'express'
import { getAllGroups, getGroupById } from '../Models/groupModel.js'

const router = express.Router()

// GET (all)
router.get('/', async (req, res) => {
    try {
        const groups = await getAllGroups()
        res.status(200).send(groups)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET (by id)
router.get('/:id', async (req, res) => {
    const id = req.params.id
    const operator = (req.body && (/^(?:<=|>=|<|>|=)$/).test(req.body.operator)) ? req.body.operator : "="

    try {
        const groups = await getGroupById(id, operator)
        res.status(200).send(groups)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router