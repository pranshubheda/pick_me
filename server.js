const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Pick Me Server listening at http://localhost:${port}`);
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
    avaialble_members = find_available_memebers();
    if (avaialble_members.length > 0) {
        n = avaialble_members.length;
        picked_index = Math.floor(Math.random() * n);
        member_id_selected = avaialble_members[picked_index];
        member_index = member_id_selected - 1;
        res.send(data.members[member_index]);
    }
});

app.get('/finalize_pick/:pick', (req, res) => {
    member_id = req.params.pick;
    member_index = member_id_selected - 1;
    console.log(member_id);
    data.members[member_index].probability = 0;
    res.sendStatus(200);
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


function find_available_memebers() {
    available_members = [];
    data.members.forEach(member => {
        if (member.probability > 0) {
            available_members.push(member.id);
        }
    });
    return available_members;
}