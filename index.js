// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'emptracker_db'
    },
    console.log(`Connected to the emptracker_db database.`)
);

//Main Menu Inquirer
const mainMenu = {
    type: 'list',
    message: 'What would you like to do?',
    name: "mainMenu",
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', '**Exit**']
};

const deptPrompt = {
    type: 'input',
    message: 'Please enter the name of the new department: ',
    name: 'deptName'
};

const rolePrompt = [{
    type: 'input',
    message: 'Please enter the role title: ',
    name: 'roleTitle'
},
{
    type: 'input',
    message: 'Please enter the salary of the role: ',
    name: 'roleSalary'
}, {
    type: 'input',
    message: 'Please enter the department id the role belongs to: ',
    name: 'roleDept'
}];

const employeePrompt = [{
    type: 'input',
    message: "Please enter the employee's First Name: ",
    name: 'empFirstName'
},
{
    type: 'input',
    message: "Please enter the employee's Last Name: ",
    name: 'empLastName'
}, {
    type: 'input',
    message: 'Please enter the role id for the new employee: ',
    name: 'empRole'
}, {
    type: 'input',
    message: "Please enter the manager's employee id for the new employee's manager: ",
    default: "NULL",
    name: 'empManager'
}];

// const updateEmployeePrompt = [{
//     type: "list",
//     message: "Please choose an employee to update their role",
//     name: "employee",
//     choices:
// }];

const init = () => {
    inquirer
        .prompt(mainMenu)
        .then((response) => {
            switch (response.mainMenu) {
                case 'View All Employees':
                    viewEmps();
                    break;
                case 'Add Employee':
                    addEmp();
                    break;
                // case 'Update Employee Role':
                //     updateEmp();
                //     break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDept();
                    break;
                case 'Add Department':
                    addDept();
                    break;
                case '**Exit**':
                    db.end();
                    break;
            }
        })
};
init();

//View Employees
const viewEmps = () => {
    db.promise().query("SELECT * FROM employee")
        .then(([rows, fields]) => {
            console.table(rows);
            init();
        })
};

//Add Employee
const addEmp = () => {
    inquirer
        .prompt(employeePrompt)
        .then((response) => {
            genEmp(response);
        })
};

genEmp = (data) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [data.empFirstName, data.empLastName, data.empRole, data.empManager]
    console.log(params)
    db.promise().query(sql, params)
    console.log("Added Employee")
    init();
}

// View Roles
const viewRoles = () => {
    const sql = `SELECT role.id AS id, role.name AS name, department.name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id;`
    db.promise().query(sql)
        .then(([rows, fields]) => {
            console.table(rows);
            init();
        })
};

// Add a Role
const addRole = () => {
    inquirer
        .prompt(rolePrompt)
        .then((response) => {
            genRole(response);
        })
};

genRole = (data) => {
    const sql = `INSERT INTO role (name, salary, department_id) VALUES (?,?,?)`;
    const params = [data.roleTitle, data.roleSalary, data.roleDept]
    db.promise().query(sql, params)
    console.log("Added Role")
    init();
}

// View Department Database
const viewDept = () => {
    db.promise().query("SELECT * FROM department")
        .then(([rows, fields]) => {
            console.table(rows);
            init();
        })
};

// Adding Departments to Database
const addDept = () => {
    inquirer
        .prompt(deptPrompt)
        .then((response) => {
            genDept(response);
        })
};

genDept = (data) => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [data.deptName]
    db.promise().query(sql, params)
    console.log("Added Department")
    init();

};