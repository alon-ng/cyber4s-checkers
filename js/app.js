const BOARD_SIZE = 8;
let gameManager;

window.addEventListener('load', initialize);

function initialize() {
  gameManager = new GameManager(BOARD_SIZE);
}
