INSERT INTO department
    (name)
VALUES
    ("Engineering"),
    ("R&D"),
    ("Human Resource"),
    ("Marketing"),
    ("Accounting & Finance");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Engineer", 100000, 1),
    ("Lead Engineer", 100000, 2),
    ("Accountant", 100000, 5),
    ("Human Resource", 100000, 3),
    ("Sales person", 100000, 4);


INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Oscar", "Ledezma", 1, 2),
    ("Reina", "Villanueva", 2, null),
    ("Michael", "Villanueva", 3, null),
    ("Leilani", "Bush", 4, null),
    ("John", "Lennon", 4, 3);