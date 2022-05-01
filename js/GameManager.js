class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.counter = 0;
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

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let possibleMoves;

      this.turn = piece.team;
      possibleMoves = (piece && piece.team === this.turn) ? piece.possibleMoves() : [];
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
}
