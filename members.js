const db = require("./db");

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
        let members_collection = db.get_members_collection();
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
        let members_collection = db.get_members_collection();
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
        let query = { _id: member_id };
        let new_value = { $set: { probability : 0 } };
        let members_collection = db.get_members_collection();
        members_collection.updateOne( query, new_value
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
        let members_collection = db.get_members_collection();
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
        let members_collection = db.get_members_collection();
        members_collection.updateOne( query, new_value
        , function(err, res) {        
            if (err) {
                return reject(err)
            }
            return resolve(res)
        }); 
    });
}