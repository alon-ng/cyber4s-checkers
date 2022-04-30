const BOARD_SIZE = 8;

const Team = {
  White: 'white',
  Black: 'black'
}

const SquareState = {
  ENEMY: 'enemy',
  FRIENDLY: 'friendly',
  EMPTY: undefined,
  OUT: 'out'
}

let gameManager;

window.addEventListener('load', initialize);

function initialize() {
  gameManager = new GameManager(BOARD_SIZE);
}
