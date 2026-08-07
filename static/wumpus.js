const board=document.getElementById("board");

const levelText=document.getElementById("level");
const coinText=document.getElementById("coins");
const scoreText=document.getElementById("score");
const livesText=document.getElementById("lives");
const timerText=document.getElementById("timer");
const statusText=document.getElementById("status");

const ROWS=10;
const COLS=10;

let currentLevel=0;
let score=0;
let lives=3;
let timer=60;

let timerInterval=null;
let dangerInterval=null;

let maze=[];

let collectedCoins=0;
let totalCoins=0;

let player={
row:0,
col:0
};

let exitGate={
row:0,
col:0
};

const levels=[

{

map:[

"##########",
"#S....C..#",
"#..#.....#",
"#.....O..#",
"#...#....#",
"#....C...#",
"#.....#..#",
"#..W.....#",
"#....C..E#",
"##########"

]

},

{

map:[

"##########",
"#S.C.....#",
"#..#..O..#",
"#....#...#",
"#..W....C#",
"#....#...#",
"#..C......#",
"#....O...#",
"#.....C.E#",
"##########"

]

},

{

map:[

"##########",
"#S..C....#",
"#O##.....#",
"#..W..C..#",
"#....#...#",
"#C..O....#",
"#....#...#",
"#..C..W..#",
"#.....C.E#",
"##########"

]

},

{

map:[

"##########",
"#S....C..#",
"#..#..O..#",
"#..W......#",
"#....#...#",
"#C....O..#",
"#....#...#",
"#..W..C..#",
"#.....C.E#",
"##########"

]

},

{

map:[

"##########",
"#S.C.....#",
"#O##..W..#",
"#....#...#",
"#..C...O.#",
"#....#...#",
"#..W......#",
"#....C...#",
"#.....C.E#",
"##########"

]

}

];

function loadLevel(index){

clearInterval(timerInterval);
clearInterval(dangerInterval);

maze=levels[index].map.map(row=>row.split(""));

collectedCoins=0;
totalCoins=0;
timer=60;

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

if(maze[r][c]==="S"){

player.row=r;
player.col=c;
maze[r][c]=".";

}

if(maze[r][c]==="E"){

exitGate.row=r;
exitGate.col=c;
maze[r][c]=".";

}

if(maze[r][c]==="C"){

totalCoins++;

}

}

}

drawBoard();
updateHUD();
startTimer();
startDangerMode();

}

function drawBoard(){

board.innerHTML="";
board.style.gridTemplateColumns=`repeat(${COLS},60px)`;

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

const cell=document.createElement("div");

cell.className="cell";

let icon="";

if(player.row===r && player.col===c){

icon="🐃";

}else if(exitGate.row===r && exitGate.col===c){

icon="🚪";

}else{

switch(maze[r][c]){

case "#":
icon="🧱";
break;

case ".":
icon="";
break;

case "C":
icon="🪙";
break;

case "W":
icon="👹";
break;

case "O":
icon="🕳";
break;

}

}

cell.textContent=icon;
board.appendChild(cell);

}

}

}

function updateHUD(){

levelText.textContent=currentLevel+1;
coinText.textContent=collectedCoins+"/"+totalCoins;
scoreText.textContent=score;
livesText.textContent=lives;
timerText.textContent=timer;

}

function startTimer(){

clearInterval(timerInterval);

timerInterval=setInterval(function(){

timer--;

updateHUD();

if(timer<=0){

clearInterval(timerInterval);

lives--;

if(lives<=0){

alert("💀 GAME OVER");
restartGame();
return;

}

loadLevel(currentLevel);

}

},1000);

}

function movePlayer(dr,dc){

let nr=player.row+dr;
let nc=player.col+dc;

if(maze[nr][nc]==="#"){
return;
}

if(maze[nr][nc]==="O"){

lives--;
updateHUD();

if(lives<=0){

alert("💀 GAME OVER");
restartGame();
return;

}

loadLevel(currentLevel);
return;

}

if(maze[nr][nc]==="W"){

lives--;
score-=20;

updateHUD();

if(lives<=0){

alert("💀 GAME OVER");
restartGame();
return;

}

loadLevel(currentLevel);
return;

}

player.row=nr;
player.col=nc;

if(maze[nr][nc]==="C"){

maze[nr][nc]=".";

collectedCoins++;

score+=10;

}

if(
player.row===exitGate.row &&
player.col===exitGate.col &&
collectedCoins===totalCoins
){

nextLevel();
return;

}

drawBoard();
updateHUD();

}

function moveUp(){

movePlayer(-1,0);

}

function moveDown(){

movePlayer(1,0);

}

function moveLeft(){

movePlayer(0,-1);

}

function moveRight(){

movePlayer(0,1);

}

document.addEventListener("keydown",function(e){

if(e.key==="ArrowUp")moveUp();

if(e.key==="ArrowDown")moveDown();

if(e.key==="ArrowLeft")moveLeft();

if(e.key==="ArrowRight")moveRight();

});

function startDangerMode(){

clearInterval(dangerInterval);

if(currentLevel<2){
return;
}

let speed=6000;

if(currentLevel>=3){
speed=4500;
}

if(currentLevel>=4){
speed=3000;
}

dangerInterval=setInterval(function(){

let cells=[];

for(let r=1;r<ROWS-1;r++){

for(let c=1;c<COLS-1;c++){

if(
maze[r][c]==="." &&
!(player.row===r&&player.col===c) &&
!(exitGate.row===r&&exitGate.col===c)
){

cells.push({r:r,c:c});

}

}

}

if(cells.length===0){
return;
}

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

if(maze[r][c]==="W"){

maze[r][c]=".";

}

}

}

let pos=cells[Math.floor(Math.random()*cells.length)];

maze[pos.r][pos.c]="W";

drawBoard();

},speed);

}

function nextLevel(){

clearInterval(timerInterval);
clearInterval(dangerInterval);

currentLevel++;

if(currentLevel>=levels.length){

alert("🏆 CONGRATULATIONS!\nYOU COMPLETED ALL LEVELS!");

restartGame();
return;

}

loadLevel(currentLevel);

}

function restartGame(){

clearInterval(timerInterval);
clearInterval(dangerInterval);

currentLevel=0;
score=0;
lives=3;

loadLevel(0);

}

function showMessage(text){

if(statusText){

statusText.textContent=text;

}

}

loadLevel(0);

// ==============================
// PART 6A
// Difficulty Upgrade
// ==============================

function getDifficulty(){

if(currentLevel<=1){

return{
wumpus:1,
pits:1,
speed:6000
};

}

if(currentLevel<=3){

return{
wumpus:2,
pits:2,
speed:4500
};

}

return{
wumpus:3,
pits:3,
speed:2500
};

}

function randomEmptyCell(){

let cells=[];

for(let r=1;r<ROWS-1;r++){

for(let c=1;c<COLS-1;c++){

if(
maze[r][c]==="." &&
!(player.row===r&&player.col===c) &&
!(exitGate.row===r&&exitGate.col===c)
){

cells.push({r:r,c:c});

}

}

}

if(cells.length===0){

return null;

}

return cells[Math.floor(Math.random()*cells.length)];

}

function upgradeLevel(){

let diff=getDifficulty();

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

if(maze[r][c]==="W")maze[r][c]=".";

if(maze[r][c]==="O")maze[r][c]=".";

}

}

for(let i=0;i<diff.wumpus;i++){

let p=randomEmptyCell();

if(p){

maze[p.r][p.c]="W";

}

}

for(let i=0;i<diff.pits;i++){

let p=randomEmptyCell();

if(p){

maze[p.r][p.c]="O";

}

}

drawBoard();

}

function levelCompleted(){

score+=100+(currentLevel*50);

showMessage("LEVEL "+(currentLevel+1)+" COMPLETE");

setTimeout(function(){

nextLevel();

},1000);

}

function startDangerMode(){

clearInterval(dangerInterval);

let diff=getDifficulty();

dangerInterval=setInterval(function(){

let cells=[];

for(let r=1;r<ROWS-1;r++){

for(let c=1;c<COLS-1;c++){

if(
maze[r][c]==="." &&
!(player.row===r&&player.col===c) &&
!(exitGate.row===r&&exitGate.col===c)
){

cells.push({r:r,c:c});

}

}

}

if(cells.length===0){

return;

}

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

if(maze[r][c]==="W"){

maze[r][c]=".";

}

}

}

for(let i=0;i<diff.wumpus;i++){

let p=cells[Math.floor(Math.random()*cells.length)];

if(p){

maze[p.r][p.c]="W";

}

}

drawBoard();

},diff.speed);

}

const oldLoadLevel=loadLevel;

loadLevel=function(index){

oldLoadLevel(index);

upgradeLevel();

};

function flashMessage(text,color){

statusText.textContent=text;
statusText.style.color=color;

setTimeout(function(){

statusText.style.color="#00ff66";

},1000);

}

function collectCoinEffect(){

flashMessage("🪙 Coin Collected!","#ffd700");

score+=5;

updateHUD();

}

function dangerEffect(){

flashMessage("⚠ WUMPUS NEARBY!","red");

}

const oldMovePlayer=movePlayer;

movePlayer=function(dr,dc){

let oldCoins=collectedCoins;

oldMovePlayer(dr,dc);

if(collectedCoins>oldCoins){

collectCoinEffect();

}

let around=[
[-1,0],
[1,0],
[0,-1],
[0,1]
];

for(let i=0;i<around.length;i++){

let rr=player.row+around[i][0];
let cc=player.col+around[i][1];

if(
rr>=0 &&
rr<ROWS &&
cc>=0 &&
cc<COLS &&
maze[rr][cc]==="W"
){

dangerEffect();
break;

}

}

if(
player.row===exitGate.row &&
player.col===exitGate.col &&
collectedCoins===totalCoins
){

flashMessage("🚪 Exit Open","#00ffff");

}

};

function animatePlayer(){

const cells=document.querySelectorAll(".cell");

const index=player.row*COLS+player.col;

if(cells[index]){

cells[index].style.transform="scale(1.15)";
cells[index].style.transition="0.2s";

setTimeout(function(){

cells[index].style.transform="scale(1)";

},180);

}

}

const oldDrawBoard=drawBoard;

drawBoard=function(){

oldDrawBoard();

animatePlayer();

};

window.onload=function(){

loadLevel(0);

flashMessage("🐃 WELCOME TO WUMPUS WORLD","#00ffff");

};

function bossMode(){

if(currentLevel<4){
return;
}

clearInterval(dangerInterval);

dangerInterval=setInterval(function(){

let dirs=[
[-1,0],
[1,0],
[0,-1],
[0,1]
];

for(let r=0;r<ROWS;r++){

for(let c=0;c<COLS;c++){

if(maze[r][c]==="W"){

let d=dirs[Math.floor(Math.random()*dirs.length)];

let nr=r+d[0];
let nc=c+d[1];

if(
nr>0 &&
nr<ROWS-1 &&
nc>0 &&
nc<COLS-1 &&
maze[nr][nc]==="."
){

maze[r][c]=".";
maze[nr][nc]="W";

}

}

}

}

drawBoard();

},1800);

}

const oldUpgradeLevel=upgradeLevel;

upgradeLevel=function(){

oldUpgradeLevel();

bossMode();

};
