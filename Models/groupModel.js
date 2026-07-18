import { pool } from '../database.js'

// GET
// Get all groups
export async function getAllGroups() {
    const [result] = await pool.query('SELECT * FROM groups_list')
    return result
}

// Get one group (filter by id)
export async function getGroupById(id) {
    const [result] = await pool.query(`
        SELECT * FROM groups_list
        WHERE group_id = ?
    `, [id])
    return result
}