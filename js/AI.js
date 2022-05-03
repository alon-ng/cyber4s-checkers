const Value = {
  'man': 100,
  'king': 500,
  dFromOrigin: 10
}

// An AI class
class AI {
  constructor(depth, team) {
    this.depth = depth;
    this.team = team;
  }

  // A funcion which evaluates the state of the board based on the sum of the evaluations of all the pieces.
  evaluate() {
    let currentEval = 0;
    for (const piece of gameManager.boardData.wPieces) {
      currentEval += this.evaluatePiece(piece);
    }
    for (const piece of gameManager.boardData.bPieces) {
      currentEval -= this.evaluatePiece(piece);
    }
    if (gameManager.turn === Team.Black) {
      return -currentEval;
    }
    return currentEval;
  }

  // A function which returns a evaluation of a piece worth based on it rank and position;
  evaluatePiece(piece) {
    let value = Value[piece.rank];
    let dFromOrigin = piece.team === Team.White ? piece.pos.y : BOARD_SIZE - 1 - piece.pos.y;
    dFromOrigin = dFromOrigin === 0 ? 10 : dFromOrigin;
    value += dFromOrigin * Value.dFromOrigin;
    let piecesCount = gameManager.boardData.piecesCount();

    return (10 * value / piecesCount);
  }

  // The main function of the AI, minmax function with alpha-beta purning, returns the best evaluation
  // in a certein depth, and puts the move of that evaluation in this.bestMove.
  search(depth, originMove, alpha, beta) {
    if (gameManager.gameEnded) {
      if (gameManager.winner === gameManager.turn) {
        this.bestMove = originMove;
        return Infinity;
      } else {
        return -Infinity;
      }
    }
    if (depth === 0) {
      return this.evaluate();
    }

    let moves = this.generateAllMoves(gameManager.turn);
    let bestEval = -Infinity;

    for (const move of moves) {
      if (!originMove) {
        originMove = move;
      }
      move.piece.makeMove(move, false);
      let currentEval = -this.search(depth - 1, originMove, -beta, -alpha);
      if (currentEval > bestEval) {
        bestEval = currentEval;
      }
      move.piece.unmakeMove(move, false);
      if (currentEval >= beta) {
        return beta;
      }
      if (currentEval > alpha) {
        alpha = currentEval;
        this.bestMove = originMove;
      }
    }

    return alpha;
  }

  // A function which starts the minmax search.
  startSearch(depth) {
    let alpha = -Infinity;
    let beta = Infinity;
    this.bestMove = undefined;
    if (depth === 0) {
      return this.evaluate();
    }

    let moves = this.generateAllMoves(gameManager.turn);
    let bestEval = -Infinity;

    for (const move of moves) {
      if (!this.bestMove) {
        this.bestMove = move;
      }
      move.piece.makeMove(move, false);
      let currentEval = -this.search(depth - 1, deepCopyMove(move), -beta, -alpha);
      if (currentEval > bestEval) {
        bestEval = currentEval;
      }
      move.piece.unmakeMove(move, false);
      if (currentEval >= beta) {
        return beta;
      }
      if (currentEval > alpha) {
        alpha = currentEval;
        this.bestMove = move;
      }
    }
    if (!this.bestMove) {
      gameManager.checkForWin();
    }
    return alpha;
  }

  // A function which returns all the possible moves of the team which it is it's turn to play.
  generateAllMoves() {
    let possibleMoves = [];
    for (let piece of gameManager.boardData.getPieces(gameManager.turn)) {
      if (gameManager.checkForPossibleTeamJumps(gameManager.turn)) {
        possibleMoves = possibleMoves.concat(piece.possibleJumps());
      } else {
        possibleMoves = possibleMoves.concat(piece.possibleMoves());
      }
    }
    return possibleMoves;
  }

  // A function which makes a AI try and play.
  play() {
    if (gameManager.turn === this.team) {
      this.updateDepth();
      this.startSearch(this.depth);
      this.bestMove.piece.makeMove(this.bestMove);
      gameManager.checkForWin();
    }
  }

  updateDepth() {
    let pieceCount = gameManager.boardData.piecesCount();
    if (pieceCount <= 4) {
      this.depth = AI_END_DEPTH;
    } else if (pieceCount <= 12) {
      this.depth = AI_MID_DEPTH;
    }
  }
}
