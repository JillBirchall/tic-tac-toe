const gameOptionsList = document.getElementById("gameOptionsList");
const gameOption = document.querySelectorAll("[data-game-option]");
const gameContainer = document.getElementById("gameContainer");
const gameBoard = document.getElementById("gameBoard");
const squaresDisplay = document.querySelectorAll("[data-square]");
const gameInfoDisplay = document.getElementById("gameInfo");
const newGameBtn = document.getElementById("newGameBtn");
let grid = []; //Stores the current board set-up
let isTwoPlayer = false;
let difficulty = "";
let currentPlayer = 1;
let gameInProgress = false;
let isPlayerTurn = true;
let winningLines = [];

gameOption.forEach((option) => {
  option.addEventListener("click", (e) => {
    let gameOption = e.target.dataset.gameOption;
    setGameType(gameOption);
    startGame();
  });
});

squaresDisplay.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (
      isSquareEmpty(e.target.dataset.square) &&
      gameInProgress &&
      isPlayerTurn
    ) {
      nextTurn(e);
    }
  });
});

newGameBtn.addEventListener("click", () => {
  resetGame();
});

function setGameType(option) {
  if (option === "2-player") {
    isTwoPlayer = true;
  } else {
    isTwoPlayer = false;
    difficulty = option;
  }
}

function isSquareEmpty(square) {
  return grid[square] === "EMPTY" ? true : false;
}

function startGame() {
  initialiseBoard();
  gameOptionsList.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameInProgress = true;
  isTwoPlayer ? updateTurnInfo("Player 1") : updateTurnInfo("Player");
}

function initialiseBoard() {
  for (let i = 0; i < 9; i++) {
    grid.push("EMPTY");
  }
}

function nextTurn(event) {
  if (isTwoPlayer) {
    playerTurn(event.target);
    currentPlayer === 1 ? (currentPlayer = 2) : (currentPlayer = 1); //Swap Player
  } else {
    playerTurn(event.target);
    if (gameInProgress) {
      currentPlayer = 2;
      isPlayerTurn = false;
      setTimeout(computerTurn, 1000);
    }
  }
}

function playerTurn(squareClicked) {
  let currentPiece;

  currentPlayer === 1 ? (currentPiece = "X") : (currentPiece = "O");

  makeMove(currentPiece, squareClicked);

  if (checkWin(currentPiece, grid)) {
    endGame(currentPiece);
  } else if (checkDraw()) {
    endGame("DRAW");
  } else {
    if (isTwoPlayer) {
      currentPlayer === 1
        ? updateTurnInfo("Player 2")
        : updateTurnInfo("Player 1");
    } else {
      isPlayerTurn = false;
      updateTurnInfo("Computer");
    }
  }
}

function computerTurn() {
  switch (difficulty) {
    case "easy":
      makeEasyComputerMove();
      break;
    case "medium":
      makeMediumComputerMove();
      break;
    case "hard":
      makeHardComputerMove();
      break;
    default:
      makeEasyComputerMove();
  }

  if (checkWin("O", grid)) {
    endGame("O");
  } else if (checkDraw()) {
    endGame("DRAW");
  } else {
    isPlayerTurn = true;
    currentPlayer = 1;
    updateTurnInfo("Player");
  }
}

function makeRandomMove() {
  if (grid.includes("EMPTY") && gameInProgress) {
    let randomSquare;

    do {
      randomSquare = String(Math.floor(Math.random() * 9));
    } while (!isSquareEmpty(randomSquare));

    let square = document.querySelector(`[data-square="${randomSquare}"]`);
    makeMove("O", square);
  }
}

function makeEasyComputerMove() {
  makeRandomMove();
}

function makeMediumComputerMove() {
  for (let i = 0; i < 9; i++) {
    if (isSquareEmpty(i)) {
      if (isWinningMove(i, "O")) {
        makeMove("O", document.querySelector(`[data-square="${i}"]`));
        return;
      }
    }
  }
  makeRandomMove();
}

function makeHardComputerMove() {
  for (let i = 0; i < 9; i++) {
    if (isSquareEmpty(i)) {
      if (isWinningMove(i, "O")) {
        makeMove("O", document.querySelector(`[data-square="${i}"]`));
        return;
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    if (isSquareEmpty(i)) {
      if (isWinningMove(i, "X")) {
        makeMove("O", document.querySelector(`[data-square="${i}"]`));
        return;
      }
    }
  }

  makeRandomMove();
}

function isWinningMove(square, piece) {
  let tempgrid = [...grid];
  tempgrid[square] = piece;
  let isWin = checkWin(piece, tempgrid);
  winningLines = []; //Clear any winning lines as these will be added later if needed, and may be incorrect if an opponent's move was countered
  return isWin;
}

function makeMove(piece, squareClicked) {
  squareClicked.classList.add(piece);
  grid[squareClicked.dataset.square] = piece;
}

//Checks if the game board contains a winning line for the specified piece
function checkWin(piece, board) {
  let isWinningLine = false;

  //Horizontal Row
  for (let i = 0; i < 9; i += 3) {
    if (
      board[i] === piece &&
      board[i + 1] === piece &&
      board[i + 2] === piece
    ) {
      winningLines.push(`row-${i / 3 + 1}`);
      isWinningLine = true;
    }
  }

  //Vertical Columns
  for (let i = 0; i < 3; i++) {
    if (board[i] == piece && board[i + 3] === piece && board[i + 6] === piece) {
      winningLines.push(`column-${i + 1}`);
      isWinningLine = true;
    }
  }

  //Diagonal Lines
  if (board[0] === piece && board[4] === piece && board[8] === piece) {
    winningLines.push("diagonal-1");
    isWinningLine = true;
  }

  if (board[2] === piece && board[4] === piece && board[6] === piece) {
    winningLines.push("diagonal-2");
    isWinningLine = true;
  }

  return isWinningLine;
}

function checkDraw() {
  if (grid.includes("EMPTY")) {
    return false;
  }

  return true;
}

function updateTurnInfo(player) {
  gameInfoDisplay.innerText = `${player} Turn`;
}

function endGame(winner) {
  gameInProgress = false;
  winner === "DRAW" ? displayDraw() : displayWinner();
  if (winner !== "DRAW") {
    animateWinningLines();
  }
  newGameBtn.classList.remove("hidden");
}

function animateWinningLines() {
  winningLines.forEach((winningLine) => {
    let lineAnimation = document.createElement("div");
    gameBoard.appendChild(lineAnimation);
    lineAnimation.classList.add("line");
    lineAnimation.classList.add(winningLine);
  });
}

function resetWinningLines() {
  winningLines = [];
  let winningLineElements = document.getElementsByClassName("line");
  while (winningLineElements.length > 0) {
    winningLineElements[0].parentNode.removeChild(winningLineElements[0]);
  }
}

function displayDraw() {
  gameInfoDisplay.innerText = "It's a Draw!";
}

function displayWinner() {
  let winnerText = "";
  if (isTwoPlayer) {
    if (currentPlayer === 1) {
      winnerText = "Player 1";
    } else {
      winnerText = "Player 2";
    }
  } else {
    if (currentPlayer === 1) {
      winnerText = "Player";
    } else {
      winnerText = "Computer";
    }
  }
  gameInfoDisplay.innerText = `${winnerText} Wins!`;
}

function resetGame() {
  resetWinningLines();
  clearBoard();
  displayGameOptions();
  grid = [];
  currentPlayer = 1;
  gameInProgress = false;
  isPlayerTurn = true;
}

function displayGameOptions() {
  gameContainer.classList.add("hidden");
  newGameBtn.classList.add("hidden");
  gameOptionsList.classList.remove("hidden");
}

function clearBoard() {
  squaresDisplay.forEach((item) => {
    item.classList.remove("X");
    item.classList.remove("O");
  });
}
