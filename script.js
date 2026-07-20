const gameBoard = (() => {
  let board = [];

  for (let i = 0; i < 3; i++) {
    board.push([]);

    for (let j = 0; j < 3; j++) {
      board[i].push(" ");
    }
  }

  const getBoard = () => board;

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

  const checkEndOfGame = () => {};

  const addPlay = (value, position) => {
    const { row, column } = mapRowAndColumn(position);

    if (board[row][column] !== " ") {
      return -1;
    }

    board[row][column] = value;
  };

  const printBoard = () => {
    let counter = 1;

    for (let i = 0; i < board.length; i++) {
      let row = "";

      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === " ") {
          row += counter + " ";
        } else {
          row += board[i][j] + " ";
        }

        counter += 1;
      }

      console.log(row);
    }
  };

  return { getBoard, addPlay, printBoard, checkWinner };
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

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const increaseTurn = () => activeTurn++;

  const getActivePlayer = () => activePlayer;

  const printRound = () => {
    console.log(`Is ${getActivePlayer().getName()} turn's!`);

    gameBoard.printBoard();
  };

  const playRound = (position) => {
    const activeMark = getActivePlayer().getMark();
    const activeName = getActivePlayer().getName();

    if (gameBoard.addPlay(activeMark, position) === -1) {
      console.log("Invalid move, please enter another spot...");
      return;
    }

    console.log(`${activeName} placed in the ${position} position.`);

    printRound();

    if (gameBoard.checkWinner(position)) {
      console.log(`${activeName} won!`);
      return;
    }

    if (increaseTurn() >= 9) {
      console.log("It's a tie!");
      return;
    }

    switchTurn();
  };

  return { playRound };
})();

const displayController = (() => {
  const boardElement = document.querySelector(".board");
  const restartButton = document.querySelector(".restart-game");

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
  };

  const handleClick = (e) => {
    if (!e.target.classList.contains("cell")) return;

    const position = e.target.dataset.id;
    console.log(position);

    ticTacToe.playRound(position);

    renderBoard();
  };

  renderBoard();

  boardElement.addEventListener("click", handleClick);

  return { renderBoard };
})();
