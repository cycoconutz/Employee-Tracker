const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '4grftk3g',
        database: 'empTracker_db'
    },
    console.log(`Connected to employee tracker database`)
);

const ascii = () => {
    console.log("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~")
    console.log("*                                              *")
    console.log("~               EMPLOYEE MANAGER               ~")
    console.log("*                                              *")
    console.log("*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~")
    menu()
};

const mainMenu = {
    type: "list",
    message: "What would you like to do?",
    name: "mainMenu",
    choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "**Quit**"],
};

const menu = () => {
    inquirer
        .prompt(mainMenu)
        .then((response) => {
            switch (response.mainMenu) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    addEmployeeName();
                    break;
                case 'Update Employee Role':
                    updateEmp();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewDepts();
                    break;
                case 'Add Department':
                    addDept();
                    break;
                case '**Quit**':
                    process.exit();
            }
        })
};

const viewEmployees = () => {
    const sql = `SELECT a.id AS id, a.first_name AS first_name, a.last_name AS last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(b.first_name, ' ', b.last_name) AS manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id JOIN role ON a.role_id = role.id JOIN department ON role.dept_id = department.id `;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            const table = consoleTable.getTable(rows);
            console.log(table);
        })
        .catch(console.log)
        .then(() => menu());
};

const addEmployeeName = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please enter the employee's first name: ",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please enter the employee's last name: ",
            name: "lastName"
        }
    ]).then(answers => {
        addEmployeeRole(answers.firstName.trim(), answers.lastName.trim());
    });
}

const addEmployeeRole = (firstName, lastName) => {
    let sql = "SELECT * FROM role";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select the new employee's role: ",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        choices.push(response[i].title);
                    }
                    return choices;
                },
                name: "empRole"
            },
        ]).then(answer => {
            let role_id;
            for (let i = 0; i < response.length; i++) {
                if (response[i].title === answer.empRole) {
                    role_id = response[i].id;
                }
            }
            addEmployeeManager(firstName, lastName, role_id);
        })
    })
};

const addEmployeeManager = (firstName, lastName, role_id) => {
    let sql = "SELECT id, first_name, last_name FROM employee";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select a manager for this employee",
                choices: () => {
                    const choices = ["None"];
                    for (let i = 0; i < response.length; i++) {
                        let currName = `${response[i].first_name} ${response[i].last_name}`;
                        choices.push(currName);
                    }
                    return choices;
                },
                name: "manager"
            }
        ]).then(answer => {
            if (answer.manager === "None") {
                addEmployee(firstName, lastName, role_id, null);
                return;
            }
            let manager_id;
            const managerName = answer.manager.split(" ");
            for (let i = 0; i < response.length; i++) {
                if (response[i].first_name === managerName[0] && response[i].last_name === managerName[1]) {
                    manager_id = response[i].id;
                }
            };
            addEmployee(firstName, lastName, role_id, manager_id);
        })
    })
}

const addEmployee = (firstName, lastName, role_id, manager_id) => {
    let sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, role_id, manager_id], (err, res) => {
        if (err) throw err;
        console.log(`New Employee ${firstName} ${lastName} added to database`);
        menu();
    })
};

const updateEmp = () => {
    let sql = "SELECT id, first_name, last_name, role_id FROM employee";
    db.query(sql, (err, response) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select an employee whose role you wish to update",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        let currName = `${response[i].first_name} ${response[i].last_name}`;
                        choices.push(currName);
                    }
                    return choices;
                },
                name: "employee"
            }
        ]).then(answer => {
            let id;
            const employeeName = answer.employee.split(" ");
            for (let i = 0; i < response.length; i++) {
                if (response[i].first_name === employeeName[0] && response[i].last_name === employeeName[1]) {
                    id = response[i].id;
                }
            };
            askEmpRole(id);
        })
    })
};

const askEmpRole = (id) => {
    let sql = `SELECT role.id AS id, role.title AS title FROM role`;
    db.query(sql, (err, response) => {
        if (err) throw (err);
        inquirer.prompt([
            {
                type: "list",
                message: "Please select the employee's new role: ",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < response.length; i++) {
                        choices.push(response[i].title);
                    }
                    return choices;
                },
                name: "newRole"
            },
        ])
            .then(answer => {
                let role_id;
                for (let i = 0; i < response.length; i++) {
                    if (response[i].title === answer.newRole) {
                        role_id = response[i].id;
                    }
                }
                updateEmpRole(id, role_id);
            })
    })
};

const updateEmpRole = (id, role_id) => {
    let sql = `UPDATE employee SET role_id = ${role_id} WHERE id = ${id}`;
    db.query(sql, (err, response) => {
        if (err) throw (err);
        console.log(`Employee Role Updated`);
        menu();
    });
}

const viewRoles = () => {
    const sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department ON role.dept_id = department.id`;

    db.promise().query(sql)
        .then(([rows, fields]) => {
            const table = consoleTable.getTable(rows);
            console.log(table);
        })
        .catch(console.log)
        .then(() => menu());
};

const addRole = () => {
    let sql = "SELECT * FROM department";
    db.query(sql, (err, result) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the title of this role?",
                name: "roleTitle",
            },
            {
                type: "number",
                message: "What is the salary for this position?",
                name: "roleSalary",
            },
            {
                type: "list",
                message: "Please choose a department",
                choices: () => {
                    const choices = [];
                    for (let i = 0; i < result.length; i++) {
                        choices.push(result[i].name);
                    }
                    return choices;
                },
                name: "department"
            }
        ]).then(answer => {
            let dept_id;
            for (let i = 0; i < result.length; i++) {
                if (result[i].name === answer.department) {
                    dept_id = result[i].id;
                }
            }
            sql = "INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)";
            db.query(sql, [answer.roleTitle, answer.roleSalary, dept_id], (err, res) => {
                if (err) throw err;

                menu();
            });
        });
    });
};

const viewDepts = () => {
    const sql = "SELECT * FROM department";

    db.promise().query(sql)
        .then(([rows, fields]) => {
            const table = consoleTable.getTable(rows);
            console.log(table);
        })
        .catch(console.log)
        .then(() => menu());
};

const deptPrompt = {
    type: "input",
    message: "Please enter the name of the new department: ",
    name: "deptName",
};

const addDept = () => {
    inquirer
        .prompt(deptPrompt)
        .then((response) => {
            genDept(response);
        })
};

const genDept = (data) => {
    const { deptName } = data;
    const params = [deptName];
    const sql = `INSERT INTO department (name) VALUES (?)`;
    db.promise().query(sql, params)
        .then(`Added new department: ${deptName}`)
        .catch(console.log)
        .then(() => menu());
};

ascii();