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
    let possibleJumps = this.checkForPossbleJumps();
    if (possibleJumps.length > 0) {
      return possibleJumps;
    }
    let potentialMoves = [];
    let possibleMoves = [];
    if (this.rank === 'man') {
      potentialMoves = [
        { x: 1 + this.pos.x, y: this.direction + this.pos.y },
        { x: -1 + this.pos.x, y: this.direction + this.pos.y}
      ];
    } else if (this.rank === 'king') {
      for (let i = 1; i < gameManager.boardData.boardSize; i++) {
        potentialMoves.push({ x: this.pos.x + 1 * i, y: this.pos.y + 1 * i });
        potentialMoves.push({ x: this.pos.x + -1 * i, y: this.pos.y + 1 * i });
        potentialMoves.push({ x: this.pos.x + 1 * i ,y: this.pos.y + -1 * i });
        potentialMoves.push({ x: this.pos.x + -1 * i, y: this.pos.y + -1 * i });
      }
    }

    for (let potMove of potentialMoves) {
      let squareState = gameManager.boardData.getSquareState(potMove, this.team);
      if (squareState === SquareState.EMPTY) {
        let move = new Move({...this.pos}, potMove);
        possibleMoves.push(move);
      }
    }
    return possibleMoves;
  }

  checkForPossbleJumps(prevMove) {
    let pos = prevMove ? prevMove.destination : this.pos;
    let possibleJumps = [];
    let potentialJumps = [
      [{ x: 1 + pos.x, y: this.direction + pos.y }, { x: 2 + pos.x, y: 2 * this.direction + pos.y }],
      [{ x: -1 + pos.x, y: this.direction + pos.y }, { x: -2 + pos.x, y: 2 * this.direction + pos.y }]
    ];

    for (let potentialJump of potentialJumps) {
      let squareStates = [gameManager.boardData.getSquareState(potentialJump[0], this.team), gameManager.boardData.getSquareState(potentialJump[1], this.team)];
      if (squareStates[0] === SquareState.ENEMY && squareStates[1] === SquareState.EMPTY) {
        let victim = gameManager.boardData.board[potentialJump[0].y][potentialJump[0].x];
        let nextMove = new Move(pos, potentialJump[1], victim);
        nextMove = this.checkForPossbleJumps(nextMove);
        possibleJumps = possibleJumps.concat(nextMove);
        for (let i = 0; i < possibleJumps.length && prevMove; i++) {
          let temp = {...prevMove}
          temp.nextMove = possibleJumps[i];
          possibleJumps[i] = temp;
        }
      }
    }

    if (possibleJumps.length === 0 && prevMove) {
      return [prevMove];
    }

    return possibleJumps;
  }

  makeMove(move) {
    gameManager.changeTurn();
    while (move) {
      move.victim ? gameManager.boardData.eatPiece(move.victim) : '';
      let dest = move.destination;
      gameManager.boardData.board[dest.y][dest.x] = this;
      gameManager.boardData.clearSquare(this.pos);
      this.pos = dest;
      move = move.nextMove;
    }
    this.checkForPromotion();
    this.draw();
  }

  unmakeMove(move) {
    for (let victim of move.victims) {
      gameManager.boardData.board[victim.pos.y][victim.pos.x] = victim;
      victim.draw();
    }
    gameManager.changeTurn();
  }

  checkForPromotion() {
    (this.team === Team.White && this.pos.y === gameManager.boardData.boardSize - 1) ? this.rank = 'king' : '';
    (this.team === Team.Black && this.pos.y === 0) ? this.rank = 'king' : '';
    this.draw();
  }
}
