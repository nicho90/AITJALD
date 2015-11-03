"use strict"

//alert("Hello World - External");

function add(a, b, c) {
    'use strict';
    a + b + c;
};
console.log(add(1, 2, 3)); // -> undefined

function add_2nd_version(a, b, c) {
    var result = a + b + c;
    return result;
};
console.log(add_2nd_version(1, 2, 3)); // -> 6

if ('day' < 'daylight') {
    console.log(true);
} else {
    console.log(false);
}

if ('Hello' < 'hello') {
    console.log(true);
} else {
    console.log(false);
}


var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(numbers);

numbers.push(10);
console.log(numbers);

numbers.pop();
console.log(numbers);

numbers.unshift(-1, 0);
console.log(numbers);

numbers.shift(0, 3);
console.log(numbers);

numbers.splice(5, 7);
console.log(numbers);
