USE emptracker_db;
 SELECT role.id AS id, role.name AS name, department.name AS name, role.salary AS salary
 FROM role JOIN department on role.department_id = department.id