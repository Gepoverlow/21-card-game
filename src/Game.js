import Deck from "./Deck";
import Player from "./Player";

class Game {
  constructor() {}

  init() {
    let deck = new Deck();
    let player = new Player();
    let house = new Player();

    this.initialDeal(player, deck, house);
  }

  initialDeal(player, deck, house) {
    player.currentCards.push(deck.dealCard());
    player.currentCards.push(deck.dealCard());
    house.currentCards.push(deck.dealCard());
    house.currentCards.push(deck.dealCard());
    console.log(player.currentCards, house.currentCards);
  }

  turn(player, deck, house) {}
}

export default Game;
