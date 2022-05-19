import Deck from "./Deck";
import Player from "./Player";

class Game {
  constructor() {}

  init() {
    this.deck = new Deck();
    this.player = new Player();
    this.house = new Player();

    this.initialDeal();
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());

    console.log(this.player.currentCards);
    console.log(this.house.currentCards);
  }

  displayCards(player, house) {
    const card = document.createElement("span");
  }

  turn(player, deck, house) {}
}

export default Game;
