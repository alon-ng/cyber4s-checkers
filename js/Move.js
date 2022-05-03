// A class containing information about a move.
class Move {
  constructor(origin, destination, victim, head) {
    this.origin = origin;
    this.destination = destination;
    this.victim = victim;
    this.head = head;
    this.nextMove;
  }
}
