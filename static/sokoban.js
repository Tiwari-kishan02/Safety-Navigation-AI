// ==========================
// SOKOBAN AI GAME
// ==========================

// Game Board
let board = [
    ["🧱","🧱","🧱","🧱","🧱"],
    ["🧱","😀","📦","⭐","🧱"],
    ["🧱"," "," "," ","🧱"],
    ["🧱","🧱","🧱","🧱","🧱"]
];

// Player Position
let playerRow = 1;
let playerCol = 1;

// Target Position
const targetRow = 1;
const targetCol = 3;

// Moves Counter
let moves = 0;

// HTML Elements
const gameBoard = document.getElementById("board");
const movesText = document.getElementById("moves");
const statusText = document.getElementById("status");

// ==========================
// DRAW BOARD
// ==========================

function drawBoard(){

    gameBoard.innerHTML="";

    for(let i=0;i<board.length;i++){

        for(let j=0;j<board[i].length;j++){

            const cell=document.createElement("div");

            cell.className="cell";

            cell.textContent=board[i][j];

            gameBoard.appendChild(cell);

        }

    }

}

// ==========================
// PLAYER MOVE
// ==========================

function movePlayer(newRow,newCol){

    // Wall
    if(board[newRow][newCol]=="🧱"){
        return;
    }

    // Box Push
    if(board[newRow][newCol]=="📦"){

        let boxRow=newRow+(newRow-playerRow);

        let boxCol=newCol+(newCol-playerCol);

        if(board[boxRow][boxCol]=="🧱"){
            return;
        }

        if(board[boxRow][boxCol]=="📦"){
            return;
        }

        board[boxRow][boxCol]="📦";

    }

    board[playerRow][playerCol]=" ";

    playerRow=newRow;
    playerCol=newCol;

    board[playerRow][playerCol]="😀";

    moves++;

    movesText.textContent="Moves : "+moves;

    // Win Check
    if(board[targetRow][targetCol]=="📦"){

        statusText.textContent="🏆 LEVEL COMPLETED";

    }

    drawBoard();

}

// ==========================
// KEYBOARD
// ==========================

document.addEventListener("keydown",function(e){

    if(e.key=="ArrowUp"){

        movePlayer(playerRow-1,playerCol);

    }

    if(e.key=="ArrowDown"){

        movePlayer(playerRow+1,playerCol);

    }

    if(e.key=="ArrowLeft"){

        movePlayer(playerRow,playerCol-1);

    }

    if(e.key=="ArrowRight"){

        movePlayer(playerRow,playerCol+1);

    }

});

// ==========================

drawBoard();
