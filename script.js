const gameBoard = (() => {
  let board = [];

  for (let i = 0; i < 3; i++) {
    board.push([]);

    for (let j = 0; j < 3; j++) {
      board[i].push(" ");
    }
  }

  const getBoard = () => board;

  const restartBoard = () => {
    board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  };

  const mapRowAndColumn = (position) => {
    const row = Math.floor((position - 1) / 3);
    const column = (position - 1) % 3;

    return { row, column };
  };

  const checkBothDiagonals = (row, column) => {
    let checkLeftDiagonal = false;
    let checkRightDiagonal = false;

    if (row === column) {
      checkLeftDiagonal = [0, 1, 2].every(
        (i) => board[i][i] !== " " && board[i][i] === board[0][0],
      );
    }

    if (row + column === 2) {
      checkRightDiagonal = [0, 1, 2].every(
        (i) => board[i][2 - i] !== " " && board[0][2] === board[i][2 - i],
      );
    }

    return checkLeftDiagonal || checkRightDiagonal;
  };

  const checkWinner = (position) => {
    const { row, column } = mapRowAndColumn(position);

    // Check row
    const checkRow = board[row].every(
      (value) => value !== " " && value === board[row][0],
    );
    if (checkRow) return true;

    // Check column
    const checkColumn = [0, 1, 2].every(
      (i) => board[i][column] !== " " && board[i][column] === board[0][column],
    );
    if (checkColumn) return true;

    // Check diagonal (only if it applies)
    const checkDiagonals = checkBothDiagonals(row, column);
    if (checkDiagonals) return true;

    return false;
  };

  const addPlay = (value, position) => {
    const { row, column } = mapRowAndColumn(position);

    if (board[row][column] !== " ") {
      return false;
    }

    board[row][column] = value;

    return true;
  };

  return { getBoard, restartBoard, addPlay, checkWinner };
})();

function createPlayer(name, mark) {
  const setName = (newName) => {
    name = newName;
  };

  const setMark = (newMark) => {
    mark = newMark;
  };

  const getName = () => name;
  const getMark = () => mark;
  return { setName, setMark, getName, getMark };
}

const ticTacToe = (() => {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");

  let activeTurn = 1;
  let activePlayer = player1;

  changePlayerOneName = (name) => {
    player1.setName(name);
  };

  changePlayerTwoName = (name) => {
    player2.setName(name);
  };

  const restartGame = () => {
    activePlayer = player1;
    activeTurn = 1;
    gameBoard.restartBoard();
  };

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const increaseTurn = () => activeTurn++;

  const getActivePlayer = () => activePlayer;

  const playRound = (position) => {
    const activeMark = getActivePlayer().getMark();
    const activeName = getActivePlayer().getName();

    const validPlay = gameBoard.addPlay(activeMark, position);

    if (!validPlay) return { status: "invalid" };

    const hasWinner = gameBoard.checkWinner(position);
    if (hasWinner)
      return { status: "win", message: `${activeName} won the game!` };

    if (increaseTurn() >= 9)
      return { status: "tie", message: "It's a tie! Nobody won this time" };

    switchTurn();
  };

  return {
    playRound,
    restartGame,
    getActivePlayer,
    changePlayerOneName,
    changePlayerTwoName,
  };
})();

const displayController = (() => {
  const boardElement = document.querySelector(".board");

  const restartButtons = document.querySelectorAll(".restart-game-btn");

  const openDialogNames = document.querySelector(".change-names-btn");
  const dialogNames = document.querySelector("#modal-change-names");
  const namesForm = document.querySelector("#new-names-form");

  const dialogEndGame = document.querySelector("#modal-win-message");
  const buttonEndGame = document.querySelector(".accept-win");

  const displayActivePlayer = () => {
    const activePlayerElement = document.querySelector(".current-player");

    activePlayer = ticTacToe.getActivePlayer();
    activePlayerElement.textContent = `Is ${activePlayer.getName()} turn's!`;
  };

  const renderBoard = () => {
    const board = gameBoard.getBoard();
    const cellsElement = document.querySelectorAll(".cell");

    cellsElement.forEach((cell) => {
      const id = cell.dataset.id;
      const row = Math.floor((id - 1) / 3);
      const column = (id - 1) % 3;
      const value = board[row][column];

      // Adding classes for CSS styling the cells
      cell.classList.remove("cell-x", "cell-o");

      if (value === "X") cell.classList.add("cell-x");
      if (value === "O") cell.classList.add("cell-o");

      cell.textContent = value;
    });

    displayActivePlayer();
  };

  const handleClick = (e) => {
    if (e.currentTarget.classList.contains("game-over")) return;
    if (!e.target.classList.contains("cell")) return;

    const position = e.target.dataset.id;

    const gameStatus = ticTacToe.playRound(position);

    if (
      gameStatus &&
      (gameStatus.status === "win" || gameStatus.status === "tie")
    ) {
      messageElement = document.querySelector(".message");
      messageElement.textContent = gameStatus.message;

      boardElement.classList.add("game-over");

      dialogEndGame.showModal();
    }

    renderBoard();
  };

  const handleReset = (e) => {
    ticTacToe.restartGame();

    dialogEndGame.close();

    boardElement.classList.remove("game-over");

    renderBoard();
  };

  const handleChangeName = (e) => {
    e.preventDefault();

    const playerOneName = document.getElementById("player-1-name").value.trim();
    const playerTwoName = document.getElementById("player-2-name").value.trim();

    if (playerOneName) ticTacToe.changePlayerOneName(playerOneName);
    if (playerTwoName) ticTacToe.changePlayerTwoName(playerTwoName);

    dialogNames.close();
    renderBoard();
  };

  renderBoard();

  boardElement.addEventListener("click", handleClick);

  restartButtons.forEach((button) => {
    button.addEventListener("click", handleReset);
  });

  openDialogNames.addEventListener("click", () => {
    dialogNames.showModal();
  });

  namesForm.addEventListener("submit", handleChangeName);

  buttonEndGame.addEventListener("click", () => {
    dialogEndGame.close();
  });
})();
