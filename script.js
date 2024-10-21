const board = [];
const playerColors = [];
const colors = ["lime", "red", "cyan", "black", "yellow", "purple"];
const classNames = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh"];
classNames.forEach((className) => {
    board.push(Array.from(document.getElementsByClassName(className)));
});
initializePlayersColors();
fillBoardWithColors();
let emptySquares = (board.length * board[0].length) - 2;
let player = 0;
const playerSquares = [[board[6][0]], [board[0][7]]];
const scores = [document.getElementById("oneScore"), document.getElementById("twoScore")];
initializeButtons();
function initializePlayersColors() {
    board[6][0].style.backgroundColor = getRandomColor();
    let same = true;
    while (same) {
        board[0][7].style.backgroundColor = getRandomColor();
        same = board[6][0].style.backgroundColor === board[0][7].style.backgroundColor;
    }
    playerColors.push(board[6][0].style.backgroundColor);
    playerColors.push(board[0][7].style.backgroundColor);
}
function fillBoardWithColors() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if ((i === 0 && j === 7) || (i === 6 && j === 0)) continue;
            setSquareColor(i, j);
        }
    }
}
function setSquareColor(i, j) {
    let same = true;
    let newColor;
    while (same) {
        newColor = getRandomColor();
        same = false;

        if (checkAdjacentColor(i, j, newColor)) {
            same = true;
        } else {
            board[i][j].style.backgroundColor = newColor;
        }
    }
}
function checkAdjacentColor(i, j, color) {
    return (
        (i > 0 && board[i - 1][j].style.backgroundColor === color) ||
        (i < 6 && board[i + 1][j].style.backgroundColor === color) ||
        (j > 0 && board[i][j - 1].style.backgroundColor === color) ||
        (j < 7 && board[i][j + 1].style.backgroundColor === color)
    );
}
function updateUI() {
    requestAnimationFrame(() => {
        scores[player].textContent = playerSquares[player].length.toString();
        document.getElementById("turnNumber").textContent = `Player ${player + 1}'s turn! Empty squares: ${emptySquares}`;
    });
}


function limeButton(){ pressButton("lime"); }
function redButton(){ pressButton("red"); }
function cyanButton(){ pressButton("cyan"); }
function blackButton(){ pressButton("black"); }
function yellowButton(){ pressButton("yellow"); }
function purpleButton(){ pressButton("purple"); }
function pressButton(color) {
    playerColors[player] = color;

    const buttons = document.getElementsByClassName("button");
    Array.from(buttons).forEach(button => {
        button.disabled = false;
        button.style.height = "45px";
        button.style.width = "45px";
    });

    colors.forEach((c) => {
        const button = document.getElementById(c);
        if (playerColors.includes(c)) {
            button.disabled = true;
            button.style.width = "30px";
            button.style.height = "30px";
        }
    });

    const adjacent = [];
    playerSquares[player].forEach((square) => {
        const q = classNames.indexOf(square.className);
        addAdjacentSquares(q, square.cellIndex, adjacent, color);
    });

    adjacent.forEach(square => {
        if (!playerSquares[0].includes(square) && !playerSquares[1].includes(square)) {
            playerSquares[player].push(square);
            square.style.backgroundColor = color;
            emptySquares--;
        }
    });

    playerSquares[player].forEach(square => {
        square.style.backgroundColor = color;
    });
    scores[player].textContent = playerSquares[player].length;
    updateUI(); 

    // Switch player
    player = player === 0 ? 1 : 0; 

    // Check for game over
    if (emptySquares <= 0) {
        const endString = getEndGameString();
        document.getElementById("turnNumber").textContent = endString;
    } else {
        document.getElementById("turnNumber").textContent = `Player ${player + 1}'s turn! Empty squares: ${emptySquares}`;
    }
}



function addAdjacentSquares(q, cellIndex, adjacent, color) {
    if (q >= 1 && board[q - 1][cellIndex].style.backgroundColor === color) {
        adjacent.push(board[q - 1][cellIndex]);
    }
    if (q <= 5 && board[q + 1][cellIndex].style.backgroundColor === color) {
        adjacent.push(board[q + 1][cellIndex]);
    }
    if (cellIndex >= 1 && board[q][cellIndex - 1].style.backgroundColor === color) {
        adjacent.push(board[q][cellIndex - 1]);
    }
    if (cellIndex <= 6 && board[q][cellIndex + 1].style.backgroundColor === color) {
        adjacent.push(board[q][cellIndex + 1]);
    }
}
function setColorRandom(square) {
    square.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}
function getEndGameString() {
    if (playerSquares[0].length > playerSquares[1].length) {
        return "Player 1 wins!";
    } else if (playerSquares[0].length < playerSquares[1].length) {
        return "Player 2 wins!";
    } else {
        return "Tie!";
    }
}
function initializeButtons() {
    colors.forEach((color) => {
        const button = document.getElementById(color);
        if (playerColors.includes(color)) {
            button.disabled = true;
            button.style.width = "30px";
            button.style.height = "30px";
        }
    });
}
