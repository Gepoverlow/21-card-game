import Deck from "./Deck";

class Game {
  constructor() {}

  init() {
    let deck = new Deck();
    deck.shuffleDeck();
    deck.log();
  }
}

export default Game;
