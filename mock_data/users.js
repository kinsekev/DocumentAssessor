const faker = require('faker');

var users = [];
var numUsers = 5;

for(let i = 0; i < numUsers; i++) {
    users.push({
        username: faker.name.findName(),
        id: faker.random.uuid()
    });
}

module.exports = users;
