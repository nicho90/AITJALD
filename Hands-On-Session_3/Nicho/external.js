"use strict"


// PART I

function Employee(firstName, lastName, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
};

function Department(name, employees) {
    this.name = name;
    this.employees = employees;
    this.addNewEmployee = function (employee) {
        this.employees.push(employee);
    };
};


var a = new Employee("Nicho", "S.", 25);
var b = new Employee("Joanna", "K.", 25);

var d = new Department("GEO-1", [
    a, b
]);

d.addNewEmployee(new Employee("André", "W.", 25));

console.log(d);



// PART II

willNotChange(1);
willChange(1);

function willNotChange(x) {
    console.log("Passage by value, before assignment x = " + x + "\n");
    x = 2;
    console.log("Passage by value, after assignment x = " + x + "\n");
}

function willChange(x) {
    console.log("Passage by reference, before assignment x.num = " + x.num + "\n");
    x.num = 2;
    console.log("Passage by reference, after assignment, x.num = " + x.num + "\n");
}
