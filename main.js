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
    const totalSum = hand.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);
    return totalSum;
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
  if (game.isBetPlaced === true) {
    game.init();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGlFQUFlLE1BQU0sRUFBQzs7Ozs7OztVQ1h0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjZCOztBQUU3QixpQkFBaUIsZ0RBQUk7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9EZWNrLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9HYW1lLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEZWNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuc2h1ZmZsZURlY2soKTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcblxuICAgIGNvbnN0IHR5cGVzID0gW1wiU3BhZGVzXCIsIFwiSGVhcnRzXCIsIFwiRGlhbW9uZHNcIiwgXCJDbHVic1wiXTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXG4gICAgICBcIkFjZVwiLFxuICAgICAgMixcbiAgICAgIDMsXG4gICAgICA0LFxuICAgICAgNSxcbiAgICAgIDYsXG4gICAgICA3LFxuICAgICAgOCxcbiAgICAgIDksXG4gICAgICAxMCxcbiAgICAgIFwiSmFja1wiLFxuICAgICAgbnVsbCxcbiAgICAgIFwiUXVlZW5cIixcbiAgICAgIFwiS2luZ1wiLFxuICAgIF07XG4gICAgbGV0IGJhc2VBbHQgPSAxMjcxMzc7XG5cbiAgICBmb3IgKGxldCB0eXBlIGluIHR5cGVzKSB7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgLy9CZWNhdXNlIG9mIGl0YWxpYW4gYW5kIHNwYW5pc2ggXCJLbmlnaHRcIiBjYXJkLCBJIGhhZCB0byBpbmNsdWRlIGEgbnVsbCBlbGVtZW50IHdpdGhpbiB0aGUgdmFsdWVzIGFycmF5IHRvIHNraXAgaXQgd2hlbiBsb29waW5nIG92ZXIgYW5kIGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgYmFzZUFsZSB2YWx1ZVxuICAgICAgICBpZiAodmFsdWVzW3ZhbHVlXSAhPT0gbnVsbCkge1xuICAgICAgICAgIGxldCBjYXJkTmFtZSA9IGAke3ZhbHVlc1t2YWx1ZV19IG9mICR7dHlwZXNbdHlwZV19YDtcbiAgICAgICAgICBsZXQgY2FyZCA9IHRoaXMuY2FyZFRvT2JqZWN0KFxuICAgICAgICAgICAgY2FyZE5hbWUsXG4gICAgICAgICAgICB0aGlzLmFzc2lnbkNhcmRWYWx1ZShjYXJkTmFtZSksXG4gICAgICAgICAgICBgJiMke2Jhc2VBbHR9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5kZWNrLnB1c2goY2FyZCk7XG4gICAgICAgIH1cbiAgICAgICAgYmFzZUFsdCsrO1xuICAgICAgfVxuICAgICAgYmFzZUFsdCArPSAyO1xuICAgIH1cbiAgfVxuXG4gIGNhcmRUb09iamVjdChuYW1lLCB2YWx1ZSwgYWx0Q29kZSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgYWx0Q29kZTogYWx0Q29kZSxcbiAgICB9O1xuICB9XG5cbiAgYXNzaWduQ2FyZFZhbHVlKGNhcmQpIHtcbiAgICBsZXQgdmFsdWUgPSAvSmFja3xRdWVlbnxLaW5nLy50ZXN0KGNhcmQpO1xuICAgIGxldCBzcGxpdFN0cmluZyA9IGNhcmQuc3BsaXQoXCIgXCIpO1xuICAgIGlmICh2YWx1ZSB8fCBzcGxpdFN0cmluZ1swXSA9PT0gXCIxMFwiKSB7XG4gICAgICByZXR1cm4gMTA7XG4gICAgfSBlbHNlIGlmIChzcGxpdFN0cmluZ1swXSA9PT0gXCJBY2VcIikge1xuICAgICAgcmV0dXJuIDExO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHNwbGl0U3RyaW5nWzBdKTtcbiAgICB9XG4gIH1cblxuICBzaHVmZmxlRGVjaygpIHtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrO1xuICAgIGxldCBsZW5ndGggPSBkZWNrLmxlbmd0aDtcbiAgICBsZXQgaTtcblxuICAgIHdoaWxlIChsZW5ndGgpIHtcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsZW5ndGgtLSk7XG5cbiAgICAgIFtkZWNrW2xlbmd0aF0sIGRlY2tbaV1dID0gW2RlY2tbaV0sIGRlY2tbbGVuZ3RoXV07XG4gICAgfVxuICAgIHJldHVybiBkZWNrO1xuICB9XG5cbiAgZGVhbENhcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVjay5wb3AoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWNrO1xuIiwiaW1wb3J0IERlY2sgZnJvbSBcIi4vRGVja1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcblxuY29uc3QgaG91c2VDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1ob3VzZVwiKTtcbmNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllclwiKTtcblxuY29uc3QgcGxheWVyU2NvcmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tcGxheWVyLXNjb3JlXCIpO1xuY29uc3QgZ2FtZVN0YXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWdhbWUtc3RhdGVcIik7XG5jb25zdCBjdXJyZW50QmV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWdhbWUtY3VycmVudC1iZXRcIik7XG5jb25zdCBwbGF5ZXJDcmVkaXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLXBsYXllci1jcmVkaXRzXCIpO1xuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKDEwMDAwKTtcbiAgICB0aGlzLmhvdXNlID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuZGVjayA9IG5ldyBEZWNrKCk7XG5cbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMgPSBbXTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyA9IFtdO1xuXG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5pc0JldFBsYWNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0aWFsRGVhbCgpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIHRoaXMudXBkYXRlSG91c2VEaXNwbGF5KCk7XG4gICAgdGhpcy5jaGVja0JsYWNramFjayh0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcblxuICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuICB9XG5cbiAgaW5pdGlhbERlYWwoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcblxuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICB9XG5cbiAgY2FsY3VsYXRlVG90YWxIYW5kKGhhbmQpIHtcbiAgICBjb25zdCB0b3RhbFN1bSA9IGhhbmQucmVkdWNlKChhY2N1bXVsYXRvciwgb2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBvYmplY3QudmFsdWU7XG4gICAgfSwgMCk7XG4gICAgcmV0dXJuIHRvdGFsU3VtO1xuICB9XG5cbiAgY2hlY2tCbGFja2phY2soaGFuZCkge1xuICAgIGlmIChoYW5kIDwgMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwiYWxpdmVcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGhhbmQgPT09IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImJsYWNramFja1wiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoYW5kID4gMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwib3ZlclwiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU2NvcmVzKHRoaXMuZ2FtZVN0YXR1cyk7XG4gIH1cblxuICBkaXNwbGF5T3B0aW9uKCkge1xuICAgIGxldCBoaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhpdEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSElUXCI7XG4gICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGhpdEJ1dHRvbik7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJEaXNwbGF5KCkge1xuICAgIHRoaXMuZW1wdHlOb2RlKHBsYXllckNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwQ2FyZC5jbGFzc05hbWUgPSBcInBsYXllckNhcmRcIjtcbiAgICAgIHBDYXJkLmlubmVySFRNTCA9IGAke3RoaXMucGxheWVyLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocENhcmQpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhvdXNlRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShob3VzZUNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaENhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIGhDYXJkLmNsYXNzTmFtZSA9IFwiaG91c2VDYXJkXCI7XG4gICAgICBoQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLmhvdXNlLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBob3VzZUNvbnRhaW5lci5hcHBlbmRDaGlsZChoQ2FyZCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZUxhc3RIb3VzZUNhcmQoKTtcbiAgfVxuXG4gIGhpZGVMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZmlyc3RDYXJkLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuQ2FyZFwiKTtcbiAgfVxuXG4gIHNob3dMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhpZGRlbkNhcmRcIik7XG5cbiAgICBpZiAod3JhcHBlciAhPT0gbnVsbCkgZmlyc3RDYXJkLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xuICB9XG5cbiAgY29tcGFyZUZpbmFsU2NvcmUoKSB7XG4gICAgY29uc3QgaG91c2VTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMuaG91c2UuY3VycmVudENhcmRzKTtcbiAgICBjb25zdCBwbGF5ZXJTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcyk7XG5cbiAgICBpZiAoaG91c2VTY29yZSA8IDE3KSB7XG4gICAgICB0aGlzLmhvdXNlLmhpdCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgICAgdGhpcy5jb21wYXJlRmluYWxTY29yZSgpO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGxheWVyU2NvcmUgPiBob3VzZVNjb3JlICYmIHBsYXllclNjb3JlIDw9IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gWW91IFdpbiFgO1xuICAgICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA+IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gSG91c2UgV2luc2A7XG4gICAgICAgIHRoaXMubG9vc2VSb3VuZCgpO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA+IHBsYXllclNjb3JlICYmIGhvdXNlU2NvcmUgPiAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFBsYXllciBXaW5zIWA7XG4gICAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA9PT0gcGxheWVyU2NvcmUpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBJdHMgYSBUaWVgO1xuICAgICAgICB0aGlzLnRpZVJvdW5kKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVNjb3JlcyhzdGF0ZSkge1xuICAgIHBsYXllclNjb3JlLnRleHRDb250ZW50ID0gYFBsYXllciBTY29yZSA9ICR7dGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQoXG4gICAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNcbiAgICApfWA7XG4gICAgaWYgKHN0YXRlID09PSBcImFsaXZlXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBBcmUgeW91IGdvaW5nIHRvIEhpdCBvciBTdGFuZD9gO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiYmxhY2tqYWNrXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBCbGFja2phY2shYDtcbiAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcIm92ZXJcIikge1xuICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFdlbnQgdG9vIGhpZ2guLi4gR2FtZSBPdmVyYDtcbiAgICAgIHRoaXMubG9vc2VSb3VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVBsYXllckNyZWRpdHMoKSB7XG4gICAgcGxheWVyQ3JlZGl0cy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgQ3JlZGl0czogJHt0aGlzLnBsYXllci5jcmVkaXRzfWA7XG4gICAgY3VycmVudEJldC50ZXh0Q29udGVudCA9IGBDdXJyZW50IEJldDogJHt0aGlzLmN1cnJlbnRCZXR9YDtcbiAgfVxuXG4gIHBsYWNlQmV0KGFtb3VudCkge1xuICAgIGlmICh0aGlzLmlzQmV0UGxhY2VkICE9PSB0cnVlKSB7XG4gICAgICB0aGlzLmJldEFtb3VudCA9IGFtb3VudDtcbiAgICAgIHRoaXMucGxheWVyLmNyZWRpdHMgLT0gYW1vdW50O1xuICAgICAgdGhpcy5jdXJyZW50QmV0ICs9IGFtb3VudDtcbiAgICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuXG4gICAgICB0aGlzLmlzQmV0UGxhY2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB3aW5Sb3VuZCgpIHtcbiAgICB0aGlzLnBsYXllci5jcmVkaXRzICs9IHRoaXMuY3VycmVudEJldCAqIDI7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGxvb3NlUm91bmQoKSB7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHRpZVJvdW5kKCkge1xuICAgIHRoaXMucGxheWVyLmNyZWRpdHMgKz0gdGhpcy5jdXJyZW50QmV0O1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBlbXB0eU5vZGUocGFyZW50KSB7XG4gICAgd2hpbGUgKHBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICBwYXJlbnQuZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGNyZWRpdHMpIHtcbiAgICB0aGlzLmNyZWRpdHMgPSBjcmVkaXRzO1xuICAgIHRoaXMuY3VycmVudENhcmRzID0gW107XG4gIH1cblxuICBoaXQoY2FyZCkge1xuICAgIHRoaXMuY3VycmVudENhcmRzLnB1c2goY2FyZCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9HYW1lLmpzXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLXN0YXJ0XCIpO1xuY29uc3QgaGl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24taGl0XCIpO1xuY29uc3Qgc3RhbmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFuZFwiKTtcblxuY29uc3QgcGxhY2VCZXRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtb25lXCIpO1xuY29uc3QgcGxhY2VCZXRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdHdvXCIpO1xuY29uc3QgcGxhY2VCZXRUaHJlZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWJldC10aHJlZVwiKTtcblxuY29uc3QgYWxsQmV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmV0XCIpO1xuY29uc3QgYWxsTW92ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vdmVcIik7XG5cbmNvbnN0IHJlbW92ZUJldHNGb2N1cyA9ICgpID0+IHtcbiAgYWxsQmV0cy5mb3JFYWNoKChiZXQpID0+IGJldC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgYWRkQmV0c0ZvY3VzID0gKCkgPT4ge1xuICBhbGxCZXRzLmZvckVhY2goKGJldCkgPT4gYmV0LmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKSk7XG59O1xuXG5jb25zdCByZW1vdmVNb3Zlc0ZvY3VzID0gKCkgPT4ge1xuICBhbGxNb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiBtb3ZlLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1c1wiKSk7XG59O1xuXG5jb25zdCBhZGRNb3Zlc0ZvY3VzID0gKCkgPT4ge1xuICBhbGxNb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiBtb3ZlLmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKSk7XG59O1xuXG5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5pc0JldFBsYWNlZCA9PT0gdHJ1ZSkge1xuICAgIGdhbWUuaW5pdCgpO1xuICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1c1wiKTtcbiAgICBhZGRNb3Zlc0ZvY3VzKCk7XG4gIH1cbn0pO1xuXG5wbGFjZUJldE9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAxMDAwICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIGdhbWUucGxhY2VCZXQoMTAwMCk7XG4gICAgcmVtb3ZlQmV0c0ZvY3VzKCk7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImZvY3VzXCIpO1xuICB9XG59KTtcblxucGxhY2VCZXRUd28uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUucGxheWVyLmNyZWRpdHMgPj0gMjAwMCAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IHRydWUpIHtcbiAgICBnYW1lLnBsYWNlQmV0KDIwMDApO1xuICAgIHJlbW92ZUJldHNGb2N1cygpO1xuICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKTtcbiAgfVxufSk7XG5cbnBsYWNlQmV0VGhyZWUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUucGxheWVyLmNyZWRpdHMgPj0gMzAwMCAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IHRydWUpIHtcbiAgICBnYW1lLnBsYWNlQmV0KDMwMDApO1xuICAgIHJlbW92ZUJldHNGb2N1cygpO1xuICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKTtcbiAgfVxufSk7XG5cbmhpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5nYW1lT3ZlciAhPT0gdHJ1ZSAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IGZhbHNlKSB7XG4gICAgZ2FtZS5wbGF5ZXIuaGl0KGdhbWUuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICBnYW1lLnVwZGF0ZVBsYXllckRpc3BsYXkoKTtcbiAgICBnYW1lLmNoZWNrQmxhY2tqYWNrKGdhbWUuY2FsY3VsYXRlVG90YWxIYW5kKGdhbWUucGxheWVyLmN1cnJlbnRDYXJkcykpO1xuICB9XG5cbiAgaWYgKGdhbWUuZ2FtZU92ZXIgPT09IHRydWUgJiYgZ2FtZS5pc0JldFBsYWNlZCA9PT0gZmFsc2UpIHtcbiAgICByZW1vdmVNb3Zlc0ZvY3VzKCk7XG4gICAgYWRkQmV0c0ZvY3VzKCk7XG4gIH1cbn0pO1xuXG5zdGFuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5nYW1lT3ZlciAhPT0gdHJ1ZSAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IGZhbHNlKSB7XG4gICAgZ2FtZS5jb21wYXJlRmluYWxTY29yZSgpO1xuICB9XG5cbiAgaWYgKGdhbWUuZ2FtZU92ZXIgPT09IHRydWUgJiYgZ2FtZS5pc0JldFBsYWNlZCA9PT0gZmFsc2UpIHtcbiAgICByZW1vdmVNb3Zlc0ZvY3VzKCk7XG4gICAgYWRkQmV0c0ZvY3VzKCk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9