USE empTracker_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Legal"),
       ("Service");

INSERT INTO role (title, salary, dept_id)
VALUES  ("Sales Rep", 60000, 1),
        ("Legal", 100000, 2),
        ("Service Rep", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Abbey", "Zwell", 1, null),
        ("Barry", "Yancy", 2, null),
        ("Charlie", "Xanthu", 3, 1);