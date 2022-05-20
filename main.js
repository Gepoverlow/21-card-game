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
    this.currentBet = 0;

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
      } else if (playerScore > houseScore && playerScore > 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. Hous Wins`;
      } else if (houseScore > playerScore && houseScore <= 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. House Wins`;
      } else if (houseScore > playerScore && houseScore > 21) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. Player Wins!`;
      } else if (houseScore === playerScore) {
        gameState.textContent = `The house rolled ${houseScore} and you ${playerScore}. Its a Tie`;
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
    } else if (state === "over") {
      gameState.textContent = `Went too high... Game Over`;
    }
  }

  updatePlayerCredits() {
    playerCredits.textContent = `Player Credits: ${this.player.credits}`;
  }

  placeBet(amount) {
    this.betAmount = amount;
    this.player.credits -= amount;
    this.currentBet += amount;
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

const restartButton = document.getElementById("option-restart");
const hitButton = document.getElementById("option-hit");
const standButton = document.getElementById("option-stand");

const placeBetOne = document.getElementById("option-bet-one");
const placeBetTwo = document.getElementById("option-bet-two");
const placeBetThree = document.getElementById("option-bet-three");

restartButton.addEventListener("click", () => {
  game.init();
});

placeBetOne.addEventListener("click", () => {
  game.placeBet(1000);
  console.log(game.currentBet);
});

placeBetTwo.addEventListener("click", () => {
  game.placeBet(2000);
  console.log(game.currentBet);
});

placeBetThree.addEventListener("click", () => {
  game.placeBet(3000);
  console.log(game.currentBet);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGVBQWUsS0FBSyxZQUFZO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEZNO0FBQ0k7O0FBRTlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQiwrQ0FBTTtBQUM1QixxQkFBcUIsK0NBQU07QUFDM0I7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiw2Q0FBSTs7QUFFeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixxQ0FBcUM7QUFDekQ7QUFDQTtBQUNBLDJCQUEyQixvQ0FBb0M7QUFDL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0NBQW9DO0FBQ3hEO0FBQ0E7QUFDQSwyQkFBMkIsbUNBQW1DO0FBQzlEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLG9EQUFvRCxZQUFZLFVBQVUsWUFBWTtBQUN0RixRQUFRO0FBQ1Isb0RBQW9ELFlBQVksVUFBVSxZQUFZO0FBQ3RGLFFBQVE7QUFDUixvREFBb0QsWUFBWSxVQUFVLFlBQVk7QUFDdEYsUUFBUTtBQUNSLG9EQUFvRCxZQUFZLFVBQVUsWUFBWTtBQUN0RixRQUFRO0FBQ1Isb0RBQW9ELFlBQVksVUFBVSxZQUFZO0FBQ3RGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0EsbURBQW1ELG9CQUFvQjtBQUN2RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDektwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQzs7Ozs7OztVQ1h0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjZCOztBQUU3QixpQkFBaUIsZ0RBQUk7O0FBRXJCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvRGVjay5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvR2FtZS5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRGVjayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNodWZmbGVEZWNrKCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG5cbiAgICBjb25zdCB0eXBlcyA9IFtcIlNwYWRlc1wiLCBcIkhlYXJ0c1wiLCBcIkRpYW1vbmRzXCIsIFwiQ2x1YnNcIl07XG4gICAgY29uc3QgdmFsdWVzID0gW1xuICAgICAgXCJBY2VcIixcbiAgICAgIDIsXG4gICAgICAzLFxuICAgICAgNCxcbiAgICAgIDUsXG4gICAgICA2LFxuICAgICAgNyxcbiAgICAgIDgsXG4gICAgICA5LFxuICAgICAgMTAsXG4gICAgICBcIkphY2tcIixcbiAgICAgIG51bGwsXG4gICAgICBcIlF1ZWVuXCIsXG4gICAgICBcIktpbmdcIixcbiAgICBdO1xuICAgIGxldCBiYXNlQWx0ID0gMTI3MTM3O1xuXG4gICAgZm9yIChsZXQgdHlwZSBpbiB0eXBlcykge1xuICAgICAgZm9yIChsZXQgdmFsdWUgaW4gdmFsdWVzKSB7XG4gICAgICAgIC8vQmVjYXVzZSBvZiBpdGFsaWFuIGFuZCBzcGFuaXNoIFwiS25pZ2h0XCIgY2FyZCwgSSBoYWQgdG8gaW5jbHVkZSBhIG51bGwgZWxlbWVudCB3aXRoaW4gdGhlIHZhbHVlcyBhcnJheSB0byBza2lwIGl0IHdoZW4gbG9vcGluZyBvdmVyIGFuZCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IGJhc2VBbGUgdmFsdWVcbiAgICAgICAgaWYgKHZhbHVlc1t2YWx1ZV0gIT09IG51bGwpIHtcbiAgICAgICAgICBsZXQgY2FyZE5hbWUgPSBgJHt2YWx1ZXNbdmFsdWVdfSBvZiAke3R5cGVzW3R5cGVdfWA7XG4gICAgICAgICAgbGV0IGNhcmQgPSB0aGlzLmNhcmRUb09iamVjdChcbiAgICAgICAgICAgIGNhcmROYW1lLFxuICAgICAgICAgICAgdGhpcy5hc3NpZ25DYXJkVmFsdWUoY2FyZE5hbWUpLFxuICAgICAgICAgICAgYCYjJHtiYXNlQWx0fWBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZGVjay5wdXNoKGNhcmQpO1xuICAgICAgICB9XG4gICAgICAgIGJhc2VBbHQrKztcbiAgICAgIH1cbiAgICAgIGJhc2VBbHQgKz0gMjtcbiAgICB9XG4gIH1cblxuICBjYXJkVG9PYmplY3QobmFtZSwgdmFsdWUsIGFsdENvZGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGFsdENvZGU6IGFsdENvZGUsXG4gICAgfTtcbiAgfVxuXG4gIGFzc2lnbkNhcmRWYWx1ZShjYXJkKSB7XG4gICAgbGV0IHZhbHVlID0gL0phY2t8UXVlZW58S2luZy8udGVzdChjYXJkKTtcbiAgICBsZXQgc3BsaXRTdHJpbmcgPSBjYXJkLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAodmFsdWUgfHwgc3BsaXRTdHJpbmdbMF0gPT09IFwiMTBcIikge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0gZWxzZSBpZiAoc3BsaXRTdHJpbmdbMF0gPT09IFwiQWNlXCIpIHtcbiAgICAgIHJldHVybiAxMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE51bWJlcihzcGxpdFN0cmluZ1swXSk7XG4gICAgfVxuICB9XG5cbiAgc2h1ZmZsZURlY2soKSB7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVjaztcbiAgICBsZXQgbGVuZ3RoID0gZGVjay5sZW5ndGg7XG4gICAgbGV0IGk7XG5cbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoLS0pO1xuXG4gICAgICBbZGVja1tsZW5ndGhdLCBkZWNrW2ldXSA9IFtkZWNrW2ldLCBkZWNrW2xlbmd0aF1dO1xuICAgIH1cbiAgICByZXR1cm4gZGVjaztcbiAgfVxuXG4gIGRlYWxDYXJkKCkge1xuICAgIHJldHVybiB0aGlzLmRlY2sucG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVjaztcbiIsImltcG9ydCBEZWNrIGZyb20gXCIuL0RlY2tcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmNvbnN0IGhvdXNlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItaG91c2VcIik7XG5jb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXJcIik7XG5cbmNvbnN0IHBsYXllclNjb3JlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLXBsYXllci1zY29yZVwiKTtcbmNvbnN0IGdhbWVTdGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1nYW1lLXN0YXRlXCIpO1xuY29uc3QgcGxheWVyQ3JlZGl0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1wbGF5ZXItY3JlZGl0c1wiKTtcblxuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigxMDAwMCk7XG4gICAgdGhpcy5ob3VzZSA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRlY2sgPSBuZXcgRGVjaygpO1xuXG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzID0gW107XG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMgPSBbXTtcblxuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG5cbiAgICB0aGlzLmluaXRpYWxEZWFsKCk7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJEaXNwbGF5KCk7XG4gICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAvLyB0aGlzLnVwZGF0ZVNjb3JlcygpO1xuICAgIHRoaXMuY2hlY2tCbGFja2phY2sodGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQodGhpcy5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgfVxuXG4gIGluaXRpYWxEZWFsKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsSGFuZChoYW5kKSB7XG4gICAgY29uc3QgdG90YWxTdW0gPSBoYW5kLnJlZHVjZSgoYWNjdW11bGF0b3IsIG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgb2JqZWN0LnZhbHVlO1xuICAgIH0sIDApO1xuICAgIHJldHVybiB0b3RhbFN1bTtcbiAgfVxuXG4gIGNoZWNrQmxhY2tqYWNrKGhhbmQpIHtcbiAgICBpZiAoaGFuZCA8IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImFsaXZlXCI7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYW5kID09PSAyMSkge1xuICAgICAgdGhpcy5nYW1lU3RhdHVzID0gXCJibGFja2phY2tcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGFuZCA+IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcIm92ZXJcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVNjb3Jlcyh0aGlzLmdhbWVTdGF0dXMpO1xuICB9XG5cbiAgZGlzcGxheU9wdGlvbigpIHtcbiAgICBsZXQgaGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkhJVFwiO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXRCdXR0b24pO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShwbGF5ZXJDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgcENhcmQuY2xhc3NOYW1lID0gXCJwbGF5ZXJDYXJkXCI7XG4gICAgICBwQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBDYXJkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVIb3VzZURpc3BsYXkoKSB7XG4gICAgdGhpcy5lbXB0eU5vZGUoaG91c2VDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGhDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBoQ2FyZC5jbGFzc05hbWUgPSBcImhvdXNlQ2FyZFwiO1xuICAgICAgaENhcmQuaW5uZXJIVE1MID0gYCR7dGhpcy5ob3VzZS5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgaG91c2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaENhcmQpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVMYXN0SG91c2VDYXJkKCk7XG4gIH1cblxuICBoaWRlTGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZpcnN0Q2FyZC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlbkNhcmRcIik7XG4gIH1cblxuICBzaG93TGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaWRkZW5DYXJkXCIpO1xuXG4gICAgaWYgKHdyYXBwZXIgIT09IG51bGwpIGZpcnN0Q2FyZC5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgfVxuXG4gIGNvbXBhcmVGaW5hbFNjb3JlKCkge1xuICAgIGNvbnN0IGhvdXNlU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyk7XG4gICAgY29uc3QgcGxheWVyU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuXG4gICAgaWYgKGhvdXNlU2NvcmUgPCAxNykge1xuICAgICAgdGhpcy5ob3VzZS5oaXQodGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAgIHRoaXMuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFlvdSBXaW4hYDtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVyU2NvcmUgPiBob3VzZVNjb3JlICYmIHBsYXllclNjb3JlID4gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBIb3VzIFdpbnNgO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA+IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gUGxheWVyIFdpbnMhYDtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA9PT0gcGxheWVyU2NvcmUpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBJdHMgYSBUaWVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTY29yZXMoc3RhdGUpIHtcbiAgICBwbGF5ZXJTY29yZS50ZXh0Q29udGVudCA9IGBQbGF5ZXIgU2NvcmUgPSAke3RoaXMuY2FsY3VsYXRlVG90YWxIYW5kKFxuICAgICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzXG4gICAgKX1gO1xuICAgIGlmIChzdGF0ZSA9PT0gXCJhbGl2ZVwiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQXJlIHlvdSBnb2luZyB0byBIaXQgb3IgU3RhbmQ/YDtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcImJsYWNramFja1wiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgQmxhY2tqYWNrIWA7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJvdmVyXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBXZW50IHRvbyBoaWdoLi4uIEdhbWUgT3ZlcmA7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGxheWVyQ3JlZGl0cygpIHtcbiAgICBwbGF5ZXJDcmVkaXRzLnRleHRDb250ZW50ID0gYFBsYXllciBDcmVkaXRzOiAke3RoaXMucGxheWVyLmNyZWRpdHN9YDtcbiAgfVxuXG4gIHBsYWNlQmV0KGFtb3VudCkge1xuICAgIHRoaXMuYmV0QW1vdW50ID0gYW1vdW50O1xuICAgIHRoaXMucGxheWVyLmNyZWRpdHMgLT0gYW1vdW50O1xuICAgIHRoaXMuY3VycmVudEJldCArPSBhbW91bnQ7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gIH1cblxuICBlbXB0eU5vZGUocGFyZW50KSB7XG4gICAgd2hpbGUgKHBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICBwYXJlbnQuZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGNyZWRpdHMpIHtcbiAgICB0aGlzLmNyZWRpdHMgPSBjcmVkaXRzO1xuICAgIHRoaXMuY3VycmVudENhcmRzID0gW107XG4gIH1cblxuICBoaXQoY2FyZCkge1xuICAgIHRoaXMuY3VycmVudENhcmRzLnB1c2goY2FyZCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9HYW1lLmpzXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuXG5jb25zdCByZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tcmVzdGFydFwiKTtcbmNvbnN0IGhpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWhpdFwiKTtcbmNvbnN0IHN0YW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tc3RhbmRcIik7XG5cbmNvbnN0IHBsYWNlQmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LW9uZVwiKTtcbmNvbnN0IHBsYWNlQmV0VHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LXR3b1wiKTtcbmNvbnN0IHBsYWNlQmV0VGhyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdGhyZWVcIik7XG5cbnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZ2FtZS5pbml0KCk7XG59KTtcblxucGxhY2VCZXRPbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZ2FtZS5wbGFjZUJldCgxMDAwKTtcbiAgY29uc29sZS5sb2coZ2FtZS5jdXJyZW50QmV0KTtcbn0pO1xuXG5wbGFjZUJldFR3by5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBnYW1lLnBsYWNlQmV0KDIwMDApO1xuICBjb25zb2xlLmxvZyhnYW1lLmN1cnJlbnRCZXQpO1xufSk7XG5cbnBsYWNlQmV0VGhyZWUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZ2FtZS5wbGFjZUJldCgzMDAwKTtcbiAgY29uc29sZS5sb2coZ2FtZS5jdXJyZW50QmV0KTtcbn0pO1xuXG5oaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSBmYWxzZSkge1xuICAgIGdhbWUucGxheWVyLmhpdChnYW1lLmRlY2suZGVhbENhcmQoKSk7XG4gICAgZ2FtZS51cGRhdGVQbGF5ZXJEaXNwbGF5KCk7XG4gICAgZ2FtZS5jaGVja0JsYWNramFjayhnYW1lLmNhbGN1bGF0ZVRvdGFsSGFuZChnYW1lLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcbiAgfVxufSk7XG5cbnN0YW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLmdhbWVPdmVyICE9PSB0cnVlICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gZmFsc2UpIHtcbiAgICBnYW1lLmNvbXBhcmVGaW5hbFNjb3JlKCk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9