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
  console.log(`starting..... init is ${game.isInitialized}`);
  if (game.isBetPlaced === true) {
    game.init();
    startButton.classList.remove("focus");
    addMovesFocus();
  }
});

placeBetOne.addEventListener("click", () => {
  console.log(`betting..... init is ${game.isInitialized}`);
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

  if (game.gameOver === true && game.isInitialized === false) {
    removeMovesFocus();
    addBetsFocus();
  }
});

standButton.addEventListener("click", () => {
  console.log(`standing..... init is ${game.isInitialized}`);
  if (game.gameOver !== true && game.isInitialized !== false) {
    game.compareFinalScore();
  }

  if (game.gameOver === true && game.isInitialized !== true) {
    removeMovesFocus();
    addBetsFocus();
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUEsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7O1VDWHRCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNONkI7O0FBRTdCLGlCQUFpQixnREFBSTs7QUFFckI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVDQUF1QyxtQkFBbUI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxzQ0FBc0MsbUJBQW1CO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0EsdUNBQXVDLG1CQUFtQjtBQUMxRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0RlY2suanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5zaHVmZmxlRGVjaygpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbXCJTcGFkZXNcIiwgXCJIZWFydHNcIiwgXCJEaWFtb25kc1wiLCBcIkNsdWJzXCJdO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtcbiAgICAgIFwiQWNlXCIsXG4gICAgICAyLFxuICAgICAgMyxcbiAgICAgIDQsXG4gICAgICA1LFxuICAgICAgNixcbiAgICAgIDcsXG4gICAgICA4LFxuICAgICAgOSxcbiAgICAgIDEwLFxuICAgICAgXCJKYWNrXCIsXG4gICAgICBudWxsLFxuICAgICAgXCJRdWVlblwiLFxuICAgICAgXCJLaW5nXCIsXG4gICAgXTtcbiAgICBsZXQgYmFzZUFsdCA9IDEyNzEzNztcblxuICAgIGZvciAobGV0IHR5cGUgaW4gdHlwZXMpIHtcbiAgICAgIGZvciAobGV0IHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgICAvL0JlY2F1c2Ugb2YgaXRhbGlhbiBhbmQgc3BhbmlzaCBcIktuaWdodFwiIGNhcmQsIEkgaGFkIHRvIGluY2x1ZGUgYSBudWxsIGVsZW1lbnQgd2l0aGluIHRoZSB2YWx1ZXMgYXJyYXkgdG8gc2tpcCBpdCB3aGVuIGxvb3Bpbmcgb3ZlciBhbmQgZGlzcGxheWluZyB0aGUgY29ycmVjdCBiYXNlQWxlIHZhbHVlXG4gICAgICAgIGlmICh2YWx1ZXNbdmFsdWVdICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNhcmROYW1lID0gYCR7dmFsdWVzW3ZhbHVlXX0gb2YgJHt0eXBlc1t0eXBlXX1gO1xuICAgICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkVG9PYmplY3QoXG4gICAgICAgICAgICBjYXJkTmFtZSxcbiAgICAgICAgICAgIHRoaXMuYXNzaWduQ2FyZFZhbHVlKGNhcmROYW1lKSxcbiAgICAgICAgICAgIGAmIyR7YmFzZUFsdH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmRlY2sucHVzaChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBiYXNlQWx0Kys7XG4gICAgICB9XG4gICAgICBiYXNlQWx0ICs9IDI7XG4gICAgfVxuICB9XG5cbiAgY2FyZFRvT2JqZWN0KG5hbWUsIHZhbHVlLCBhbHRDb2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBhbHRDb2RlOiBhbHRDb2RlLFxuICAgIH07XG4gIH1cblxuICBhc3NpZ25DYXJkVmFsdWUoY2FyZCkge1xuICAgIGxldCB2YWx1ZSA9IC9KYWNrfFF1ZWVufEtpbmcvLnRlc3QoY2FyZCk7XG4gICAgbGV0IHNwbGl0U3RyaW5nID0gY2FyZC5zcGxpdChcIiBcIik7XG4gICAgaWYgKHZhbHVlIHx8IHNwbGl0U3RyaW5nWzBdID09PSBcIjEwXCIpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9IGVsc2UgaWYgKHNwbGl0U3RyaW5nWzBdID09PSBcIkFjZVwiKSB7XG4gICAgICByZXR1cm4gMTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOdW1iZXIoc3BsaXRTdHJpbmdbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHNodWZmbGVEZWNrKCkge1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2s7XG4gICAgbGV0IGxlbmd0aCA9IGRlY2subGVuZ3RoO1xuICAgIGxldCBpO1xuXG4gICAgd2hpbGUgKGxlbmd0aCkge1xuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbmd0aC0tKTtcblxuICAgICAgW2RlY2tbbGVuZ3RoXSwgZGVja1tpXV0gPSBbZGVja1tpXSwgZGVja1tsZW5ndGhdXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2s7XG4gIH1cblxuICBkZWFsQ2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNrLnBvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlY2s7XG4iLCJpbXBvcnQgRGVjayBmcm9tIFwiLi9EZWNrXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5jb25zdCBob3VzZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLWhvdXNlXCIpO1xuY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyXCIpO1xuXG5jb25zdCBwbGF5ZXJTY29yZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1wbGF5ZXItc2NvcmVcIik7XG5jb25zdCBnYW1lU3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZ2FtZS1zdGF0ZVwiKTtcbmNvbnN0IGN1cnJlbnRCZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZ2FtZS1jdXJyZW50LWJldFwiKTtcbmNvbnN0IHBsYXllckNyZWRpdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tcGxheWVyLWNyZWRpdHNcIik7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoMTAwMDApO1xuICAgIHRoaXMuaG91c2UgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5kZWNrID0gbmV3IERlY2soKTtcblxuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcyA9IFtdO1xuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzID0gW107XG5cbiAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAvLyB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICAgIHRoaXMuaXNCZXRQbGFjZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdGlhbERlYWwoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckRpc3BsYXkoKTtcbiAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgIC8vIHRoaXMudXBkYXRlU2NvcmVzKCk7XG4gICAgdGhpcy5jaGVja0JsYWNramFjayh0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcblxuICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuICB9XG5cbiAgaW5pdGlhbERlYWwoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcblxuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIHRoaXMuaG91c2UuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICB9XG5cbiAgY2FsY3VsYXRlVG90YWxIYW5kKGhhbmQpIHtcbiAgICBjb25zdCB0b3RhbFN1bSA9IGhhbmQucmVkdWNlKChhY2N1bXVsYXRvciwgb2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3IgKyBvYmplY3QudmFsdWU7XG4gICAgfSwgMCk7XG4gICAgcmV0dXJuIHRvdGFsU3VtO1xuICB9XG5cbiAgY2hlY2tCbGFja2phY2soaGFuZCkge1xuICAgIGlmIChoYW5kIDwgMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwiYWxpdmVcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGhhbmQgPT09IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImJsYWNramFja1wiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoYW5kID4gMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwib3ZlclwiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU2NvcmVzKHRoaXMuZ2FtZVN0YXR1cyk7XG4gIH1cblxuICBkaXNwbGF5T3B0aW9uKCkge1xuICAgIGxldCBoaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGhpdEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiSElUXCI7XG4gICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGhpdEJ1dHRvbik7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJEaXNwbGF5KCkge1xuICAgIHRoaXMuZW1wdHlOb2RlKHBsYXllckNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwQ2FyZC5jbGFzc05hbWUgPSBcInBsYXllckNhcmRcIjtcbiAgICAgIHBDYXJkLmlubmVySFRNTCA9IGAke3RoaXMucGxheWVyLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocENhcmQpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhvdXNlRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShob3VzZUNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaENhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIGhDYXJkLmNsYXNzTmFtZSA9IFwiaG91c2VDYXJkXCI7XG4gICAgICBoQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLmhvdXNlLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBob3VzZUNvbnRhaW5lci5hcHBlbmRDaGlsZChoQ2FyZCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZUxhc3RIb3VzZUNhcmQoKTtcbiAgfVxuXG4gIGhpZGVMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZmlyc3RDYXJkLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuQ2FyZFwiKTtcbiAgfVxuXG4gIHNob3dMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhpZGRlbkNhcmRcIik7XG5cbiAgICBpZiAod3JhcHBlciAhPT0gbnVsbCkgZmlyc3RDYXJkLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xuICB9XG5cbiAgY29tcGFyZUZpbmFsU2NvcmUoKSB7XG4gICAgY29uc3QgaG91c2VTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMuaG91c2UuY3VycmVudENhcmRzKTtcbiAgICBjb25zdCBwbGF5ZXJTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcyk7XG5cbiAgICBpZiAoaG91c2VTY29yZSA8IDE3KSB7XG4gICAgICB0aGlzLmhvdXNlLmhpdCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgICAgdGhpcy5jb21wYXJlRmluYWxTY29yZSgpO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGxheWVyU2NvcmUgPiBob3VzZVNjb3JlICYmIHBsYXllclNjb3JlIDw9IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gWW91IFdpbiFgO1xuICAgICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA+IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gSG91c2UgV2luc2A7XG4gICAgICAgIHRoaXMubG9vc2VSb3VuZCgpO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA+IHBsYXllclNjb3JlICYmIGhvdXNlU2NvcmUgPiAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFBsYXllciBXaW5zIWA7XG4gICAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA9PT0gcGxheWVyU2NvcmUpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBJdHMgYSBUaWVgO1xuICAgICAgICB0aGlzLnRpZVJvdW5kKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVNjb3JlcyhzdGF0ZSkge1xuICAgIHBsYXllclNjb3JlLnRleHRDb250ZW50ID0gYFBsYXllciBTY29yZSA9ICR7dGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQoXG4gICAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNcbiAgICApfWA7XG4gICAgaWYgKHN0YXRlID09PSBcImFsaXZlXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBBcmUgeW91IGdvaW5nIHRvIEhpdCBvciBTdGFuZD9gO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiYmxhY2tqYWNrXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBCbGFja2phY2shYDtcbiAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcIm92ZXJcIikge1xuICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFdlbnQgdG9vIGhpZ2guLi4gR2FtZSBPdmVyYDtcbiAgICAgIHRoaXMubG9vc2VSb3VuZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVBsYXllckNyZWRpdHMoKSB7XG4gICAgcGxheWVyQ3JlZGl0cy50ZXh0Q29udGVudCA9IGBQbGF5ZXIgQ3JlZGl0czogJHt0aGlzLnBsYXllci5jcmVkaXRzfWA7XG4gICAgY3VycmVudEJldC50ZXh0Q29udGVudCA9IGBDdXJyZW50IEJldDogJHt0aGlzLmN1cnJlbnRCZXR9YDtcbiAgfVxuXG4gIHBsYWNlQmV0KGFtb3VudCkge1xuICAgIGlmICh0aGlzLmlzQmV0UGxhY2VkICE9PSB0cnVlKSB7XG4gICAgICB0aGlzLmJldEFtb3VudCA9IGFtb3VudDtcbiAgICAgIHRoaXMucGxheWVyLmNyZWRpdHMgLT0gYW1vdW50O1xuICAgICAgdGhpcy5jdXJyZW50QmV0ICs9IGFtb3VudDtcbiAgICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuXG4gICAgICB0aGlzLmlzQmV0UGxhY2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICB3aW5Sb3VuZCgpIHtcbiAgICB0aGlzLnBsYXllci5jcmVkaXRzICs9IHRoaXMuY3VycmVudEJldCAqIDI7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGxvb3NlUm91bmQoKSB7XG4gICAgdGhpcy5jdXJyZW50QmV0ID0gMDtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHRpZVJvdW5kKCkge1xuICAgIHRoaXMucGxheWVyLmNyZWRpdHMgKz0gdGhpcy5jdXJyZW50QmV0O1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gIH1cblxuICBlbXB0eU5vZGUocGFyZW50KSB7XG4gICAgd2hpbGUgKHBhcmVudC5maXJzdENoaWxkKSB7XG4gICAgICBwYXJlbnQuZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKGNyZWRpdHMpIHtcbiAgICB0aGlzLmNyZWRpdHMgPSBjcmVkaXRzO1xuICAgIHRoaXMuY3VycmVudENhcmRzID0gW107XG4gIH1cblxuICBoaXQoY2FyZCkge1xuICAgIHRoaXMuY3VycmVudENhcmRzLnB1c2goY2FyZCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9HYW1lLmpzXCI7XG5cbmNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLXN0YXJ0XCIpO1xuY29uc3QgaGl0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24taGl0XCIpO1xuY29uc3Qgc3RhbmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFuZFwiKTtcblxuY29uc3QgcGxhY2VCZXRPbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtb25lXCIpO1xuY29uc3QgcGxhY2VCZXRUd28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdHdvXCIpO1xuY29uc3QgcGxhY2VCZXRUaHJlZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWJldC10aHJlZVwiKTtcblxuY29uc3QgYWxsQmV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmV0XCIpO1xuY29uc3QgYWxsTW92ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm1vdmVcIik7XG5cbmNvbnN0IHJlbW92ZUJldHNGb2N1cyA9ICgpID0+IHtcbiAgYWxsQmV0cy5mb3JFYWNoKChiZXQpID0+IGJldC5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgYWRkQmV0c0ZvY3VzID0gKCkgPT4ge1xuICBhbGxCZXRzLmZvckVhY2goKGJldCkgPT4gYmV0LmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKSk7XG59O1xuXG5jb25zdCByZW1vdmVNb3Zlc0ZvY3VzID0gKCkgPT4ge1xuICBhbGxNb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiBtb3ZlLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1c1wiKSk7XG59O1xuXG5jb25zdCBhZGRNb3Zlc0ZvY3VzID0gKCkgPT4ge1xuICBhbGxNb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiBtb3ZlLmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKSk7XG59O1xuXG5zdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhgc3RhcnRpbmcuLi4uLiBpbml0IGlzICR7Z2FtZS5pc0luaXRpYWxpemVkfWApO1xuICBpZiAoZ2FtZS5pc0JldFBsYWNlZCA9PT0gdHJ1ZSkge1xuICAgIGdhbWUuaW5pdCgpO1xuICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJmb2N1c1wiKTtcbiAgICBhZGRNb3Zlc0ZvY3VzKCk7XG4gIH1cbn0pO1xuXG5wbGFjZUJldE9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhgYmV0dGluZy4uLi4uIGluaXQgaXMgJHtnYW1lLmlzSW5pdGlhbGl6ZWR9YCk7XG4gIGlmIChnYW1lLnBsYXllci5jcmVkaXRzID49IDEwMDAgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSB0cnVlKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgxMDAwKTtcbiAgICByZW1vdmVCZXRzRm9jdXMoKTtcbiAgICBzdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIik7XG4gIH1cbn0pO1xuXG5wbGFjZUJldFR3by5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAyMDAwICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIGdhbWUucGxhY2VCZXQoMjAwMCk7XG4gICAgcmVtb3ZlQmV0c0ZvY3VzKCk7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImZvY3VzXCIpO1xuICB9XG59KTtcblxucGxhY2VCZXRUaHJlZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5wbGF5ZXIuY3JlZGl0cyA+PSAzMDAwICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIGdhbWUucGxhY2VCZXQoMzAwMCk7XG4gICAgcmVtb3ZlQmV0c0ZvY3VzKCk7XG4gICAgc3RhcnRCdXR0b24uY2xhc3NMaXN0LmFkZChcImZvY3VzXCIpO1xuICB9XG59KTtcblxuaGl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLmdhbWVPdmVyICE9PSB0cnVlICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gZmFsc2UpIHtcbiAgICBnYW1lLnBsYXllci5oaXQoZ2FtZS5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIGdhbWUudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIGdhbWUuY2hlY2tCbGFja2phY2soZ2FtZS5jYWxjdWxhdGVUb3RhbEhhbmQoZ2FtZS5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG4gIH1cblxuICBpZiAoZ2FtZS5nYW1lT3ZlciA9PT0gdHJ1ZSAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgcmVtb3ZlTW92ZXNGb2N1cygpO1xuICAgIGFkZEJldHNGb2N1cygpO1xuICB9XG59KTtcblxuc3RhbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgY29uc29sZS5sb2coYHN0YW5kaW5nLi4uLi4gaW5pdCBpcyAke2dhbWUuaXNJbml0aWFsaXplZH1gKTtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSBmYWxzZSkge1xuICAgIGdhbWUuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgfVxuXG4gIGlmIChnYW1lLmdhbWVPdmVyID09PSB0cnVlICYmIGdhbWUuaXNJbml0aWFsaXplZCAhPT0gdHJ1ZSkge1xuICAgIHJlbW92ZU1vdmVzRm9jdXMoKTtcbiAgICBhZGRCZXRzRm9jdXMoKTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=