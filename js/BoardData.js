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

    let r = document.createElement('tr');
    table.appendChild(r);
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
          y <= 2 ? this.createPiece(Team.White, { x: x, y: y }) : '';
          y >= 6 ? this.createPiece(Team.Black, { x: x, y: y }) : '';
        }
      }
    }
  }

  createPiece(color, pos, rank = 'man') {
    let piece = new Piece(color, pos, rank);
    this.board[pos.y][pos.x] = piece;
    color === Team.White ? this.wPieces.push(piece) : this.bPieces.push(piece);
    piece.draw();
    return piece;
  }
}
