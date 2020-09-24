
INSERT INTO department
    (name)
VALUES
    ("Engineering"),
    ("Buisness"),
    ("Human Resource");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("Engineer", 100000, 1),
    ("Manager", 15000, 2),
    ("HR", 90000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Oscar", "Ledezma", 1, null),
    ("Reina", "Villanueva", 2, 1),
    ("Michael", "Villanueva", 3, null);