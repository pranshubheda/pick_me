const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.listen(port, () => {
    console.log('Pick Me Server listening at http://localhost:${port}');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/run_pick_me', (req, res) => {
    console.log("TEST")
    data = {
        name: 'Pranshu',
        probability: 1
    };
    res.send(data);
    // res.send({ hello: 'world' });
});

/*
Use this function to add a new member to be considered 
for the pick_me program.
*/
function add_member(member) {
    data = {
        name: 'Pranshu',
        probability: 1
    };

    fs.writeFile('test_data.json', data, function(err) {
        if (err) {
            return console.log.err('Not able to save data to file');
        }
        console.log('Data saved to file successfully')
    });
}

/*
Use this function to add a new member to be considered 
for the pick_me program.
*/
function remove_member(member) {
    //pass
}

/*
Use this function to initialize the probabilities
of the team members. A fresh start.
*/
function initialize_probabilities() {
    //pass
}

/*
-- Validation -- 
Check if probability initialization required.
-- Validation -- 
Read in the member list.
Pick a member based on probabiliy.
Adjust the probability of winner.
Write the results to file.
*/
function run_pick_me() {
    return 'Running pick me'
}