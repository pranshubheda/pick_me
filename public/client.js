let members = [];
let picked_member_id= -1;

function run_pick_me() {
    fetch('/run_pick_me')
        .then(response => {
            console.log(response);
            if(response.ok && response.status !=368 ) return response.json();
            else if(!response.ok && response.status == 368 ) {
                return reinitialize_alert();
            }
            else {
                throw new Error('Request failed.');
            }
        })
        .then(data => {
            picked_member_id = data.id;
            picked_member_index = picked_member_id-1;
            // console.log(picked_member_index);
            create_roulette(picked_member_index);
            // document.getElementById('picked_member_display').innerText = data.name;
            // document.getElementById('picked_member_display').style.display = '';
            document.getElementById('finalize').style.display = '';
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}

function finalize_pick() {
    fetch(`/finalize_pick/${picked_member_id}`)
        .then(response => {
            if(response.ok) {
                get_members();  
                // document.getElementById('picked_member_display').style.color = 'green';
                confirmation_alert();
                setTimeout(() => {
                    // document.getElementById("pick_confirmed_close").click();
                }, 3000);
            }
            else {
                throw new Error('Request failed.');
            }
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}

function reinitialize() {
    fetch(`/reinitialize`)
        .then(response => {
            if(response.ok) {
                get_members();  
                setTimeout(() => {
                    document.getElementById("reinitialize_close").click();
                }, 3000);
            }
            else {
                throw new Error('Request failed.');
            }
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}

function get_members() {
    fetch('/get_members')
    .then(response => {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(data => {
        // console.log(data);
        members = data;
        //populate table
        populate_table();
    })
    .catch(error => {
        console.error('Unsuccessful response');
    })
}

function populate_table() {
    let member_data_inner_html = '';
    let table_body = document.getElementById('table_body');
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        // console.log(member);
        let insert_row_string = `<tr><th scope=\'row\'>${member.id}</th><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
        member_data_inner_html += insert_row_string;
    }
    table_body.innerHTML = member_data_inner_html;
}

function save() {
    fetch('/save')
    .then(response => {
        console.log(response);
        if(response.ok && response.status == 200) {
            console.log("TEST")
            save_alert();
        }
        else {
            throw new Error('Request failed.');
        }
    })
    .catch(error => {
        console.error('Not able to save file successfully.');
    })    
}

function init() {
    //make api call to fetch members, populate members variable
    get_members();
}

init();

$('#alert_div').on('close.bs.alert', function () {
    on_close_confirmation_alert();
});

function on_close_confirmation_alert() {
    // document.getElementById('picked_member_display').innerText = '';
    // document.getElementById('picked_member_display').style.display = 'none';
    document.getElementById('finalize').style.display = 'none';
}

$('#reinitialize_div').on('close.bs.alert', function () {
    on_close_reinitialize_alert();
});

function on_close_reinitialize_alert() {
    document.getElementById('reinitialize').style.display = 'none';
}

let confirmation_alert = function(message) {
    $('#alert_div').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" id="pick_confirmed_close">×</a><span>Pick Confirmed!</span></div>');
}

let reinitialize_alert = function(message) {
    document.getElementById('reinitialize').style.display = '';
    $('#reinitialize_div').html('<div class="alert alert-primary"><a class="close" data-dismiss="alert" id="reinitialize_close">×</a><span>No new members left. Reinitialize probabilities.</span></div>');
}

let save_alert = function(message) {
    $('#save_alert_div').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" id="save_alert_close">×</a><span>Member states saved!</span></div>');
}

let create_roulette = function(member_index) {
    var option = {
        speed : 10,
        duration : 3,
        stopImageNumber : member_index,
        startCallback : function() {
            // console.log('start');
        },
        slowDownCallback : function() {
            // console.log('slowDown');
        },
        stopCallback : function($stopElm) {
            // console.log('stop');
        }
    };
    $('div.roulette').roulette('option', option);	
    $('div.roulette').roulette('start');
}

var option = {
    speed : 10,
    duration : 3,
    stopImageNumber : 0,
    startCallback : function() {
        // console.log('start');
    },
    slowDownCallback : function() {
        // console.log('slowDown');
    },
    stopCallback : function($stopElm) {
        // console.log('stop');
    }
};
$('div.roulette').roulette(option);	
	
get_members();