var width = 500;
var height = 500;

var r=150.0; //torus radius
var r1=40.0; //torus fatness
var xres=30; //torus resolution, number of grid lines around cross section
var yres=xres/2+1; // number of gid lines horizontal to the donut circle 

class Vertex{
    constructor(x,y,z){
        this.x=x; this.y=y; this.z=z;
    }
}

class Torus{
    constructor(r, r1, xres){
        this.r = r; //torus radius
        this.r1 = r1; //torus cross section radius
        this.xres = 30; // how many cross sections grid lines
        this.yres = xres/2+1;
        this.fdat = [] 
        this.rtd = []
        this.cross_sections = {}

        //create torus
        let dx=2*Math.PI/(this.xres-1);
        let dy=2*Math.PI/(this.yres-1);
        for (let y=0;y<this.yres;y++) for (let x=0;x<this.xres;x++){
            this.fdat[x+y*this.xres] = new Vertex(0.0,0.0,0.0);    
             this.rtd[x+y*this.xres] = new Vertex(0.0,0.0,0.0);
            this.fdat[x+y*this.xres].x=(this.r+this.r1*Math.cos(y*dy))*Math.cos(x*dx);
            this.fdat[x+y*this.xres].y=(this.r+this.r1*Math.cos(y*dy))*Math.sin(x*dx);
            this.fdat[x+y*this.xres].z=this.r1*Math.sin(y*dy);
        }
    }

    rotate(a, b, c){// rotate torus given the 3 angles 
        let tmq=0.0; let tmw=0.0; let tmr=0.0;
        let sia=Math.sin(a); let coa=Math.cos(a);
        let sib=Math.sin(b); let cob=Math.cos(b);
        let sic=Math.sin(c); let coc=Math.cos(c);
        for (let y=0;y<yres;y++){
            for (let x=0;x<xres;x++){
            tmq=this.fdat[x+y*this.xres].x*coa-this.fdat[x+y*this.xres].y*sia;
            tmw=this.fdat[x+y*this.xres].x*sia+this.fdat[x+y*this.xres].y*coa;
            tmr=tmw*cob-this.fdat[x+y*this.xres].z*sib;
            this.rtd[x+y*this.xres].x=tmq*coc-tmr*sic;
            this.rtd[x+y*this.xres].y=tmq*sic+tmr*coc;
            this.rtd[x+y*this.xres].z=tmw*sib+this.fdat[x+y*this.xres].z*cob;
            }
        }
    }

    getPolygon(x, y){
        // get the coordinates of a polygon that makes up a piece of the torus
        // x and y are the abstract pixels that ranges 0...xres 0...yres
        return [[this.rtd[x+y*xres].x,         this.rtd[x+y*xres].y],
                [this.rtd[(x+1)+(y+1)*xres].x, this.rtd[x+1+(y+1)*xres].y],
                [this.rtd[(x+1)+(y)*xres].x,   this.rtd[(x+1)+(y)*xres].y],
                [this.rtd[(x)+(y+1)*xres].x,   this.rtd[(x)+(y+1)*xres].y]]
    }

    addCrossSection(t){ // t is angle in radians 
        let vtx = []; 
        let x = Math.sin(t);
        let dx=2*Math.PI/(this.xres-1);
        let dy=2*Math.PI/(this.yres-1);
        for (let y=0; y<this.yres; y++){
            vtx[y] = new Vertex(0.0, 0.0, 0.0);
            vtx[y].x = (this.r+this.r1*Math.cos(y*dy))*Math.cos(t);
            vtx[y].y = (this.r+this.r1*Math.cos(y*dy))*Math.sin(t);
            vtx[y].z =  this.r1*Math.sin(y*dy);
        }
        this.cross_sections[t] = vtx;
    }

    getCrossSection(t, a, b, c){
        
        let poly_points = [];
        let tmq=0.0; let tmw=0.0; let tmr=0.0;
        let sia=Math.sin(a); let coa=Math.cos(a);
        let sib=Math.sin(b); let cob=Math.cos(b);
        let sic=Math.sin(c); let coc=Math.cos(c);
        let vtx = this.cross_sections[t];
        for (let y=0;y<yres;y++){
            tmq=vtx[y].x*coa-vtx[y].y*sia;
            tmw=vtx[y].x*sia+vtx[y].y*coa;
            tmr=tmw*cob-vtx[y].z*sib;
            poly_points.push([tmq*coc-tmr*sic, tmq*sic+tmr*coc]);
            // poly_points[y] = new Vertex(tmq*coc-tmr*sic, tmq*sic+tmr*coc, tmw*sib+this.cross_sections[t][y].z*cob);
        }
        return poly_points;
    }

  
}

var a0=0; var b0=0; var c0=0;
function animateit(){
    a0=0; // rotation around z-axis
    b0=Math.PI/4; // rotation around axis horizontal to the screen
    c0=0 // rotation around axis pointing out of the screen
}
  
//generate svg container
var svg_torus = d3.select("#div4").append("svg")
  .attr("id", "svg_torus" )
  .attr("width", width)
  .attr("height", height);

//line interpreter: data-> visualization
var lineGenerator = d3.line()
  .x(function(d) {return d.x;})
  .y(function(d) {return d.y;})
var line = d3.line().curve(d3.curveLinearClosed);

window.onload = function() {
    s_torus = new Torus(r, r1*0.5, xres); // small 
    m_torus = new Torus(r, r1    , xres); // medium
    l_torus = new Torus(r, r1*1.5, xres); // large
    l_torus.addCrossSection(Math.PI/4)
    setTimeout(draw_torus,500);
}

function draw_torus(){
    // rotate torus 
    s_torus.rotate(a0,b0,c0);
    m_torus.rotate(a0,b0,c0);
    l_torus.rotate(a0,b0,c0);


    // update angles 
    animateit();

    //clear the svg container
    d3.selectAll("#svg_torus > *").remove();
    svg_torus.append("circle").attr("cx", width/2).attr("cy", width/2).attr("r", 10).style("fill", "red");

    for (y=0;y<yres-1;y++)
    for (x=0;x<xres-1;x++){
        // draw a retangular polygon to approximate the torus surface
        var s_points = s_torus.getPolygon(x, y);
        var m_points = m_torus.getPolygon(x, y);
        var l_points = l_torus.getPolygon(x, y);
        
        var offset = width/2;
        var trans = "translate(" + offset.toString() + "px, " + offset.toString() + "px)"
        
        svg_torus.append("path")
            .attr("d", line(d3.polygonHull(m_points)))
            .attr("opacity", m_torus.rtd[x+y*xres].z/(r*8)+0.2)
            .style("transform", trans);
            //.attr("class", "rotated");
            
        svg_torus.append("path")
            .attr("d", line(d3.polygonHull(l_points)))
            .attr("opacity", l_torus.rtd[x+y*xres].z/(r*8)+0.2)
            .style("transform", trans);

        svg_torus.append("path")
            .attr("d", line(d3.polygonHull(s_points)))
            .attr("opacity", s_torus.rtd[x+y*xres].z/(r*8)+0.2)
            .style("transform", trans);
            
        // // cross section
        // var line  = svg_torus.append("line")
        //     .attr("x1", width/2+rtd[x+y*xres].x)
        //     .attr("y1", width/2+rtd[x+y*xres].y)
        //     .attr("x2", width/2+rtd[(x)+(y+1)*xres].x)
        //     .attr("y2", width/2+rtd[(x)+(y+1)*xres].y)
        //     .style("stroke", "black")
        //     .style("stroke-opacity", 0.1)
        //     //.style("stroke-width", rtd[(x)+(y+1)*xres].z/120+1)
        //     ;

        // // circular lines
        // svg_torus.append("line")
        //     .attr("x1", width/2+rtd[x+y*xres].x)
        //     .attr("y1", width/2+rtd[x+y*xres].y)
        //     .attr("x2", width/2+rtd[(x+1)+(y)*xres].x)
        //     .attr("y2", width/2+rtd[(x+1)+(y)*xres].y)
        //     .style("stroke", "black")
        //     .style("stroke-opacity", 0.1)
        //     // .style("stroke-width", rtd[(x)+(y+1)*xres].z/120+1)
        //     ;
    }

    svg_torus.append("path")
        .attr("d", line(d3.polygonHull( l_torus.getCrossSection(Math.PI/4, a0 ,b0 ,c0) ) ) )
        .style("fill", "blue")
        .style("stroke","red")
        .style("stroke-width", "1%") 
        .style("transform", trans)   
        .style("fill-opacity", 0.0);

    

    setTimeout(draw_torus, 20);
  }

  