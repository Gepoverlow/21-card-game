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
    this.updatePlayerDisplay();
    this.updateHouseDisplay();
    this.checkBlackjack(this.calculateTotalHand(this.player.currentCards));
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());

    console.log(this.player.currentCards);
    console.log(this.house.currentCards);
  }

  calculateTotalHand(hand) {
    return hand.reduce((a, b) => a.value + b.value);
  }

  checkBlackjack(hand) {
    console.log(`you started the round with ${hand}`);

    if (hand < 21) {
      console.log("give chance to pick option");
    } else if (hand === 21) {
      console.log("Blackjack!");
    } else if (hand > 21) {
      console.log("You went too far");
    }
  }

  displayOption() {
    let hitButton = document.createElement("div");
    hitButton.textContent = "HIT";
    playerContainer.appendChild(hitButton);
  }

  updatePlayerDisplay() {
    this.emptyNode(playerContainer);
    for (let i = 0; i < this.player.currentCards.length; i++) {
      const pCard = document.createElement("span");
      pCard.className = "card";
      pCard.innerHTML = `${this.player.currentCards[i].altCode}`;
      playerContainer.appendChild(pCard);
      console.log(this.player.currentCards);
    }
  }

  updateHouseDisplay() {
    this.emptyNode(houseContainer);
    for (let i = 0; i < this.house.currentCards.length; i++) {
      const hCard = document.createElement("span");
      hCard.className = "card";
      hCard.innerHTML = `${this.house.currentCards[i].altCode}`;
      houseContainer.appendChild(hCard);
    }
  }

  // updateCardDisplay(player, house) {
  //   for (let i = 0; i < player.currentCards.length; i++) {
  //     const pCard = document.createElement("span");
  //     pCard.className = "card";
  //     pCard.innerHTML = `${player.currentCards[i].altCode}`;
  //     playerContainer.appendChild(pCard);
  //   }

  //   for (let i = 0; i < house.currentCards.length; i++) {
  //     const hCard = document.createElement("span");
  //     hCard.className = "card";
  //     hCard.innerHTML = `${house.currentCards[i].altCode}`;
  //     houseContainer.appendChild(hCard);
  //   }
  // }

  emptyNode(parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }
}

export default Game;
