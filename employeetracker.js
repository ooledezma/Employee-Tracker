// Connectiong configuration
require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");
var logo = require('asciiart-logo');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USERNAME,

  // Your password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

//Inital Start Of Application

console.log(
  logo({
      name: 'Employee Tracker',
      font: 'Star Wars',
      lineChars: 10,
      padding: 2,
      margin: 3,
      borderColor: 'white',
      logoColor: 'bold-white',
  })
  .emptyLine()
  .render()
);

function runSearch() {
  inquirer
    .prompt({
      name: "choices",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.choices) {
        case "View All Departments":
          viewDepartment();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Employees":
          viewEmployees();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Exit":
          console.log("Good Bye! Have A Great Day!");
          connection.end();
          break;
      }
    });
}

//View All Departments
function viewDepartment() {
  var query = "SELECT * FROM department";

  connection.query(query, function (err, res) {
    if (err) return err;
    //console.log(res);
    console.table(res);
    runSearch();
  });
}

//View All Roles
function viewRoles() {
  var query = "SELECT * FROM role";

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    runSearch();
  });
}

//View All Employees
function viewEmployees() {
  var query =
    'SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(man.first_name, " " ,man.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee man on employee.manager_id = man.id;';

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    runSearch();
  });
}

//Add A New Department
function addDepartment() {
  inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What is the name of the new department?",
    })
    .then(function (answer) {
      var query = "INSERT INTO department (name) VALUES (?)";

      connection.query(query, answer.addDept, function (err, res) {
        if (err) return err;
        console.log("Department Added!");
        runSearch();
      });
    });
}

//Add A New Role
function addRole() {
  var query = "SELECT * FROM department";

  connection.query(query, function (err, res) {
    if (err) return err;

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "What is the name of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for this role?",
        },
        {
          name: "dept",
          type: "list",
          message: "What department is this role in?",
          choices: function () {
            var choiceArray = [];
            //console.log(res);
            for (let i = 0; i < res.length; i++) {
              choiceArray.push(res[i].name);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        //console.log(answer);
        var chosenDepartment;
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === answer.dept) {
            chosenDepartment = res[i].id;
            //console.log(chosenDepartment);
          }
        }
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.role,
            salary: answer.salary,
            department_id: chosenDepartment,
          },
          function (err) {
            if (err) throw err;
            console.log("Role Added!");
            runSearch();
          }
        );
      });
  });
}

//Add An Employee
function addEmployee() {
  var query = "SELECT * FROM role";

  connection.query(query, function (err, res) {
    if (err) return err;
    inquirer
      .prompt([
        {
          name: "firstname",
          type: "input",
          message: "What is the first name of the employee?",
        },
        {
          name: "lastname",
          type: "input",
          message: "What is the last name of the employee?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the role of the employee?",
          choices: function () {
            var roleArray = [];
            //console.log(res);
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }
            return roleArray;
          },
        },
      ])
      .then(function (ans) {
        //console.log(ans);
        var chosenrole;
        var firstname = ans.firstname;
        var lastname = ans.lastname;

        for (let i = 0; i < res.length; i++) {
          if (res[i].title === ans.role) {
            chosenrole = res[i].id;
           //console.log(chosenrole);
          }
        }
        connection.query("SELECT * FROM employee", query, function (err, res) {
          inquirer
            .prompt([
              {
                name: "manager",
                type: "list",
                message: "Who is the employee manager?",
                choices: function () {
                  var nameArray = [];
                  for (let i = 0; i < res.length; i++) {
                    nameArray.push(res[i].first_name + " " + res[i].last_name);
                  }
                  return nameArray;
                },
              },
            ])
            .then(function (answer) {
              //console.log(answer);
              var chosenManager;
              for (let i = 0; i < res.length; i++) {
                if (
                  res[i].first_name + " " + res[i].last_name ===
                  answer.manager
                ) {
                  chosenManager = res[i].id;
                  //console.log(chosenManager);
                }
              }
              connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: firstname,
                  last_name: lastname,
                  role_id: chosenrole,
                  manager_id: chosenManager,
                },
                function (err) {
                  if (err) throw err;
                  //console.log("Employee Added!");
                  runSearch();
                }
              );
            });
        });
      });
  });
}

//Add Employee Role
function updateEmployeeRole() {
  var query = "SELECT * FROM employee";

  connection.query(query, function (err, res) {
    if (err) return err;
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: function () {
            var nameArray = [];
            for (let i = 0; i < res.length; i++) {
              nameArray.push(res[i].first_name + " " + res[i].last_name);
            }
            return nameArray;
          },
        },
      ])
      .then(function (ans) {
        //console.log(ans);
        var chosenEmployee;
        for (let i = 0; i < res.length; i++) {
          if (res[i].first_name + " " + res[i].last_name === ans.employee) {
            chosenEmployee = res[i].id;
            //console.log(chosenEmployee);
          }
        }

        connection.query("SELECT * FROM role", query, function (err, res) {
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "Who is the employee's new role?",
                choices: function () {
                  var roleArray = [];
                  for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title);
                  }
                  return roleArray;
                },
              },
            ])
            .then(function (answer) {
              //console.log(answer);
              var chosenRole;
              for (let i = 0; i < res.length; i++) {
                if (res[i].title === answer.role) {
                  chosenRole = res[i].id;
                  //console.log(chosenRole);
                }
              }

              connection.query(
                "UPDATE employee SET ? WHERE ?",
                [{ role_id: chosenRole }, { id: chosenEmployee }],
                function (err) {
                  if (err) throw err;
                  console.log("Employee Updated");
                  runSearch();
                }
              );
            });
        });
      });
  });
}
