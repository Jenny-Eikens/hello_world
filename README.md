# MySQL Database with REST API (Express.js)

## Overview of Operations by Table

### Tasks
#### // Read
* Get all tasks
* Get one task by id
* Get tasks that match one or more filter conditions
* Get all tags associated with one task via junction table task_tags

#### // Create
* Add a task
    * without tags OR
    * with tags (creates entries in junction table task_tags)

#### // Update
* Change a task record
    * without changing tags OR
    * with changing tags (deletes existing entries from junction table task_tags, then creates new entries)

#### // Delete
* Delete one task by id
* Delete tasks that match one or more filter conditions
* Delete all tasks 

---

### Users
#### // Read
* Get all users
* Get one user by id
* Get all users that match one or more filter conditions 
* Get all tasks assigned to a user by user name

#### // Create
* Add a new user

#### // Update
* Change a user record

#### // Delete
* Delete one user by id 
* Delete users that match one or more filter conditions 
* Delete all users

---

### Tags
#### // Read
* Get all tags 
* Get all tasks associated with one tag via junction table task_tags

#### // Create
* Add a new tag

---

### Groups
#### // Read
* Get all groups
* Get one group by id

---



## Entity Relationship Diagram
![ERD](/MYSQL%20todo_app%20(.env)%20-%20todo_app%20-%20Diagram.png)  