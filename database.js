// All database code (pool, queries) goes in this file

import mysql from 'mysql2'
import dotenv from 'dotenv'
import express from 'express'
import tasks from './Controllers/taskController.js'
import users from './Controllers/userController.js'
import tags from './Controllers/tagController.js'
import groups from './Controllers/groupController.js'

const app = express()
const PORT = 4242
app.use(express.json())
dotenv.config()

app.use('/tasks', tasks)
app.use('/users', users)
app.use('/tags', tags)
app.use('/groups', groups)


export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))