let members = {};
let picked_member_id= -1;
let data = [];
let svg;

function finalize_pick() {
    fetch(`/finalize_pick/${picked_member_id}`)
        .then(response => {
            if(response.ok) {
                get_members();  
                show_confirmation_alert();
                setTimeout(() => {
                    document.getElementById("pick_confirmed_close").click();
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
            get_members();
            show_reinitialization_alert();  
            setTimeout(() => {
                document.getElementById("reinitialize_close").click();
            }, 3000);
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}

function get_members() {
    fetch('/get_members/IIW')
    .then(response => {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(res_data => {
        // console.log(data);
        members = res_data;
        //populate table
        populate_table();
        // console.log(members);
        data = [];
        Object.values(members).forEach(member => {
            if(member.probability > 0){
                data_obj = {'label': member.name, 'value':1,  'question': '', '_id': member._id};
                data.push(data_obj);
            }
        });
        if (svg != null) {
            var div = document.getElementById('wheel'); 
            while(div.firstChild) { 
                div.removeChild(div.firstChild); 
            }
            svg = null; 
            div.innerHTML = '<div id="chart"></div><div id="question"><h1></h1></div>'
        }
        
        if(data.length > 0 && svg == null) {
            wheelie();
        }
        
    })
    .catch(error => {
        console.error('Unsuccessful response');
    })
}

function enable_member(member_id) {
    fetch(`/enable/${member_id}`)
    .then(response => {
        console.log(response);
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(data => {
        get_members();
    })
    .catch(error => {
        console.error('Unsuccessful response');
    })
}

function disable_member(member_id) {
    fetch(`/disable/${member_id}`)
    .then(response => {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(data => {
        get_members();
    })
    .catch(error => {
        console.error('Unsuccessful response');
    })
}

function populate_table() {
    let member_data_inner_html = '';
    let table_body = document.getElementById('table_body');
    Object.values(members).forEach(member => {
        let row_class = ['data_row'];
        if (member.probability == 0) {
            row_class.push('do_not_enter_draw');
        }else {
            row_class.push('enter_draw');
        }
        let row_class_string = row_class.join(' ');
        let insert_row_string = `<tr class='${row_class_string}'><td>${member._id}</td><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
        member_data_inner_html += insert_row_string;
    });

    table_body.innerHTML = member_data_inner_html;
    // add data_row listener
    var data_row_elements = document.getElementsByClassName('data_row');
    for(var i=0; i<data_row_elements.length; i++)
    {
        let data_row_element = data_row_elements[i];
        data_row_element.addEventListener("click", () => {
            let toggle_member_id = parseInt(data_row_element.firstChild.innerHTML);
            toggle_member_probability(toggle_member_id);
        });
    }
}

function toggle_member_probability(toggle_member_id) {
    const toggle_member = members[toggle_member_id];
    if(toggle_member.probability == 0) {
        enable_member(toggle_member_id);
    }
    else {
        disable_member(toggle_member_id);
    }

}

function on_close_confirmation_alert() {
    document.getElementById('finalize').style.display = 'none';
}

function on_close_reinitialize_alert() {
    document.getElementById('reinitialize').style.display = 'none';
}

let show_confirmation_alert = function(message) {
    $('#alert_div').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" id="pick_confirmed_close">×</a><span>Pick Confirmed!</span></div>');
}

let show_reinitialization_alert = function(message) {
    document.getElementById('reinitialize').style.display = '';
    $('#reinitialize_div').html('<div class="alert alert-primary"><a class="close" data-dismiss="alert" id="reinitialize_close">×</a><span>No new members left. Reinitialize probabilities.</span></div>');
}

let show_success_form_alert = function(message) {
    document.getElementById('form_alert').style.display = '';
    $('#reinitialize_div').html('<div class="alert alert-success"><a class="close" data-dismiss="alert" id="reinitialize_close">×</a><span>'+message+'</span></div>');
}

let show_failure_form_alert = function(message) {
    document.getElementById('form_alert').style.display = '';
    $('#reinitialize_div').html('<div class="alert alert-danger"><a class="close" data-dismiss="alert" id="reinitialize_close">×</a><span>'+message+'</span></div>');
}


function wheelie() {
    let padding = {top:20, right:40, bottom:0, left:0};
    let w = 500 - padding.left - padding.right;
    let h = 500 - padding.top  - padding.bottom;
    let r = Math.min(w, h)/2;
    let rotation = 0;
    let oldrotation = 0;
    let picked = 100000;
    let oldpick = [];
    let color = d3.scale.category20();
    svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    var vis = container
        .append("g");
    
    var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
    
    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });

        // add the text
    arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
    .attr("text-anchor", "end")
    .text( function(d, i) {
        return d.data.label;
    });
    container.on("click", spin);
    function spin(d){
    
        container.on("click", null);

        var  ps       = 360/data.length,
            pieslice = Math.round(1440/data.length),
            rng      = Math.floor((Math.random() * 1440) + 360);
            
        rotation = (Math.round(rng / ps) * ps);
        
        picked = Math.round(data.length - (rotation % 360)/ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        //pick the member
        picked_member_id = data[picked]._id;
        console.log(`Picked Member ID: ${picked_member_id}`);

        rotation += 90 - Math.round(ps/2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function(){
                document.getElementById('finalize').style.display = '';
                container.on("click", spin);
            });
    }

    //make arrow
    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"black"});
    //draw spin circle
    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style({"fill":"white","cursor":"pointer"});
    //spin text
    container.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("SPIN")
        .style({"font-weight":"bold", "font-size":"30px"});
    
    function rotTween(to) {
        var i = d3.interpolate(oldrotation % 360, rotation);
        return function(t) {
        return "rotate(" + i(t) + ")";
        };
    }
}

function handleErrors(response) {
    if (!response.ok) {
        return response.text().then(text => {
            throw new Error(text)
        });
    }
    return response;
}

function add_team() {
    let team_name = document.getElementById("search_teams_input").value;
    let team = {};
    team.name = team_name;
    const options = {
        method: 'POST',
        body: JSON.stringify(team),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/add_team/', options)
    .then(handleErrors)
    .then(response => {
        return response.text();
    })
    .then(response_text => {
        show_success_form_alert(response_text);
        get_members();
    })
    .catch( error_text => {
        console.log(error_text.message);
        show_failure_form_alert(error_text.message);
    })
}

function add_member() {
    let name = document.getElementById("search_members_input").value;
    let karma_points = document.getElementById("karma_points").value;
    let probability = 0;
    let member = {};

    member.name = name;
    member.probability = probability;
    member.karma = karma_points;
    member.teams = [];

    all_teams_li = document.getElementById('assign_teams').children[2].children;
    Object.values(all_teams_li).forEach(team_li => {
        if( team_li.children[0].checked) {
            let team_name = team_li.children[1].innerHTML; 
            member.teams.push(team_name);
        }
    });


    const options = {
        method: 'POST',
        body: JSON.stringify(member),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch('/add_member/', options)
    .then(handleErrors)
    .then(response => {
        return response.text();
    })
    .then(response_text => {
        show_success_form_alert(response_text);
        get_members();
    })
    .catch( error => {
        show_failure_form_alert(error.message);
    })
}

function get_all_teams() {
    fetch('/get_all_teams')
    .then(response => {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
    .then(res_data => {
        // console.log(data);
        select_teams_drop_down_table = '';
        // assign_teams_list
        assign_teams_list = document.getElementById('assign_teams').children[2];
        teams = res_data;
        Object.values(teams).forEach(team => {
            let insert_row_string = `<li><input type="checkbox" class="team_checkbox"/><span>${team.name}</span></li>`;
            select_teams_drop_down_table += insert_row_string;
        });
        assign_teams_list.innerHTML = select_teams_drop_down_table;
    })
    .catch(error => {
        console.error(error);
    })
}

function init() {
    get_members();
    get_all_teams();
}

function search_teams() {
    search_keyword = document.getElementById('search_teams_input').value;
    search_teams_results = document.getElementById('search_teams_results');

    if(search_keyword !== "") {
        fetch(`/search_teams/${search_keyword}`)
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(res_data => {
            // console.log(data);
            search_result_items = '';
            // assign_teams_list
            teams = res_data;
            Object.values(teams).forEach(team => {
                let insert_row_string = `<a class="team" href="#">${team.name}</a>`;
                search_result_items += insert_row_string;
            });
            search_teams_results.innerHTML = search_result_items;
        })
        .catch(error => {
            console.error(error);
        })
    }
    else {
        search_teams_results.innerHTML = "";
    }
}

function search_members() {
    search_keyword = document.getElementById('search_members_input').value;
    search_members_results = document.getElementById('search_members_results');

    if(search_keyword !== "") {
        fetch(`/search_members/${search_keyword}`)
        .then(response => {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
        .then(res_data => {
            // console.log(data);
            search_result_items = '';
            // assign_members_list
            let members = res_data;
            Object.values(members).forEach(member => {
                let member_str = JSON.stringify(member);
                let insert_row_string = `<a onClick='select_member(${member_str})' href='#'>${member.name}</a>`;
                search_result_items += insert_row_string;
            });
            search_members_results.innerHTML = search_result_items;
        })
        .catch(error => {
            console.error(error);
        })
    }
    else {
        search_members_results.innerHTML = "";
    }
}

function select_member(selected_member) {
    document.getElementById("search_members_input").value = selected_member.name;
    search_members_results.innerHTML = "";
    document.getElementById("karma_points").value = selected_member.karma;
    // assign_teams_list = document.getElementById('assign_teams').children[2];
    let assigned_teams = new Set(selected_member.teams);
    all_teams_li = document.getElementById('assign_teams').children[2].children;
    Object.values(all_teams_li).forEach(team_li => {
        let team_name = team_li.children[1].innerHTML; 
        if(assigned_teams.has(team_name)) {
            team_li.children[0].checked = true;
        }
    });
}

$('#alert_div').on('close.bs.alert', function () {
    on_close_confirmation_alert();
});

$('#reinitialize_div').on('close.bs.alert', function () {
    on_close_reinitialize_alert();
});
