var width = 500;
var height = 500;

//Make an SVG Container
var svg1 = d3.select("#div1").append("svg")
.attr("width", width)
.attr("height", height);

//Draw the Circle
var ratio = 100/0.5;
var bloch_r = 100;
var bloch_x = 200;
var bloch_y = 200;
var bloch_circle = svg1.append("circle")
.attr("cx", bloch_x)
.attr("cy", bloch_y)
.attr("r", bloch_r)
.style("fill", "blue")
.style("stroke","black")
.style("stroke-width", "1%")
.style("fill-opacity", 0.0);

//Draw the state point
var statepoint =svg1.append("circle")
.attr("cx", 200)
.attr("cy", 100)
.attr("r", 5)
.style("fill", "black");

// Draw state line 
var stateline = svg1.append("line")
.attr("class", "bloch")
.attr("x1", bloch_x)
.attr("y1", bloch_y)
.attr("x2", 200)
.attr("y2", 100)
.style("stroke-width", "1%")
.style("stroke", "black");

// Add interactivity for the block circle
bloch_circle
.on("mousemove", handleMouseMoveBlochCircle)
.on("mouseover", handleMouseOverBlochCircle);
// .on("mouseout", handleMouseOutBlochCircle);
var is_mouse_on_bloch_circle = false; 
function handleMouseOverBlochCircle(d, i) { 
  statepoint.style("fill", "black");
}

function handleMouseMoveBlochCircle(d, i) {  
   // Use D3 to select element, change color and size
   var mouse = d3.mouse(this);
   stateline
   .attr("x2", mouse[0])
   .attr("y2", mouse[1]);
   statepoint
   .attr("cx", mouse[0])
   .attr("cy", mouse[1]);
   is_mouse_on_bloch_circle = true;
 }

function handleMouseOutBlochCircle(d, i) {
  bloch_circle
  .style("stroke","red")
  .style("stroke-width", "1%")
}

// function handleMouseMoveSVG(d, i) {  
//   if(!is_mouse_on_bloch_circle){
//     console.log("here")
//     console.log(is_mouse_on_bloch_circle);
//     // Use D3 to select element, change color and size
//     var mouse = d3.mouse(this);
//     var x = mouse[0] - bloch_x;
//     var y = mouse[1] - bloch_y;
//     var scale = bloch_r/Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
//     y = y*scale;
//     x = x*scale;
//     d3.select("line")
//     .attr("x2", bloch_x + x)
//     .attr("y2", bloch_y + y)
//   }
// }


function bigImg(x) {
    x.style.height = "64px";
    x.style.width = "64px";
}
  