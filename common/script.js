var showbanner = true; 
function hamBarOnClick() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
  
  // banner responsiveness
  if (showbanner) document.getElementById("navbanner").style.display = "none";
  else document.getElementById("navbanner").style.display = "block";
  showbanner = !showbanner;
}


// hide banner on scrolling down the page, show when scrolling up
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("banner").style.top = "0";
  } else {
    document.getElementById("banner").style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
}


