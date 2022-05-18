class Player {
  constructor() {
    this.currentCards = [];
  }

  hit(card) {
    this.currentCards.push(card);
  }
}

export default Player;
