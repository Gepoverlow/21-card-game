/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Deck.js":
/*!*********************!*\
  !*** ./src/Deck.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Deck {
  constructor() {
    this.deck = [];
    this.reset();
    this.shuffleDeck();
  }
  reset() {
    this.deck = [];

    const types = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const values = [
      "Ace",
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      "Jack",
      null,
      "Queen",
      "King",
    ];
    let baseAlt = 127137;

    for (let type in types) {
      for (let value in values) {
        //Because of italian and spanish "Knight" card, I had to include a null element within the values array to skip it when looping over and displaying the correct baseAle value
        if (values[value] !== null) {
          let cardName = `${values[value]} of ${types[type]}`;
          let card = this.cardToObject(
            cardName,
            this.assignCardValue(cardName),
            `&#${baseAlt}`
          );
          this.deck.push(card);
        }
        baseAlt++;
      }
      baseAlt += 2;
    }
  }

  cardToObject(name, value, altCode) {
    return {
      name: name,
      value: value,
      altCode: altCode,
    };
  }

  assignCardValue(card) {
    let value = /Jack|Queen|King/.test(card);
    let splitString = card.split(" ");
    if (value || splitString[0] === "10") {
      return 10;
    } else if (splitString[0] === "Ace") {
      return 11;
    } else {
      return Number(splitString[0]);
    }
  }

  shuffleDeck() {
    const deck = this.deck;
    let length = deck.length;
    let i;

    while (length) {
      i = Math.floor(Math.random() * length--);

      [deck[length], deck[i]] = [deck[i], deck[length]];
    }
    return deck;
  }

  dealCard() {
    return this.deck.pop();
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Deck);


/***/ }),

/***/ "./src/Game.js":
/*!*********************!*\
  !*** ./src/Game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Deck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Deck */ "./src/Deck.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ "./src/Player.js");



const houseContainer = document.getElementById("container-house");
const playerContainer = document.getElementById("container-player");

const playerScore = document.getElementById("info-player-score");
const gameState = document.getElementById("info-game-state");
const currentBet = document.getElementById("info-game-current-bet");
const playerCredits = document.getElementById("info-player-credits");

class Game {
  constructor() {
    this.isInitialized = false;
    this.player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"](10000);
    this.house = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.currentBet = 0;
  }

  init() {
    this.deck = new _Deck__WEBPACK_IMPORTED_MODULE_0__["default"]();

    this.player.currentCards = [];
    this.house.currentCards = [];

    this.gameOver = false;
    this.isInitialized = true;
    this.isBetPlaced = false;

    this.initialDeal();
    this.updatePlayerDisplay();
    this.updateHouseDisplay();
    this.checkBlackjack(this.calculateTotalHand(this.player.currentCards));

    this.updatePlayerCredits();
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());
  }

  calculateTotalHand(hand) {
    let totalSum = hand.reduce((accumulator, object) => {
      let current = accumulator + object.value;

      return current;
    }, 0);
    if (this.acesInPlay(hand) > 0 && totalSum > 21) {
      totalSum -= 10;
    }
    return totalSum;
  }

  acesInPlay(hand) {
    const acesPlaying = hand.filter((card) => card.name[0] === "A");
    return acesPlaying.length;
  }

  checkBlackjack(hand) {
    if (hand < 21) {
      this.gameStatus = "alive";
      this.gameOver = false;
    } else if (hand === 21) {
      this.gameStatus = "blackjack";
      this.gameOver = true;
    } else if (hand > 21) {
      this.gameStatus = "over";
      this.gameOver = true;
    }
    this.updateScores(this.gameStatus);
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
      pCard.className = "playerCard";
      pCard.innerHTML = `${this.player.currentCards[i].altCode}`;
      playerContainer.appendChild(pCard);
    }
  }

  updateHouseDisplay() {
    this.emptyNode(houseContainer);
    for (let i = 0; i < this.house.currentCards.length; i++) {
      const hCard = document.createElement("span");
      hCard.className = "houseCard";
      hCard.innerHTML = `${this.house.currentCards[i].altCode}`;
      houseContainer.appendChild(hCard);
    }
    this.hideLastHouseCard();
  }

  hideLastHouseCard() {
    const allHouseCards = document.querySelectorAll(".houseCard");
    const firstCard = allHouseCards[0];

    const wrapper = document.createElement("div");
    firstCard.appendChild(wrapper);

    wrapper.classList.add("hiddenCard");
  }

  showLastHouseCard() {
    const allHouseCards = document.querySelectorAll(".houseCard");
    const firstCard = allHouseCards[0];
    const wrapper = document.querySelector(".hiddenCard");

    if (wrapper !== null) firstCard.removeChild(wrapper);
  }

  compareFinalScore() {
    const houseScore = this.calculateTotalHand(this.house.currentCards);
    const playerScore = this.calculateTotalHand(this.player.currentCards);

    if (houseScore < 17) {
      this.house.hit(this.deck.dealCard());
      this.updateHouseDisplay();
      this.compareFinalScore();
      this.showLastHouseCard();
    } else {
      if (playerScore > houseScore && playerScore <= 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. You Win!`;
        this.winRound();
      } else if (playerScore > houseScore && playerScore > 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. House Wins`;
        this.looseRound();
      } else if (houseScore > playerScore && houseScore <= 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. House Wins`;
        this.looseRound();
      } else if (houseScore > playerScore && houseScore > 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. Player Wins!`;
        this.winRound();
      } else if (houseScore === playerScore) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. Its a Tie`;
        this.tieRound();
      }

      this.gameOver = true;
      this.showLastHouseCard();
    }
  }

  updateScores(state) {
    playerScore.textContent = `Player Score = ${this.calculateTotalHand(
      this.player.currentCards
    )}`;
    if (state === "alive") {
      gameState.textContent = `Are you going to Hit or Stand?`;
    } else if (state === "blackjack") {
      gameState.textContent = `Blackjack!`;
      this.winRound();
    } else if (state === "over") {
      gameState.textContent = `Went too high... Game Over`;
      this.looseRound();
    }
  }

  updatePlayerCredits() {
    playerCredits.textContent = `Player Credits: ${this.player.credits}`;
    currentBet.textContent = `Current Bet: ${this.currentBet}`;
  }

  placeBet(amount) {
    if (this.isBetPlaced !== true) {
      this.betAmount = amount;
      this.player.credits -= amount;
      this.currentBet += amount;
      this.updatePlayerCredits();

      this.isBetPlaced = true;
    }
  }

  winRound() {
    this.player.credits += this.currentBet * 2;
    this.currentBet = 0;
    this.updatePlayerCredits();
    this.isInitialized = false;
  }

  looseRound() {
    this.currentBet = 0;
    this.updatePlayerCredits();
    this.isInitialized = false;
  }

  tieRound() {
    this.player.credits += this.currentBet;
    this.currentBet = 0;
    this.updatePlayerCredits();
    this.isInitialized = false;
  }

  emptyNode(parent) {
    while (parent.firstChild) {
      parent.firstChild.remove();
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);


/***/ }),

/***/ "./src/Player.js":
/*!***********************!*\
  !*** ./src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Player {
  constructor(credits) {
    this.credits = credits;
    this.currentCards = [];
  }

  hit(card) {
    this.currentCards.push(card);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Game.js */ "./src/Game.js");


const game = new _Game_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

const startButton = document.getElementById("option-start");
const hitButton = document.getElementById("option-hit");
const standButton = document.getElementById("option-stand");

const placeBetOne = document.getElementById("option-bet-one");
const placeBetTwo = document.getElementById("option-bet-two");
const placeBetThree = document.getElementById("option-bet-three");

const allBets = document.querySelectorAll(".bet");
const allMoves = document.querySelectorAll(".move");

const removeBetsFocus = () => {
  allBets.forEach((bet) => bet.classList.remove("focus"));
};

const addBetsFocus = () => {
  allBets.forEach((bet) => bet.classList.add("focus"));
};

const removeMovesFocus = () => {
  allMoves.forEach((move) => move.classList.remove("focus"));
};

const addMovesFocus = () => {
  allMoves.forEach((move) => move.classList.add("focus"));
};

startButton.addEventListener("click", () => {
  game.init(); //
  if (game.isBetPlaced === true) {
    startButton.classList.remove("focus");
    addMovesFocus();
  }
});

placeBetOne.addEventListener("click", () => {
  if (game.player.credits >= 1000 && game.isInitialized !== true) {
    game.placeBet(1000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

placeBetTwo.addEventListener("click", () => {
  if (game.player.credits >= 2000 && game.isInitialized !== true) {
    game.placeBet(2000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

placeBetThree.addEventListener("click", () => {
  if (game.player.credits >= 3000 && game.isInitialized !== true) {
    game.placeBet(3000);
    removeBetsFocus();
    startButton.classList.add("focus");
  }
});

hitButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.player.hit(game.deck.dealCard());
    game.updatePlayerDisplay();
    game.checkBlackjack(game.calculateTotalHand(game.player.currentCards));
  }

  if (game.gameOver === true && game.isBetPlaced === false) {
    removeMovesFocus();
    addBetsFocus();
  }
});

standButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.compareFinalScore();
  }

  if (game.gameOver === true && game.isBetPlaced === false) {
    removeMovesFocus();
    addBetsFocus();
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQzs7Ozs7OztVQ1h0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjZCOztBQUU3QixpQkFBaUIsZ0RBQUk7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0RlY2suanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5zaHVmZmxlRGVjaygpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbXCJTcGFkZXNcIiwgXCJIZWFydHNcIiwgXCJEaWFtb25kc1wiLCBcIkNsdWJzXCJdO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtcbiAgICAgIFwiQWNlXCIsXG4gICAgICAyLFxuICAgICAgMyxcbiAgICAgIDQsXG4gICAgICA1LFxuICAgICAgNixcbiAgICAgIDcsXG4gICAgICA4LFxuICAgICAgOSxcbiAgICAgIDEwLFxuICAgICAgXCJKYWNrXCIsXG4gICAgICBudWxsLFxuICAgICAgXCJRdWVlblwiLFxuICAgICAgXCJLaW5nXCIsXG4gICAgXTtcbiAgICBsZXQgYmFzZUFsdCA9IDEyNzEzNztcblxuICAgIGZvciAobGV0IHR5cGUgaW4gdHlwZXMpIHtcbiAgICAgIGZvciAobGV0IHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgICAvL0JlY2F1c2Ugb2YgaXRhbGlhbiBhbmQgc3BhbmlzaCBcIktuaWdodFwiIGNhcmQsIEkgaGFkIHRvIGluY2x1ZGUgYSBudWxsIGVsZW1lbnQgd2l0aGluIHRoZSB2YWx1ZXMgYXJyYXkgdG8gc2tpcCBpdCB3aGVuIGxvb3Bpbmcgb3ZlciBhbmQgZGlzcGxheWluZyB0aGUgY29ycmVjdCBiYXNlQWxlIHZhbHVlXG4gICAgICAgIGlmICh2YWx1ZXNbdmFsdWVdICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNhcmROYW1lID0gYCR7dmFsdWVzW3ZhbHVlXX0gb2YgJHt0eXBlc1t0eXBlXX1gO1xuICAgICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkVG9PYmplY3QoXG4gICAgICAgICAgICBjYXJkTmFtZSxcbiAgICAgICAgICAgIHRoaXMuYXNzaWduQ2FyZFZhbHVlKGNhcmROYW1lKSxcbiAgICAgICAgICAgIGAmIyR7YmFzZUFsdH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmRlY2sucHVzaChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBiYXNlQWx0Kys7XG4gICAgICB9XG4gICAgICBiYXNlQWx0ICs9IDI7XG4gICAgfVxuICB9XG5cbiAgY2FyZFRvT2JqZWN0KG5hbWUsIHZhbHVlLCBhbHRDb2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBhbHRDb2RlOiBhbHRDb2RlLFxuICAgIH07XG4gIH1cblxuICBhc3NpZ25DYXJkVmFsdWUoY2FyZCkge1xuICAgIGxldCB2YWx1ZSA9IC9KYWNrfFF1ZWVufEtpbmcvLnRlc3QoY2FyZCk7XG4gICAgbGV0IHNwbGl0U3RyaW5nID0gY2FyZC5zcGxpdChcIiBcIik7XG4gICAgaWYgKHZhbHVlIHx8IHNwbGl0U3RyaW5nWzBdID09PSBcIjEwXCIpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9IGVsc2UgaWYgKHNwbGl0U3RyaW5nWzBdID09PSBcIkFjZVwiKSB7XG4gICAgICByZXR1cm4gMTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOdW1iZXIoc3BsaXRTdHJpbmdbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHNodWZmbGVEZWNrKCkge1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2s7XG4gICAgbGV0IGxlbmd0aCA9IGRlY2subGVuZ3RoO1xuICAgIGxldCBpO1xuXG4gICAgd2hpbGUgKGxlbmd0aCkge1xuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbmd0aC0tKTtcblxuICAgICAgW2RlY2tbbGVuZ3RoXSwgZGVja1tpXV0gPSBbZGVja1tpXSwgZGVja1tsZW5ndGhdXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2s7XG4gIH1cblxuICBkZWFsQ2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNrLnBvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlY2s7XG4iLCJpbXBvcnQgRGVjayBmcm9tIFwiLi9EZWNrXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5jb25zdCBob3VzZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLWhvdXNlXCIpO1xuY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyXCIpO1xuXG5jb25zdCBwbGF5ZXJTY29yZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1wbGF5ZXItc2NvcmVcIik7XG5jb25zdCBnYW1lU3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZ2FtZS1zdGF0ZVwiKTtcbmNvbnN0IGN1cnJlbnRCZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZ2FtZS1jdXJyZW50LWJldFwiKTtcbmNvbnN0IHBsYXllckNyZWRpdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tcGxheWVyLWNyZWRpdHNcIik7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoMTAwMDApO1xuICAgIHRoaXMuaG91c2UgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5kZWNrID0gbmV3IERlY2soKTtcblxuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcyA9IFtdO1xuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzID0gW107XG5cbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzQmV0UGxhY2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmluaXRpYWxEZWFsKCk7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJEaXNwbGF5KCk7XG4gICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICB0aGlzLmNoZWNrQmxhY2tqYWNrKHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcykpO1xuXG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gIH1cblxuICBpbml0aWFsRGVhbCgpIHtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuXG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gIH1cblxuICBjYWxjdWxhdGVUb3RhbEhhbmQoaGFuZCkge1xuICAgIGxldCB0b3RhbFN1bSA9IGhhbmQucmVkdWNlKChhY2N1bXVsYXRvciwgb2JqZWN0KSA9PiB7XG4gICAgICBsZXQgY3VycmVudCA9IGFjY3VtdWxhdG9yICsgb2JqZWN0LnZhbHVlO1xuXG4gICAgICByZXR1cm4gY3VycmVudDtcbiAgICB9LCAwKTtcbiAgICBpZiAodGhpcy5hY2VzSW5QbGF5KGhhbmQpID4gMCAmJiB0b3RhbFN1bSA+IDIxKSB7XG4gICAgICB0b3RhbFN1bSAtPSAxMDtcbiAgICB9XG4gICAgcmV0dXJuIHRvdGFsU3VtO1xuICB9XG5cbiAgYWNlc0luUGxheShoYW5kKSB7XG4gICAgY29uc3QgYWNlc1BsYXlpbmcgPSBoYW5kLmZpbHRlcigoY2FyZCkgPT4gY2FyZC5uYW1lWzBdID09PSBcIkFcIik7XG4gICAgcmV0dXJuIGFjZXNQbGF5aW5nLmxlbmd0aDtcbiAgfVxuXG4gIGNoZWNrQmxhY2tqYWNrKGhhbmQpIHtcbiAgICBpZiAoaGFuZCA8IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImFsaXZlXCI7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYW5kID09PSAyMSkge1xuICAgICAgdGhpcy5nYW1lU3RhdHVzID0gXCJibGFja2phY2tcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGFuZCA+IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcIm92ZXJcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVNjb3Jlcyh0aGlzLmdhbWVTdGF0dXMpO1xuICB9XG5cbiAgZGlzcGxheU9wdGlvbigpIHtcbiAgICBsZXQgaGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkhJVFwiO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXRCdXR0b24pO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShwbGF5ZXJDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgcENhcmQuY2xhc3NOYW1lID0gXCJwbGF5ZXJDYXJkXCI7XG4gICAgICBwQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBDYXJkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVIb3VzZURpc3BsYXkoKSB7XG4gICAgdGhpcy5lbXB0eU5vZGUoaG91c2VDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGhDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBoQ2FyZC5jbGFzc05hbWUgPSBcImhvdXNlQ2FyZFwiO1xuICAgICAgaENhcmQuaW5uZXJIVE1MID0gYCR7dGhpcy5ob3VzZS5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgaG91c2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaENhcmQpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVMYXN0SG91c2VDYXJkKCk7XG4gIH1cblxuICBoaWRlTGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZpcnN0Q2FyZC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlbkNhcmRcIik7XG4gIH1cblxuICBzaG93TGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaWRkZW5DYXJkXCIpO1xuXG4gICAgaWYgKHdyYXBwZXIgIT09IG51bGwpIGZpcnN0Q2FyZC5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgfVxuXG4gIGNvbXBhcmVGaW5hbFNjb3JlKCkge1xuICAgIGNvbnN0IGhvdXNlU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyk7XG4gICAgY29uc3QgcGxheWVyU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuXG4gICAgaWYgKGhvdXNlU2NvcmUgPCAxNykge1xuICAgICAgdGhpcy5ob3VzZS5oaXQodGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAgIHRoaXMuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFlvdSBXaW4hYDtcbiAgICAgICAgdGhpcy53aW5Sb3VuZCgpO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJTY29yZSA+IGhvdXNlU2NvcmUgJiYgcGxheWVyU2NvcmUgPiAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA+IHBsYXllclNjb3JlICYmIGhvdXNlU2NvcmUgPD0gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBIb3VzZSBXaW5zYDtcbiAgICAgICAgdGhpcy5sb29zZVJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXNlU2NvcmUgPiBwbGF5ZXJTY29yZSAmJiBob3VzZVNjb3JlID4gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBQbGF5ZXIgV2lucyFgO1xuICAgICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXNlU2NvcmUgPT09IHBsYXllclNjb3JlKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gSXRzIGEgVGllYDtcbiAgICAgICAgdGhpcy50aWVSb3VuZCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTY29yZXMoc3RhdGUpIHtcbiAgICBwbGF5ZXJTY29yZS50ZXh0Q29udGVudCA9IGBQbGF5ZXIgU2NvcmUgPSAke3RoaXMuY2FsY3VsYXRlVG90YWxIYW5kKFxuICAgICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzXG4gICAgKX1gO1xuICAgIGlmIChzdGF0ZSA9PT0gXCJhbGl2ZVwiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQXJlIHlvdSBnb2luZyB0byBIaXQgb3IgU3RhbmQ/YDtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcImJsYWNramFja1wiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQmxhY2tqYWNrIWA7XG4gICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJvdmVyXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBXZW50IHRvbyBoaWdoLi4uIEdhbWUgT3ZlcmA7XG4gICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJDcmVkaXRzKCkge1xuICAgIHBsYXllckNyZWRpdHMudGV4dENvbnRlbnQgPSBgUGxheWVyIENyZWRpdHM6ICR7dGhpcy5wbGF5ZXIuY3JlZGl0c31gO1xuICAgIGN1cnJlbnRCZXQudGV4dENvbnRlbnQgPSBgQ3VycmVudCBCZXQ6ICR7dGhpcy5jdXJyZW50QmV0fWA7XG4gIH1cblxuICBwbGFjZUJldChhbW91bnQpIHtcbiAgICBpZiAodGhpcy5pc0JldFBsYWNlZCAhPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5iZXRBbW91bnQgPSBhbW91bnQ7XG4gICAgICB0aGlzLnBsYXllci5jcmVkaXRzIC09IGFtb3VudDtcbiAgICAgIHRoaXMuY3VycmVudEJldCArPSBhbW91bnQ7XG4gICAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcblxuICAgICAgdGhpcy5pc0JldFBsYWNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgd2luUm91bmQoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3JlZGl0cyArPSB0aGlzLmN1cnJlbnRCZXQgKiAyO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBsb29zZVJvdW5kKCkge1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICB0aWVSb3VuZCgpIHtcbiAgICB0aGlzLnBsYXllci5jcmVkaXRzICs9IHRoaXMuY3VycmVudEJldDtcbiAgICB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgZW1wdHlOb2RlKHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihjcmVkaXRzKSB7XG4gICAgdGhpcy5jcmVkaXRzID0gY3JlZGl0cztcbiAgICB0aGlzLmN1cnJlbnRDYXJkcyA9IFtdO1xuICB9XG5cbiAgaGl0KGNhcmQpIHtcbiAgICB0aGlzLmN1cnJlbnRDYXJkcy5wdXNoKGNhcmQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZS5qc1wiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcblxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFydFwiKTtcbmNvbnN0IGhpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWhpdFwiKTtcbmNvbnN0IHN0YW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tc3RhbmRcIik7XG5cbmNvbnN0IHBsYWNlQmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LW9uZVwiKTtcbmNvbnN0IHBsYWNlQmV0VHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LXR3b1wiKTtcbmNvbnN0IHBsYWNlQmV0VGhyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdGhyZWVcIik7XG5cbmNvbnN0IGFsbEJldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJldFwiKTtcbmNvbnN0IGFsbE1vdmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb3ZlXCIpO1xuXG5jb25zdCByZW1vdmVCZXRzRm9jdXMgPSAoKSA9PiB7XG4gIGFsbEJldHMuZm9yRWFjaCgoYmV0KSA9PiBiZXQuY2xhc3NMaXN0LnJlbW92ZShcImZvY3VzXCIpKTtcbn07XG5cbmNvbnN0IGFkZEJldHNGb2N1cyA9ICgpID0+IHtcbiAgYWxsQmV0cy5mb3JFYWNoKChiZXQpID0+IGJldC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgcmVtb3ZlTW92ZXNGb2N1cyA9ICgpID0+IHtcbiAgYWxsTW92ZXMuZm9yRWFjaCgobW92ZSkgPT4gbW92ZS5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgYWRkTW92ZXNGb2N1cyA9ICgpID0+IHtcbiAgYWxsTW92ZXMuZm9yRWFjaCgobW92ZSkgPT4gbW92ZS5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIikpO1xufTtcblxuc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZ2FtZS5pbml0KCk7IC8vXG4gIGlmIChnYW1lLmlzQmV0UGxhY2VkID09PSB0cnVlKSB7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImZvY3VzXCIpO1xuICAgIGFkZE1vdmVzRm9jdXMoKTtcbiAgfVxufSk7XG5cbnBsYWNlQmV0T25lLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLnBsYXllci5jcmVkaXRzID49IDEwMDAgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSB0cnVlKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgxMDAwKTtcbiAgICByZW1vdmVCZXRzRm9jdXMoKTtcbiAgICBzdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIik7XG4gIH1cbn0pO1xuXG5wbGFjZUJldFR3by5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAyMDAwICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIGdhbWUucGxhY2VCZXQoMjAwMCk7XG4gICAgcmVtb3ZlQmV0c0ZvY3VzKCk7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImZvY3VzXCIpO1xuICB9XG59KTtcblxucGxhY2VCZXRUaHJlZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAzMDAwICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIGdhbWUucGxhY2VCZXQoMzAwMCk7XG4gICAgcmVtb3ZlQmV0c0ZvY3VzKCk7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImZvY3VzXCIpO1xuICB9XG59KTtcblxuaGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLmdhbWVPdmVyICE9PSB0cnVlICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gZmFsc2UpIHtcbiAgICBnYW1lLnBsYXllci5oaXQoZ2FtZS5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIGdhbWUudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIGdhbWUuY2hlY2tCbGFja2phY2soZ2FtZS5jYWxjdWxhdGVUb3RhbEhhbmQoZ2FtZS5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG4gIH1cblxuICBpZiAoZ2FtZS5nYW1lT3ZlciA9PT0gdHJ1ZSAmJiBnYW1lLmlzQmV0UGxhY2VkID09PSBmYWxzZSkge1xuICAgIHJlbW92ZU1vdmVzRm9jdXMoKTtcbiAgICBhZGRCZXRzRm9jdXMoKTtcbiAgfVxufSk7XG5cbnN0YW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLmdhbWVPdmVyICE9PSB0cnVlICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gZmFsc2UpIHtcbiAgICBnYW1lLmNvbXBhcmVGaW5hbFNjb3JlKCk7XG4gIH1cblxuICBpZiAoZ2FtZS5nYW1lT3ZlciA9PT0gdHJ1ZSAmJiBnYW1lLmlzQmV0UGxhY2VkID09PSBmYWxzZSkge1xuICAgIHJlbW92ZU1vdmVzRm9jdXMoKTtcbiAgICBhZGRCZXRzRm9jdXMoKTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=