const { query } = require('express');
const db = require('./db');

exports.add_team = function (team) {
    return new Promise((resolve, reject) => {
        this.check_if_exists(team).then( teams => {
            let team_exists = teams.length > 0 ? true : false;
            if (team_exists) {
                return reject("Team already exists");
            }
            this.find_max_id().then(max_id => {
                let new_team = {  _id: max_id+1, name : team  };
                return resolve(insert_team(new_team));
            })
        }).catch (err => {
            return reject(err);
        });
    });
}

exports.check_if_exists = function(team) {
    return new Promise((resolve, reject) => {
        let teams_collection = db.get_teams_collection();
        let query = { name : { $exists : true, $in: [team] } }
        teams_collection.find(query).toArray( function(err, teams) {
            if (err) {
                return reject(err)
            }
            return resolve(teams);
        });
    });
}

exports.find_max_id = function() {
    return new Promise((resolve, reject) => {
        let teams_collection = db.get_teams_collection();
        teams_collection.find().sort([['_id', -1]]).limit(1).next((err, max_id_team) => {
            if (err) {
                return reject(err);
            }
            let max_id_team_id = 0
            if(max_id_team !== null) {
                max_id_team_id = max_id_team._id
            }
            return resolve(max_id_team_id);
        });
    });
}

function insert_team(new_team) {
    return new Promise((resolve, reject) => {
        let teams_collection = db.get_teams_collection();
        teams_collection.insertOne(new_team, function(err, res) {        
            if (err) {
                return reject(err);
            }
            return resolve("Successfully added team, here is the result "+ res);
        });
    });
}