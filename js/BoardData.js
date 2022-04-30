class BoardData {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
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
    this.resetBoard();
  }
}
