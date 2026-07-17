import { pool } from '../database.js'

export async function getAllGroups() {
    const [result] = await pool.query('SELECT * FROM groups_list')
    return result
}

export async function getGroupById(id) {
    const [result] = await pool.query(`
        SELECT * FROM groups_list
        WHERE group_id = ?
    `, [id])
    return result
}