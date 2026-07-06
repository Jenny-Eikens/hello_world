CREATE DATABASE todo_app;
USE todo_app;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    user_name VARCHAR(61) NOT NULL,
    email VARCHAR(254) NOT NULL,
    user_group_id INT NOT NULL,
    PRIMARY KEY (group_id),
    FOREIGN KEY (user_group_id) REFERENCES groups_list(group_id)
);

CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
SET NEW.user_name = CONCAT(NEW.first_name, '.', NEW.last_name);


CREATE TABLE tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(254) NOT NULL 
        CHECK (LENGTH(TRIM(description)) > 0), 
    urgency VARCHAR(7) NOT NULL,
    status VARCHAR(11) NOT NULL DEFAULT 'new',
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    category VARCHAR(10) NOT NULL DEFAULT 'other',
    task_group_id INT,
    PRIMARY KEY (group_id),
    FOREIGN KEY (task_group_id) REFERENCES groups_list(group_id),
    CONSTRAINT status_constraint 
        CHECK (status IN ('new', 'in progress', 'complete', 'cancelled')),
    CONSTRAINT category_constraint 
        CHECK (category IN ('finances', 'household', 'health', 'birthday', 'other')),
    CONSTRAINT urgency_constraint 
        CHECK (urgency IN ('extreme', 'high', 'medium', 'low'))
);

CREATE TABLE groups_list (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(254) NOT NULL
);

CREATE TABLE tags (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL
);

CREATE TABLE task_tags (
    task_id INT,
    tag_id INT,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id),
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id)
);

-- INSERT INTO users (first_name, last_name, email)
-- VALUES ('Mary', 'Smith', 'msmith@gmail.com');

-- INSERT INTO tasks (description, urgency, category)
-- VALUES ('Finish documentation', 'medium', 'work');

-- INSERT INTO groups_list (name, description) 
-- VALUES ('Party planning committee', 'Group for planning and hosting parties');

-- INSERT INTO tags (name)
-- VALUES 
-- ('fun'),
-- ('time-consuming'),
-- ('tedious');

-- INSERT INTO task_tags
-- VALUES (1, 1);