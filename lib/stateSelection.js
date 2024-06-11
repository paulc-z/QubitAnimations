
//Make an SVG Container
var width = 500; 
var height = 500;
var svgContainer = d3.select("#div1").append("svg")
                                    .attr("width", 1000)
                                    .attr("height", 10000);

//specify the radius and center of the Bloch Circle
var pureradius = (width-100)/2;
var circlexcenter = width/2;
var circleycenter = height/2

//generate array of angles every 1 degrees
var angles = [];
for (var i = -179; i <= 180; i++) {
   angles.push(i);
}

//map angles to radians, turn into math matrix, take sine, turn into regular array
var sinangles = math.sin(math.matrix(angles.map(x => x*math.pi/180))).valueOf()
//calculate x coordinates for pure state centers on Bloch circle
var statepointx = sinangles.map(x => pureradius*x + circlexcenter)
//repeat for y coordinates
var cosangles = math.cos(math.matrix(angles.map(x => x*math.pi/180))).valueOf()
var statepointy = cosangles.map(x => pureradius*x + circleycenter)

var statedata =[]

for (var i = 0; i<=(statepointx.length-1); i++) {
  statedata.push([statepointx[i],statepointy[i]])
}

//Draw Bloch Circle
var blochcircle = svgContainer.append("circle")
                              .attr("cx", circlexcenter)
                              .attr("cy", circleycenter)
                              .attr("r", pureradius)
                              .style("fill", "blue")
                              .style("stroke","black")
                              .style("stroke-width", 5)
                              .style("fill-opacity", 0.0)

                              
var new_statepoints = svgContainer.selectAll(".empty") // Get an empty class -- any name with no DOMs will do
                  .data(statedata) // Join the circles to the statedata
                  .enter() // Grab all new data points
                  .append('circle') // Add a circles for each 'new' data point
                  .attr("class","statecircles")
                  .attr('cx', function(d) {
                    return d[0];
                  }) // set center to first entry of statedata array pairs
                  .attr('cy', function(d) {
                    return d[1];  // set center to second entry of statedata array pairs
                  })
                  .attr('r', 1)
                  .style("fill", "black");
              //    .style("z-index", 1);

// Change radius of statecircles on mouseover
var circlesize = svgContainer.selectAll(".statecircles")
    .on('mouseover', function (d,i) {d3.select(this).attr('r',6);})
    .on('mouseout', function (d,i) {d3.select(this).attr('r',1);});

