class GameManager {
  constructor(boardSize) {
    this.boardData = new BoardData(boardSize);
    this.boardData.createBoard();
    this.boardData.initializePieces();

    this.counter = 0;
    this.prevSquare;
    this.prevPossibleMoves;
    this.turn = Team.White;
    this.gameEnded = false;
    this.winner;
  }

  // The main core of the game, A function which activates whenever a square is clicked.
  selectSquare(e) {
    let currentPos = squareToPos(e);
    let move;

    // Removes last selection
    if (this.prevSquare) {
      this.prevSquare.classList.remove('selected-square');
    }

    // Removes previous valid moves and stopover marking
    // Check weather the player clicked on a valid move square and if so put this square in the move variable
    if (this.prevPossibleMoves) {
      for (let prevPosMove of this.prevPossibleMoves) {
        let prevPosMoveCopy = prevPosMove;
        while (prevPosMoveCopy.nextMove) {
          posToSqaure(prevPosMoveCopy.destination).classList.remove('stopover-square');
          prevPosMoveCopy = prevPosMoveCopy.nextMove;
        }
        posToSqaure(prevPosMoveCopy.destination).classList.remove('valid-move-square');
        move = isPosEqual(prevPosMoveCopy.destination, currentPos) ? prevPosMove : move;
      }
    }

    if (move) {
      // Makes a move
      let piecePos = squareToPos(this.prevSquare);
      this.boardData.board[piecePos.y][piecePos.x].makeMove(move);
      this.checkForWin();
      this.prevSquare = undefined;
      this.prevPossibleMoves = undefined;

      // Let AI play
      setTimeout(aiPlay, 500);
    } else {
      e.classList.add('selected-square');

      let piece = this.boardData.board[currentPos.y][currentPos.x];
      let possibleMoves = [];

      // Checkes weather the player has possible jump, if so it reurns only the possible jump
      // Of the piece, else, it return all the possible moves (non-jump moves).
      if (piece && piece.team === this.turn) {
        if (this.checkForPossibleTeamJumps(piece.team)) {
          possibleMoves = piece.possibleJumps();
        } else {
          possibleMoves = piece.possibleMoves();
        }
      }

      // Shuffles through possible moves when piece is selected multiple times.
      if (e === this.prevSquare) {
        let possibleMovesLength = possibleMoves.length;
        possibleMoves = possibleMoves.slice(this.counter, this.counter + 1);
        this.counter = (this.counter + 1) % (possibleMovesLength);
      } else {
        this.counter = 0;
      }

      // Draw the possible moves and stopovers to the board.
      for (let possibleMove of possibleMoves) {
        while (possibleMove.nextMove) {
          posToSqaure(possibleMove.destination).classList.add('stopover-square');
          possibleMove = possibleMove.nextMove;
        }
        posToSqaure(possibleMove.destination).classList.add('valid-move-square');
      }

      this.prevSquare = e;
      this.prevPossibleMoves = possibleMoves;
    }
  }

  // A function which changes the turn and update the indicator if needed.
  changeTurn(toDraw = true) {
    if (toDraw) {
      let indicator = document.getElementById('turn-indicator');
      this.turn === Team.White ? indicator.classList.add('turn-indicator-b') : indicator.classList.remove('turn-indicator-b');
      this.turn === Team.White ? indicator.innerHTML = 'Black Turn' : indicator.innerHTML = 'White Turn';
    }
    this.turn = this.turn === Team.White ? Team.Black : Team.White;
  }

  // A function which checks if a player won and notify the user if needed.
  checkForWin(toNotify = true) {
    let pieces = this.boardData.getPieces(this.turn);
    let isOutOfMoves = true;
    // Checks weather the player has moves to do, if not, he either has
    // No pieces left or no possible moves.
    for (const piece of pieces) {
      let possibleMoves = []
      if (this.checkForPossibleTeamJumps(piece.team)) {
        possibleMoves = piece.possibleJumps();
      } else {
        possibleMoves = piece.possibleMoves();
      }
      if (possibleMoves.length > 0) {
        isOutOfMoves = false;
        break;
      }
    }

    this.winner = isOutOfMoves ? opponentTeam(this.turn) : undefined;

    if (this.winner && toNotify) {
      this.gameEnded = true;
      this.turn = false;
      let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
      overlay.getElementsByTagName('h1')[0].innerHTML = "Good Game!";
      overlay.getElementsByTagName('h2')[0].innerHTML = this.winner.charAt(0).toUpperCase() + this.winner.slice(1) + ' wins!';
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
  }
    return this.winner;
  }

  // A function which checks if there are possible jumps to a certein team. (returns a boolian).
  checkForPossibleTeamJumps(team) {
    // At the moment one piece has a possible jump, the loop ends and returns true.
    let pieces = this.boardData.getPieces(team);
    for (const piece of pieces) {
      let posJumps = piece.possibleJumps();
      if (posJumps && posJumps.length > 0) {
        return true;
      }
    }
    return false;
  }
}

function aiPlay() {
  if (ai) {
    ai.play();
  }
}
