import Game from "./Game.js";

const game = new Game();

const startButton = document.getElementById("option-start");
const hitButton = document.getElementById("option-hit");
const standButton = document.getElementById("option-stand");

const placeBetOne = document.getElementById("option-bet-one");
const placeBetTwo = document.getElementById("option-bet-two");
const placeBetThree = document.getElementById("option-bet-three");

const allBets = document.querySelectorAll(".bet");
const allMoves = document.querySelectorAll(".move");

const removeBetsFocus = () => {
  allBets.forEach((bet) => bet.classList.remove("focus"));
};

const addBetsFocus = () => {
  allBets.forEach((bet) => bet.classList.add("focus"));
};

const removeMovesFocus = () => {
  allMoves.forEach((move) => move.classList.remove("focus"));
};

const addMovesFocus = () => {
  allMoves.forEach((move) => move.classList.add("focus"));
};

startButton.addEventListener("click", () => {
  if (game.isBetPlaced === true) {
    game.init();
    startButton.classList.remove("focus");
    addMovesFocus();
  }
});

placeBetOne.addEventListener("click", () => {
  if (game.player.credits >= 1000) {
    game.placeBet(1000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

placeBetTwo.addEventListener("click", () => {
  if (game.player.credits >= 2000) {
    game.placeBet(2000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

placeBetThree.addEventListener("click", () => {
  if (game.player.credits >= 3000) {
    game.placeBet(3000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

hitButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.player.hit(game.deck.dealCard());
    game.updatePlayerDisplay();
    game.checkBlackjack(game.calculateTotalHand(game.player.currentCards));
  }

  if (game.gameOver === true) {
    removeMovesFocus();
    addBetsFocus();
  }
});

standButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.compareFinalScore();
  }

  if (game.gameOver === true) {
    removeMovesFocus();
    addBetsFocus();
  }
});
