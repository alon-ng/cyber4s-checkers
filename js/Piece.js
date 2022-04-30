class Piece {
  constructor(team, pos, rank = 'man') {
    this.team = team;
    this.pos = pos;
    this.rank = rank;
    this.direction = this.team === Team.White ? 1 : -1;
  }

  draw() {
    let imgPath = `./img/${this.team}-${this.rank}.png`;
    let pieceImgElement = posToSqaure(this.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  possibleMoves() {
    let possibleJumps = this.checkForPossbleJumps({...this.pos});
    if (possibleJumps.length > 0) {
      return possibleJumps;
    }
    let possibleMoves = [];
    let potentialMoves = [
      { x: 1 + this.pos.x, y: this.direction + this.pos.y },
      { x: -1 + this.pos.x, y: this.direction + this.pos.y}
    ];
    for (let potMove of potentialMoves) {
      let squareState = gameManager.boardData.getSquareState(potMove, this.team);
      if (squareState === SquareState.EMPTY) {
        let move = new Move({...this.pos}, potMove);
        possibleMoves.push(move);
      } else if (squareState === SquareState.ENEMY) {

      }
    }
    return possibleMoves;
  }

  checkForPossbleJumps(pos) {
    let possibleJumps = [];
    let potentialJumps = [
      [{ x: 1 + pos.x, y: this.direction + pos.y }, { x: 2 + pos.x, y: 2 * this.direction + pos.y }],
      [{ x: -1 + pos.x, y: this.direction + pos.y }, { x: -2 + pos.x, y: 2 * this.direction + pos.y }]
    ];
    for (let potentialJump of potentialJumps) {
      let squareStates = [gameManager.boardData.getSquareState(potentialJump[0], this.team), gameManager.boardData.getSquareState(potentialJump[1], this.team)];
      if (squareStates[0] === SquareState.ENEMY && squareStates[1] === SquareState.EMPTY) {
        let victim = gameManager.boardData.board[potentialJump[0].y][potentialJump[0].x];
        possibleJumps.push(new Move(this.pos, potentialJump[1], [victim]));
      }
    }
    return possibleJumps;
  }

  makeMove(move) {
    for (let victim of move.victims) {
      gameManager.boardData.eatPiece(victim);
    }
    let dest = move.destination;
    gameManager.boardData.board[dest.y][dest.x] = this;
    gameManager.boardData.clearSquare(this.pos);
    this.pos = dest;
    this.draw();
    gameManager.changeTurn();
  }

  unmakeMove(move) {
    for (let victim of move.victims) {
      gameManager.boardData.board[victim.pos.y][victim.pos.x] = victim;
      victim.draw();
    }
    gameManager.changeTurn();
  }
}
