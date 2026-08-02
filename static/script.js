const body=document.body;

const red=document.getElementById("sokoban");

const blue=document.getElementById("wumpus");

red.addEventListener("mouseenter",()=>{

body.style.background="radial-gradient(circle,#550000,#050b16)";

});

blue.addEventListener("mouseenter",()=>{

body.style.background="radial-gradient(circle,#001d55,#050b16)";

});

red.addEventListener("mouseleave",()=>{

body.style.background="#050b16";

});

blue.addEventListener("mouseleave",()=>{

body.style.background="#050b16";

});
