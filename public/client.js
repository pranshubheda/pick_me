let members = [];
let picked_member_id= -1;
let data = [];
let svg;

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
            picked_member_id = data._id;
            picked_member_index = picked_member_id-1;
            // console.log(picked_member_index);
            create_roulette(picked_member_index);
            // document.getElementById('picked_member_display').innerText = data.name;
            // document.getElementById('picked_member_display').style.display = '';
            // document.getElementById('finalize').style.display = '';
        })
        .catch(error => {
            console.error('Unsuccessful response');
        })
}

function finalize_pick() {
    console.log(picked_member_id);
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
            get_members();  
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

function enable_member() {
    fetch(`/enable/1`)
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

function disable_member() {
    fetch(`/disable/1`)
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
        let insert_row_string = `<tr><th scope=\'row\'>${member._id}</th><td>${member.name}</td><td>${member.probability}</td><td>${member.karma}</td></tr>`;
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

function init() {
    get_members();
}


// var data = [
//             {"label":"Dell LAPTOP",  "value":1,  "question":"What CSS property is used for specifying the area between the content and its border?"}, // padding
//             {"label":"IMAC PRO",  "value":1,  "question":"What CSS property is used for changing the font?"}, //font-family
//             {"label":"SUZUKI",  "value":1,  "question":"What CSS property is used for changing the color of text?"}, //color
//             {"label":"HONDA",  "value":1,  "question":"What CSS property is used for changing the boldness of text?"}, //font-weight
//             {"label":"FERRARI",  "value":1,  "question":"What CSS property is used for changing the size of text?"}, //font-size
//             {"label":"APARTMENT",  "value":1,  "question":"What CSS property is used for changing the background color of a box?"}
// ];

var padding = {top:20, right:40, bottom:0, left:0},
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top  - padding.bottom,
    r = Math.min(w, h)/2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

function wheelie() {
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
        //all slices have been seen, all done
        console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if(oldpick.length == data.length){
            console.log("done");
            container.on("click", null);
            return;
        }
        var  ps       = 360/data.length,
            pieslice = Math.round(1440/data.length),
            rng      = Math.floor((Math.random() * 1440) + 360);
            
        rotation = (Math.round(rng / ps) * ps);
        
        picked = Math.round(data.length - (rotation % 360)/ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        picked_member_id = data[picked]._id;
        // if(oldpick.indexOf(picked) !== -1){
        //     d3.select(this).call(spin);
        //     return;
        // } else {
            // oldpick.push(picked);
        // }
        rotation += 90 - Math.round(ps/2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function(){
                //mark question as seen
                // d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                //     .attr("fill", "#111");
                //populate question
                // d3.select("#question h1")
                //     .text(data[picked].question);
                // oldrotation = rotation;
                // console.log(picked_member_id);
                // finalize_pick();
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
}


function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function(t) {
    return "rotate(" + i(t) + ")";
  };
}