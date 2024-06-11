//Define various parameters used in the visualization
var containerwidth = 600   //Overall width
var circlemargin = 100     //Margin between containerwidth and circle
var bottomtextheight = 130 //Extra vertical space below circle for text

var linestrokes = '1%'
var zerotextoffset = 35
var onetextoffset = 55
var numbertextsize = '28px'

var circletextoffset = 5
var circletextfontsize = '22px'

var statepointradius = 10
var percentstatementfont = "26px"
var percentstatementlinespace = 45
var percentstatementoffset = 250

//Make an SVG Container
var svgContainer = d3.select("#purestateBC").append("svg")
      .attr("id", "svgIn")
      .attr("width", containerwidth)
      .attr("height", containerwidth + bottomtextheight)
      .style("z-index", "-1")
      // .on('mouseout', mouseout)
      // .on('mouseover', mouseover);


//Define box radius holding circles
var containerradius = containerwidth / 2

//specify the radius and center of the Bloch Circle
var pureradius = containerradius - circlemargin
var circlexcenter = containerradius
var circleycenter = containerradius

//Define colors for amplitudes, corresponding probabilities, and offdiagonal
var zeroampcolor = "rgb(130, 207, 255)"
var oneampcolor = "rgb(255, 123, 144)"
var zerocolor = "rgb(0, 93, 255)"
var onecolor = "rgb(255, 0, 0)"
var offdiagonalcolor = "rgb(152, 0, 168)"

//draw measurement axis
var measaxis = svgContainer.append("g");

var axisdata=[
  [containerradius,(circlemargin-zerotextoffset)],
  [containerradius,(containerwidth-onetextoffset)]];

var axisHalodata=[
  [containerradius,(circlemargin-2*zerotextoffset)],
  [containerradius,containerwidth-onetextoffset/2]];

var updownaxis = measaxis.append('path')
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '10,10')
      .style('stroke-width',linestrokes)
      .style("stroke-opacity", "0.2")
      .attr('d', d3.line()(axisdata))
      ;
var updownaxisHalo = measaxis.append('path') // the Halo counterpart is to make to updown axis have a larger
.attr('stroke', 'white')
      .style('stroke-width', '40%')
      .style("stroke-opacity", "0.1")
      .attr('d', d3.line()(axisHalodata));

// measurement bases texts
var zerotext = measaxis.append("text")
      .text("0")
      .attr('class','zerostatetext')
      .attr("text-anchor", "middle")
      .attr('x', containerradius)
      .attr('y', circlemargin-zerotextoffset -5 )
      .style("font-size", numbertextsize)
      .style("fill",zeroampcolor)

var onetext = measaxis.append("text")
      .text("1")
      .attr('class','onestatetext')
      .attr("text-anchor", "middle")
      .attr('x', containerradius)
      .attr('y', containerwidth - circlemargin + onetextoffset + 5)
      .style("font-size", numbertextsize)
      .style("fill",oneampcolor)


// line segments 
var asquareline = svgContainer.append("line")
      .attr("x1", circlexcenter)
      .attr('y1', circlemargin)
      .attr("x2", circlexcenter)
      .attr('y2', containerwidth-circlemargin)
      .attr("stroke-width", linestrokes)
      .attr("stroke", zerocolor)
      .style("stroke-opacity", "0.0");

var bsquareline = svgContainer.append("line")
      .attr("x1", circlexcenter)
      .attr("x2", circlexcenter)
      .attr("y1", circlemargin)
      .attr('y2', circlemargin)
      .attr("stroke-width", linestrokes)
      .attr("stroke", onecolor)
      .style("stroke-opacity", "0.0");

var aline = svgContainer.append("line")
      .attr("x1", circlexcenter)
      .attr("x2", circlexcenter)
      .attr('y1', circleycenter)
      .attr('y2', circleycenter)
      .attr("stroke-width", linestrokes)
      .attr("stroke", zeroampcolor)
      .style("stroke-opacity", "0.0");

var bline = svgContainer.append("line")
      .attr("x1", circlexcenter)
      .attr("x2", circlexcenter)
      .attr('y1', circleycenter)
      .attr('y2', circleycenter)
      .attr("stroke-width", linestrokes)
      .attr("stroke", oneampcolor)
      .style("stroke-opacity", "0.0");

var cline = svgContainer.append('line')
      .attr("x1", circlexcenter)
      .attr("x2", circlexcenter)
      .attr("y1", circleycenter)
      .attr("y2", circleycenter)
      .attr("stroke-width", linestrokes)
      .attr("stroke", offdiagonalcolor)
      .style("stroke-opacity", "0.0");

//Draw Bloch Circle
var blochcircle = svgContainer.append("circle")
      .attr("cx", circlexcenter)
      .attr("cy", circleycenter)
      .attr("r", pureradius)
      .style("fill", "none")
      .style("stroke","black")
      .style("stroke-width", linestrokes)
      .style("fill-opacity", 0.0)
      .style("pointer-events", "all")
      ;
     

// State Point 
// var statecircle = svgContainer.append("g");
var statecircle = svgContainer.append('circle')
      .style("fill", "white")
      .attr("stroke", "black")
      .attr('cx', circlexcenter)
      .attr('cy', circlemargin)
      .attr('r', statepointradius)
      .style("stroke-width", "1")
      .style("opacity", 0) ;
      
var statecircleHalo = svgContainer.append("circle")
      .style("fill", "white")
      .style("opacity", 0)
      .attr('cx', circlexcenter)
      .attr('cy', circleycenter)
      .attr('r', statepointradius*5)

//define distance from edge of circle to arrows and their lengths
var arrowlength = 30

//Define arrowheads
var markerBoxWidth = 10
var markerBoxHeight = 10
var refX = markerBoxWidth/2
var refY = markerBoxHeight/2

var arrow = svgContainer.append('svg:line')
      .attr('class', 'right-axis')
      .attr('x1', circlexcenter)
      .attr('x2', circlexcenter)
      .attr('y1', circlemargin)
      .attr('y2', circlemargin - arrowlength)
      .attr("marker-end", "url(#arrow)")
      .attr("stroke",'#555')
      .attr("stroke-width",'3px')
      .style("opacity", 0);

var defs = svgContainer.append("defs");
      defs.append("marker")
      .attr("id","arrow")
            .attr("viewBox","0 -5 10 10")
            .attr("refX",5)
            .attr("refY",0)
            .attr("markerWidth",4)
            .attr("markerHeight",4)
            .attr("orient","auto")
      .append("path")
            .attr("d", "M0,-5 L10,0 L0,5")
            .attr('stroke', 'context-stroke')
            .attr("class","arrowHead");


var buttonOffset = containerradius-percentstatementoffset;
svgContainer.append("text")
      .attr("x", buttonOffset + 30  )
      .attr("y", circleycenter*2 - 70 + 20)
      .text("Measure")
      .attr("text-anchor", "middle")
      .style("font-size", circletextfontsize)
var measButton = svgContainer.append('rect')
      .attr("x", buttonOffset *.8 )
      .attr("y", circleycenter*2 - 70)
      .attr("width", 80)
      .attr("height", 25)
      .attr("fill", "rgb(239, 239, 239)")
      .attr("opacity", 0.4)
      .attr('stroke', 'black')
      .style("z-index", "2")
      .style("pointer-events", "all")
      .on( "click", measure )
      .on("mouseover",function(){measButton.attr("fill","rgb(220,220,220)") })
      .on("mouseout",function(){measButton.attr("fill", "rgb(239, 239, 239)");})
      
svgContainer.append("text")
      .attr("x",  containerwidth - 2.5*buttonOffset  + 35  )
      .attr("y", circleycenter*2 - 70 + 20 )
      .text("Reset Axis")
      .attr("text-anchor", "middle")
      .style("font-size", circletextfontsize)     
var axisButton = svgContainer.append('rect')
      .attr("x", containerwidth - 2.8*buttonOffset )
      .attr("y", circleycenter*2 - 70)
      .attr("width", 100)
      .attr("height", 25)
      .attr("fill", "rgb(239, 239, 239)")
      .attr("opacity", 0.4)
      .attr('stroke', 'black')
      .style("z-index", "2")
      .style("pointer-events", "all")
      .on( "click", resetAxis )
      .on("mouseover",function(){axisButton.attr("fill","rgb(220,220,220)");})
      .on("mouseout",function(){axisButton.attr("fill", "rgb(239, 239, 239)");})


var circletext = svgContainer.append("text")
      .text("Move/Tap inside the circle to choose a pure qubit state.")
      .attr("text-anchor", "middle")
      .attr('x', containerradius)
      .attr('y', containerwidth -  3.3*circletextoffset)
      .style("font-size", circletextfontsize)
      .style("font-style", "italic");
                
var circletext = svgContainer.append("text")
      .text("Drag the axis outside the circle to choose a measurement axis.")
      .attr("text-anchor", "middle")
      .attr('x', containerradius)
      .attr('y', containerwidth + 10 )
      .style("font-size", circletextfontsize)
      .style("font-style", "italic");


// Text for probability of measurement outcomes
var zeropercentstatement = svgContainer.append('text')
      .attr('x', containerradius-percentstatementoffset)
      .attr('y', containerwidth + percentstatementlinespace)
      .text("Your chance of measuring the ")
      .style("font-size",percentstatementfont)
      .attr('display','none')
      
zeropercentstatement.append('tspan')
      .attr('class','zerostatetext')
      .text('0')
      .style('fill',zeroampcolor)
zeropercentstatement
      .append('tspan')
      .text(" state is ")
zeropercentstatement.append('tspan')
  .attr('id','zeroprobability').style('fill',zerocolor)
zeropercentstatement.append('tspan').text(' %')

var onepercentstatement = svgContainer.append('text')
      .text("Your chance of measuring the ")
      .attr('x', containerradius-percentstatementoffset)
      .attr('y', containerwidth + 2*percentstatementlinespace)
      .style("font-size", percentstatementfont)
      .attr('display','none')
onepercentstatement.append('tspan').attr('class','onestatetext').text('1').style('fill',oneampcolor)
onepercentstatement.append('tspan').text(" state is ")
onepercentstatement.append('tspan').attr('id', 'oneprobability').style('fill', onecolor)
onepercentstatement.append('tspan').text(' %')



// show the line segements when the event mouseover is triggered 
function mouseover() {
  arrow.style("opacity", 1);
  statecircle.style("opacity", 1);
  asquareline.style("stroke-opacity", 1);
  bsquareline.style("stroke-opacity", 1);
  aline.style("stroke-opacity", 1);
  bline.style("stroke-opacity", 1);
  cline.style("stroke-opacity", 1);
  zeropercentstatement.attr('display','yes');
  onepercentstatement.attr('display','yes');
  
}
mouseover(); // default display everything

// normalized coordinate
var nx = 0;              // normalized statepont coodinate relative to ox,oy 
var ny = 1;
var sx = circlexcenter;  // state point coordinate
var sy = circleycenter; 
var zx = 0              //nomarlized zero state coordinate in relative to ox,oy 
var zy = 1
var vx = 0              //nomarlized zero state coordinate in relative to ox,oy 
var vy = 1


function mouseco(x,y) {
      var coorrad = math.sqrt(math.pow((x-containerradius),2)+math.pow((y-containerradius),2));
      var scalefac = coorrad/pureradius;
      if (scalefac<1) {return [x,y]}
      else {return [(x-containerradius)/scalefac+containerradius,(y-containerradius)/scalefac+containerradius]}
}

function displayBC(mx,my,axismoving){
      let x=mouseco(mx,my)[0];   // mouse x y in svg coord 
      let y=mouseco(mx,my)[1];
      let ox = circlexcenter;
      let oy = circleycenter;
      let r = Math.sqrt( (x-ox)**2 + (y-oy)**2  );
      
      
      if (axismoving) { // if the user is moving the measurement axis 
          nx = (x-ox)/r;
          ny = (y-oy)/r;
        
            let ax = nx*(pureradius + 35);
            let ay = ny*(pureradius + 35);
            zx = zerotext.attr('x') - ox;
            zy = zerotext.attr('y') - oy;
            // unflip the axis so the visual is smooth
            if ( Math.sqrt( (zx+ax)**2+(zy+ay)**2 ) < Math.sqrt( (zx-ax)**2+(zy-ay)**2 ) ){
                   ax = -ax;
                   ay = -ay;
            } 
      
            axisdata=[[ox+ax, ox+ay],  [ox-ax, oy-ay]]; 

            let ratio =  Math.abs( containerwidth- circlemargin+2*zerotextoffset- onetextoffset/2)/Math.abs(circlemargin-zerotextoffset  - containerwidth + onetextoffset) 
            
            axisHalodata=[[ox+ax*ratio, ox+ay*ratio],  [ox-ax*ratio, oy-ay*ratio]]; 
         

            updownaxis.attr('d', d3.line()(axisdata))
            updownaxisHalo.attr('d', d3.line()(axisHalodata))
            
            zerotext
                  .attr('x', ox + ax/pureradius*(pureradius + 20))
                  .attr('y', oy + ay/pureradius*(pureradius + 20))
                  
            onetext
                  .attr('x', ox - ax/pureradius*(pureradius + 20))
                  .attr('y', oy - ay/pureradius*(pureradius + 20))    
      }
      else  {
            sx = ox + (x-ox)/r*pureradius;
            sy = oy + (y-oy)/r*pureradius;
      }

      let x0 = sx-ox
      let y0 = sy-oy
      let a = -ny 
      let b = nx 

     
      // the vertical line from state point to the measurement axis
      vx = ox + b*(b*x0 - a*y0) 
      vy = oy - a*(b*x0 - a*y0)

      statecircle
            .attr("cx", sx)
            .attr("cy", sy);
      statecircleHalo
            .attr("cx", sx)
            .attr("cy", sy);

      r = Math.sqrt( (sx-ox)**2 + (sy-ox)**2 ) 
      arrow
            .attr("x1", sx)
            .attr("y1", sy)
            .attr("x2", sx+(sx-ox)/r*arrowlength)
            .attr("y2", sy+(sy-oy)/r*arrowlength);

      zx = zerotext.attr('x') - ox;
      zy = zerotext.attr('y') - oy;  
      r = pureradius/Math.sqrt( (zx)**2 + (zy)**2 ) 
      zx = zx*r
      zy = zy*r

      aline .attr("x1", sx) // zero amplitutude
            .attr("y1", sy)
            .attr('x2', ox-zx) // one state
            .attr('y2', oy-zy)
      
      bline .attr("x1", sx) // one amplitute 
            .attr("y1", sy)
            .attr('x2', ox+zx) // zero state
            .attr('y2', oy+zy)
      
      cline .attr('x1', vx)
            .attr('y1', vy)
            .attr('x2', sx)
            .attr('y2', sy);

      asquareline
            .attr('x1', ox-zx)
            .attr('y1', oy-zy)
            .attr('x2', vx)
            .attr('y2', vy);

      bsquareline
            .attr('x1', ox+zx)
            .attr('y1', oy+zy)
            .attr('x2', vx)
            .attr('y2', vy);


      let oneprob = Math.sqrt((vx-ox-zx)**2 + (vy-oy-zy)**2 )/(2*pureradius) *100
      d3.select("#zeroprobability").text(String(math.round(100*(100-oneprob))/100))
      d3.select("#oneprobability").text(String(math.round(100*oneprob)/100))
}

statecircleHalo.on("mouseover" , function(){ statecircleHalo.attr("cursor", "grab"); })

statecircleHalo.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended))
      .on("mouseover", axisMouseover);

measaxis.call(d3.drag()
      .on("start", dragstarted)
      .on("drag", draggedAxis)
      .on("end", dragended))
      .on("mouseover", axisMouseover);

function axisMouseover(){
      statecircleHalo.attr("cursor", "grabbing");
}
function dragstarted() {
      // d3.select(this).raise();
      console.log("started")
      statecircleHalo.attr("cursor", "grabbing");
}
function dragended() {
      statecircleHalo.attr("cursor", "grab");
} 
function dragged(event){
      displayBC(event.x, event.y, false);
}

function draggedAxis(event) {
      d3.select(this).selectAll(".child")
            .attr("cx", event.x).attr("cy",  event.y);
      displayBC(event.x, event.y, true);
}

function mousemove(event) {
  displayBC(event.x, event.y, false);  
}

displayBC(circlexcenter, circlemargin, false);

function resetAxis(){
      if( zerotext.attr('y') > circleycenter){
            zx = zerotext.attr('x') - circlexcenter;
            zy = zerotext.attr('y') - circleycenter;
            if (( zx + pureradius)**2 < ( zx - pureradius)**2)  {
                  displayBC(circlexcenter- pureradius, circleycenter , true);
            }
            else {
                  displayBC(circlexcenter + pureradius, circleycenter , true);
            }   
      }
      displayBC(circlexcenter, circleycenter - pureradius, true);
}

function measure(){
      let oneprob  = Math.sqrt((vx-circlexcenter-zx)**2 + (vy-circleycenter-zy)**2 )/(2*pureradius)
      if (Math.random() < oneprob ){  // collapse to one state
            console.log("one state")
            displayBC(circlexcenter - zx, circleycenter - zy, false);
      }
      else{ // collapse to the zeroth state
            console.log("zero state")
            displayBC(circlexcenter + zx, circleycenter + zy, false);
      }

}