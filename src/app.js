import Game from "./Game.js";
import Deck from "./Deck.js";
import Player from "./Player.js";

let game = new Game();
game.init();

let restartButton = document.getElementById("option-restart");
let hitButton = document.getElementById("option-hit");
let standButton = document.getElementById("option-stand");

restartButton.addEventListener("click", () => {
  game.init();
});

hitButton.addEventListener("click", () => {
  game.player.hit(game.deck.dealCard());
  game.updatePlayerDisplay();
  console.log(game.deck.deck);
});
