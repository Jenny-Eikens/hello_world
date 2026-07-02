// Models are used for interaction with data

import { pool } from '../database.js'

const allowed = ["task_id", "description", "urgency", "status", "created_on", "category", "task_group_id"]

// GET
// Get all tasks
export async function getAllTasks() {
    const tasks = await pool.query('SELECT * FROM tasks')
    return tasks
}

// Get one task (filter by id)
export async function getTaskById(id) {
    const [result] = await pool.query(`
        SELECT * FROM tasks
        WHERE task_id = ? 
    `, [id])
    return result[0]
}

// Get one task (filter by any column)
export async function getTaskByField(field, value) {
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
export async function addTask(description, urgency, status, created_on, category) {
    const result = await pool.query(`
    INSERT INTO tasks (description, urgency, status, created_on, category)
    VALUES (?, ?, ?, ?, ?)
    `, [description, urgency, status, created_on, category])
    return result
}

/* -------------------------------------- */

// PATCH
// Update task
export async function updateTask(id, changes) {

    const changeLength = Object.keys(changes).length
    let queryString = ""
    let i = 0
    for (let key in changes) {
        if (!allowed.includes(key)) {
            continue
        }
        queryString += `${key} = '${changes[key]}'`
        if (i < changeLength - 1) {
            queryString += ", "
            i++
        }
    }
    const result = await pool.query(`
        UPDATE tasks
        SET ${queryString}
        WHERE task_id = ?
        `, [id])
        return result
}

/* -------------------------------------- */

// DELETE
// Delete task by id

// Delete task by status (complete)

// Delete all tasks