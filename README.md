# MySQL Database with REST API (Express.js)

## Overview of Endpoints by Table

### <span style="text-decoration:underline"> Tasks </span>
#### GET
* <code>/tasks</code>
    * Get all tasks
* <code>/tasks/:id</code>
    * Get one or more tasks by id
    * Optionally add operator (<, <=, =, >=, >) via request body
* <code>/tasks/:description</code>
    * Get all tags associated with one task via junction table task_tags
* <code>/tasks?field1=value1&field2=value2</code>
    * Get tasks that match one or more filter conditions

#### POST
* <code>/tasks</code>
    * Add a task (pass in values via request body)
        * without tags OR
        * with tags (creates entries in junction table task_tags)

#### PATCH
* <code>/tasks/:id</code>
    * Change a task record (pass in values to change via request body)
        * without changing tags OR
        * with changing tags (deletes existing entries from junction table task_tags, then creates new entries)

#### DELETE
* <code>tasks/:id</code>
    * Delete one or more tasks by id
    * Optionally add operator (<, <=, =, >=, >) via request body
* <code>tasks?field1=value1&field2=value2</code>
    * Delete tasks that match one or more filter conditions
* <code>/tasks</code>
* Delete all tasks 

---

### <span style="text-decoration:underline"> Users </span>
#### GET
* <code>/users</code>
    * Get all users
* <code>/users/:id</code>
    * Get one or more users by id
    * Optionally add operator (<, <=, =, >=, >) via request body
* <code>users/:user_name</code>
    * Get all tasks assigned to a user via groups_list table
* <code>/users?field1=value1&field2=value2</code>
    * Get all users that match one or more filter conditions 

#### POST
* <code>/users</code>
    * Add a new user (pass in values via request body)

#### PATCH
* <code>/users/:id</code>
    * Change a user record (pass in values to change via request body)

#### DELETE
* <code>/users/:id</code>
    * Delete one ore more users by id 
    * Optionally add operator (<, <=, =, >=, >) via request body
* <code>/users?field1=value1&field2=value2</code>
    * Delete users that match one or more filter conditions 
* <code>/users</code>
    * Delete all users

---

### <span style="text-decoration:underline"> Tags </span>
#### GET
* <code>/tags</code>
    * Get all tags 
* <code>/tags/:name</code>
    * Get all tasks associated with one tag via junction table task_tags

#### POST
* <code>/tags</code>
    * Add a new tag (pass in values via request body)

---

### <span style="text-decoration:underline"> Groups </span>
#### GET
* <code>/groups</code>
    * Get all groups
* <code>groups/:id</code>
    * Get one or more groups by id
    * Optionally add operator (<, <=, =, >=, >) via request body

***



## Entity Relationship Diagram
![ERD](/MYSQL%20todo_app%20(.env)%20-%20todo_app%20-%20Diagram.png)  