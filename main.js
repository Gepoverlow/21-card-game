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
    // this.currentBet = 0;
    this.isBetPlaced = false;

    this.initialDeal();
    this.updatePlayerDisplay();
    this.updateHouseDisplay();
    // this.updateScores();
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
  }

  looseRound() {
    this.currentBet = 0;
    this.updatePlayerCredits();
  }

  tieRound() {
    this.player.credits += this.currentBet;
    this.currentBet = 0;
    this.updatePlayerCredits();
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

startButton.addEventListener("click", () => {
  if (game.isBetPlaced === true) {
    game.init();
  }
});

placeBetOne.addEventListener("click", () => {
  if (game.player.credits >= 1000) {
    game.placeBet(1000);
  }
});

placeBetTwo.addEventListener("click", () => {
  if (game.player.credits >= 2000) {
    game.placeBet(2000);
  }
});

placeBetThree.addEventListener("click", () => {
  if (game.player.credits >= 3000) {
    game.placeBet(3000);
  }
});

hitButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.player.hit(game.deck.dealCard());
    game.updatePlayerDisplay();
    game.checkBlackjack(game.calculateTotalHand(game.player.currentCards));
  }
});

standButton.addEventListener("click", () => {
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.compareFinalScore();
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZSxNQUFNLEVBQUM7Ozs7Ozs7VUNYdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ042Qjs7QUFFN0IsaUJBQWlCLGdEQUFJOztBQUVyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9EZWNrLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9HYW1lLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBEZWNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuc2h1ZmZsZURlY2soKTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcblxuICAgIGNvbnN0IHR5cGVzID0gW1wiU3BhZGVzXCIsIFwiSGVhcnRzXCIsIFwiRGlhbW9uZHNcIiwgXCJDbHVic1wiXTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXG4gICAgICBcIkFjZVwiLFxuICAgICAgMixcbiAgICAgIDMsXG4gICAgICA0LFxuICAgICAgNSxcbiAgICAgIDYsXG4gICAgICA3LFxuICAgICAgOCxcbiAgICAgIDksXG4gICAgICAxMCxcbiAgICAgIFwiSmFja1wiLFxuICAgICAgbnVsbCxcbiAgICAgIFwiUXVlZW5cIixcbiAgICAgIFwiS2luZ1wiLFxuICAgIF07XG4gICAgbGV0IGJhc2VBbHQgPSAxMjcxMzc7XG5cbiAgICBmb3IgKGxldCB0eXBlIGluIHR5cGVzKSB7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgLy9CZWNhdXNlIG9mIGl0YWxpYW4gYW5kIHNwYW5pc2ggXCJLbmlnaHRcIiBjYXJkLCBJIGhhZCB0byBpbmNsdWRlIGEgbnVsbCBlbGVtZW50IHdpdGhpbiB0aGUgdmFsdWVzIGFycmF5IHRvIHNraXAgaXQgd2hlbiBsb29waW5nIG92ZXIgYW5kIGRpc3BsYXlpbmcgdGhlIGNvcnJlY3QgYmFzZUFsZSB2YWx1ZVxuICAgICAgICBpZiAodmFsdWVzW3ZhbHVlXSAhPT0gbnVsbCkge1xuICAgICAgICAgIGxldCBjYXJkTmFtZSA9IGAke3ZhbHVlc1t2YWx1ZV19IG9mICR7dHlwZXNbdHlwZV19YDtcbiAgICAgICAgICBsZXQgY2FyZCA9IHRoaXMuY2FyZFRvT2JqZWN0KFxuICAgICAgICAgICAgY2FyZE5hbWUsXG4gICAgICAgICAgICB0aGlzLmFzc2lnbkNhcmRWYWx1ZShjYXJkTmFtZSksXG4gICAgICAgICAgICBgJiMke2Jhc2VBbHR9YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5kZWNrLnB1c2goY2FyZCk7XG4gICAgICAgIH1cbiAgICAgICAgYmFzZUFsdCsrO1xuICAgICAgfVxuICAgICAgYmFzZUFsdCArPSAyO1xuICAgIH1cbiAgfVxuXG4gIGNhcmRUb09iamVjdChuYW1lLCB2YWx1ZSwgYWx0Q29kZSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgYWx0Q29kZTogYWx0Q29kZSxcbiAgICB9O1xuICB9XG5cbiAgYXNzaWduQ2FyZFZhbHVlKGNhcmQpIHtcbiAgICBsZXQgdmFsdWUgPSAvSmFja3xRdWVlbnxLaW5nLy50ZXN0KGNhcmQpO1xuICAgIGxldCBzcGxpdFN0cmluZyA9IGNhcmQuc3BsaXQoXCIgXCIpO1xuICAgIGlmICh2YWx1ZSB8fCBzcGxpdFN0cmluZ1swXSA9PT0gXCIxMFwiKSB7XG4gICAgICByZXR1cm4gMTA7XG4gICAgfSBlbHNlIGlmIChzcGxpdFN0cmluZ1swXSA9PT0gXCJBY2VcIikge1xuICAgICAgcmV0dXJuIDExO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTnVtYmVyKHNwbGl0U3RyaW5nWzBdKTtcbiAgICB9XG4gIH1cblxuICBzaHVmZmxlRGVjaygpIHtcbiAgICBjb25zdCBkZWNrID0gdGhpcy5kZWNrO1xuICAgIGxldCBsZW5ndGggPSBkZWNrLmxlbmd0aDtcbiAgICBsZXQgaTtcblxuICAgIHdoaWxlIChsZW5ndGgpIHtcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsZW5ndGgtLSk7XG5cbiAgICAgIFtkZWNrW2xlbmd0aF0sIGRlY2tbaV1dID0gW2RlY2tbaV0sIGRlY2tbbGVuZ3RoXV07XG4gICAgfVxuICAgIHJldHVybiBkZWNrO1xuICB9XG5cbiAgZGVhbENhcmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVjay5wb3AoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWNrO1xuIiwiaW1wb3J0IERlY2sgZnJvbSBcIi4vRGVja1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXJcIjtcblxuY29uc3QgaG91c2VDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1ob3VzZVwiKTtcbmNvbnN0IHBsYXllckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLXBsYXllclwiKTtcblxuY29uc3QgcGxheWVyU2NvcmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tcGxheWVyLXNjb3JlXCIpO1xuY29uc3QgZ2FtZVN0YXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWdhbWUtc3RhdGVcIik7XG5jb25zdCBjdXJyZW50QmV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLWdhbWUtY3VycmVudC1iZXRcIik7XG5jb25zdCBwbGF5ZXJDcmVkaXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLXBsYXllci1jcmVkaXRzXCIpO1xuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKDEwMDAwKTtcbiAgICB0aGlzLmhvdXNlID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuZGVjayA9IG5ldyBEZWNrKCk7XG5cbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMgPSBbXTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyA9IFtdO1xuXG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgLy8gdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgICB0aGlzLmlzQmV0UGxhY2VkID0gZmFsc2U7XG5cbiAgICB0aGlzLmluaXRpYWxEZWFsKCk7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJEaXNwbGF5KCk7XG4gICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAvLyB0aGlzLnVwZGF0ZVNjb3JlcygpO1xuICAgIHRoaXMuY2hlY2tCbGFja2phY2sodGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQodGhpcy5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgfVxuXG4gIGluaXRpYWxEZWFsKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsSGFuZChoYW5kKSB7XG4gICAgY29uc3QgdG90YWxTdW0gPSBoYW5kLnJlZHVjZSgoYWNjdW11bGF0b3IsIG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgb2JqZWN0LnZhbHVlO1xuICAgIH0sIDApO1xuICAgIHJldHVybiB0b3RhbFN1bTtcbiAgfVxuXG4gIGNoZWNrQmxhY2tqYWNrKGhhbmQpIHtcbiAgICBpZiAoaGFuZCA8IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImFsaXZlXCI7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYW5kID09PSAyMSkge1xuICAgICAgdGhpcy5nYW1lU3RhdHVzID0gXCJibGFja2phY2tcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGFuZCA+IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcIm92ZXJcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVNjb3Jlcyh0aGlzLmdhbWVTdGF0dXMpO1xuICB9XG5cbiAgZGlzcGxheU9wdGlvbigpIHtcbiAgICBsZXQgaGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkhJVFwiO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXRCdXR0b24pO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShwbGF5ZXJDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgcENhcmQuY2xhc3NOYW1lID0gXCJwbGF5ZXJDYXJkXCI7XG4gICAgICBwQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBDYXJkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVIb3VzZURpc3BsYXkoKSB7XG4gICAgdGhpcy5lbXB0eU5vZGUoaG91c2VDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGhDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBoQ2FyZC5jbGFzc05hbWUgPSBcImhvdXNlQ2FyZFwiO1xuICAgICAgaENhcmQuaW5uZXJIVE1MID0gYCR7dGhpcy5ob3VzZS5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgaG91c2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaENhcmQpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVMYXN0SG91c2VDYXJkKCk7XG4gIH1cblxuICBoaWRlTGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZpcnN0Q2FyZC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlbkNhcmRcIik7XG4gIH1cblxuICBzaG93TGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaWRkZW5DYXJkXCIpO1xuXG4gICAgaWYgKHdyYXBwZXIgIT09IG51bGwpIGZpcnN0Q2FyZC5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgfVxuXG4gIGNvbXBhcmVGaW5hbFNjb3JlKCkge1xuICAgIGNvbnN0IGhvdXNlU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyk7XG4gICAgY29uc3QgcGxheWVyU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuXG4gICAgaWYgKGhvdXNlU2NvcmUgPCAxNykge1xuICAgICAgdGhpcy5ob3VzZS5oaXQodGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAgIHRoaXMuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFlvdSBXaW4hYDtcbiAgICAgICAgdGhpcy53aW5Sb3VuZCgpO1xuICAgICAgfSBlbHNlIGlmIChwbGF5ZXJTY29yZSA+IGhvdXNlU2NvcmUgJiYgcGxheWVyU2NvcmUgPiAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA+IHBsYXllclNjb3JlICYmIGhvdXNlU2NvcmUgPD0gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBIb3VzZSBXaW5zYDtcbiAgICAgICAgdGhpcy5sb29zZVJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXNlU2NvcmUgPiBwbGF5ZXJTY29yZSAmJiBob3VzZVNjb3JlID4gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBQbGF5ZXIgV2lucyFgO1xuICAgICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKGhvdXNlU2NvcmUgPT09IHBsYXllclNjb3JlKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gSXRzIGEgVGllYDtcbiAgICAgICAgdGhpcy50aWVSb3VuZCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTY29yZXMoc3RhdGUpIHtcbiAgICBwbGF5ZXJTY29yZS50ZXh0Q29udGVudCA9IGBQbGF5ZXIgU2NvcmUgPSAke3RoaXMuY2FsY3VsYXRlVG90YWxIYW5kKFxuICAgICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzXG4gICAgKX1gO1xuICAgIGlmIChzdGF0ZSA9PT0gXCJhbGl2ZVwiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQXJlIHlvdSBnb2luZyB0byBIaXQgb3IgU3RhbmQ/YDtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcImJsYWNramFja1wiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQmxhY2tqYWNrIWA7XG4gICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJvdmVyXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBXZW50IHRvbyBoaWdoLi4uIEdhbWUgT3ZlcmA7XG4gICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJDcmVkaXRzKCkge1xuICAgIHBsYXllckNyZWRpdHMudGV4dENvbnRlbnQgPSBgUGxheWVyIENyZWRpdHM6ICR7dGhpcy5wbGF5ZXIuY3JlZGl0c31gO1xuICAgIGN1cnJlbnRCZXQudGV4dENvbnRlbnQgPSBgQ3VycmVudCBCZXQ6ICR7dGhpcy5jdXJyZW50QmV0fWA7XG4gIH1cblxuICBwbGFjZUJldChhbW91bnQpIHtcbiAgICBpZiAodGhpcy5pc0JldFBsYWNlZCAhPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5iZXRBbW91bnQgPSBhbW91bnQ7XG4gICAgICB0aGlzLnBsYXllci5jcmVkaXRzIC09IGFtb3VudDtcbiAgICAgIHRoaXMuY3VycmVudEJldCArPSBhbW91bnQ7XG4gICAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcblxuICAgICAgdGhpcy5pc0JldFBsYWNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgd2luUm91bmQoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3JlZGl0cyArPSB0aGlzLmN1cnJlbnRCZXQgKiAyO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gIH1cblxuICBsb29zZVJvdW5kKCkge1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gIH1cblxuICB0aWVSb3VuZCgpIHtcbiAgICB0aGlzLnBsYXllci5jcmVkaXRzICs9IHRoaXMuY3VycmVudEJldDtcbiAgICB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuICB9XG5cbiAgZW1wdHlOb2RlKHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihjcmVkaXRzKSB7XG4gICAgdGhpcy5jcmVkaXRzID0gY3JlZGl0cztcbiAgICB0aGlzLmN1cnJlbnRDYXJkcyA9IFtdO1xuICB9XG5cbiAgaGl0KGNhcmQpIHtcbiAgICB0aGlzLmN1cnJlbnRDYXJkcy5wdXNoKGNhcmQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZS5qc1wiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcblxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFydFwiKTtcbmNvbnN0IGhpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWhpdFwiKTtcbmNvbnN0IHN0YW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tc3RhbmRcIik7XG5cbmNvbnN0IHBsYWNlQmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LW9uZVwiKTtcbmNvbnN0IHBsYWNlQmV0VHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LXR3b1wiKTtcbmNvbnN0IHBsYWNlQmV0VGhyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdGhyZWVcIik7XG5cbnN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLmlzQmV0UGxhY2VkID09PSB0cnVlKSB7XG4gICAgZ2FtZS5pbml0KCk7XG4gIH1cbn0pO1xuXG5wbGFjZUJldE9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAxMDAwKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgxMDAwKTtcbiAgfVxufSk7XG5cbnBsYWNlQmV0VHdvLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLnBsYXllci5jcmVkaXRzID49IDIwMDApIHtcbiAgICBnYW1lLnBsYWNlQmV0KDIwMDApO1xuICB9XG59KTtcblxucGxhY2VCZXRUaHJlZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAzMDAwKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgzMDAwKTtcbiAgfVxufSk7XG5cbmhpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5nYW1lT3ZlciAhPT0gdHJ1ZSAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IGZhbHNlKSB7XG4gICAgZ2FtZS5wbGF5ZXIuaGl0KGdhbWUuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICBnYW1lLnVwZGF0ZVBsYXllckRpc3BsYXkoKTtcbiAgICBnYW1lLmNoZWNrQmxhY2tqYWNrKGdhbWUuY2FsY3VsYXRlVG90YWxIYW5kKGdhbWUucGxheWVyLmN1cnJlbnRDYXJkcykpO1xuICB9XG59KTtcblxuc3RhbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSBmYWxzZSkge1xuICAgIGdhbWUuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=