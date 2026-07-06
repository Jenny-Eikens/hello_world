import { pool } from "../database.js";

const allowed = ["user_id", "first_name", "last_name", "user_name", "email", "user_group_id"]

// GET
// Get all users
export async function getAllUsers() {
    const [result] = await pool.query('SELECT * FROM users')
    return result
}

// Get one user (filter by id)
export async function getUserById(id) {
    const [result] = await pool.query(`
        SELECT * FROM users
        WHERE user_id = ?
    `, [id])
    return result
}

// Get one or more users (filter by any column)
export async function getUsersByFields(filters) {
    const filterLength = filters.length

    let queryString = ""
    let valueArr = []
    let i = 0

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
       
    const [result] = await pool.query(`
        SELECT * FROM users
        WHERE ${queryString}
    `, [...valueArr])
    return result
}

/* -------------------------------------- */

// POST
// Add user
export async function addUser(categories) {
    let categoryLength = Object.entries(categories).length

    if (categoryLength === 0) {
        throw new Error ("No fields passed")
        return 
    }

    const fieldArr = []
    let questionMarks = ""
    const valueArr = []
    let i = 0

    for (let key in categories) {
        if (!allowed.includes(key)) {
            throw new Error ("Invalid field")
            continue
        }
        fieldArr.push(key)
        questionMarks += "?"
        valueArr.push(categories[key])

        if (i < categoryLength - 1) {
            questionMarks += ", "
        }
        i++
    }

    const result = await pool.query(`
        INSERT INTO users (${[...fieldArr]})
        VALUES (${questionMarks})
    `, [...valueArr])
    return result
}

/* -------------------------------------- */

// PATCH 
// Update user

export async function updateUser(id, changes) {

    if (!changes) {
        throw new Error ("No changes passed")
        return
    }

    const changeLength = Object.entries(changes).length

    let queryString = ""
    let i = 0

    for (let key in changes) {
        if (!allowed.includes(key)) {
            throw new Error("Invalid field")
            continue
        }
        queryString += `${key} = '${changes[key]}'`

        if (i < changeLength - 1) {
            queryString += ", "
        }
        i++
    }
    

    const result = await pool.query(`
        UPDATE users
        SET ${queryString}
        WHERE user_id = ?
    `, [id])
    return result
}

/* -------------------------------------- */

// DELETE
// Delete user by id
export async function deleteUserById(id) {
    const [result] = await pool.query(`
        DELETE FROM users
        WHERE user_id = ?
    `, [id])
    return result
}

// Delete one or more users by any field(s)
export async function deleteUsersByFields(filters) {
    const filterLength = filters.length
    let queryString = ""
    const valueArr = []

    if (filterLength === 0) {
        throw new Error ("No values passed")
        return
    }

    for (let i = 0; i < filterLength; i++) {
        const field = filters[i][0]
        const value = filters[i][1]

        queryString += `${field} = ?`
        valueArr.push(value)

        if (i < filterLength - 1) {
            queryString += ' AND '
        }
    }

    const [result] = await pool.query(`
        DELETE FROM users 
        WHERE ${queryString}
    `, [...valueArr])
    return result
}

// Delete all users
export async function deleteAllUsers() {
    const result = await pool.query('DELETE FROM users')
    return result
}