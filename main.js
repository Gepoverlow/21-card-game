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

class Game {
  constructor() {}

  init() {
    this.deck = new _Deck__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.house = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]();

    this.gameOver = false;

    this.initialDeal();
    this.updatePlayerDisplay();
    this.updateHouseDisplay();
    // this.updateScores();
    this.checkBlackjack(this.calculateTotalHand(this.player.currentCards));
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
    console.log(state);
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
  constructor() {
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


let game = new _Game_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
game.init();

let restartButton = document.getElementById("option-restart");
let hitButton = document.getElementById("option-hit");
let standButton = document.getElementById("option-stand");

restartButton.addEventListener("click", () => {
  game.init();
});

hitButton.addEventListener("click", () => {
  if (game.gameOver !== true) {
    game.player.hit(game.deck.dealCard());
    game.updatePlayerDisplay();
    game.checkBlackjack(game.calculateTotalHand(game.player.currentCards));
  }
});

standButton.addEventListener("click", () => {
  if (game.gameOver !== true) {
    game.compareFinalScore();
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7QUNONkI7O0FBRTdCLGVBQWUsZ0RBQUk7QUFDbkI7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0RlY2suanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5zaHVmZmxlRGVjaygpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbXCJTcGFkZXNcIiwgXCJIZWFydHNcIiwgXCJEaWFtb25kc1wiLCBcIkNsdWJzXCJdO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtcbiAgICAgIFwiQWNlXCIsXG4gICAgICAyLFxuICAgICAgMyxcbiAgICAgIDQsXG4gICAgICA1LFxuICAgICAgNixcbiAgICAgIDcsXG4gICAgICA4LFxuICAgICAgOSxcbiAgICAgIDEwLFxuICAgICAgXCJKYWNrXCIsXG4gICAgICBudWxsLFxuICAgICAgXCJRdWVlblwiLFxuICAgICAgXCJLaW5nXCIsXG4gICAgXTtcbiAgICBsZXQgYmFzZUFsdCA9IDEyNzEzNztcblxuICAgIGZvciAobGV0IHR5cGUgaW4gdHlwZXMpIHtcbiAgICAgIGZvciAobGV0IHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgICAvL0JlY2F1c2Ugb2YgaXRhbGlhbiBhbmQgc3BhbmlzaCBcIktuaWdodFwiIGNhcmQsIEkgaGFkIHRvIGluY2x1ZGUgYSBudWxsIGVsZW1lbnQgd2l0aGluIHRoZSB2YWx1ZXMgYXJyYXkgdG8gc2tpcCBpdCB3aGVuIGxvb3Bpbmcgb3ZlciBhbmQgZGlzcGxheWluZyB0aGUgY29ycmVjdCBiYXNlQWxlIHZhbHVlXG4gICAgICAgIGlmICh2YWx1ZXNbdmFsdWVdICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNhcmROYW1lID0gYCR7dmFsdWVzW3ZhbHVlXX0gb2YgJHt0eXBlc1t0eXBlXX1gO1xuICAgICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkVG9PYmplY3QoXG4gICAgICAgICAgICBjYXJkTmFtZSxcbiAgICAgICAgICAgIHRoaXMuYXNzaWduQ2FyZFZhbHVlKGNhcmROYW1lKSxcbiAgICAgICAgICAgIGAmIyR7YmFzZUFsdH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmRlY2sucHVzaChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBiYXNlQWx0Kys7XG4gICAgICB9XG4gICAgICBiYXNlQWx0ICs9IDI7XG4gICAgfVxuICB9XG5cbiAgY2FyZFRvT2JqZWN0KG5hbWUsIHZhbHVlLCBhbHRDb2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBhbHRDb2RlOiBhbHRDb2RlLFxuICAgIH07XG4gIH1cblxuICBhc3NpZ25DYXJkVmFsdWUoY2FyZCkge1xuICAgIGxldCB2YWx1ZSA9IC9KYWNrfFF1ZWVufEtpbmcvLnRlc3QoY2FyZCk7XG4gICAgbGV0IHNwbGl0U3RyaW5nID0gY2FyZC5zcGxpdChcIiBcIik7XG4gICAgaWYgKHZhbHVlIHx8IHNwbGl0U3RyaW5nWzBdID09PSBcIjEwXCIpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9IGVsc2UgaWYgKHNwbGl0U3RyaW5nWzBdID09PSBcIkFjZVwiKSB7XG4gICAgICByZXR1cm4gMTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOdW1iZXIoc3BsaXRTdHJpbmdbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHNodWZmbGVEZWNrKCkge1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2s7XG4gICAgbGV0IGxlbmd0aCA9IGRlY2subGVuZ3RoO1xuICAgIGxldCBpO1xuXG4gICAgd2hpbGUgKGxlbmd0aCkge1xuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbmd0aC0tKTtcblxuICAgICAgW2RlY2tbbGVuZ3RoXSwgZGVja1tpXV0gPSBbZGVja1tpXSwgZGVja1tsZW5ndGhdXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2s7XG4gIH1cblxuICBkZWFsQ2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNrLnBvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlY2s7XG4iLCJpbXBvcnQgRGVjayBmcm9tIFwiLi9EZWNrXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5jb25zdCBob3VzZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLWhvdXNlXCIpO1xuY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyXCIpO1xuXG5jb25zdCBwbGF5ZXJTY29yZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mby1wbGF5ZXItc2NvcmVcIik7XG5jb25zdCBnYW1lU3RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tZ2FtZS1zdGF0ZVwiKTtcblxuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBpbml0KCkge1xuICAgIHRoaXMuZGVjayA9IG5ldyBEZWNrKCk7XG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCk7XG4gICAgdGhpcy5ob3VzZSA9IG5ldyBQbGF5ZXIoKTtcblxuICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdGlhbERlYWwoKTtcbiAgICB0aGlzLnVwZGF0ZVBsYXllckRpc3BsYXkoKTtcbiAgICB0aGlzLnVwZGF0ZUhvdXNlRGlzcGxheSgpO1xuICAgIC8vIHRoaXMudXBkYXRlU2NvcmVzKCk7XG4gICAgdGhpcy5jaGVja0JsYWNramFjayh0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcbiAgfVxuXG4gIGluaXRpYWxEZWFsKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsSGFuZChoYW5kKSB7XG4gICAgY29uc3QgdG90YWxTdW0gPSBoYW5kLnJlZHVjZSgoYWNjdW11bGF0b3IsIG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgb2JqZWN0LnZhbHVlO1xuICAgIH0sIDApO1xuICAgIHJldHVybiB0b3RhbFN1bTtcbiAgfVxuXG4gIGNoZWNrQmxhY2tqYWNrKGhhbmQpIHtcbiAgICBpZiAoaGFuZCA8IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcImFsaXZlXCI7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYW5kID09PSAyMSkge1xuICAgICAgdGhpcy5nYW1lU3RhdHVzID0gXCJibGFja2phY2tcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoaGFuZCA+IDIxKSB7XG4gICAgICB0aGlzLmdhbWVTdGF0dXMgPSBcIm92ZXJcIjtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVNjb3Jlcyh0aGlzLmdhbWVTdGF0dXMpO1xuICB9XG5cbiAgZGlzcGxheU9wdGlvbigpIHtcbiAgICBsZXQgaGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBoaXRCdXR0b24udGV4dENvbnRlbnQgPSBcIkhJVFwiO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChoaXRCdXR0b24pO1xuICB9XG5cbiAgdXBkYXRlUGxheWVyRGlzcGxheSgpIHtcbiAgICB0aGlzLmVtcHR5Tm9kZShwbGF5ZXJDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgcENhcmQuY2xhc3NOYW1lID0gXCJwbGF5ZXJDYXJkXCI7XG4gICAgICBwQ2FyZC5pbm5lckhUTUwgPSBgJHt0aGlzLnBsYXllci5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHBDYXJkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVIb3VzZURpc3BsYXkoKSB7XG4gICAgdGhpcy5lbXB0eU5vZGUoaG91c2VDb250YWluZXIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGhDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBoQ2FyZC5jbGFzc05hbWUgPSBcImhvdXNlQ2FyZFwiO1xuICAgICAgaENhcmQuaW5uZXJIVE1MID0gYCR7dGhpcy5ob3VzZS5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgaG91c2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaENhcmQpO1xuICAgIH1cbiAgICB0aGlzLmhpZGVMYXN0SG91c2VDYXJkKCk7XG4gIH1cblxuICBoaWRlTGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGZpcnN0Q2FyZC5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImhpZGRlbkNhcmRcIik7XG4gIH1cblxuICBzaG93TGFzdEhvdXNlQ2FyZCgpIHtcbiAgICBjb25zdCBhbGxIb3VzZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ob3VzZUNhcmRcIik7XG4gICAgY29uc3QgZmlyc3RDYXJkID0gYWxsSG91c2VDYXJkc1swXTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5oaWRkZW5DYXJkXCIpO1xuXG4gICAgaWYgKHdyYXBwZXIgIT09IG51bGwpIGZpcnN0Q2FyZC5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgfVxuXG4gIGNvbXBhcmVGaW5hbFNjb3JlKCkge1xuICAgIGNvbnN0IGhvdXNlU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcyk7XG4gICAgY29uc3QgcGxheWVyU2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuXG4gICAgaWYgKGhvdXNlU2NvcmUgPCAxNykge1xuICAgICAgdGhpcy5ob3VzZS5oaXQodGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuICAgICAgdGhpcy51cGRhdGVIb3VzZURpc3BsYXkoKTtcbiAgICAgIHRoaXMuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHBsYXllclNjb3JlID4gaG91c2VTY29yZSAmJiBwbGF5ZXJTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIFlvdSBXaW4hYDtcbiAgICAgIH0gZWxzZSBpZiAocGxheWVyU2NvcmUgPiBob3VzZVNjb3JlICYmIHBsYXllclNjb3JlID4gMjEpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBIb3VzIFdpbnNgO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA8PSAyMSkge1xuICAgICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgVGhlIGhvdXNlIHJvbGxlZCAke2hvdXNlU2NvcmV9IGFuZCB5b3UgJHtwbGF5ZXJTY29yZX0uIEhvdXNlIFdpbnNgO1xuICAgICAgfSBlbHNlIGlmIChob3VzZVNjb3JlID4gcGxheWVyU2NvcmUgJiYgaG91c2VTY29yZSA+IDIxKSB7XG4gICAgICAgIGdhbWVTdGF0ZS50ZXh0Q29udGVudCA9IGBUaGUgaG91c2Ugcm9sbGVkICR7aG91c2VTY29yZX0gYW5kIHlvdSAke3BsYXllclNjb3JlfS4gUGxheWVyIFdpbnMhYDtcbiAgICAgIH0gZWxzZSBpZiAoaG91c2VTY29yZSA9PT0gcGxheWVyU2NvcmUpIHtcbiAgICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYFRoZSBob3VzZSByb2xsZWQgJHtob3VzZVNjb3JlfSBhbmQgeW91ICR7cGxheWVyU2NvcmV9LiBJdHMgYSBUaWVgO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2hvd0xhc3RIb3VzZUNhcmQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTY29yZXMoc3RhdGUpIHtcbiAgICBjb25zb2xlLmxvZyhzdGF0ZSk7XG4gICAgcGxheWVyU2NvcmUudGV4dENvbnRlbnQgPSBgUGxheWVyIFNjb3JlID0gJHt0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZChcbiAgICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkc1xuICAgICl9YDtcbiAgICBpZiAoc3RhdGUgPT09IFwiYWxpdmVcIikge1xuICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYEFyZSB5b3UgZ29pbmcgdG8gSGl0IG9yIFN0YW5kP2A7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSA9PT0gXCJibGFja2phY2tcIikge1xuICAgICAgZ2FtZVN0YXRlLnRleHRDb250ZW50ID0gYEJsYWNramFjayFgO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwib3ZlclwiKSB7XG4gICAgICBnYW1lU3RhdGUudGV4dENvbnRlbnQgPSBgV2VudCB0b28gaGlnaC4uLiBHYW1lIE92ZXJgO1xuICAgIH1cbiAgfVxuXG4gIGVtcHR5Tm9kZShwYXJlbnQpIHtcbiAgICB3aGlsZSAocGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHBhcmVudC5maXJzdENoaWxkLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdXJyZW50Q2FyZHMgPSBbXTtcbiAgfVxuXG4gIGhpdChjYXJkKSB7XG4gICAgdGhpcy5jdXJyZW50Q2FyZHMucHVzaChjYXJkKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWUuanNcIjtcblxubGV0IGdhbWUgPSBuZXcgR2FtZSgpO1xuZ2FtZS5pbml0KCk7XG5cbmxldCByZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tcmVzdGFydFwiKTtcbmxldCBoaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1oaXRcIik7XG5sZXQgc3RhbmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFuZFwiKTtcblxucmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBnYW1lLmluaXQoKTtcbn0pO1xuXG5oaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUpIHtcbiAgICBnYW1lLnBsYXllci5oaXQoZ2FtZS5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIGdhbWUudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIGdhbWUuY2hlY2tCbGFja2phY2soZ2FtZS5jYWxjdWxhdGVUb3RhbEhhbmQoZ2FtZS5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG4gIH1cbn0pO1xuXG5zdGFuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBpZiAoZ2FtZS5nYW1lT3ZlciAhPT0gdHJ1ZSkge1xuICAgIGdhbWUuY29tcGFyZUZpbmFsU2NvcmUoKTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=