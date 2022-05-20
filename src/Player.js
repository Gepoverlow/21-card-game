class Player {
  constructor(credits) {
    this.credits = credits;
    this.currentCards = [];
  }

  hit(card) {
    this.currentCards.push(card);
  }
}

export default Player;
