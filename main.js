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
      gameState.textContent = `Went too high... House Wins`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7VUNYdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ042Qjs7QUFFN0IsaUJBQWlCLGdEQUFJOztBQUVyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvRGVjay5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvR2FtZS5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRGVjayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNodWZmbGVEZWNrKCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG5cbiAgICBjb25zdCB0eXBlcyA9IFtcIlNwYWRlc1wiLCBcIkhlYXJ0c1wiLCBcIkRpYW1vbmRzXCIsIFwiQ2x1YnNcIl07XG4gICAgY29uc3QgdmFsdWVzID0gW1xuICAgICAgXCJBY2VcIixcbiAgICAgIDIsXG4gICAgICAzLFxuICAgICAgNCxcbiAgICAgIDUsXG4gICAgICA2LFxuICAgICAgNyxcbiAgICAgIDgsXG4gICAgICA5LFxuICAgICAgMTAsXG4gICAgICBcIkphY2tcIixcbiAgICAgIG51bGwsXG4gICAgICBcIlF1ZWVuXCIsXG4gICAgICBcIktpbmdcIixcbiAgICBdO1xuICAgIGxldCBiYXNlQWx0ID0gMTI3MTM3O1xuXG4gICAgZm9yIChsZXQgdHlwZSBpbiB0eXBlcykge1xuICAgICAgZm9yIChsZXQgdmFsdWUgaW4gdmFsdWVzKSB7XG4gICAgICAgIC8vQmVjYXVzZSBvZiBpdGFsaWFuIGFuZCBzcGFuaXNoIFwiS25pZ2h0XCIgY2FyZCwgSSBoYWQgdG8gaW5jbHVkZSBhIG51bGwgZWxlbWVudCB3aXRoaW4gdGhlIHZhbHVlcyBhcnJheSB0byBza2lwIGl0IHdoZW4gbG9vcGluZyBvdmVyIGFuZCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IGJhc2VBbGUgdmFsdWVcbiAgICAgICAgaWYgKHZhbHVlc1t2YWx1ZV0gIT09IG51bGwpIHtcbiAgICAgICAgICBsZXQgY2FyZE5hbWUgPSBgJHt2YWx1ZXNbdmFsdWVdfSBvZiAke3R5cGVzW3R5cGVdfWA7XG4gICAgICAgICAgbGV0IGNhcmQgPSB0aGlzLmNhcmRUb09iamVjdChcbiAgICAgICAgICAgIGNhcmROYW1lLFxuICAgICAgICAgICAgdGhpcy5hc3NpZ25DYXJkVmFsdWUoY2FyZE5hbWUpLFxuICAgICAgICAgICAgYCYjJHtiYXNlQWx0fWBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZGVjay5wdXNoKGNhcmQpO1xuICAgICAgICB9XG4gICAgICAgIGJhc2VBbHQrKztcbiAgICAgIH1cbiAgICAgIGJhc2VBbHQgKz0gMjtcbiAgICB9XG4gIH1cblxuICBjYXJkVG9PYmplY3QobmFtZSwgdmFsdWUsIGFsdENvZGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGFsdENvZGU6IGFsdENvZGUsXG4gICAgfTtcbiAgfVxuXG4gIGFzc2lnbkNhcmRWYWx1ZShjYXJkKSB7XG4gICAgbGV0IHZhbHVlID0gL0phY2t8UXVlZW58S2luZy8udGVzdChjYXJkKTtcbiAgICBsZXQgc3BsaXRTdHJpbmcgPSBjYXJkLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAodmFsdWUgfHwgc3BsaXRTdHJpbmdbMF0gPT09IFwiMTBcIikge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0gZWxzZSBpZiAoc3BsaXRTdHJpbmdbMF0gPT09IFwiQWNlXCIpIHtcbiAgICAgIHJldHVybiAxMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE51bWJlcihzcGxpdFN0cmluZ1swXSk7XG4gICAgfVxuICB9XG5cbiAgc2h1ZmZsZURlY2soKSB7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVjaztcbiAgICBsZXQgbGVuZ3RoID0gZGVjay5sZW5ndGg7XG4gICAgbGV0IGk7XG5cbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoLS0pO1xuXG4gICAgICBbZGVja1tsZW5ndGhdLCBkZWNrW2ldXSA9IFtkZWNrW2ldLCBkZWNrW2xlbmd0aF1dO1xuICAgIH1cbiAgICByZXR1cm4gZGVjaztcbiAgfVxuXG4gIGRlYWxDYXJkKCkge1xuICAgIHJldHVybiB0aGlzLmRlY2sucG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVjaztcbiIsImltcG9ydCBEZWNrIGZyb20gXCIuL0RlY2tcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmNvbnN0IGhvdXNlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItaG91c2VcIik7XG5jb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXJcIik7XG5cbmNvbnN0IHBsYXllclNjb3JlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvLXBsYXllci1zY29yZVwiKTtcbmNvbnN0IGdhbWVTdGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1nYW1lLXN0YXRlXCIpO1xuY29uc3QgY3VycmVudEJldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1nYW1lLWN1cnJlbnQtYmV0XCIpO1xuY29uc3QgcGxheWVyQ3JlZGl0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1wbGF5ZXItY3JlZGl0c1wiKTtcblxuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigxMDAwMCk7XG4gICAgdGhpcy5ob3VzZSA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRlY2sgPSBuZXcgRGVjaygpO1xuXG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzID0gW107XG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMgPSBbXTtcblxuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNCZXRQbGFjZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdGlhbERlYWwoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckRpc3BsYXkoKTtcbiAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgIHRoaXMuY2hlY2tCbGFja2phY2sodGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQodGhpcy5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG5cbiAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcbiAgfVxuXG4gIGluaXRpYWxEZWFsKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsSGFuZChoYW5kKSB7XG4gICAgbGV0IHRvdGFsU3VtID0gaGFuZC5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBvYmplY3QpID0+IHtcbiAgICAgIGxldCBjdXJyZW50ID0gYWNjdW11bGF0b3IgKyBvYmplY3QudmFsdWU7XG5cbiAgICAgIHJldHVybiBjdXJyZW50O1xuICAgIH0sIDApO1xuICAgIGlmICh0aGlzLmFjZXNJblBsYXkoaGFuZCkgPiAwICYmIHRvdGFsU3VtID4gMjEpIHtcbiAgICAgIHRvdGFsU3VtIC09IDEwO1xuICAgIH1cbiAgICByZXR1cm4gdG90YWxTdW07XG4gIH1cblxuICBhY2VzSW5QbGF5KGhhbmQpIHtcbiAgICBjb25zdCBhY2VzUGxheWluZyA9IGhhbmQuZmlsdGVyKChjYXJkKSA9PiBjYXJkLm5hbWVbMF0gPT09IFwiQVwiKTtcbiAgICByZXR1cm4gYWNlc1BsYXlpbmcubGVuZ3RoO1xuICB9XG5cbiAgY2hlY2tCbGFja2phY2soaGFuZCkge1xuICAgIGlmIChoYW5kIDwgMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwiYWxpdmVcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGhhbmQgPT09IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImJsYWNramFja1wiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoYW5kID4gMjEpIHtcbiAgICAgIHRoaXMuZ2FtZVN0YXR1cyA9IFwib3ZlclwiO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU2NvcmVzKHRoaXMuZ2FtZVN0YXR1cyk7XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJEaXNwbGF5KCkge1xuICAgIHRoaXMuZW1wdHlOb2RlKHBsYXllckNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwQ2FyZC5jbGFzc05hbWUgPSBcInBsYXllckNhcmRcIjtcbiAgICAgIHBDYXJkLmlubmVySFRNTCA9IGAke3RoaXMucGxheWVyLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQocENhcmQpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhvdXNlRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShob3VzZUNvbnRhaW5lcik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaENhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIGhDYXJkLmNsYXNzTmFtZSA9IFwiaG91c2VDYXJkXCI7XG4gICAgICBoQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLmhvdXNlLmN1cnJlbnRDYXJkc1tpXS5hbHRDb2RlfWA7XG4gICAgICBob3VzZUNvbnRhaW5lci5hcHBlbmRDaGlsZChoQ2FyZCk7XG4gICAgfVxuICAgIHRoaXMuaGlkZUxhc3RIb3VzZUNhcmQoKTtcbiAgfVxuXG4gIGhpZGVMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZmlyc3RDYXJkLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuQ2FyZFwiKTtcbiAgfVxuXG4gIHNob3dMYXN0SG91c2VDYXJkKCkge1xuICAgIGNvbnN0IGFsbEhvdXNlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvdXNlQ2FyZFwiKTtcbiAgICBjb25zdCBmaXJzdENhcmQgPSBhbGxIb3VzZUNhcmRzWzBdO1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmhpZGRlbkNhcmRcIik7XG5cbiAgICBpZiAod3JhcHBlciAhPT0gbnVsbCkgZmlyc3RDYXJkLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xuICB9XG5cbiAgY29tcGFyZUZpbmFsU2NvcmUoKSB7XG4gICAgY29uc3QgaG91c2VTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMuaG91c2UuY3VycmVudENhcmRzKTtcbiAgICBjb25zdCBwbGF5ZXJTY29yZSA9IHRoaXMuY2FsY3VsYXRlVG90YWxIYW5kKHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcyk7XG5cbiAgICBpZiAoaG91c2VTY29yZSA8IDE3KSB7XG4gICAgICB0aGlzLmhvdXNlLmhpdCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgICAgdGhpcy5jb21wYXJlRmluYWxTY29yZSgpO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGxheWVyU2NvcmUgPiBob3VzZVNjb3JlICYmIHBsYXllclNjb3JlIDw9IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gWW91IFdpbiFgO1xuICAgICAgICB0aGlzLndpblJvdW5kKCk7XG4gICAgICB9IGVsc2UgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA+IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gSG91c2UgV2luc2A7XG4gICAgICAgIHRoaXMubG9vc2VSb3VuZCgpO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA+IHBsYXllclNjb3JlICYmIGhvdXNlU2NvcmUgPiAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFBsYXllciBXaW5zIWA7XG4gICAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA9PT0gcGxheWVyU2NvcmUpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBJdHMgYSBUaWVgO1xuICAgICAgICB0aGlzLnRpZVJvdW5kKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgdGhpcy5zaG93TGFzdEhvdXNlQ2FyZCgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVNjb3JlcyhzdGF0ZSkge1xuICAgIHBsYXllclNjb3JlLnRleHRDb250ZW50ID0gYFBsYXllciBTY29yZSA9ICR7dGhpcy5jYWxjdWxhdGVUb3RhbEhhbmQoXG4gICAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNcbiAgICApfWA7XG4gICAgaWYgKHN0YXRlID09PSBcImFsaXZlXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBBcmUgeW91IGdvaW5nIHRvIEhpdCBvciBTdGFuZD9gO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiYmxhY2tqYWNrXCIpIHtcbiAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBCbGFja2phY2shYDtcbiAgICAgIHRoaXMud2luUm91bmQoKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcIm92ZXJcIikge1xuICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFdlbnQgdG9vIGhpZ2guLi4gSG91c2UgV2luc2A7XG4gICAgICB0aGlzLmxvb3NlUm91bmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVQbGF5ZXJDcmVkaXRzKCkge1xuICAgIHBsYXllckNyZWRpdHMudGV4dENvbnRlbnQgPSBgUGxheWVyIENyZWRpdHM6ICR7dGhpcy5wbGF5ZXIuY3JlZGl0c31gO1xuICAgIGN1cnJlbnRCZXQudGV4dENvbnRlbnQgPSBgQ3VycmVudCBCZXQ6ICR7dGhpcy5jdXJyZW50QmV0fWA7XG4gIH1cblxuICBwbGFjZUJldChhbW91bnQpIHtcbiAgICBpZiAodGhpcy5pc0JldFBsYWNlZCAhPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5iZXRBbW91bnQgPSBhbW91bnQ7XG4gICAgICB0aGlzLnBsYXllci5jcmVkaXRzIC09IGFtb3VudDtcbiAgICAgIHRoaXMuY3VycmVudEJldCArPSBhbW91bnQ7XG4gICAgICB0aGlzLnVwZGF0ZVBsYXllckNyZWRpdHMoKTtcblxuICAgICAgdGhpcy5pc0JldFBsYWNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgd2luUm91bmQoKSB7XG4gICAgdGhpcy5wbGF5ZXIuY3JlZGl0cyArPSB0aGlzLmN1cnJlbnRCZXQgKiAyO1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICBsb29zZVJvdW5kKCkge1xuICAgIHRoaXMuY3VycmVudEJldCA9IDA7XG4gICAgdGhpcy51cGRhdGVQbGF5ZXJDcmVkaXRzKCk7XG4gICAgdGhpcy5pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gIH1cblxuICB0aWVSb3VuZCgpIHtcbiAgICB0aGlzLnBsYXllci5jcmVkaXRzICs9IHRoaXMuY3VycmVudEJldDtcbiAgICB0aGlzLmN1cnJlbnRCZXQgPSAwO1xuICAgIHRoaXMudXBkYXRlUGxheWVyQ3JlZGl0cygpO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgZW1wdHlOb2RlKHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihjcmVkaXRzKSB7XG4gICAgdGhpcy5jcmVkaXRzID0gY3JlZGl0cztcbiAgICB0aGlzLmN1cnJlbnRDYXJkcyA9IFtdO1xuICB9XG5cbiAgaGl0KGNhcmQpIHtcbiAgICB0aGlzLmN1cnJlbnRDYXJkcy5wdXNoKGNhcmQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZS5qc1wiO1xuXG5jb25zdCBnYW1lID0gbmV3IEdhbWUoKTtcblxuY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFydFwiKTtcbmNvbnN0IGhpdEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uLWhpdFwiKTtcbmNvbnN0IHN0YW5kQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tc3RhbmRcIik7XG5cbmNvbnN0IHBsYWNlQmV0T25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LW9uZVwiKTtcbmNvbnN0IHBsYWNlQmV0VHdvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tYmV0LXR3b1wiKTtcbmNvbnN0IHBsYWNlQmV0VGhyZWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1iZXQtdGhyZWVcIik7XG5cbmNvbnN0IGFsbEJldHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJldFwiKTtcbmNvbnN0IGFsbE1vdmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb3ZlXCIpO1xuXG5jb25zdCByZW1vdmVCZXRzRm9jdXMgPSAoKSA9PiB7XG4gIGFsbEJldHMuZm9yRWFjaCgoYmV0KSA9PiBiZXQuY2xhc3NMaXN0LnJlbW92ZShcImZvY3VzXCIpKTtcbn07XG5cbmNvbnN0IGFkZEJldHNGb2N1cyA9ICgpID0+IHtcbiAgYWxsQmV0cy5mb3JFYWNoKChiZXQpID0+IGJldC5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgcmVtb3ZlTW92ZXNGb2N1cyA9ICgpID0+IHtcbiAgYWxsTW92ZXMuZm9yRWFjaCgobW92ZSkgPT4gbW92ZS5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNcIikpO1xufTtcblxuY29uc3QgYWRkTW92ZXNGb2N1cyA9ICgpID0+IHtcbiAgYWxsTW92ZXMuZm9yRWFjaCgobW92ZSkgPT4gbW92ZS5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIikpO1xufTtcblxuc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuaXNCZXRQbGFjZWQgPT09IHRydWUpIHtcbiAgICBnYW1lLmluaXQoKTtcbiAgICBzdGFydEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiZm9jdXNcIik7XG4gICAgYWRkTW92ZXNGb2N1cygpO1xuICB9XG59KTtcblxucGxhY2VCZXRPbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUucGxheWVyLmNyZWRpdHMgPj0gMTAwMCAmJiBnYW1lLmlzSW5pdGlhbGl6ZWQgIT09IHRydWUpIHtcbiAgICBnYW1lLnBsYWNlQmV0KDEwMDApO1xuICAgIHJlbW92ZUJldHNGb2N1cygpO1xuICAgIHN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJmb2N1c1wiKTtcbiAgfVxufSk7XG5cbnBsYWNlQmV0VHdvLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLnBsYXllci5jcmVkaXRzID49IDIwMDAgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSB0cnVlKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgyMDAwKTtcbiAgICByZW1vdmVCZXRzRm9jdXMoKTtcbiAgICBzdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIik7XG4gIH1cbn0pO1xuXG5wbGFjZUJldFRocmVlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIGlmIChnYW1lLnBsYXllci5jcmVkaXRzID49IDMwMDAgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSB0cnVlKSB7XG4gICAgZ2FtZS5wbGFjZUJldCgzMDAwKTtcbiAgICByZW1vdmVCZXRzRm9jdXMoKTtcbiAgICBzdGFydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZm9jdXNcIik7XG4gIH1cbn0pO1xuXG5oaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSBmYWxzZSkge1xuICAgIGdhbWUucGxheWVyLmhpdChnYW1lLmRlY2suZGVhbENhcmQoKSk7XG4gICAgZ2FtZS51cGRhdGVQbGF5ZXJEaXNwbGF5KCk7XG4gICAgZ2FtZS5jaGVja0JsYWNramFjayhnYW1lLmNhbGN1bGF0ZVRvdGFsSGFuZChnYW1lLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcbiAgfVxuXG4gIGlmIChnYW1lLmdhbWVPdmVyID09PSB0cnVlICYmIGdhbWUuaXNCZXRQbGFjZWQgPT09IGZhbHNlKSB7XG4gICAgcmVtb3ZlTW92ZXNGb2N1cygpO1xuICAgIGFkZEJldHNGb2N1cygpO1xuICB9XG59KTtcblxuc3RhbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUgJiYgZ2FtZS5pc0luaXRpYWxpemVkICE9PSBmYWxzZSkge1xuICAgIGdhbWUuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgfVxuXG4gIGlmIChnYW1lLmdhbWVPdmVyID09PSB0cnVlICYmIGdhbWUuaXNCZXRQbGFjZWQgPT09IGZhbHNlKSB7XG4gICAgcmVtb3ZlTW92ZXNGb2N1cygpO1xuICAgIGFkZEJldHNGb2N1cygpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==