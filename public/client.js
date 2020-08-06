let members = [];

function run_pick_me() {
    fetch('/run_pick_me')
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(data => {
            console.log(data);
            document.getElementById('picked_member_display').innerText = data.name;
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
        members = data;
    })
    .catch(error => {
        console.error('Unsuccessful response');
    })
}

function init() {
    //make api call to fetch members, populate members variable
    get_members();
    //populate table
    let member_data_inner_html = '';
    let table_body = document.getElementById('table_body');
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        let insert_row_string = `<tr><th scope=\'row\'>${member.id}</th><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
        member_data_inner_html += insert_row_string;
    }
    table_body.innerHTML = member_data_inner_html;
}

init();