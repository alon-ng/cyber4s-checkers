const Value = {
  'man': 100,
  'king': 900
}

function evaluate() {
  let eval = 0;
  for (const piece of gameManager.boardData.wPieces) {
    eval += Value[piece.rank];
  }
  for (const piece of gameManager.boardData.bPieces) {
    eval -= Value[piece.rank];
  }
  if (gameManager.turn === Team.Black) {
    return -eval;
  }
  return eval;
}

function search(depth, alpha = -Infinity, beta = Infinity) {
  if (gameManager.gameEnded) {
    if (gameManager.winner === gameManager.turn) {
      return Infinity;
    } else {
      return -Infinity;
    }
  }
  if (depth === 0) {
    return evaluate();
  }

  let moves = generateAllMoves(gameManager.turn);
  let bestEval = -Infinity;

  for (const move of moves) {
    move.piece.makeMove(move);
    let eval = -search(depth - 1, -beta, -alpha);
    bestEval = Math.max(eval, bestEval);
    move.piece.unmakeMove(move);
    if (eval >= beta) {
      return beta;
    }
    alpha = Math.max(alpha, eval)
  }

  return alpha;
}

function generateAllMoves() {
  let possibleMoves = [];
  for (let piece of gameManager.boardData.getPieces(gameManager.turn)) {
    if (gameManager.checkForPossibleTeamJumps(gameManager.turn)) {
      possibleMoves = possibleMoves.concat(piece.checkForPossbleJumps());
    } else {
      possibleMoves = possibleMoves.concat(piece.possibleMoves());
    }
  }
  return possibleMoves;
}
