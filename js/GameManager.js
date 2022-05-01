class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.prevSquare;
    this.prevPossibleMoves;
    this.turn = Team.White;
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
      this.prevSquare = undefined;
      this.prevPossibleMoves = undefined;
    } else {
      e.classList.add('selected-square');
      this.prevSquare = e;

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let possibleMoves;

      piece ? possibleMoves = piece.possibleMoves() : possibleMoves = [];
      
      for (let possibleMove of possibleMoves) {
        while (possibleMove.nextMove) {
          posToSqaure(possibleMove.destination).classList.add('stopover-square');
          possibleMove = possibleMove.nextMove;
        }
        posToSqaure(possibleMove.destination).classList.add('valid-move-square');
      }

      this.prevPossibleMoves = possibleMoves;
    }
  }

  changeTurn() {
    let indicator = document.getElementById('turn-indicator');
    this.turn === Team.White ? indicator.classList.add('turn-indicator-b') : indicator.classList.remove('turn-indicator-b');
    this.turn === Team.White ? indicator.innerHTML = 'Black Turn' : indicator.innerHTML = 'White Turn';
    this.turn = this.turn === Team.White ? Team.Black : Team.White;
  }
}
