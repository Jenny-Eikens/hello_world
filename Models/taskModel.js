// Models are used for interaction with data

import { pool } from '../database.js'

const allowed = ["task_id", "description", "urgency", "status", "created_on", "category", "task_group_id"]

// GET
// Get all tasks
export async function getAllTasks() {
    const [result] = await pool.query('SELECT * FROM tasks')
    return result
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
export async function getTasksByFields(filters) {

    const filterLength = filters.length
    let queryString = ""
    const valueArr = []

    for (let i = 0; i < filterLength; i++) {
        const field = filters[i][0]
        const value = filters[i][1]
        if (!allowed.includes(field)) {
            throw new Error ("Invalid field")
            continue
        }
        queryString += `${field} = ?`
        if (i < filterLength - 1) {
            queryString += ' AND '
        }
        valueArr.push(value)
    }

    const result = await pool.query(`
        SELECT * FROM tasks
        WHERE ${queryString}
    `, [...valueArr])
    return result[0]
}

/* -------------------------------------- */

// POST
// Add task
export async function addTask(categories) {

    let categoryLength = Object.entries(categories).length
    console.log("Category length: ", categoryLength)
    const categoryArr = []
    let questionMarks = ""
    const valueArr = []
    let i = 0

    for (let key in categories) {
        if (!allowed.includes(key)) {
            throw new Error ("Invalid field")
            continue
        }
        categoryArr.push(key)
        valueArr.push(categories[key])
        questionMarks += "?"
        if (i < categoryLength - 1) {
            questionMarks += ", "
        }
        i++
    }

    const result = await pool.query(`
    INSERT INTO tasks (${[...categoryArr]})
    VALUES (${questionMarks})
    `, [...valueArr])
    return result
}

/* -------------------------------------- */

// PATCH
// Update task
export async function updateTask(id, changes) {

    const changeLength = Object.entries(changes).length

    if (changeLength === 0) {
        throw new Error ("No changes passed")
        return
    }

    let queryString = ""
    let i = 0
    for (let key in changes) {
        if (!allowed.includes(key)) {
            throw new Error ("Invalid field")
            continue
        }
        queryString += `${key} = '${changes[key]}'`
        if (i < changeLength - 1) {
            queryString += ", "
        }
        i++
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

export async function deleteTaskById(id) {
    const result = await pool.query(`
        DELETE FROM tasks
        WHERE task_id = ?
    `, [id])
    return result
}

// Delete task by any field
export async function deleteTaskByFields(filters) {

    const filterLength = filters.length
    let queryString = ""
    const valueArr = []
    let i = 0

    if (filterLength === 0) {
        throw new Error ("No values passed")
        return
    }

    for (let key in filters) {
        if (!allowed.includes(key)) {
            throw new Error ("Invalid field")
            continue
        }
        queryString += `${key} = ?`
        valueArr.push(filters[key])
        if (i < filterLength - 1) {
            queryString += " AND "
        }
        i++
    }

    const result = await pool.query(`
        DELETE FROM tasks
        WHERE ${queryString}
    `, [...valueArr])
    return result
}

// Delete all tasks
export async function deleteAllTasks() {
    const result = await pool.query('DELETE FROM tasks')
    return result
}