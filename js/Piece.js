class Piece {
  constructor(team, pos, rank = 'man') {
    this.team = team;
    this.pos = pos;
    this.rank = rank;
  }

  draw() {
    let imgPath = `./img/${this.team}-${this.rank}.png`;
    let pieceImgElement = posToSqaure(this.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  possibleMoves() {
    let direction = this.team === Team.White ? 1 : -1;
    let possibleMoves = [];
    let potentialMoves = [{ x: 1 + this.pos.x, y: direction + this.pos.y }, { x: -1 + this.pos.x, y: direction + this.pos.y}];
    for (let potMove of potentialMoves) {
      let squareState = gameManager.boardData.getSquareState(potMove, this.color);
      if (squareState === SquareState.EMPTY) {
        let move = new Move({...this.pos}, potMove);
        possibleMoves.push(move);
      } else if (squareState === SquareState.ENEMY) {
        // Check for jump
      }
    }
    return possibleMoves;
  }

  makeMove(move) {
    for (let victim of move.victims) {
      capturePiece(victim);
    }
    let dest = move.destination;
    gameManager.boardData.board[dest.y][dest.x] = this;
    gameManager.boardData.clearSquare(this.pos);
    this.pos = dest;
    this.draw();
    gameManager.changeTurn();
  }

  unmakeMove(move) {

  }
}
