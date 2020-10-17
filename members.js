const db = require("./db");

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

exports.add_member = function (member) {
    return new Promise((resolve, reject) => {
        this.check_if_exists(member.name).then( members => {
            let member_exists = members.length > 0 ? true : false;
            if (member_exists) {
                return reject("Member already exists");
            }
            this.find_max_id().then(max_id => {
                let new_member = member;
                new_member._id = max_id + 1;
                insert_member(new_member).then(res => {
                    return resolve(res);                        
                }).catch (err => {
                    return reject(err);
                });
            })
        }).catch (err => {
            return reject(err);
        });
    });
}

exports.check_if_exists = function(member_name) {
    return new Promise((resolve, reject) => {
        let members_collection = db.get_members_collection();
        let query = { name : { $exists : true, $in: [member_name] } }
        members_collection.find(query).toArray( function(err, members) {
            if (err) {
                return reject(err)
            }
            return resolve(members);
        });
    });
}

exports.find_max_id = function() {
    return new Promise((resolve, reject) => {
        let members_collection = db.get_members_collection();
        members_collection.find().sort([['_id', -1]]).limit(1).next((err, max_id_member) => {
            if (err) {
                return reject(err);
            }
            return resolve(max_id_member._id);
        });
    });
}

function insert_member(new_member) {
    return new Promise((resolve, reject) => {
        let members_collection = db.get_members_collection();
        members_collection.insertOne(new_member, function(err, res) {
            if (err) {
                return reject(err);
            }
            return resolve("Successfully added member, here is the result "+ res);
        });
    });
}

exports.search = function (keyword) {
    return new Promise((resolve, reject) => {
        let members_collection = db.get_members_collection();
        search_text = ['.*',keyword,'.*'].join('');
        let query = { 
            'name': { '$regex': search_text, $options: 'i' }
        };
        members_collection.find(query).toArray( function(err, members) {        
            if (err) {
                return reject(err)
            }
            return resolve(members)
        }); 
    });
}

exports.update = function (member) {
    return new Promise((resolve, reject) => {
        this.check_if_exists(member.name).then( members => {
            let member_exists = members.length > 0 ? true : false;
            if (member_exists) {
                let query = { name: member.name };
                let new_value = { $set: { karma : member.karma, teams: member.teams } };
                let members_collection = db.get_members_collection();
                members_collection.updateOne( query, new_value
                , function(err, res) {        
                    if (err) {
                        return reject(err)
                    }
                    return resolve(res)
                });
            }
            else {
                return reject("Member does not exist");
            }
        }).catch (err => {
            return reject(err);
        }); 
    });
}

exports.delete = function (member) {
    return new Promise((resolve, reject) => {
        this.check_if_exists(member.name).then( members => {
            let member_exists = members.length > 0 ? true : false;
            if (member_exists) {
                let query = { name: member.name };
                let members_collection = db.get_members_collection();
                members_collection.deleteOne( query
                , function(err, res) {        
                    if (err) {
                        return reject(err)
                    }
                    return resolve(res)
                });
            }
            else {
                return reject("Member does not exist");
            }
        }).catch (err => {
            return reject(err);
        }); 
    });
}