// Function that takes a pos object { x: , y: } and returns the <td> element in that position.
function posToSqaure(pos) {
  return document.getElementById(`pos${pos.x}-${pos.y}`);
}

// Function that takes a <td> element and returns the position of it as a pos object { x: , y: }.
function squareToPos(square) {
  return { x: parseInt(square.id[3]), y: parseInt(square.id[5])};
}

// Function that gets two position objects { x: , y: } and returns weather they are equal.
function isPosEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// A function which takes a linked list of moves and reverse it.
function reverseMoves(head) {
  let prev, next;
  let current = head;
  while (current) {
    next = current.nextMove;
    current.nextMove = prev;
    prev = current;
    current = next;
  }
  return prev;
}

// Function which get a team color and returns the other team color.
function opponentTeam(team) {
  return team === Team.White ? Team.Black : Team.White;
}

// Work in progress
function deepCopyMove(move) {
  let copy = new Move(move.origin, move.destination, move.victim, undefined);
  copy.head = copy;
  copy.piece = move.piece;
  while (move.nextMove) {
    copy.piece = move.piece;
    copy.nextMove = new Move(move.nextMove.origin, move.nextMove.destination, move.nextMove.victim, copy.head);
    copy = copy.nextMove;
    move = move.nextMove;
  }
  return copy.head;
}
