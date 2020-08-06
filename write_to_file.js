const fs = require('fs');
const path = require('path');

let data = {
    members: [
        {
            id: 1,
            name: 'Madhu',
            probability: 1,
            karma: 0
        },
        {
            id: 2,
            name: 'Prasad',
            probability: 1,
            karma: 0
        },
        {
            id: 3,
            name: 'Sam',
            probability: 1,
            karma: 0
        },
        {
            id: 4,
            name: 'Amit',
            probability: 1,
            karma: 0
        },
        {
            id: 5,
            name: 'Xin',
            probability: 1,
            karma: 0
        },
        {
            id: 6,
            name: 'Sang',
            probability: 1,
            karma: 0
        },
        {
            id: 7,
            name: 'Harsha',
            probability: 1,
            karma: 0
        },
        {
            id: 8,
            name: 'Pranshu',
            probability: 1,
            karma: 0
        }
    ]
};

fs.writeFile('member_states_template.json', JSON.stringify(data), function(err) {
    if (err) {
        return console.log.err('Not able to save data to file');
    }
    console.log('Data saved to file successfully')
});