import Deck from "./Deck";
import Player from "./Player";

const houseContainer = document.getElementById("container-house");
const playerContainer = document.getElementById("container-player");

class Game {
  constructor() {}

  init() {
    this.deck = new Deck();
    this.player = new Player();
    this.house = new Player();

    this.initialDeal();
    this.updateCardDisplay(this.player, this.house);
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());

    console.log(this.player.currentCards);
    console.log(this.house.currentCards);
  }

  updateCardDisplay(player, house) {
    for (let i = 0; i < player.currentCards.length; i++) {
      const pCard = document.createElement("span");
      pCard.innerHTML = `${player.currentCards[i].altCode}`;
      playerContainer.appendChild(pCard);
    }

    for (let i = 0; i < house.currentCards.length; i++) {
      const hCard = document.createElement("span");
      hCard.innerHTML = `${house.currentCards[i].altCode}`;
      houseContainer.appendChild(hCard);
    }
  }

  turn(player, deck, house) {}
}

export default Game;
