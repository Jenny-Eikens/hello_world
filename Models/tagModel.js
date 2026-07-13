import { pool } from '../database.js';

// GET 
// Get all tags
export async function getAllTags() {
    const [result] = await pool.query('SELECT * FROM tags')
    return result
}
// Get all tasks associated with a tag
export async function getTagTasks(name) {
    const [result] = await pool.query(`
        SELECT tags.name AS Tag, tasks.description AS Task
        FROM tags
        JOIN task_tags ON tags.tag_id = task_tags.tag_id
        JOIN tasks ON tasks.task_id = task_tags.task_id
        WHERE tags.name = ?
    `, [name])
    return result
}

/* -------------------------------------- */

// POST 
// Add tags
export async function addTag(tag) {
    const result = await pool.query(`
        INSERT INTO tags (name)
        VALUES (?)
    `, [tag])
    return result
}