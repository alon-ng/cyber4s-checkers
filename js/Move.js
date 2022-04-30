class Move {
  constructor(origin, destination, victims = [], stopovers = []) {
    this.origin = origin;
    this.destination = destination;
    this.victims = victims;
  }
}
