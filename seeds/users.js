const faker = require('faker');
const User = require('../models/user');

const users = [];

for (let i = 0; i < 5; i++) {
    let username = faker.name.findName();
    users.push({ username });
}

function seedUsersDB() {
    User.deleteMany({}, (err) =>  {
        if(err) {
            console.log(err);
        } else {
            console.log('Removed Users');
            users.forEach(function(seed) {
                User.create(seed, (err, user) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('User created');
                    }
                });
            });
        }
    });
}

module.exports = seedUsersDB;