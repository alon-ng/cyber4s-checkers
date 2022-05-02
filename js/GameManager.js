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
    this.winner;
  }

  selectSquare(e) {
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
      this.checkForWin();
      this.prevSquare = undefined;
      this.prevPossibleMoves = undefined;
    } else {
      e.classList.add('selected-square');

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let possibleMoves = [];

      if (piece && piece.team === this.turn) {
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

  checkForWin(toNotify = true) {
    let pieces = this.boardData.getPieces(this.turn);
    let isOutOfMoves = true;
    for (const piece of pieces) {
      let possibleMoves = []
      if (this.checkForPossibleTeamJumps(piece.team)) {
        possibleMoves = piece.checkForPossbleJumps();
      } else {
        possibleMoves = piece.possibleMoves();
      }
      if (possibleMoves.length > 0) {
        isOutOfMoves = false;
        break;
      }
    }

    this.winner = isOutOfMoves ? opponentTeam(this.turn) : undefined;

    if (this.winner && toNotify) {
      this.gameEnded = true;
      this.turn = false;
      let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
      overlay.getElementsByTagName('h1')[0].innerHTML = "Good Game!";
      overlay.getElementsByTagName('h2')[0].innerHTML = this.winner.charAt(0).toUpperCase() + this.winner.slice(1) + ' wins!';
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
  }
    return this.winner;
  }

  checkForPossibleTeamJumps(team) {
    let pieces = this.boardData.getPieces(team);
    for (const piece of pieces) {
      let posJumps = piece.checkForPossbleJumps();
      if (posJumps && posJumps.length > 0) {
        return true;
      }
    }
    return false;
  }
}
