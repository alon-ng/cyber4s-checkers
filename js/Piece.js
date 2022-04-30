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
    for (let i = 0; i < potentialMoves.length; i++) {
      let squareState = gameManager.boardData.getSquareState(potentialMoves[i], this.color);
      if (squareState === SquareState.EMPTY) {
        let move = new Move({...this.pos}, potentialMoves[i]);
        possibleMoves.push(move);
      }
    }
    return possibleMoves;
  }
}
