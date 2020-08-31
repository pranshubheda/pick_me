const { query } = require('express');
const uri = process.env.MONGOLAB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true });

let db_name = 'pick_me';
let db;
let members_collection;

client.connect().then(() => {
    db = client.db(db_name);
    members_collection = db.collection('members');
})
.catch((err) => {
    console.log(err);
});

exports.add_member = function(member) {
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

exports.remove_member = function (member) {
    //pass
}

exports.update_member = function (member) {
    //pass
}

exports.find_all = function () {
    return new Promise((resolve, reject) => {
        members_collection.find().toArray( function(err, members) {        
            if (err) {
                return reject(err)
            }
            return resolve(members)
        }); 
    });
}

exports.find_team_members = function (team_name) {
    return new Promise((resolve, reject) => {
        members_collection.aggregate([
            {
                $unwind: '$teams'
            },
            {
                $match: { teams: team_name }
            },
            {
                $sort: { '_id': 1 }
            }
        ]).toArray( function(err, members) {        
            if (err) {
                return reject(err)
            }
            return resolve(members)
        }); 
    });
}

exports.disable = function (member_id) {
    return new Promise((resolve, reject) => {
        members_collection.updateOne(
            {
                _id: member_id
            },
            {
                $set: {
                    probability : 0 
                }
            }
        , function(err, res) {        
            if (err) {
                return reject(err)
            }
            return resolve(res)
        }); 
    });
}

exports.enable = function (member_id) {
    return new Promise((resolve, reject) => {
        let query = { _id: member_id };
        let new_value = { $set: { probability : 1 } };
        members_collection.updateOne( query, new_value
        , function(err, res) {        
            if (err) {
                return reject(err)
            }
            return resolve(res)
        }); 
    });
}

exports.finalize_pick = function (member_id) {
    return new Promise((resolve, reject) => {
        let query = { _id: member_id };
        let new_value = { $set: { probability : 0 }, $inc: { karma : 100 } };
        members_collection.updateOne( query, new_value
        , function(err, res) {        
            if (err) {
                return reject(err)
            }
            return resolve(res)
        }); 
    });
}