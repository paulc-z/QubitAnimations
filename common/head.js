
//insert header 
document.head.insertAdjacentHTML("afterbegin",
`
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="./common/tufte.css">
<link rel="stylesheet" href="./common/latex.css">
<link rel="stylesheet" href="./common/style.css">
<script src="common/mathjax-config.js" defer></script>

`);


// navigation bar shared by multiple pages 
document.body.insertAdjacentHTML("afterbegin",  `
<div id="bannerimage"> </div>

<div class="sidenav">
  <a id="index"  href="index.html" >Home</a>
  <a id="bloch"  href="bloch.html">Bloch Sphere</a>
  <a id="states" href="states.html">Pure/Mixed States</a>
  <a id="prob"   href="prob.html"  >Epistemic Probability</a>
  <a id="sepTor" href="sepTorus.html">Separable 2 Qubit</a>
  <a id="torus"  href="torus.html">Full 2 Qubit</a>
</div>

<div class="topnav" id="myTopnav">
<a id="index"  href="index.html" >Home</a> 
<a id="bloch"  href="bloch.html">Bloch Sphere</a>
<a id="states" href="states.html">Pure/Mixed States</a>
<a id="prob"   href="prob.html"  >Epistemic Probability</a>
<a id="sepTor" href="sepTorus.html">Separable 2 Qubit</a>
<a id="torus"  href="torus.html">Full 2 Qubit</a>
<a  href="javascript:void(0);" class="icon" onclick="hamBarOnClick()">
  <i class="fa fa-bars" style=" background:transparent;"></i>
</a>
<div class="navbanner" id="navbanner"> </div>
</div>
`)


// insert footer 
document.body.insertAdjacentHTML("beforeend",  `<div class="footer"><p>  Li-Heng Henry Chang, Bard Physics 2021.</p></div>`)


// highlight the button of the current page on the navbar
var fileName = location.href.split("/").slice(-1)[0].split(".")[0];
var curpage =  document.getElementById(fileName)
curpage.classList.add("active");
console.log(curpage)

// make the torus resposive : fit their width to screen size or text content size

if (window.innerWidth < 900){
  let w = document.querySelector('section').offsetWidth;
  let elems = document.getElementsByClassName("fitWidthPlot"); 
  let ratio= w*.85/800
  for (let i = 0; i < elems.length; i++) {
    elems[i].style.transformOrigin = "top left"
    elems[i].style.transform = "scale(" + ratio +")"
    elems[i].style.marginBottom = "300px"
  }
}
// else {
//   console.log("large screen")
//   let elems = document.getElementsByClassName("sliderContainer");
//   for (let i = 0; i < elems.length; i++) elems[i].style.marginBottom  = "400px";

// }

window.onresize =  responsiveDiv; 
function responsiveDiv(){
  console.log(document.getElementById("torusDiv"))
  if (window.innerWidth < 1300){
    document.getElementById("torusDiv").style.display = "block";
    document.getElementById("sepTorusDiv").style.display = "block";
  }
  else{
    document.getElementById("sepTorusDiv").style.display = "flex"
    document.getElementById("torusDiv").style.display = "flex"
  }
}
responsiveDiv();



