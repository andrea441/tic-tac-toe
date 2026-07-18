const gameBoard = (() => {
  let board = [];

  for (let i = 0; i < 3; i++) {
    board.push([]);

    for (let j = 0; j < 3; j++) {
      board[i].push(" ");
    }
  }

  const mapRowAndColumn = (position) => {
    const row = Math.floor((position - 1) / 3);
    const column = (position - 1) % 3;

    return { row, column };
  };

  const addPlay = (value, position) => {
    const { row, column } = mapRowAndColumn(position);

    if (board[row][column] !== " ") {
      return -1;
    }

    board[row][column] = value;
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

    // Check diagonal (only if it applies)
    const checkDiagonal = checkDiagonal(row, column);
  };

  const checkDiagonal = (row, column) => {
    if (row === column) {
      // Check left diagonal
    } else if (row + column === 2) {
      // Check right diagonal
    }
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

  return { addPlay, printBoard, checkWinner };
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

  let activePlayer = player1;

  const switchTurn = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const printRound = () => {
    console.log(`Is ${getActivePlayer().getName()} turn's!`);

    gameBoard.printBoard();
  };

  const restartGame = () => {};

  const playRound = (position) => {
    const activeMark = getActivePlayer().getMark();

    if (gameBoard.addPlay(activeMark, position) === -1) {
      console.log("Invalid move, please enter another spot...");
      return;
    }

    console.log(
      `${getActivePlayer().getName()} placed in the ${position} position.`,
    );

    gameBoard.checkWinner();

    switchTurn();

    printRound();
  };

  printRound();

  return { playRound };
})();

ticTacToe.playRound(1);
ticTacToe.playRound(1);
ticTacToe.playRound(2);
ticTacToe.playRound(1);
