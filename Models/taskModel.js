// Models are used for interaction with data

import { pool } from '../database.js'

// GET
// Get all tasks
export async function getAllTasks() {
    const tasks = await pool.query('SELECT * FROM tasks')
    return tasks
}

// Get one task (filter by any column)
export async function getTaskByField(field, value) {
    const allowed = ["task_id", "description", "urgency", "status", "created_on", "category", "task_group_id"]
    if (!allowed.includes(field)) {
        throw new Error ("Invalid field")
    }
    const task = await pool.query(`
        SELECT * FROM tasks
        WHERE ${field} = ?
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
export async function updateTask(id, field, value) {
    const allowed = ["task_id", "description", "urgency", "status", "created_on", "category", "task_group_id"]
    if (!allowed.includes(field)) {
        throw new Error ("Invalid field")
    }
    const result = await pool.query(`
        UPDATE tasks
        SET ${field} = ?
        WHERE task_id = ?
        `, [value, id])
        return result
}

/* -------------------------------------- */

// DELETE
// Delete task by id

// Delete task by status (complete)

// Delete all tasks