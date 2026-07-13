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
    return result
}

// Get one or more tasks (filter by any column)
export async function getTasksByFields(filters) {

    const filterLength = filters.length
    let queryString = ""
    const valueArr = []

    for (let i = 0; i < filterLength; i++) {
        const field = filters[i][0]
        const value = filters[i][1]
        if (!allowed.includes(field)) {
            throw new Error(`Invalid field '${field}'`)
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

// Get all tags associated with a task
export async function getTaskTags(description) {
    const [result] = await pool.query(`
        SELECT tasks.description AS Task, tags.name AS Tag
        FROM tasks
        JOIN task_tags ON tasks.task_id = task_tags.task_id
        JOIN tags ON tags.tag_id = task_tags.tag_id
        WHERE tasks.description = ?
    `, [description])
    return result
}

/* -------------------------------------- */

// POST
// Add task
export async function addTask(categories) {
    let categoryLength = Object.entries(categories).length

    if (categoryLength === 0) {
        throw new Error("No fields passed")
    }

    const fieldArr = []
    const valueArr = []

    for (let key in categories) {
        if (key === "tags") {
            continue
        }
        if (!allowed.includes(key)) {
            throw new Error(`Invalid field '${key}'`)
            continue
        }
        fieldArr.push(key)
        valueArr.push(categories[key])
    }
    const placeholders = valueArr.map(() => "?").join(", ")
    const fields = fieldArr.join(", ")

    const [result] = await pool.query(`
    INSERT INTO tasks (${fields})
    VALUES (${placeholders}) 
    `, [...valueArr])
    return result
}

// Insert task tags into junction table
export async function addTaskTags(id, tags) {
    const queryString = tags.map(() => "name = ?").join(" OR ")

    // returns array of objects with key 'tag_id'
    const [tagIds] = await pool.query(`
          SELECT tag_id FROM tags
          WHERE ${queryString} 
        `, [...tags])

    // creates nested arrays [task_id, tag_id]
    const valueArr = tagIds.map((tagId) => [id, tagId.tag_id])

    const [result] = await pool.query(`
          INSERT INTO task_tags (task_id, tag_id)  
          VALUES ?
        `, [valueArr])
    return result
}

/* -------------------------------------- */

// PATCH
// Update task
export async function updateTask(id, changes) {

    if (!changes) {
        throw new Error("No changes passed")
    }
    let changeLength = Object.entries(changes).length
    if (changes.tags) {
        changeLength--
    }

    let queryString = ""
    let i = 0
    for (let key in changes) {
        if (key === "tags") {
            continue
        }
        if (!allowed.includes(key)) {
            throw new Error(`Invalid field '${key}'`)
        }
        queryString += `${key} = '${changes[key]}'`
        if (i < changeLength - 1) {
            queryString += ", "
        }
        i++
    }

    const [result] = await pool.query(`
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
    const [result] = await pool.query(`
        DELETE FROM tasks
        WHERE task_id = ?
    `, [id])
    return result
}

// Delete one or more tasks by any field(s)
export async function deleteTasksByFields(filters) {
    const filterLength = filters.length
    let queryString = ""
    const valueArr = []

    if (filterLength === 0) {
        throw new Error("No values passed")
    }

    for (let i = 0; i < filterLength; i++) {
        const field = filters[i][0]
        const value = filters[i][1]

        if (!allowed.includes(field)) {
            throw new Error(`Invalid field '${field}'`)
        }

        queryString += `${field} = ?`
        valueArr.push(value)

        if (i < filterLength - 1) {
            queryString += ' AND '
        }
    }

    const [result] = await pool.query(`
        DELETE FROM tasks
        WHERE ${queryString}
    `, [...valueArr])
    return result
}

// Delete task tags from junction table
export async function deleteTaskTags(id) {
    const [result] = await pool.query(`
        DELETE FROM task_tags
        WHERE task_id = ?
    `, [id])
}

// Delete all tasks
export async function deleteAllTasks() {
    const result = await pool.query('DELETE FROM tasks')
    return result
}