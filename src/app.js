import Game from "./Game.js";

const game = new Game();

const startButton = document.getElementById("option-start");
const hitButton = document.getElementById("option-hit");
const standButton = document.getElementById("option-stand");

const placeBetOne = document.getElementById("option-bet-one");
const placeBetTwo = document.getElementById("option-bet-two");
const placeBetThree = document.getElementById("option-bet-three");

startButton.addEventListener("click", () => {
  if (game.isBetPlaced === true) {
    game.init();
  }
});

placeBetOne.addEventListener("click", () => {
  if (game.player.credits >= 1000) {
    game.placeBet(1000);
  }
});

placeBetTwo.addEventListener("click", () => {
  if (game.player.credits >= 2000) {
    game.placeBet(2000);
  }
});

placeBetThree.addEventListener("click", () => {
  if (game.player.credits >= 3000) {
    game.placeBet(3000);
  }
});

hitButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.player.hit(game.deck.dealCard());
    game.updatePlayerDisplay();
    game.checkBlackjack(game.calculateTotalHand(game.player.currentCards));
  }
});

standButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.compareFinalScore();
  }
});
