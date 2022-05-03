// A piece class
class Piece {
  // Piece constructor which sets the default piece to a rank of 'man'.
  constructor(team, pos, rank = PieceRank.Man) {
    this.team = team;
    this.pos = pos;
    this.rank = rank;
    this.direction = this.team === Team.White ? 1 : -1;
    this.currentVictims = [];
  }

  // A function which draws the piece to the board.
  draw() {
    let imgPath = `./img/${this.team}-${this.rank}.png`;
    let pieceImgElement = posToSqaure(this.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }

  // A function which returns all the piece possible moves (without the jumps).
  possibleMoves() {
    let potentialMoves = [];
    let possibleMoves = [];

    if (this.rank === PieceRank.Man) {
      potentialMoves = [
        { x: 1 + this.pos.x, y: this.direction + this.pos.y },
        { x: -1 + this.pos.x, y: this.direction + this.pos.y}
      ];
      for (let potMove of potentialMoves) {
        let squareState = gameManager.boardData.getSquareState(potMove, this.team);
        if (squareState === SquareState.EMPTY) {
          let move = new Move({...this.pos}, potMove);
          move.piece = this;
          possibleMoves.push(move);
        }
      }
    } else if (this.rank === PieceRank.King) {
      let offsets = [ { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
      for (const offset of offsets) {
        let checkingPos = { x: this.pos.x + offset.x, y: this.pos.y + offset.y};
        for (let i = 1; i < gameManager.boardData.boardSize; i++) {
          let sqrState = gameManager.boardData.getSquareState(checkingPos, this.team);
          if (sqrState === SquareState.EMPTY) {
            let move = new Move({...this.pos}, {...checkingPos});
            move.piece = this;
            possibleMoves.push(move);
          } else {
            break;
          }
          checkingPos.x += offset.x;
          checkingPos.y += offset.y;
        }
      }
    }

    return possibleMoves;
  }

  // A recusive function which returns the piece possible jumps.
  checkForPossbleJumps(prevMove) {
    let pos = prevMove ? prevMove.destination : this.pos;
    let possibleJumps = [];
    let potentialJumps = [];
    if (this.rank === PieceRank.Man) {
      potentialJumps = [
        [{ x: 1 + pos.x, y: this.direction + pos.y }, { x: 2 + pos.x, y: 2 * this.direction + pos.y }],
        [{ x: -1 + pos.x, y: this.direction + pos.y }, { x: -2 + pos.x, y: 2 * this.direction + pos.y }],
        [{ x: 1 + pos.x, y: -this.direction + pos.y }, { x: 2 + pos.x, y: -2 * this.direction + pos.y }],
        [{ x: -1 + pos.x, y: -this.direction + pos.y }, { x: -2 + pos.x, y: -2 * this.direction + pos.y }]
      ];
      potentialJumps = prevMove ? potentialJumps : potentialJumps.slice(0, 2);
    } else if (this.rank === PieceRank.King) {
      let offsets = [ { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
      for (const offset of offsets) {
        let checkingPos = { x: pos.x + offset.x, y: pos.y + offset.y};
        for (let i = 1; i < gameManager.boardData.boardSize; i++) {
          let sqrState = gameManager.boardData.getSquareState(checkingPos, this.team);
          if (sqrState === SquareState.ENEMY) {
            potentialJumps.push([{...checkingPos}, { x: checkingPos.x + offset.x, y: checkingPos.y + offset.y }]);
            break;
          } else if (sqrState !== SquareState.EMPTY) {
            break;
          }
          checkingPos.x += offset.x;
          checkingPos.y += offset.y;
        }
      }
    }

    for (let potentialJump of potentialJumps) {
      let squareStates = [gameManager.boardData.getSquareState(potentialJump[0], this.team), gameManager.boardData.getSquareState(potentialJump[1], this.team)];
      if (squareStates[0] === SquareState.ENEMY && squareStates[1] === SquareState.EMPTY) {
        let victim = gameManager.boardData.board[potentialJump[0].y][potentialJump[0].x];
        if (this.currentVictims.indexOf(victim) === -1) {
          this.currentVictims.push(victim);
          let nextMove = new Move(pos, potentialJump[1], victim);
          nextMove.piece = this;
          nextMove = this.checkForPossbleJumps(nextMove);
          possibleJumps = possibleJumps.concat(nextMove);
        }
      }
    }

    for (let i = 0; i < possibleJumps.length && prevMove; i++) {
      let temp = {...prevMove}
      temp.nextMove = possibleJumps[i];
      possibleJumps[i] = temp;
    }

    if (possibleJumps.length === 0 && prevMove) {
      return [prevMove];
    }
    this.currentVictims = prevMove ? this.currentVictims : [];
    return possibleJumps;
  }

  // A function which takes a move object and make the move.
  makeMove(move, toDraw = true) {
    gameManager.changeTurn(toDraw);
    while (move) {
      move.victim ? gameManager.boardData.eatPiece(move.victim, toDraw) : '';
      let dest = move.destination;
      gameManager.boardData.board[dest.y][dest.x] = this;
      gameManager.boardData.clearSquare(this.pos, toDraw);
      this.pos = dest;
      move = move.nextMove;
    }
    this.checkForPromotion(false, toDraw);
    this.movesSincePromotion++;
    toDraw ? this.draw() : '';
  }

  // A function which takes a move object and unmake the move.
  unmakeMove(move, toDraw = true) {
    let rMoves = reverseMoves(move);
    this.movesSincePromotion--;
    this.checkForPromotion(true, toDraw);
    while (rMoves) {
      if (rMoves.victim) {
        gameManager.boardData.getPieces(rMoves.victim.team).push(rMoves.victim);
        gameManager.boardData.board[rMoves.victim.pos.y][rMoves.victim.pos.x] = rMoves.victim;
        toDraw ? rMoves.victim.draw() : '';
      }
      let dest = rMoves.origin;
      gameManager.boardData.board[dest.y][dest.x] = this;
      gameManager.boardData.clearSquare(this.pos, toDraw);
      this.pos = dest;
      rMoves = rMoves.nextMove;
    }
    toDraw ? this.draw() : '';
    gameManager.changeTurn(toDraw);
  }

  // A function which checks if a piece need to be promoted to a king, and does so if the right conditions met.
  checkForPromotion(isReverse = false, toDraw = true) {
    if (!isReverse) {
      if ((this.rank === PieceRank.Man && this.team === Team.White && this.pos.y === gameManager.boardData.boardSize - 1) && this.rank === PieceRank.Man) {
        this.rank = PieceRank.King
        this.movesSincePromotion = 0;
      }
      if ((this.rank === PieceRank.Man && this.team === Team.Black && this.pos.y === 0) && this.rank === PieceRank.Man) {
        this.rank = PieceRank.King
        this.movesSincePromotion = 0;
      }
    } else {
      if (this.rank === PieceRank.King && (this.team === Team.White && this.pos.y === gameManager.boardData.boardSize - 1) && this.movesSincePromotion === 0) {
        this.rank = PieceRank.Man;
      }
      if ((this.rank === PieceRank.King && this.team === Team.Black && this.pos.y === 0) && this.movesSincePromotion === 0) {
        this.rank = PieceRank.Man;
      }
    }
    toDraw ? this.draw() : '';
  }
}
