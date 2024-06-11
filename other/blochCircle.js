import { LaTeXJSComponent } from "https://cdn.jsdelivr.net/npm/latex.js/dist/latex.mjs"
customElements.define("latex-js", LaTeXJSComponent)

var width = 1000;
var height = 1000;

class State_1Q{ //single qubit state
  constructor(radius, theta) {
    this.radius = radius;
    this.theta  = theta ;
  }
}

class State_2Q{ // two qubit state 
  constructor(radius, theta1, theta2) {
    this.radius = radius;
    this.theta1 = theta1;
    this.theta2 = theta2;
  }
}


// properties of a state 
var radius = 0.5;        //radius 
var theta = 0; //angle theta
var state = [radius, theta]; //[radius, theta]
var state2q = [0.5,0,0];

// plot the torus 
import * as THREE from './build/three.module.js';
import { OrbitControls } from './three/jsm/controls/OrbitControls.js';  

// create render
var renderer = new THREE.WebGLRenderer();
var container = document.getElementById('div3');
container.style.height = '500px'; 
container.style.width = '500px' ;
container.style.display='block';
var w = container.offsetWidth;
var h = container.offsetHeight;
renderer.setSize( w, h);
container.appendChild(renderer.domElement);

// create scene and camera
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( w/-2, w/2, h/2, h/-2, -500, 1000);
camera.position.z = 0; 
camera.position.y = -50;
camera.position.x = 0;

// controls
var controls = new OrbitControls(camera, renderer.domElement);

//plot torus 
var r    = 100.0; //torus radius
var r1   = 50.0; //torus fatness
var xres = 200; // donut resolution 
var yres = 200; // cross section circumference resolution 

var s_geometry = new THREE.TorusGeometry( r, r1*0.5, yres , xres);
var m_geometry = new THREE.TorusGeometry( r, r1    , yres , xres);
var l_geometry = new THREE.TorusGeometry( r, r1*1.5, yres/5 , xres/5);
var wireframe  = new THREE.WireframeGeometry( l_geometry );
var l_torus = new THREE.LineSegments( wireframe );
l_torus.material.depthTest = false; l_torus.material.opacity = 0.25; l_torus.material.transparent = true;
scene.add( l_torus );

var s_material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, reflectivity:1});
var m_material = new THREE.MeshBasicMaterial({ color: 0xcccc00, transparent: true, opacity: 0.5, reflectivity:1});
// var l_material = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.1});

var s_torus = new THREE.Mesh( s_geometry, s_material );
var m_torus = new THREE.Mesh( m_geometry, m_material );
// var l_torus = new THREE.Mesh( l_geometry, l_material );

scene.add( s_torus );
scene.add( m_torus );
// scene.add( l_torus );
// plot radial axes that intersects at the up up state
var geometry = new THREE.CylinderGeometry( r1*1.5, r1*1.5, 5, 100, 10, true);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side:THREE.DoubleSide} );
var crossAxis = new THREE.Mesh( geometry, material );
crossAxis.position.x += r;
scene.add( crossAxis );

var geometry = new THREE.CylinderGeometry( r, r, 5, 100, 10, true);
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00, side:THREE.DoubleSide} );
var donutAxis = new THREE.Mesh( geometry, material );
donutAxis.rotation.x += Math.PI/2;
donutAxis.position.z += r1*1.5;
scene.add(donutAxis);

var p = document.createElement("P");
    p.appendChild( document.createTextNode(""));
    p.setAttribute("id", "torus_state")
    document.getElementById("div3").append(p);


var onScene = [];
function torus_2q(state2q){
    
    for (let i = 0; i < onScene.length; i++) {
      scene.remove(onScene[i]);
    }
    
    /* 
    Plots a two qubit state with 3 params specified. 
    t1 is the angle of the 1st qubit on the bloch circle.
    t2 is the angle of the 2nd qubit on the bloch circle.
    r is the radius of both qubits on the bloch circle. 
    the sign of r specifies wether the state is on the inside of the torus (-1) or outside (1)
    */
    var radius, theta2, theta1;
    [radius, theta1, theta2] = state2q;
    theta1 = -theta1;
    theta2 = -theta2 + Math.PI/2;
    
    
  
    // cross section
    var geometry = new THREE.CylinderGeometry( r1*1.5, r1*1.5, 0.01, 100 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: 1, side:THREE.DoubleSide} );
    var cylinder = new THREE.Mesh( geometry, material );
    cylinder.rotation.z += theta1;
    cylinder.position.x += r*Math.cos(theta1);
    cylinder.position.y += r*Math.sin(theta1);
    //cylinder.position.x += r;
    cylinder.name = "cylinder";
    scene.add( cylinder );
    onScene.push(cylinder);

    
    // show torus know for maximally mixed states
    if(Math.abs(radius) <= 0.001 ){
      document.getElementById("torus_state").innerHTML = "Maximally Mixed State";
      let points = [];
      let res = 100;
      let dt = Math.PI*2/res;
      let offset = theta2-theta1;
      let k = Math.sqrt(0.25-radius*radius);
      for(let i = 0; i < res ; i++){
        points.push(  new THREE.Vector3(
          (r + r1*(1+k)*Math.cos(i*dt+offset)) * Math.cos(i*dt),
          (r + r1*(1+k)*Math.cos(i*dt+offset)) * Math.sin(i*dt),
               r1*(1+k)*Math.sin(i*dt+offset)                     ));
      }
      var material = new THREE.LineBasicMaterial({
        color: 0xff0000, linewidth: 10,
      });
      var geometry = new THREE.BufferGeometry().setFromPoints( points );
      var line = new THREE.Line( geometry, material );
      scene.add( line );
      onScene.push(line);

      let origin = new THREE.Vector3( r*Math.cos(theta1), 
                                      r*Math.sin(theta1), 
                                          0                 );
      let dir    = new THREE.Vector3( Math.cos(theta2)*Math.cos(theta1), 
                                      Math.cos(theta2)*Math.sin(theta1), 
                                      Math.sin(theta2)                 );
      let length = r1*1.5;
      let hex = 0xff0000;
      let arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 0.4*length, 0.6*0.4*length );
      scene.add( arrowHelper );
      onScene.push( arrowHelper);
    }
    else{
      if(Math.abs(radius) > 0.5-0.001 ) document.getElementById("torus_state").innerHTML = "Separable State";
      else document.getElementById("torus_state").innerHTML = "Mixed State";
      // state_arrow = Arrow(x=x+a*np.cos(t2), dx=k*np.cos(t2), y=y+a*np.sin(t2), dy=k*np.sin(t2), width = 0.3, alpha = 1, color = 'r')     
      let origin = new THREE.Vector3( (r + 1.5*r1*Math.cos(theta2))*Math.cos(theta1), 
                                      (r + 1.5*r1*Math.cos(theta2))*Math.sin(theta1), 
                                           1.5*r1*Math.sin(theta2)                  );
      let dir    = new THREE.Vector3( -Math.cos(theta2)*Math.cos(theta1), 
                                      -Math.cos(theta2)*Math.sin(theta1), 
                                      -Math.sin(theta2)                 );
      let length = r1*radius;
      let hex = 0xff0000;
      let arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, 10, 0.6*10,);
      scene.add( arrowHelper ); 
      onScene.push( arrowHelper);
    }
    camera.lookAt(s_torus.position);
    camera.updateMatrix();
    renderer.render( scene, camera );
  }

torus_2q([0.5, Math.PI/3, Math.PI/4]);

var animate = function () {
  renderer.setSize( container.offsetWidth, container.offsetHeight);
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
};

animate();




//Make an SVG Container
var svg_blochcircle = d3.select("#div4").append("svg")
    .attr("width", width)
    .attr("height", height);
  
bloch2d(state);
function bloch2d(state){
    svg_blochcircle.selectAll("*").remove();

    [radius, theta] = state;
    var a = Math.cos(theta/2);
    var b = Math.sin(theta/2); 
    
    // convert to coodinates for display
    var t = theta - Math.PI/2;
    var bloch_r = (width-100)/4;
    
    var r = bloch_r*radius/0.5;
    var bloch_x = width/4;
    var bloch_y = width/4;
    var x = r*Math.cos(t);
    var y = r*Math.sin(t);
    
    //Draw the Circle
    var bloch_circle = svg_blochcircle.append("circle")
    .attr("cx", bloch_x)
    .attr("cy", bloch_y)
    .attr("r",  bloch_r)
    .style("stroke","black")
    .style("stroke-width", 3)
    .style("fill-opacity", 0.0);
    
    //Draw the state point
    var statepoint = svg_blochcircle.append("circle")
    .attr("cx", bloch_x+x)
    .attr("cy", bloch_y+y)
    .attr("r", 7)
    .style("fill", "");
    
    function addLine2D(x1, x2, y1, y2, color){ 
        svg_blochcircle.append("line")
        .attr("x1", bloch_x + x1)
        .attr("y1", bloch_y + y1)
        .attr("x2", bloch_x + x2)
        .attr("y2", bloch_y + y2)
        .style("stroke-width", 3)
        .style("stroke", color);
    }
    // Draw state line relative to the center of the bloch_circle
    var state_arrow = addLine2D(0, x, 0,        y,        'black');
    var a_line      = addLine2D(0, x, -bloch_r, y,        'green');
    var b_line      = addLine2D(0, x, bloch_r,  y,        'red');
    var c_line      = addLine2D(0, x, y,        y,        'blue');
    var a2_line     = addLine2D(0, 0, y,        bloch_r,  'red'); // a squared
    var b2_line     = addLine2D(0, 0, y,       -bloch_r,  'green'); // b squared
}


// Slider for selecting the radius 
var radius_data = [0, .1, .2, .3, .4, .5];

var textRadius = d3.sliderBottom()
  .min(0)
  .max(0.5)
  .width(450)
  .tickFormat(d3.format(''))
  .ticks(5)
  .step(0.1)
  .default(0.5)
  .on('onchange', val => {
    state[0] = val;
    bloch2d(state);
    
    state2q[0] = val;
    torus_2q(state2q);
    d3.select('p#radius-text').text(d3.format('.1f')(val));
  });

var sliderRadius = d3
  .select('div#radius-slider')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  ;
sliderRadius.call(textRadius);

// Slider for selecting the 1st angle
var textAngle1 = d3.sliderBottom()
  .min(-180).max(180)
  .width(450)
  .tickFormat(d3.format(''))
  .ticks(4)
  .default(0)
  .on('onchange', val => {
    state[1] = val*Math.PI/180;
    bloch2d(state);
    state2q[1] = val*Math.PI/180;
    torus_2q(state2q);
    d3.select('p#angle1-text').text(d3.format(',d')(val));
  });

var sliderAngle1 = d3
  .select('div#angle1-slider')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  ;
sliderAngle1.call(textAngle1);

// Slider for selecting the 1st angle
var textAngle2 = d3.sliderBottom()
  .min(-180).max(180)
  .width(450)
  .tickFormat(d3.format(''))
  .ticks(4)
  .default(0)
  .on('onchange', val => {
    d3.select('p#angle2-text').text(d3.format(',d')(val));
    state2q[2] = val*Math.PI/180;
    torus_2q(state2q);
  });

var sliderAngle2 = d3
  .select('div#angle2-slider')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)')
  ;
  
sliderAngle2.call(textAngle2);













  
  