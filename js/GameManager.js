class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.counter = 0;
    this.prevSquare;
    this.prevPossibleMoves;
    this.turn = Team.White;
    this.gameEnded = false;
  }

  selectSquare(e) {
    console.log(this.boardData.wPieces);
    console.log(this.boardData.bPieces);
    let currentPos = squareToPos(e);
    let move;
    if (this.prevSquare) {
      this.prevSquare.classList.remove('selected-square');
    }

    if (this.prevPossibleMoves) {
      for (let prevPosMove of this.prevPossibleMoves) {
        let prevPosMoveCopy = prevPosMove;
        while (prevPosMoveCopy.nextMove) {
          posToSqaure(prevPosMoveCopy.destination).classList.remove('stopover-square');
          prevPosMoveCopy = prevPosMoveCopy.nextMove;
        }
        posToSqaure(prevPosMoveCopy.destination).classList.remove('valid-move-square');
        move = isPosEqual(prevPosMoveCopy.destination, currentPos) ? prevPosMove : move;
      }
    }

    if (move) {
      let piecePos = squareToPos(this.prevSquare);
      this.boardData.board[piecePos.y][piecePos.x].makeMove(move);
      this.prevSquare = undefined;
      this.prevPossibleMoves = undefined;
    } else {
      e.classList.add('selected-square');

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let possibleMoves = [];

      if (piece && piece.team === this.turn) {
        // possibleMoves = this.checkForPossibleTeamJumps(piece.team) ?
        if (this.checkForPossibleTeamJumps(piece.team)) {
          possibleMoves = piece.checkForPossbleJumps();
        } else {
          possibleMoves = piece.possibleMoves();
        }
      }
      if (e === this.prevSquare) {
        let possibleMovesLength = possibleMoves.length;
        possibleMoves = possibleMoves.slice(this.counter, this.counter + 1);
        this.counter = (this.counter + 1) % (possibleMovesLength);
      } else {
        this.counter = 0;
      }

      for (let possibleMove of possibleMoves) {
        while (possibleMove.nextMove) {
          posToSqaure(possibleMove.destination).classList.add('stopover-square');
          possibleMove = possibleMove.nextMove;
        }
        posToSqaure(possibleMove.destination).classList.add('valid-move-square');
      }

      this.prevSquare = e;
      this.prevPossibleMoves = possibleMoves;
    }
  }

  changeTurn() {
    let indicator = document.getElementById('turn-indicator');
    this.turn === Team.White ? indicator.classList.add('turn-indicator-b') : indicator.classList.remove('turn-indicator-b');
    this.turn === Team.White ? indicator.innerHTML = 'Black Turn' : indicator.innerHTML = 'White Turn';
    this.turn = this.turn === Team.White ? Team.Black : Team.White;
  }

  checkForWin() {
    let wPossibleMoves = []
    for (const piece of this.boardData.wPieces) {
      wPossibleMoves = wPossibleMoves.concat(piece.possibleMoves());
    }

    let bPossibleMoves = []
    for (const piece of this.boardData.bPieces) {
      bPossibleMoves = bPossibleMoves.concat(piece.possibleMoves());
    }

    let win;
    win = this.boardData.wPieces.length === 0 || wPossibleMoves.length === 0 ? Team.Black : win;
    win = this.boardData.bPieces.length === 0 || bPossibleMoves.length === 0 ? Team.White : win;

    if (win) {
      this.gameEnded = true;
      this.turn = false;
      let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
      overlay.getElementsByTagName('h1')[0].innerHTML = "Good Game!";
      overlay.getElementsByTagName('h2')[0].innerHTML = win.charAt(0).toUpperCase() + win.slice(1) + ' wins!';
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
  }
    return win;
  }

  checkForPossibleTeamJumps(team) {
    let pieces = team === Team.White ? this.boardData.wPieces : this.boardData.bPieces;
    for (const piece of pieces) {
      let posJumps = piece.checkForPossbleJumps();
      if (posJumps && posJumps.length > 0) {
        return true;
      }
    }
    return false;
  }
}
