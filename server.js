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

let data = {
    members: [
        {
            id: 1,
            name: 'Pranshu',
            probability: 1,
            karma: 100
        },
        {
            id: 2,
            name: 'Prasad',
            probability: 1,
            karma: 100
        },
        {
            id: 3,
            name: 'Madhu',
            probability: 1,
            karma: 100
        },
        {
            id: 4,
            name: 'Sam',
            probability: 1,
            karma: 100
        }
    ]
};

/*
-- Validation -- 
Check if probability initialization required.
-- Validation -- 
Read in the member list.
Pick a member based on probabiliy.
Adjust the probability of winner.
Write the results to file.
*/
app.get('/run_pick_me', (req, res) => {
    n = data.members.length
    picked_index = Math.floor(Math.random() * n);
    res.send(data.members[picked_index]);
});

app.get('/get_members', (req, res) => {
    res.send(data.members);
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
