/// ===============================
// SOKOBAN AI GAME
// Complete Multi Level Version
// Part 1/3
// ===============================

let currentLevel = 0;
let moves = 0;

let player = {
    row: 0,
    col: 0
};

let boxes = [];
let targets = [];

const levels = [

    // LEVEL 1
    {
        map: [
            "########",
            "#      #",
            "#  .   #",
            "#  $   #",
            "#  @   #",
            "#      #",
            "########"
        ]
    },


    // LEVEL 2
    {
        map: [
            "########",
            "#   .  #",
            "#  $$  #",
            "#  ..  #",
            "#  @   #",
            "#      #",
            "########"
        ]
    },


    // LEVEL 3
    {
        map: [
            "########",
            "# . .  #",
            "# $$   #",
            "#  @   #",
            "#      #",
            "#      #",
            "########"
        ]
    }

];


let board = [];


// ===============================
// LOAD LEVEL
// ===============================

function loadLevel(){

    board = [];

    boxes = [];
    targets = [];

    moves = 0;

    document.getElementById("moves").innerText =
        "Moves: " + moves;


    let level = levels[currentLevel];


    for(let r = 0; r < level.map.length; r++){

        let row = [];

        for(let c = 0; c < level.map[r].length; c++){

            let char = level.map[r][c];


            if(char === "@"){

                player.row = r;
                player.col = c;

                row.push(" ");

            }

            else if(char === "$"){

                boxes.push({
                    row:r,
                    col:c
                });

                row.push(" ");

            }

            else if(char === "."){

                targets.push({
                    row:r,
                    col:c
                });

                row.push(".");

            }

            else{

                row.push(char);

            }

        }

        board.push(row);

    }


    drawBoard();

    updateStatus(
        "Level " + (currentLevel + 1)
    );

}



// ===============================
// DRAW BOARD
// ===============================

function drawBoard(){

    let game =
    document.getElementById("game");


    game.innerHTML="";


    for(let r=0;r<board.length;r++){

        for(let c=0;c<board[r].length;c++){


            let cell =
            document.createElement("div");


            cell.className="cell";


            let value = board[r][c];


            if(value === "#"){

                cell.innerHTML="🧱";

            }

            else{

                let isBox=false;


                for(let b of boxes){

                    if(
                    b.row===r &&
                    b.col===c
                    ){

                        isBox=true;
                        break;

                    }

                }



                let isPlayer =
                player.row===r &&
                player.col===c;



                let isTarget=false;


                for(let t of targets){

                    if(
                    t.row===r &&
                    t.col===c
                    ){

                        isTarget=true;
                        break;

                    }

                }



                if(isPlayer){

                    cell.innerHTML="😀";

                }

                else if(isBox){

                    if(isTarget){

                        cell.innerHTML="📦⭐";

                    }

                    else{

                        cell.innerHTML="📦";

                    }

                }

                else if(isTarget){

                    cell.innerHTML="⭐";

                }

                else{

                    cell.innerHTML="";

                }


            }


            game.appendChild(cell);


        }

    }

}

// ===============================
// SOKOBAN AI GAME
// Part 2/3
// Movement + Box Push + Controls
// ===============================


// CHECK BOX POSITION
function boxAt(row,col){

    for(let b of boxes){

        if(
            b.row===row &&
            b.col===col
        ){

            return b;

        }

    }

    return null;

}



// CHECK WALL
function isWall(row,col){

    if(row < 0 ||
       col < 0 ||
       row >= board.length ||
       col >= board[0].length){

        return true;

    }


    return board[row][col] === "#";

}



// MOVE PLAYER
function movePlayer(dr,dc){


    let newRow =
    player.row + dr;


    let newCol =
    player.col + dc;



    if(isWall(newRow,newCol)){

        return;

    }



    let box =
    boxAt(newRow,newCol);



    // BOX PUSH
    if(box){


        let boxNewRow =
        newRow + dr;


        let boxNewCol =
        newCol + dc;



        if(
            isWall(boxNewRow,boxNewCol)
            ||
            boxAt(boxNewRow,boxNewCol)
        ){

            return;

        }



        box.row =
        boxNewRow;


        box.col =
        boxNewCol;


    }



    player.row =
    newRow;


    player.col =
    newCol;



    moves++;


    document.getElementById("moves").innerText =
    "Moves: " + moves;



    drawBoard();


    checkWin();

}



// ===============================
// KEYBOARD CONTROL
// ===============================


document.addEventListener(
"keydown",
function(e){


    if(e.key==="ArrowUp"){

        movePlayer(-1,0);

    }


    else if(e.key==="ArrowDown"){

        movePlayer(1,0);

    }


    else if(e.key==="ArrowLeft"){

        movePlayer(0,-1);

    }


    else if(e.key==="ArrowRight"){

        movePlayer(0,1);

    }


});




// ===============================
// WIN CHECK
// ===============================

function checkWin(){


    let completed = true;



    for(let t of targets){


        let found=false;



        for(let b of boxes){


            if(
                b.row===t.row &&
                b.col===t.col
            ){

                found=true;
                break;

            }


        }



        if(!found){

            completed=false;
            break;

        }


    }



    if(completed){


        updateStatus(
        "🎉 Level Complete!"
        );


        setTimeout(
        function(){

            nextLevel();

        },
        1500
        );


    }


}



// ===============================
// RESET CURRENT LEVEL
// ===============================

function resetLevel(){

    loadLevel();

}



// ===============================
// NEXT LEVEL
// ===============================

function nextLevel(){


    currentLevel++;



    if(currentLevel >= levels.length){


        updateStatus(
        "🏆 All Levels Completed!"
        );


        currentLevel =
        levels.length-1;


        return;


    }



    loadLevel();


}



// ===============================
// STATUS TEXT
// ===============================

function updateStatus(text){


    let status =
    document.getElementById("status");


    if(status){

        status.innerText=text;

    }


}

// ===============================
// SOKOBAN AI GAME
// Part 3/3
// Initialization + Buttons + AI Hint
// ===============================


// ===============================
// BUTTON FUNCTIONS
// ===============================


function setupButtons(){


    let resetBtn =
    document.getElementById("resetBtn");


    if(resetBtn){

        resetBtn.onclick =
        function(){

            resetLevel();

        };

    }



    let nextBtn =
    document.getElementById("nextBtn");


    if(nextBtn){

        nextBtn.onclick =
        function(){

            nextLevel();

        };

    }



    let hintBtn =
    document.getElementById("hintBtn");


    if(hintBtn){

        hintBtn.onclick =
        function(){

            showHint();

        };

    }


}



// ===============================
// SIMPLE AI HINT SYSTEM
// ===============================

function showHint(){


    let hints=[

        "Try moving boxes towards ⭐ targets",

        "Avoid pushing boxes into corners",

        "Plan your moves before pushing",

        "Use arrow keys to control player"

    ];



    let random =
    hints[
        Math.floor(
        Math.random()*hints.length
        )
    ];



    updateStatus(
        "🤖 AI Hint: " + random
    );


}



// ===============================
// TOUCH CONTROL READY
// ===============================


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



// ===============================
// GAME START
// ===============================


window.addEventListener("DOMContentLoaded", function(){

    loadLevel();

    setupButtons();

});

document.addEventListener("keydown", function(event){

    console.log("Key pressed:", event.key);

    if(event.key === "ArrowUp"){
        movePlayer(-1,0);
    }

    if(event.key === "ArrowDown"){
        movePlayer(1,0);
    }

    if(event.key === "ArrowLeft"){
        movePlayer(0,-1);
    }

    if(event.key === "ArrowRight"){
        movePlayer(0,1);
    }

});
