const uri = process.env.MONGOLAB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db_name = 'pick_me';
let db;

exports.connect_to_db = function () {
    client.connect().then(() => {
        db = client.db(db_name);
    })
    .catch((err) => {
        console.log(err);
    });
}

exports.get_members_collection = function () {
    let members_collection = db.collection('members');
    return members_collection;
}

exports.get_teams_collection = function () {
    let teams_collection = db.collection('teams');
    return teams_collection;
}