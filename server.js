const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const db = require('./db');
const members = require('./members');
const teams = require('./teams');
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 

let data;

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

    db.connect_to_db();
    // console.log(db.get_members_collection())
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
    
    app.get('/get_all_members', (req, res) => {
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
            team_members = docs
            data = {}
            team_members.forEach(team_member => {
                data[team_member._id] = team_member;
            });
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

    app.post('/add_team/', (req, res) => {
        var team = req.body;
        teams.add_team(team.name).then( (docs) => {
            res.status(200).send("Successfully added team");
        })
        .catch( (err) => {
            res.status(403).send(err)
        });
    });

    app.post('/add_member/', (req, res) => {
        var member = req.body;
        members.add_member(member).then( (docs) => {
            res.status(200).send("Successfully added member");
        })
        .catch( (err) => {
            res.status(403).send(err)
        });
    });

    app.get('/get_all_teams', (req, res) => {
        teams.find_all().then( (docs) => {
            data = docs
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/search_members/:keyword', (req, res) => {
        members.search(req.params.keyword).then( (docs) => {
            data = docs
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/search_teams/:keyword', (req, res) => {
        teams.search(req.params.keyword).then( (docs) => {
            data = docs
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/get_member/:member_name', (req, res) => {
        members.check_if_exists(req.params.member_name).then( (members) => {
            data = members
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });

    app.get('/get_team/:team_name', (req, res) => {
        teams.check_if_exists(req.params.team_name).then( (teams) => {
            data = teams
            res.send(data);
        })
        .catch( (err) => {
            console.log(err);
        });
    });
}

initialize_server();

setup_routes();