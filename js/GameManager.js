class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.prevSquare;
    this.prevValidMoves;
    this.turn = Team.White;
  }

  selectSquare(e) {
    let currentPos = squareToPos(e);
    let isValidMove;
    if (this.prevSquare) {
      this.prevSquare.classList.remove('selected-square');
    }

    if (this.prevValidMoves) {
      for (let i = 0; i < this.prevValidMoves.length; i++) {
        posToSqaure(this.prevValidMoves[i].destination).classList.remove('valid-move-square');
        // isValidMove = (isPosEqual(squareToPos(this.prevValidMoves[i].destination), currentPos)) || isValidMove;
      }
    }

    if (isValidMove) {
      let piecePos = squareToPos(this.prevSquare);
      this.boardData.board[piecePos.y][piecePos.x].makeMove(currentPos);
      this.prevSquare = undefined;
      this.prevValidMoves = undefined;
    } else {
      e.classList.add('selected-square');
      this.prevSquare = e;

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let validMoves;

      piece && piece.team === this.turn ? validMoves = piece.possibleMoves() : validMoves = [];

      for (let i = 0; i < validMoves.length; i++) {
        posToSqaure(validMoves[i].destination).classList.add('valid-move-square');
      }

      this.prevValidMoves = validMoves;
    }
  }

  getSquareState(pos) {

  }
}
