import * as THREE from './build/three.module.js';
import { OrbitControls } from './three/jsm/controls/OrbitControls.js';

var div_width  = 600;
var div_height = div_width;
var width_padding = 0;
var height_padding  = 0;
var width  = (div_width - width_padding )/5; 
var height = (div_width - height_padding)/5;
var slider_width = div_width;
var statepoint_color = "#ff00ff";
var statepoint_radius = 5;

// Create a condition that targets viewports at least 768px wide
const mediaQuery = window.matchMedia('(min-width: 768px)')
function handleTabletChange(e) {
  // Check if the media query is true
  if (e.matches) {
    // Then log the following message to the console
    console.log('Media Query Matched!')
  }
}
// Register event listener
mediaQuery.addListener(handleTabletChange)

// Initial check
handleTabletChange(mediaQuery)

class State_1Q { //single qubit state
    constructor(radius, theta) {
        this.radius = radius;
        this.theta = theta;
    }
}
class State_2Q { // two qubit state 
    constructor(radius, theta1, theta2) {
        this.radius = radius;
        this.theta1 = theta1;
        this.theta2 = theta2;
    }
}

// var state1q = new State_1Q(0.5, 0);
// var state2q = new State_2Q(0.5, 0, 0);
var stateline_color      = "rgb(0, 255, 0)"
var bloch1_color         = "rgb(34,139,34)"  // or dark brown for
var bloch2_color         = "rgb(0,0,0)"
var l_crossSection_color = "#22759e"

// properties of a state 
var radius = 0.5;             //radius
var theta  = 0;               //angle theta
var state  = [radius, theta]; //[radius, theta]
var state2q= [0.0, 45*Math.PI / 180, 100*Math.PI / 180];     //[s, theta1, theta2]

// plot the torus 
// create render
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xffffff, 0);
var container = document.getElementById('div_torus');

container.style.height  = div_width.toString()  + 'px'; 
container.style.width   = div_height.toString() + 'px'; 

var w = width; 
var h = height;
renderer.setSize(w, h); 
container.appendChild(renderer.domElement);

// create scene and camera
var scene_torus_ratio = 0.65;
var scene = new THREE.Scene(); scene.background = null;

var camera = new THREE.OrthographicCamera
(w / - scene_torus_ratio, w /  scene_torus_ratio, h / scene_torus_ratio, h / - scene_torus_ratio, -500, 1000);
camera.position.z = 200 ; camera.position.y = -100; camera.position.x = 100;
camera.zoom = .75

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 0, 100);
light.target.position.set(0, 0, 0);
// light.castShadow = true; 
scene.add(light);
scene.add(light.target);


// controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.update();

//plot torus 
var r = 100.0; //torus radius
var r1 = 50.0; //torus fatness
var xres = 80; // donut resolution 
var yres = 80; // cross section circumference resolution 

var s_geometry = new THREE.TorusGeometry(r, r1 * 0.5, yres, xres);          // small inner torus 
var m_geometry = new THREE.TorusGeometry(r, r1, yres, xres);                // meduim center
var l_geometry = new THREE.TorusGeometry(r, r1 * 1.5, yres / 5, xres / 5);  // larger outer
var wireframe = new THREE.WireframeGeometry(l_geometry);

var s_material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .7, reflectivity: 1 });
var m_material = new THREE.MeshPhongMaterial({ color: 0xf7e297, transparent: true, opacity: .5, reflectivity: 1 });

var s_torus = new THREE.Mesh(s_geometry, s_material);
var m_torus = new THREE.Mesh(m_geometry, m_material);
var l_torus = new THREE.LineSegments(wireframe);
l_torus.material.depthTest = false; l_torus.material.opacity = 0.4; l_torus.material.transparent = true;
l_torus.material.color = new THREE.Color(0x000000);
l_torus.material.linewidth = 1;

scene.add(s_torus);
scene.add(m_torus);
scene.add(l_torus);

// plot radial axes that intersects at the up up state
var geometry = new THREE.CylinderGeometry(r1 * 1.5, r1 * 1.5, 5, 100, 10, true);
var material = new THREE.MeshBasicMaterial({ color: bloch2_color, side : THREE.DoubleSide });
var crossAxis = new THREE.Mesh(geometry, material);
crossAxis.rotation.z += Math.PI/2 ;
crossAxis.position.y += r;
scene.add(crossAxis);

var geometry = new THREE.RingGeometry( r-5, r, 100 );
var material = new THREE.MeshBasicMaterial( { color: bloch1_color, side: THREE.DoubleSide } );
var donutAxis = new THREE.Mesh( geometry, material );
donutAxis.position.z += r1 * 1.5;
scene.add(donutAxis );

var p = document.createElement("P");
p.appendChild(document.createTextNode(""));
p.setAttribute("id", "torus_state")
document.getElementById("div_torus").append(p);

var onScene = [];

function torus_2q(state2q){
    /* 
    Plots a two qubit state with 3 params specified. 
    t1 is the angle of the 1st qubit on the bloch circle.
    t2 is the angle of the 2nd qubit on the bloch circle.
    r is the radius of both qubits on the bloch circle. 
    the sign of r specifies wether the state is on the inside of the torus (-1) or outside (1)
    */
    var s, radius, theta2, theta1;
    [s, theta1, theta2] = state2q;
    radius = Math.sqrt(0.25 - s * s);
    theta1 = -theta1 + Math.PI / 2;
    theta2 = -theta2 + Math.PI / 2;

    //clear interactive elements 
    for (let i = 0; i < onScene.length; i++){
        scene.remove(onScene[i]);
    }

    // cross section
    var geometry = new THREE.CylinderGeometry(r1 * 1.5, r1 * 1.5, 0.01, 100);
    var material = new THREE.MeshBasicMaterial({ color: l_crossSection_color, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.z += theta1;
    cylinder.position.x += r * Math.cos(theta1);
    cylinder.position.y += r * Math.sin(theta1);

    
    //cylinder.position.x += r;
    cylinder.name = "cylinder";
    scene.add(cylinder);
    onScene.push(cylinder);

    // show torus knot for maximally mixed states
    if (Math.abs(radius) <= 0.001) {
        document.getElementById("torus_state").innerHTML = "Maximally Entangled State";
        let vertices = [];
        let res = 1000;
        let dt = Math.PI * 2 / res;
        let sign = s/ Math.abs(s) ;

        let offset = theta2 - theta1;
        for (let i = 0; i < res; i++) {
            let t1 = i*dt;
            let t2 = offset + t1*sign;

          vertices.push(
            (r + (r1+0) * (1 + s) * Math.cos(t2)) * Math.cos(t1),
            (r + (r1+0) * (1 + s) * Math.cos(t2)) * Math.sin(t1),
                 (r1+0) * (1 + s) * Math.sin(t2)                 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        var material = new THREE.PointsMaterial( { color: statepoint_color, size: 6 } );
        var points = new THREE.Points( geometry, material );
        scene.add( points );
        onScene.push(points);
    }
    else {

        // state text
        if (Math.abs(radius) > 0.5 - 0.001) document.getElementById("torus_state").innerHTML = "Separable State";
        else document.getElementById("torus_state").innerHTML = "Entangled State";

        // state arrow pointer 
        let sign = s == 0  ?  1 :s / Math.abs(s) ;
        var origin = new THREE.Vector3((r + (1 + .5 * sign) * r1 * Math.cos(theta2)) * Math.cos(theta1),
            (r + (1 + .5 * sign) * r1 * Math.cos(theta2)) * Math.sin(theta1),
            (1 + .5 * sign) * r1 * Math.sin(theta2));
        var dir = new THREE.Vector3(-Math.cos(theta2) * Math.cos(theta1),
            -Math.cos(theta2) * Math.sin(theta1),
            -Math.sin(theta2));
        dir.multiplyScalar(sign);
        let length = r1 * radius;
        var geometry = new THREE.BoxGeometry(5, 5 , length);
        var material = new THREE.MeshBasicMaterial( {color: stateline_color} );
        var cube = new THREE.Mesh( geometry, material );
        cube.rotateOnWorldAxis(new THREE.Vector3(1,0,0), theta2 - Math.PI/2);
        cube.position.x += origin.x +.5*length*dir.x;
        cube.position.y += origin.y +.5*length*dir.y;
        cube.position.z += origin.z +.5*length*dir.z;
        cube.rotateOnWorldAxis(new THREE.Vector3(0,0,1), theta1 - Math.PI/2);
        
        scene.add( cube );
        onScene.push(cube);
      
        // state point on the torus 
        var geometry = new THREE.SphereGeometry(5, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: statepoint_color });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = origin.x + length * dir.x;
        sphere.position.y = origin.y + length * dir.y;
        sphere.position.z = origin.z + length * dir.z;
        scene.add(sphere);
        onScene.push(sphere);     
    }
    camera.lookAt(s_torus.position);
    camera.updateMatrix();
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

torus_2q(state2q);



var animate = function () {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();

// Torus cross Section 
var svg_torusCrossSection = d3.select("#div_torusXsec").append("svg")
    .attr("width", width)
    .attr("height", height);

function torus_crossSection(state2q) {
    svg_torusCrossSection.selectAll("*").remove();
    var s, theta1, theta2; 
    [s, theta1, theta2] = state2q;
    var radius = Math.sqrt(.25-s*s);
    var theta = theta2;

    var a = Math.cos(theta / 2);
    var b = Math.sin(theta / 2);

    // convert to coodinates for display
    var t = theta - Math.PI / 2;
    var bloch_r = (width - 10) / 3 ;
    var r = bloch_r * radius / 0.5;
    var bloch_x = (width) / 3 * 1.5;
    var bloch_y = (width) / 3 * 1.5;
    var sign = s/Math.abs(s); if (s==0 ){sign = 1;}
    var ex = (1 + s)* bloch_r * Math.cos(t);
    var ey = (1 + s)* bloch_r * Math.sin(t);
    var sx = (1 + .5*sign)* bloch_r * Math.cos(t);
    var sy = (1 + .5*sign)* bloch_r * Math.sin(t);


    var l_circle = svg_torusCrossSection.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  1.5*bloch_r)
        .style("fill",  l_crossSection_color)
        .style("stroke", "black")
        .style("stroke-dasharray", ("5,5"))
        .style("stroke-width", 1)
        .style("fill-opacity", 0.5);

    var m_circle = svg_torusCrossSection.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r)
        .style("stroke", "#f3dc8a")
        .style("fill",  "white")
        .style("stroke-width", 2)
        .style("fill-opacity", 0);

    var s_circle = svg_torusCrossSection.append("circle")
        .attr("cx",  bloch_x)
        .attr("cy",  bloch_y)
        .attr("r",  .5* bloch_r)
        .style("stroke", "#41403d")
        .style("fill",  "white")
        .style("stroke-width", 1.5)
        .style("fill-opacity", 1);

    // Draw state line relative to the center of the bloch_circle
    var state_arrow = svg_torusCrossSection.append("line")
        .attr("x1", bloch_x + sx)
        .attr("y1", bloch_y + sy)
        .attr("x2", bloch_x + ex)
        .attr("y2", bloch_y + ey)
        .style("stroke-width", statepoint_radius+2)
        .style("stroke", stateline_color);

    //Draw the state point
    var statepoint = svg_torusCrossSection.append("circle")
        .attr("cx", bloch_x + ex)
        .attr("cy", bloch_y + ey)
        .attr("r", statepoint_radius)
        .style("fill", statepoint_color)
        .style("stroke", "black")
        .style("stroke-width", .5);
    
}


var svg_torusTopView = d3.select("#div_torusTopView").append("svg")
    .attr("width", width)
    .attr("height", height);

function torus_topView(state2q) {
    svg_torusTopView.selectAll("*").remove();
    var s, theta1, theta2; 
    [s, theta1, theta2] = state2q;

    var a = Math.cos(theta / 2);
    var b = Math.sin(theta / 2);

    // convert to coodinates for display
    var t = theta1 - Math.PI / 2;
    var bloch_r = (width - 10) / 3 * 7/8;
    var bloch_x = (width) / 3 * 1.5;
    var bloch_y = (width) / 3 * 1.5;

    //Draw the Circle
    let translation = "translate(" + bloch_x.toString() + "," + bloch_y.toString() + ")";
    var arc = d3.arc()
        .innerRadius(bloch_r/4)
        .outerRadius(bloch_r*7/4) // or bloch_r/2
        .startAngle( 0) //converting from degs to radians
        .endAngle(Math.PI*2); //just radians

    
    var l_torus_out_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*7/4)
        .style("fill",  "white")
        .style("stroke", "black")
        .style("stroke-dasharray", ("5,5"))
        .style("stroke-width", 1)
        .style("fill-opacity", 0);

    var sep_out_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*6/4)
        .style("fill",  "#b89c39")
        .style("stroke", "#b89c39")
        .style("stroke-width", 1.5)
        .style("fill-opacity", .2);

    var s_torus_out_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*5/4)
        .style("fill",  "white")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill-opacity", 0);

    var s_torus_in_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*3/4)
        .style("fill",  "white")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill-opacity", 0);
        
    var sep_in_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*2/4)
        .style("fill",  "white")
        .style("stroke", "#b89c39")
        .style("stroke-width", 1.5)
        .style("fill-opacity", 1);

    var l_torus_in_circle = svg_torusTopView.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r",  bloch_r*1/4)
        .style("fill",  "white")
        .style("stroke", "black")
        .style("stroke-dasharray", ("5,5"))
        .style("stroke-width", 1)
        .style("fill-opacity", 0);
    

    
    svg_torusTopView.append("line") // axis line
        .attr("x1", bloch_x  )
        .attr("y1", bloch_y - bloch_r/4)
        .attr("x2", bloch_x  )
        .attr("y2", bloch_y - bloch_r/4*7 )
        .style("stroke-width", 3)
        .style("stroke", "black");

    var l_crossSection_line = svg_torusTopView.append("line")
        .attr("x1", bloch_x + bloch_r/4*Math.cos(t) )
        .attr("y1", bloch_y + bloch_r/4*Math.sin(t) )
        .attr("x2", bloch_x + bloch_r/4*7*Math.cos(t) )
        .attr("y2", bloch_y + bloch_r/4*7*Math.sin(t) )
        .style("stroke-width", 3)
        .style("stroke", l_crossSection_color);
}


//Make an SVG Container
var svg_blochCircle1 = d3.select("#div_qubit1").append("svg")
    .attr("id", "blochCircle1")
    .attr("width", width)
    .attr("height", height);

var svg_blochCircle2 = d3.select("#div_qubit2").append("svg")
    .attr("id", "blochCircle2")
    .attr("width", width)
    .attr("height", height);

var svg_blochCircle = [svg_blochCircle1, svg_blochCircle2];

var a_color  = "rgb(130, 207, 255)";
var b_color  = "rgb(255, 123, 144)";
var a2_color = "rgb(0, 93, 255)"   ;
var b2_color = "rgb(255, 0, 0)"    ;
var c_color  = "rgb(152, 0, 168)"  ;



function bloch2d(state, svg, color) {
    // the single qubit state to draw 
    // the svg to append to 
    // the color of the circumference
    svg.selectAll("*").remove();

    let radius = Math.abs(state[0]);
    let theta = state[1];
    var a = Math.cos(theta / 2);
    var b = Math.sin(theta / 2);

    // convert to coodinates for display
    var t = theta - Math.PI / 2;
    var bloch_r = (width-20) / 2;

    var r = bloch_r * radius / 0.5;
    var bloch_x = width / 2;
    var bloch_y = width / 2; 
    var x = r * Math.cos(t);
    var y = r * Math.sin(t);

    //Draw the Circle
    var bloch_circle = svg.append("circle")
        .attr("cx", bloch_x)
        .attr("cy", bloch_y)
        .attr("r", bloch_r)
        .style("stroke", color)
        .style("stroke-width", 3)
        .style("fill-opacity", 0.0);

    function addLine2D(x1, x2, y1, y2, color) {
        svg.append("line")
            .attr("x1", bloch_x + x1)
            .attr("y1", bloch_y + y1)
            .attr("x2", bloch_x + x2)
            .attr("y2", bloch_y + y2)
            .style("stroke-width", 3)
            .style("stroke", color);
    }
    // Draw state line relative to the center of the bloch_circle
    //Define colors for amplitudes, corresponding probabilities, and offdiagonal
    
    var state_arrow = addLine2D(0, x, 0, y, stateline_color);
    if (radius == .5){
        var a_line  = addLine2D(0, x, bloch_r, y, a_color);
        var b_line  = addLine2D(0, x, -bloch_r, y, b_color);
    }
    var c_line  = addLine2D(0, x, y, y, c_color);
    var a2_line = addLine2D(0, 0, y,  bloch_r, a2_color); // a squared
    var b2_line = addLine2D(0, 0, y, -bloch_r, b2_color); // b squared

    //Draw the state point
     var statepoint = svg.append("circle")
     .attr("cx", bloch_x + x)
     .attr("cy", bloch_y + y)
     .attr("r", statepoint_radius)
     .style("fill", "white")
     .style("stroke", "black")
     .style("stroke-width", .2);
}

// Slider for selecting the radius 
var radius_data = [0, .1, .2, .3, .4, .5];
var textS = d3.sliderBottom()
    .min(-0.5)
    .max(0.5)
    .width(slider_width-50)
    .tickFormat(d3.format('.2f'))
    .ticks(10)
    .step(0.01)
    .default(0)
    .on('onchange', val => {
        var r = .5 - Math.abs(val);
        if(val != 0) { r = r*val/Math.abs(val)}
        state[0] = r;
        state2q[0] = val; 
        bloch2d([r, state2q[1]], svg_blochCircle1, bloch1_color);
        bloch2d([r, state2q[2]], svg_blochCircle2, bloch2_color);
        torus_2q(state2q);
        torus_crossSection(state2q);
    });


var sliderS = d3
    .select('div#radius-slider')
    .append('svg')
    .attr('width', slider_width)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(20,10)')
    ;


// Slider for selecting the 1st angle
var textAngle1 = d3.sliderBottom()
    .min(-180)
    .max(180)
    .width(slider_width-50)
    .tickValues([-180, -90, 0, 90, 180])
    .tickFormat(d3.format(',d'))
    .default(state2q[1]*180/Math.PI)
    .on('onchange', val => {
        state[1] = val * Math.PI / 180;
        bloch2d(state, svg_blochCircle1, bloch1_color);
        state2q[1] = val * Math.PI / 180;
        torus_2q(state2q);
        torus_topView(state2q);
        // d3.select('p#angle1-text').text(d3.format('.1f')(val));
    });


var sliderAngle1 = d3
    .select('div#angle1-slider')
    .append('svg')
    .attr('width', slider_width)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(25,10)')
    ;



// Slider for selecting the 2nd angle
var textAngle2 = d3.sliderBottom()
    .min(-180).max(180)
    .width(slider_width-50)
    .tickFormat(d3.format(',d'))
    .tickValues([-180, -90,0,90,180])
    .default(state2q[2]*180/Math.PI)
    .on('onchange', val => {
        state[1] = val * Math.PI / 180;
        bloch2d(state, svg_blochCircle2, bloch2_color);
        state2q[2] = val * Math.PI / 180;
        torus_2q(state2q);
        torus_crossSection(state2q);
        // d3.select('p#angle2-text').text(d3.format('.if')(val));
    });


var sliderAngle2 = d3
    .select('div#angle2-slider')
    .append('svg')
    .attr('width', slider_width)
    .attr('height', 50)
    .append('g')
    .attr('transform', 'translate(25,10)')
    ;


window.addEventListener('DOMContentLoaded', (event) =>{
    bloch2d( [.5, state2q[1] ], svg_blochCircle1, bloch1_color);
    bloch2d(  [.5, state2q[2] ], svg_blochCircle2, bloch2_color);
    torus_crossSection(state2q);
    torus_topView(state2q);
    sliderAngle1.call(textAngle1);
    sliderAngle2.call(textAngle2);
    sliderS.call(textS);
})

// bloch2d( [.5, state2q[1] ], svg_blochCircle1, bloch1_color);
// bloch2d(  [.5, state2q[2] ], svg_blochCircle2, bloch2_color);
// torus_crossSection(state2q);
// torus_topView(state2q);
// sliderAngle1.call(textAngle1);
// sliderAngle2.call(textAngle2);
// sliderS.call(textS);