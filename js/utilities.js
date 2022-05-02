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

// Function that gets a color TeamColor value and returns the oppisite TeamColor (WHITE -> BLACK and vice-versa).
function opponentColor(team) {
  return team === Team.White ? Team.Black : Team.White;
}

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

function opponentTeam(team) {
  return team === Team.White ? Team.Black : Team.White;
}
