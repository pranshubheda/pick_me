let members = [];
let picked_member_id= -1;

function run_pick_me() {
    fetch('/run_pick_me')
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(data => {
            console.log(data);
            picked_member_id = data.id;
            document.getElementById('picked_member_display').innerText = data.name;
            document.getElementById('picked_member_display').style.display = '';
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
                document.getElementById('picked_member_display').style.color = 'green';
                confirmation_alert();
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
    console.log('Members');
    console.log(members);
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        // console.log(member);
        let insert_row_string = `<tr><th scope=\'row\'>${member.id}</th><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
        member_data_inner_html += insert_row_string;
    }
    table_body.innerHTML = member_data_inner_html;
}

function init() {
    //make api call to fetch members, populate members variable
    get_members();
}

init();

$('#alert_div').on('close.bs.alert', function () {
    document.getElementById('picked_member_display').innerText = '';
    document.getElementById('picked_member_display').style.display = 'none';
    document.getElementById('finalize').style.display = 'none';
});

let confirmation_alert = function(message) {
    $('#alert_div').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" id="pick_confirmed">×</a><span>Pick Confirmed!</span></div>');
}

get_members();