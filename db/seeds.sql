USE emptracker_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Legal"),
       ("Service");

INSERT INTO role (name, salary, department_id)
VALUES ("Sales Rep", 60000, 1),
       ("Lawyer", 100000, 2),
       ("Service Rep", 50000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Abbey", "Zim", 1, null),
       ("Brock", "Yancy", 1, null),
       ("Charlie", "Xanathar", 1, null),
       ("Deb", "Wallace", 1, null);
