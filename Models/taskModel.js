// Models are used for interaction with data

import { pool } from '../database.js'

// GET
// Get all tasks
export async function getAllTasks() {
    const [tasks] = await pool.query('SELECT * FROM tasks')

    return tasks
}

// Get one task (filter by id)

// Filter by category

// Filter by urgency

// Filter by creation date

// Filter by status

/* -------------------------------------- */

// POST
// Add task
export async function addTask(description, urgency) {
    const result = await pool.query(`
    INSERT INTO tasks (description, urgency)
    VALUES (?, ?)
    `, [description, urgency])
    return result
}


/* -------------------------------------- */

// PATCH
// Update task

/* -------------------------------------- */

// DELETE
// Delete task by id

// Delete task by status (complete)

// Delete all tasks