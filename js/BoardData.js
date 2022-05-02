class BoardData {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
    this.wPieces = [];
    this.bPieces = [];
  }

  createBoard() {
    let table = document.createElement('table');
    document.getElementsByClassName('checkers-div')[0].appendChild(table);

    for (let y = 0; y < this.boardSize; y++) {
      let row = document.createElement('tr');
      for (let x = 0; x < this.boardSize; x++) {
        let id = `pos${x}-${y}`;
        let square = document.createElement('td');
        square.id = id;
        square.classList.add('checkers-square');
        square.setAttribute("onclick", "gameManager.selectSquare(this)")
        if ((x + y) % 2 === 0) {
          square.classList.add('white-square');
        } else {
          square.classList.add('black-square');
        }
        let piece = document.createElement('img');
        piece.classList.add('checkers-piece');

        square.appendChild(piece);
        row.appendChild(square);
      }
      table.appendChild(row);
    }
  }

  initializePieces() {
    this.wPieces = [];
    this.bPieces = [];
    this.board = new Array();

    for (let y = 0; y < this.boardSize; y++) {
      this.board[y] = new Array();
      for (let x = 0; x < this.boardSize; x++) {
        this.board[y][x] = SquareState.EMPTY;
        if ((x + y) % 2 === 1) {
          y <= 2 && x % 2 === 0 ? this.createPiece(Team.White, { x: x, y: y }) : '';
          y >= 5 && x % 2 === 0 ? this.createPiece(Team.Black, { x: x, y: y }) : '';
        }
      }
    }
  }



  createPiece(team, pos, rank = PieceRank.Man) {
    let piece = new Piece(team, pos, rank);
    this.board[pos.y][pos.x] = piece;
    this.getPieces(team).push(piece);
    piece.draw();
    return piece;
  }

  getSquareState(pos, team) {
    if (pos.x > this.boardSize - 1 || pos.x < 0 || pos.y > this.boardSize - 1 || pos.y < 0) {
      return SquareState.OUT;
    }
    let square = this.board[pos.y][pos.x];
    return square !== SquareState.EMPTY ? square.team == team ? SquareState.FRIENDLY : SquareState.ENEMY : SquareState.EMPTY;
  }

  clearSquare(pos) {
    let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
    this.board[pos.y][pos.x] = SquareState.EMPTY;
    pieceImgElement.src = '';
  }

  eatPiece(piece) {
    if (piece) {
      let pieces = this.getPieces(piece.team);
      pieces.splice(pieces.indexOf(piece), 1);
    }
    this.clearSquare(piece.pos);
  }

  getPieces(team) {
    return team === Team.White ? this.wPieces : this.bPieces;
  }
}
