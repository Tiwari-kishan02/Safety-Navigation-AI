const board = document.getElementById("board");
const levelText = document.getElementById("level");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const coinsText = document.getElementById("coins");
const timerText = document.getElementById("timer");
const statusText = document.getElementById("status");

const upBtn = document.getElementById("up");
const downBtn = document.getElementById("down");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const resetBtn = document.getElementById("reset");

const ROWS = 10;
const COLS = 10;

let currentLevel = 0;
let score = 0;
let lives = 3;
let timer = 60;

let collectedCoins = 0;
let totalCoins = 0;

let maze = [];
let timerInterval = null;
let dangerInterval = null;

let player = {
    row: 1,
    col: 1
};

let exitGate = {
    row: 8,
    col: 8
};

const levels = [
    { time:60, wumpus:0, pits:0, walls:0 },
    { time:60, wumpus:1, pits:0, walls:0 },
    { time:60, wumpus:1, pits:1, walls:1 },
    { time:58, wumpus:1, pits:1, walls:2 },
    { time:58, wumpus:1, pits:2, walls:2 },
    { time:55, wumpus:2, pits:2, walls:3 },
    { time:55, wumpus:2, pits:2, walls:4 },
    { time:53, wumpus:2, pits:3, walls:4 },
    { time:53, wumpus:2, pits:3, walls:5 },
    { time:50, wumpus:3, pits:3, walls:5 },
    { time:50, wumpus:3, pits:3, walls:6 },
    { time:48, wumpus:3, pits:4, walls:6 },
    { time:48, wumpus:3, pits:4, walls:7 },
    { time:46, wumpus:3, pits:5, walls:7 },
    { time:46, wumpus:4, pits:5, walls:8 },
    { time:44, wumpus:4, pits:5, walls:8 },
    { time:43, wumpus:4, pits:6, walls:9 },
    { time:42, wumpus:4, pits:6, walls:10 },
    { time:41, wumpus:5, pits:7, walls:11 },
    { time:40, wumpus:5, pits:7, walls:12 }
];

function emptyMaze() {
    maze = [];

    for (let r = 0; r < ROWS; r++) {
        maze[r] = [];

        for (let c = 0; c < COLS; c++) {
            if (
                r === 0 ||
                c === 0 ||
                r === ROWS - 1 ||
                c === COLS - 1
            ) {
                maze[r][c] = "#";
            } else {
                maze[r][c] = ".";
            }
        }
    }
}

function randomCell() {
    let r;
    let c;

    do {
        r = 1 + Math.floor(Math.random() * (ROWS - 2));
        c = 1 + Math.floor(Math.random() * (COLS - 2));
    } while (
        maze[r][c] !== "." ||
        (r === player.row && c === player.col) ||
        (r === exitGate.row && c === exitGate.col)
    );

    return { row: r, col: c };
}

function buildLevel() {

    emptyMaze();

    player = {
        row: 1,
        col: 1
    };

    exitGate = {
        row: 8,
        col: 8
    };

    maze[player.row][player.col] = ".";
    maze[exitGate.row][exitGate.col] = ".";

    const difficulty = levels[currentLevel];

    for (let i = 0; i < difficulty.walls; i++) {

        const p = randomCell();

        if (
            Math.abs(p.row - player.row) +
            Math.abs(p.col - player.col) > 2
        ) {
            maze[p.row][p.col] = "#";
        }
    }

    for (let i = 0; i < difficulty.pits; i++) {

        const p = randomCell();

        if (maze[p.row][p.col] === ".") {
            maze[p.row][p.col] = "O";
        }
    }

    for (let i = 0; i < 5; i++) {

        const p = randomCell();

        if (maze[p.row][p.col] === ".") {
            maze[p.row][p.col] = "C";
        } else {
            i--;
        }
    }

    for (let i = 0; i < difficulty.wumpus; i++) {

        const p = randomCell();

        if (maze[p.row][p.col] === ".") {
            maze[p.row][p.col] = "W";
        } else {
            i--;
        }
    }
}

function loadLevel(index) {

    clearInterval(timerInterval);
    clearInterval(dangerInterval);

    currentLevel = index;

    timer = levels[currentLevel].time;

    collectedCoins = 0;
    totalCoins = 5;

    buildLevel();

    drawBoard();
    updateHUD();
    startTimer();
    startDangerMode();
}

function updateHUD() {

    if (levelText) {
        levelText.textContent = currentLevel + 1;
    }

    if (scoreText) {
        scoreText.textContent = score;
    }

    if (livesText) {
        livesText.textContent = lives;
    }

    if (coinsText) {
        coinsText.textContent = collectedCoins;
    }

    if (timerText) {
        timerText.textContent = timer;
    }
}

function setStatus(message) {

    if (statusText) {
        statusText.textContent = message;
    }
}

function drawBoard() {

    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${COLS}, 70px)`;

    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const cell = document.createElement("div");

            cell.className = "cell";

            let icon = "";

            if (
                player.row === r &&
                player.col === c
            ) {

                icon = "🐃";

            } else if (
                exitGate.row === r &&
                exitGate.col === c
            ) {

                icon = "🚪";

            } else {

                switch (maze[r][c]) {

                    case "#":
                        icon = "🧱";
                        break;

                    case "C":
                        icon = "🪙";
                        break;

                    case "W":
                        icon = "👹";
                        break;

                    case "O":
                        icon = "🕳️";
                        break;

                    default:
                        icon = "";
                }
            }

            cell.textContent = icon;

            board.appendChild(cell);
        }
    }
}

function collectCoin() {

    if (maze[player.row][player.col] === "C") {

        maze[player.row][player.col] = ".";

        collectedCoins++;

        score += 10;

        updateHUD();
    }
}

function checkDanger() {

    const tile = maze[player.row][player.col];

    if (tile === "W") {

        loseLife();

        return true;
    }

    if (tile === "O") {

        loseLife();

        return true;
    }

    return false;
}

function checkWin() {

    if (
        player.row === exitGate.row &&
        player.col === exitGate.col &&
        collectedCoins === totalCoins
    ) {

        clearInterval(timerInterval);
        clearInterval(dangerInterval);

        score += 100;

        updateHUD();

        setStatus(
            "🏆 LEVEL COMPLETE!"
        );

        setTimeout(function() {

            if (currentLevel < levels.length - 1) {

                currentLevel++;

                loadLevel(currentLevel);

            } else {

                alert(
                    "🏆 YOU COMPLETED ALL 20 LEVELS!"
                );

                currentLevel = 0;
                score = 0;
                lives = 3;

                loadLevel(0);
            }

        }, 700);
    }
}

function movePlayer(dr, dc) {

    const nr = player.row + dr;
    const nc = player.col + dc;

    if (
        nr < 0 ||
        nc < 0 ||
        nr >= ROWS ||
        nc >= COLS
    ) {
        return;
    }

    if (maze[nr][nc] === "#") {
        return;
    }

    player.row = nr;
    player.col = nc;

    collectCoin();

    if (checkDanger()) {
        return;
    }

    updateHUD();
    drawBoard();

    checkWin();
}

function loseLife() {

    lives--;

    updateHUD();

    if (lives <= 0) {

        clearInterval(timerInterval);
        clearInterval(dangerInterval);

        alert("💀 GAME OVER");

        lives = 3;
        score = 0;
        currentLevel = 0;

        loadLevel(0);

        return;
    }

    setStatus(
        "⚠️ Danger! Lives remaining: " + lives
    );

    setTimeout(function() {

        buildLevel();

        drawBoard();
        updateHUD();

    }, 300);
}

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(function() {

        timer--;

        updateHUD();

        if (timer <= 0) {

            clearInterval(timerInterval);

            setStatus("⏰ TIME UP!");

            loseLife();
        }

    }, 1000);
}

function startDangerMode() {

    clearInterval(dangerInterval);

    const level = currentLevel;

    if (level < 5) {
        return;
    }

    let speed = 5000;

    if (level >= 10) {
        speed = 3500;
    }

    if (level >= 15) {
        speed = 2200;
    }

    if (level >= 19) {
        speed = 1400;
    }

    dangerInterval = setInterval(function() {

        let oldWumpus = [];

        for (let r = 1; r < ROWS - 1; r++) {

            for (let c = 1; c < COLS - 1; c++) {

                if (maze[r][c] === "W") {

                    oldWumpus.push({
                        row: r,
                        col: c
                    });

                    maze[r][c] = ".";
                }
            }
        }

        for (let i = 0; i < oldWumpus.length; i++) {

            const p = randomCell();

            maze[p.row][p.col] = "W";
        }

        const extra = Math.floor(level / 5);

        for (let i = 0; i < extra; i++) {

            const p = randomCell();

            maze[p.row][p.col] = "W";
        }

        drawBoard();

        if (maze[player.row][player.col] === "W") {

            loseLife();
        }

    }, speed);
}

document.addEventListener("keydown", function(e) {

    if (e.key === "ArrowUp") {
        e.preventDefault();
        movePlayer(-1, 0);
    }

    if (e.key === "ArrowDown") {
        e.preventDefault();
        movePlayer(1, 0);
    }

    if (e.key === "ArrowLeft") {
        e.preventDefault();
        movePlayer(0, -1);
    }

    if (e.key === "ArrowRight") {
        e.preventDefault();
        movePlayer(0, 1);
    }
});

if (upBtn) {
    upBtn.onclick = function() {
        movePlayer(-1, 0);
    };
}

if (downBtn) {
    downBtn.onclick = function() {
        movePlayer(1, 0);
    };
}

if (leftBtn) {
    leftBtn.onclick = function() {
        movePlayer(0, -1);
    };
}

if (rightBtn) {
    rightBtn.onclick = function() {
        movePlayer(0, 1);
    };
}

if (resetBtn) {
    resetBtn.onclick = function() {
        loadLevel(currentLevel);
    };
}

function restartGame() {

    score = 0;
    lives = 3;
    currentLevel = 0;

    loadLevel(0);
}

function nextLevel() {

    if (currentLevel < levels.length - 1) {

        currentLevel++;

        loadLevel(currentLevel);

    } else {

        alert("🏆 ALL 20 LEVELS COMPLETED!");

        restartGame();
    }
}

function showLevelMessage() {

    setStatus(
        "LEVEL " +
        (currentLevel + 1) +
        " / " +
        levels.length
    );

    if (currentLevel < 5) {
        setStatus("🟢 EASY LEVEL");
    } else if (currentLevel < 10) {
        setStatus("🟡 MEDIUM LEVEL");
    } else if (currentLevel < 15) {
        setStatus("🟠 HARD LEVEL");
    } else if (currentLevel < 19) {
        setStatus("🔴 VERY HARD LEVEL");
    } else {
        setStatus("👹 BOSS LEVEL");
    }
}

function startGame() {

    score = 0;
    lives = 3;
    currentLevel = 0;

    loadLevel(0);
    showLevelMessage();
}

startGame();

function finalCheck() {

    if (!board) {
        return;
    }

    drawBoard();
    updateHUD();
}

window.addEventListener("load", function() {

    finalCheck();

});
