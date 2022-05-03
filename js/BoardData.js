class BoardData {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
    this.wPieces = [];
    this.bPieces = [];
  }

  // A function which creates the board visually in HTML.
  createBoard() {
    let table = document.createElement('table');
    table.id = 'checkers-board';
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

  // A function which initialize all the pieces in their respected position.
  initializePieces() {
    this.wPieces = [];
    this.bPieces = [];
    this.board = new Array();

    for (let y = 0; y < this.boardSize; y++) {
      this.board[y] = new Array();
      for (let x = 0; x < this.boardSize; x++) {
        this.board[y][x] = SquareState.EMPTY;
        if ((x + y) % 2 === 1) {
          y <= 2 ? this.createPiece(Team.White, { x: x, y: y }) : '';
          y >= this.boardSize - 3 ? this.createPiece(Team.Black, { x: x, y: y }) : '';
        }
      }
    }
  }

  // A function which create a piece object and adds it to BoardData and draws it as well.
  createPiece(team, pos, rank = PieceRank.Man) {
    let piece = new Piece(team, pos, rank);
    this.board[pos.y][pos.x] = piece;
    this.getPieces(team).push(piece);
    piece.draw();
    return piece;
  }

  // A function which gets a position object and a team object and returns the state (empty, friendly, enemy or outofbound).
  getSquareState(pos, team) {
    if (pos.x > this.boardSize - 1 || pos.x < 0 || pos.y > this.boardSize - 1 || pos.y < 0) {
      return SquareState.OUT;
    }
    let square = this.board[pos.y][pos.x];
    return square !== SquareState.EMPTY ? square.team == team ? SquareState.FRIENDLY : SquareState.ENEMY : SquareState.EMPTY;
  }

  // A function which removes a piece from a certein position on the board.
  clearSquare(pos, toDraw = true) {
    this.board[pos.y][pos.x] = SquareState.EMPTY;
    if (toDraw) {
      let pieceImgElement = posToSqaure(pos).getElementsByTagName('img')[0];
      pieceImgElement.src = '';
    }
  }

  // A function which removes a piece from a certein position on the board and from the pieces arrays.
  eatPiece(piece, toDraw = true) {
    if (piece) {
      let pieces = this.getPieces(piece.team);
      pieces.splice(pieces.indexOf(piece), 1);
    }
    this.clearSquare(piece.pos, toDraw);
  }

  // A function which get a team type and returns all the pieces of that type.
  getPieces(team) {
    return team === Team.White ? this.wPieces : this.bPieces;
  }

  // A function which returns the count of all the pieces on the board.
  piecesCount() {
    return this.wPieces.length + this.bPieces.length;
  }
}
