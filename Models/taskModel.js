// Models are used for interaction with data

import { pool } from '../database.js'

// GET
// Get all tasks
export async function getAllTasks() {
    const tasks = await pool.query('SELECT * FROM tasks')
    return tasks
}

// Get one task (filter by any column)
export async function getTaskByColumn(column, value) {
    const allowed = ["task_id", "description", "urgency", "status", "created_on", "category", "task_group_id"]
    if (!allowed.includes(column)) {
        throw new Error ("Invalid column")
    }
    const task = await pool.query(`
        SELECT * FROM tasks
        WHERE ${column} = ?
    `, [value])
    return task[0][0]
}

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