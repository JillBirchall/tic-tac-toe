const gameOptionsList = document.getElementById("gameOptionsList");
const gameOption = document.querySelectorAll("[data-game-option]");
const gameContainer = document.getElementById("gameContainer");
const squaresDisplay = document.querySelectorAll("[data-square]");
const gameInfoDisplay = document.getElementById("gameInfo");
const newGameBtn = document.getElementById("newGameBtn");
let takenSquares = []; //Stores a list of all the squares that contain pieces
let isTwoPlayer = false;
let difficulty = "";
let currentPlayer = 1;
let gameInProgress = false;
let isPlayerTurn = true;

gameOption.forEach(option => {
    option.addEventListener("click", e => {
        let gameOption = e.target.dataset.gameOption;
        setGameType(gameOption);
        startGame();
    })
});

squaresDisplay.forEach((item) => {
    item.addEventListener("click", (e) => {
        if (isSquareEmpty(e.target.dataset.square) && gameInProgress && playerTurn) {
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
    return takenSquares.indexOf(square) === -1 ? true : false;
 } 

function startGame() {
    gameOptionsList.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    gameInProgress = true;
    isTwoPlayer ? updateTurnInfo("Player 1") : updateTurnInfo("Player");
  
}

function nextTurn(event) {
    if (isTwoPlayer) {
        playerTurn(event.target);
        currentPlayer === 1? currentPlayer = 2 : currentPlayer = 1; //Swap Player
    } else {
        playerTurn(event.target);
        currentPlayer = 2;
        isPlayerTurn = false;
        setTimeout(computerTurn, 1000);
    }
}

function playerTurn(squareClicked) {
    if (currentPlayer === 1) {
        makeMove("X", squareClicked);
        checkWin("X");
        if (gameInProgress) isTwoPlayer ? updateTurnInfo("Player 2") : updateTurnInfo("Computer");
    } else {
        isPlayerTurn = false;
        makeMove("O", squareClicked);
        checkWin("O");
        if (gameInProgress) isTwoPlayer ? updateTurnInfo("Player 1") : updateTurnInfo("Player");
    }
}

function computerTurn() {
    makeEasyComputerMove();
    checkWin("O");
    if (gameInProgress) {
        isPlayerTurn = true;
        currentPlayer = 1;
        updateTurnInfo("Player");
    }
}

function makeEasyComputerMove() {

    if (takenSquares.length < 9 && gameInProgress) {
        let randomSquare;
    
        do {
          randomSquare = String(Math.floor(Math.random() * 9));
        } while (!isSquareEmpty(randomSquare));
    
        let square = document.querySelector(`[data-square="${randomSquare}"]`);
        makeMove("O", square);
}
}

function makeMove(piece, squareClicked) {
    squareClicked.classList.add(piece);
    takenSquares.push(squareClicked.dataset.square);
}

function checkWin(piece) {
    //Horizontal
  for (let i = 0; i < 9; i += 3) {
    if (
      document
        .querySelector(`[data-square="${i}"]`)
        .classList.contains(piece) &&
      document
        .querySelector(`[data-square="${i + 1}"]`)
        .classList.contains(piece) &&
      document
        .querySelector(`[data-square="${i + 2}"]`)
        .classList.contains(piece)
    ) {
        endGame(piece);
      return;
    }
  }
  //Vertical
  for (let i = 0; i < 3; i++) {
    if (
      document
        .querySelector(`[data-square="${i}"]`)
        .classList.contains(piece) &&
      document
        .querySelector(`[data-square="${i + 3}"]`)
        .classList.contains(piece) &&
      document
        .querySelector(`[data-square="${i + 6}"]`)
        .classList.contains(piece)
    ) {
        endGame(piece);
      return;
    }
  }
  //diagonals
  if (
    (document.querySelector(`[data-square="0"]`).classList.contains(piece) &&
      document.querySelector(`[data-square="4"]`).classList.contains(piece) &&
      document.querySelector(`[data-square="8"]`).classList.contains(piece)) ||
    (document.querySelector(`[data-square="2"]`).classList.contains(piece) &&
      document.querySelector(`[data-square="4"]`).classList.contains(piece) &&
      document.querySelector(`[data-square="6"]`).classList.contains(piece))
  ) {
    endGame(piece);
    return;
  }
  //Check for draw
  if (takenSquares.length === 9) {
    endGame("DRAW");
  }
}

function updateTurnInfo(player) {
    gameInfoDisplay.innerText = `${player} Turn`
}

function endGame(winner) {
    gameInProgress = false;
    winner === "DRAW" ? displayDraw() : displayWinner();
    newGameBtn.classList.remove("hidden");

}

function displayDraw() {
    gameInfoDisplay.innerText = "It's a Draw!";
}

function displayWinner() {
    let winnerText = "";
  if (isTwoPlayer) {
      if (currentPlayer === 1) {
        winnerText = "Player 1"
      } else {
        winnerText = "Player 2"
      }
  } else {
    if (currentPlayer === 1) {
        winnerText = "Player"
      } else {
        winnerText = "Computer"
      }
  }
  gameInfoDisplay.innerText = `${winnerText} Wins!`

}

function resetGame() {
    clearBoard();
    displayGameOptions();
    takenSquares = []; 
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










