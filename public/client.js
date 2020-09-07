let members = [];
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
        members.forEach(member => {
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
    for (let i = 0; i < members.length; i++) {
        const member = members[i];

        let row_class = ['data_row'];
        if (member.probability == 0) {
            row_class.push('do_not_enter_draw');
        }else {
            row_class.push('enter_draw');
        }
        let row_class_string = row_class.join(' ');
        let insert_row_string = `<tr class='${row_class_string}'><td>${member._id}</td><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
        member_data_inner_html += insert_row_string;
    }
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
    const toggle_member = members[toggle_member_id-1];
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
        return data[i].label;
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

function init() {
    get_members();
}

$('#alert_div').on('close.bs.alert', function () {
    on_close_confirmation_alert();
});

$('#reinitialize_div').on('close.bs.alert', function () {
    on_close_reinitialize_alert();
});

