import Game from "./Game.js";

const game = new Game();

const restartButton = document.getElementById("option-restart");
const hitButton = document.getElementById("option-hit");
const standButton = document.getElementById("option-stand");

const placeBetOne = document.getElementById("option-bet-one");
const placeBetTwo = document.getElementById("option-bet-two");
const placeBetThree = document.getElementById("option-bet-three");

restartButton.addEventListener("click", () => {
  game.init();
});

placeBetOne.addEventListener("click", () => {
  game.placeBet(1000);
  console.log(game.currentBet);
});

placeBetTwo.addEventListener("click", () => {
  game.placeBet(2000);
  console.log(game.currentBet);
});

placeBetThree.addEventListener("click", () => {
  game.placeBet(3000);
  console.log(game.currentBet);
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
