USE empTracker_db;
SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary
FROM  role
JOIN department ON role.dept_id = department.id;