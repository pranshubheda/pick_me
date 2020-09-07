const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const members = require('./members');

let data;

initialize_server();

setup_routes();

function find_available_memebers() {
    available_members = [];
    data.forEach(member => {
        if (member.probability > 0) {
            available_members.push(member._id);
        }
    });
    console.log(available_members);
    return available_members;
}

function initialize_server() {
    app.use(express.static('public'));
    
    app.listen(port, () => {
        console.log(`Pick Me Server listening at http://localhost:${port}`);
    });
}

function setup_routes() {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    
    app.get('/reinitialize', (req, res) => {
        data.forEach(member => {
            members.enable(member._id);
        });
        res.sendStatus(200);
    });
    
    app.get('/get_members', (req, res) => {
        members.find_all().then( (docs) => {
            data = docs
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/get_members/:team_name', (req, res) => {
        members.find_team_members(req.params.team_name).then( (docs) => {
            data = docs
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });
    
    app.get('/save', (req, res) => {
        fs.writeFile('member_states.json', JSON.stringify(data), function(err) {
            if (err) {
                return console.log.err('Not able to save data to file');
            }
            console.log('Data saved to file successfully')
        });
        res.sendStatus(200);
    });

    app.get('/disable/:member_id', (req, res) => {
        members.disable(parseInt(req.params.member_id)).then( (msg) => {
            res.send(msg);
        })
        .catch( (err) => {
            console.log(err);
        });
    });
    
    app.get('/enable/:member_id', (req, res) => {
        members.enable(parseInt(req.params.member_id)).then( (msg) => {
            res.send(msg);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/finalize_pick/:pick', (req, res) => {
        members.finalize_pick(parseInt(req.params.pick)).then( (msg) => {
            res.send(msg);
        })
        .catch( (err) => {
            console.log(err);
        });
    });
}