require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoletable = require("console.table");

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

// console.log(`%c
// ------------------------------------------------------------------------------------
// ______                 _                         _______             _
// |  ____|               | |                       |__   __|           | |
// | |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __
// |  __| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \    | | '__/ _` |/ __| |/ / _ \ '__|
// | |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |
// |______|_| |_| |_| .__/|_|\___/ \__, |\___|\___|    |_|_|  \__,_|\___|_|\_\___|_|
//                  | |             __/ |
//                  |_|            |___/
// ------------------------------------------------------------------------------------`)

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
        "Update Employee",
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

        case "Update Employee":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewDepartment() {
  var query = "SELECT * FROM department";

  connection.query(query, function (err, res) {
    if (err) return err;
    //console.log(res);
    console.table(res);
    runSearch();
  });
}

function viewRoles() {
  var query = "SELECT * FROM role";

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    runSearch();
  });
}

function viewEmployees() {
  var query = "SELECT * FROM employee";

  connection.query(query, function (err, res) {
    if (err) return err;
    console.table(res);
    runSearch();
  });
}

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

function addRole() {
  inquirer.prompt([
    {
      name: "addrole",
      type: "input",
      message: "What is the name of the new role?",
    },
    {
      name: "addsalary",
      type: "input",
      message: "What is the salary for this role?",
    },
    {
      name: "dept",
      type: "list",
      message: "What department is this role in?",
      choices: function () {
      var addDept = [],
      var query = "SELECT * FROM department"

      connection.query(query, function (err, res) {
      if (err) return err;
     addDept.push(res)
    });      
    }
    },
  ]).then(function (answer) {
    console.log("addDept")
  });
}
