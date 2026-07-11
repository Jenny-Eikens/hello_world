import { pool } from '../database.js';

// GET
// Get all tags
export async function getAllTags() {
    const [result] = await pool.query('SELECT * FROM tags')
    return result
}
// Get one tag (filter by id)


/* -------------------------------------- */

// POST 
// Add tags
export async function addTag(tag) {
    const result = await pool.query(`
        INSERT INTO tags (name)
        VALUES (?)
    `, [tag])
}