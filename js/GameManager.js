class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.prevSquare;
    this.prevValidMoves;
  }

  selectSquare(e) {
    let currentPos = squareToPos(e);
    let isValidMove = false;
    if (this.prevSquare) {
      this.prevSquare.classList.remove('selected-square');
    }

    if (this.prevValidMoves) {
      for (let i = 0; i < this.prevValidMoves.length; i++) {
        this.prevValidMoves[i].classList.remove('valid-move-square');
        isValidMove = (isPosEqual(squareToPos(this.prevValidMoves[i]), currentPos)) || isValidMove;
      }
    }

    if (isValidMove) {
      // let piecePos = squareToPos(this.prevSquare);
      // this.boardData.board[piecePos.y][piecePos.x].moveTo(currentPos, false);
      // this.prevSquare = undefined;
      // this.prevValidMoves = undefined;
    } else {
      e.classList.add('selected-square');
      this.prevSquare = e;

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let validMoves;

      piece && piece.color === this.turn ? validMoves = piece.validMoves() : validMoves = [];

      for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].classList.add('valid-move-square');
      }

      this.prevValidMoves = validMoves;
    }
  }
}
