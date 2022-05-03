const BOARD_SIZE = 8;
const AI_START_DEPTH = 8;
const AI_MID_DEPTH = 10;
const AI_END_DEPTH = 12;

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

const PieceRank = {
  King: 'king',
  Man: 'man'
}

let gameManager;
let ai;

window.addEventListener('load', initialize);

// A function which starts the game after the html is loaded.
function initialize() {
  gameManager = new GameManager(BOARD_SIZE);
}

// A function which called everytime the New Game button is clicked.
function newGame() {
  let boardTable = document.getElementById('checkers-board');
  document.getElementsByClassName('checkers-div')[0].removeChild(boardTable);
  gameManager = new GameManager(BOARD_SIZE);
  setTimeout(aiPlay, 1000);
}

let rotation = 0;
// A function which called everytime the Rotate Board button is clicked.
function rotateBoard() {
  rotation += 180;
  document.getElementById('checkers-board').style.transform = `rotate(${rotation}deg)`;
}

// A function which called when a player choose which team does he wish to play.
function chooseTeam(team) {
  if (team) {
    ai = new AI(AI_START_DEPTH, opponentTeam(team));
    setTimeout(aiPlay, 1000);
  }

  let overlay = document.getElementsByClassName('popup-notification-overlay')[0];
  let buttons = document.getElementsByClassName('team-buttons')[0];
  overlay.removeChild(buttons);

  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.visibility = 'hidden';
  }, 1000);
}
