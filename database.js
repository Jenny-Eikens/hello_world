// All database code (pool, queries) goes in this file

/* TODO
- decide if I want PUT method on tasks and users
- add model and controller for users

- figure out how to enable GET using multiple fields + values
- optimize patch
- POST: figure out how to make values optional
*/

import mysql from 'mysql2'
import dotenv from 'dotenv'
import express from 'express'
import tasks from './Controllers/taskController.js'

const app = express()
app.use(express.json())
dotenv.config()

app.use('/tasks', tasks)


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

app.listen(3000, () => console.log('Server is running on port 3000'))