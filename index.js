// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
let allEmployees = [];


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

const updateEmployeePrompt = [{
    type: "list",
    message: "Please choose an employee to update their role",
    name: "employee",
    choices: allEmployees
}];

const init = () => {
    inquirer
        .prompt(mainMenu)
        .then((response) => {
            switch (response.mainMenu) {
                // case 'View All Employees':
                //     viewEmps();
                //     break;
                // case 'Add Employee':
                //     addEmp();
                //     break;
                // case 'Update Employee Role':
                //     updateEmp();
                //     break;
                // case 'View All Roles':
                //     viewRoles();
                //     break;
                // case 'Add Role':
                //     addRole();
                //     break;
                case 'View All Departments':
                    viewDept();
                    break;
                case 'Add Department':
                    addDept();
                    break;
            }
        })
};
init();


const viewDept = () => {
    db.promise().query("SELECT * FROM department")
        .then(([rows, fields]) => {
            console.table(rows);
        })
        .catch(console.log)
        .then(() => db.end());
};

const addDept = () => {
    inquirer
        .prompt(deptPrompt)
        .then((response) => {
            genDept(response);
        })
};

genDept = (data) => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    db.promise().query(sql, data);
    console.log("Added Department")
    init();

}