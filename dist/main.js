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
    console.log(`Your current total is ${hand}`);

    if (hand < 21) {
      console.log("give chance to pick option");
      this.gameOver = false;
    } else if (hand === 21) {
      console.log("Blackjack!");
      this.gameOver = true;
    } else if (hand > 21) {
      console.log("You went too far");
      this.gameOver = true;
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
    const lastCard = allHouseCards[allHouseCards.length - 1];

    const wrapper = document.createElement("div");
    lastCard.appendChild(wrapper);

    wrapper.classList.add("hiddenCard");
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
/* harmony import */ var _Deck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Deck.js */ "./src/Deck.js");
/* harmony import */ var _Player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Player.js */ "./src/Player.js");




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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGVBQWUsS0FBSyxZQUFZO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixRQUFRO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEZNO0FBQ0k7O0FBRTlCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiw2Q0FBSTtBQUN4QixzQkFBc0IsK0NBQU07QUFDNUIscUJBQXFCLCtDQUFNOztBQUUzQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsS0FBSzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLHFDQUFxQztBQUN6RDtBQUNBO0FBQ0EsMkJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixvQ0FBb0M7QUFDeEQ7QUFDQTtBQUNBLDJCQUEyQixtQ0FBbUM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNoR3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQzs7Ozs7OztVQ1Z0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNONkI7QUFDQTtBQUNJOztBQUVqQyxlQUFlLGdEQUFJO0FBQ25COztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0RlY2suanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vMjFfY2FyZF9nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERlY2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRlY2sgPSBbXTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5zaHVmZmxlRGVjaygpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuXG4gICAgY29uc3QgdHlwZXMgPSBbXCJTcGFkZXNcIiwgXCJIZWFydHNcIiwgXCJEaWFtb25kc1wiLCBcIkNsdWJzXCJdO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtcbiAgICAgIFwiQWNlXCIsXG4gICAgICAyLFxuICAgICAgMyxcbiAgICAgIDQsXG4gICAgICA1LFxuICAgICAgNixcbiAgICAgIDcsXG4gICAgICA4LFxuICAgICAgOSxcbiAgICAgIDEwLFxuICAgICAgXCJKYWNrXCIsXG4gICAgICBudWxsLFxuICAgICAgXCJRdWVlblwiLFxuICAgICAgXCJLaW5nXCIsXG4gICAgXTtcbiAgICBsZXQgYmFzZUFsdCA9IDEyNzEzNztcblxuICAgIGZvciAobGV0IHR5cGUgaW4gdHlwZXMpIHtcbiAgICAgIGZvciAobGV0IHZhbHVlIGluIHZhbHVlcykge1xuICAgICAgICAvL0JlY2F1c2Ugb2YgaXRhbGlhbiBhbmQgc3BhbmlzaCBcIktuaWdodFwiIGNhcmQsIEkgaGFkIHRvIGluY2x1ZGUgYSBudWxsIGVsZW1lbnQgd2l0aGluIHRoZSB2YWx1ZXMgYXJyYXkgdG8gc2tpcCBpdCB3aGVuIGxvb3Bpbmcgb3ZlciBhbmQgZGlzcGxheWluZyB0aGUgY29ycmVjdCBiYXNlQWxlIHZhbHVlXG4gICAgICAgIGlmICh2YWx1ZXNbdmFsdWVdICE9PSBudWxsKSB7XG4gICAgICAgICAgbGV0IGNhcmROYW1lID0gYCR7dmFsdWVzW3ZhbHVlXX0gb2YgJHt0eXBlc1t0eXBlXX1gO1xuICAgICAgICAgIGxldCBjYXJkID0gdGhpcy5jYXJkVG9PYmplY3QoXG4gICAgICAgICAgICBjYXJkTmFtZSxcbiAgICAgICAgICAgIHRoaXMuYXNzaWduQ2FyZFZhbHVlKGNhcmROYW1lKSxcbiAgICAgICAgICAgIGAmIyR7YmFzZUFsdH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmRlY2sucHVzaChjYXJkKTtcbiAgICAgICAgfVxuICAgICAgICBiYXNlQWx0Kys7XG4gICAgICB9XG4gICAgICBiYXNlQWx0ICs9IDI7XG4gICAgfVxuICB9XG5cbiAgY2FyZFRvT2JqZWN0KG5hbWUsIHZhbHVlLCBhbHRDb2RlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBhbHRDb2RlOiBhbHRDb2RlLFxuICAgIH07XG4gIH1cblxuICBhc3NpZ25DYXJkVmFsdWUoY2FyZCkge1xuICAgIGxldCB2YWx1ZSA9IC9KYWNrfFF1ZWVufEtpbmcvLnRlc3QoY2FyZCk7XG4gICAgbGV0IHNwbGl0U3RyaW5nID0gY2FyZC5zcGxpdChcIiBcIik7XG4gICAgaWYgKHZhbHVlIHx8IHNwbGl0U3RyaW5nWzBdID09PSBcIjEwXCIpIHtcbiAgICAgIHJldHVybiAxMDtcbiAgICB9IGVsc2UgaWYgKHNwbGl0U3RyaW5nWzBdID09PSBcIkFjZVwiKSB7XG4gICAgICByZXR1cm4gMTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOdW1iZXIoc3BsaXRTdHJpbmdbMF0pO1xuICAgIH1cbiAgfVxuXG4gIHNodWZmbGVEZWNrKCkge1xuICAgIGNvbnN0IGRlY2sgPSB0aGlzLmRlY2s7XG4gICAgbGV0IGxlbmd0aCA9IGRlY2subGVuZ3RoO1xuICAgIGxldCBpO1xuXG4gICAgd2hpbGUgKGxlbmd0aCkge1xuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbmd0aC0tKTtcblxuICAgICAgW2RlY2tbbGVuZ3RoXSwgZGVja1tpXV0gPSBbZGVja1tpXSwgZGVja1tsZW5ndGhdXTtcbiAgICB9XG4gICAgcmV0dXJuIGRlY2s7XG4gIH1cblxuICBkZWFsQ2FyZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNrLnBvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlY2s7XG4iLCJpbXBvcnQgRGVjayBmcm9tIFwiLi9EZWNrXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5jb25zdCBob3VzZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyLWhvdXNlXCIpO1xuY29uc3QgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItcGxheWVyXCIpO1xuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5kZWNrID0gbmV3IERlY2soKTtcbiAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoKTtcbiAgICB0aGlzLmhvdXNlID0gbmV3IFBsYXllcigpO1xuXG4gICAgdGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0aWFsRGVhbCgpO1xuICAgIHRoaXMudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIHRoaXMudXBkYXRlSG91c2VEaXNwbGF5KCk7XG4gICAgdGhpcy5jaGVja0JsYWNramFjayh0aGlzLmNhbGN1bGF0ZVRvdGFsSGFuZCh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpKTtcbiAgfVxuXG4gIGluaXRpYWxEZWFsKCkge1xuICAgIHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgICB0aGlzLmhvdXNlLmN1cnJlbnRDYXJkcy5wdXNoKHRoaXMuZGVjay5kZWFsQ2FyZCgpKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsSGFuZChoYW5kKSB7XG4gICAgY29uc3QgdG90YWxTdW0gPSBoYW5kLnJlZHVjZSgoYWNjdW11bGF0b3IsIG9iamVjdCkgPT4ge1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yICsgb2JqZWN0LnZhbHVlO1xuICAgIH0sIDApO1xuICAgIHJldHVybiB0b3RhbFN1bTtcbiAgfVxuXG4gIGNoZWNrQmxhY2tqYWNrKGhhbmQpIHtcbiAgICBjb25zb2xlLmxvZyhgWW91ciBjdXJyZW50IHRvdGFsIGlzICR7aGFuZH1gKTtcblxuICAgIGlmIChoYW5kIDwgMjEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZ2l2ZSBjaGFuY2UgdG8gcGljayBvcHRpb25cIik7XG4gICAgICB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChoYW5kID09PSAyMSkge1xuICAgICAgY29uc29sZS5sb2coXCJCbGFja2phY2shXCIpO1xuICAgICAgdGhpcy5nYW1lT3ZlciA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChoYW5kID4gMjEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiWW91IHdlbnQgdG9vIGZhclwiKTtcbiAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BsYXlPcHRpb24oKSB7XG4gICAgbGV0IGhpdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgaGl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJISVRcIjtcbiAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaGl0QnV0dG9uKTtcbiAgfVxuXG4gIHVwZGF0ZVBsYXllckRpc3BsYXkoKSB7XG4gICAgdGhpcy5lbXB0eU5vZGUocGxheWVyQ29udGFpbmVyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVyLmN1cnJlbnRDYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcENhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgIHBDYXJkLmNsYXNzTmFtZSA9IFwicGxheWVyQ2FyZFwiO1xuICAgICAgcENhcmQuaW5uZXJIVE1MID0gYCR7dGhpcy5wbGF5ZXIuY3VycmVudENhcmRzW2ldLmFsdENvZGV9YDtcbiAgICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChwQ2FyZCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSG91c2VEaXNwbGF5KCkge1xuICAgIHRoaXMuZW1wdHlOb2RlKGhvdXNlQ29udGFpbmVyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaG91c2UuY3VycmVudENhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBoQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgaENhcmQuY2xhc3NOYW1lID0gXCJob3VzZUNhcmRcIjtcbiAgICAgIGhDYXJkLmlubmVySFRNTCA9IGAke3RoaXMuaG91c2UuY3VycmVudENhcmRzW2ldLmFsdENvZGV9YDtcbiAgICAgIGhvdXNlQ29udGFpbmVyLmFwcGVuZENoaWxkKGhDYXJkKTtcbiAgICB9XG4gICAgdGhpcy5oaWRlTGFzdEhvdXNlQ2FyZCgpO1xuICB9XG5cbiAgaGlkZUxhc3RIb3VzZUNhcmQoKSB7XG4gICAgY29uc3QgYWxsSG91c2VDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaG91c2VDYXJkXCIpO1xuICAgIGNvbnN0IGxhc3RDYXJkID0gYWxsSG91c2VDYXJkc1thbGxIb3VzZUNhcmRzLmxlbmd0aCAtIDFdO1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbGFzdENhcmQuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG5cbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5DYXJkXCIpO1xuICB9XG5cbiAgZW1wdHlOb2RlKHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWU7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmN1cnJlbnRDYXJkcyA9IFtdO1xuICB9XG5cbiAgaGl0KGNhcmQpIHtcbiAgICB0aGlzLmN1cnJlbnRDYXJkcy5wdXNoKGNhcmQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vR2FtZS5qc1wiO1xuaW1wb3J0IERlY2sgZnJvbSBcIi4vRGVjay5qc1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9QbGF5ZXIuanNcIjtcblxubGV0IGdhbWUgPSBuZXcgR2FtZSgpO1xuZ2FtZS5pbml0KCk7XG5cbmxldCByZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb24tcmVzdGFydFwiKTtcbmxldCBoaXRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1oaXRcIik7XG5sZXQgc3RhbmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbi1zdGFuZFwiKTtcblxucmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICBnYW1lLmluaXQoKTtcbn0pO1xuXG5oaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgaWYgKGdhbWUuZ2FtZU92ZXIgIT09IHRydWUpIHtcbiAgICBnYW1lLnBsYXllci5oaXQoZ2FtZS5kZWNrLmRlYWxDYXJkKCkpO1xuICAgIGdhbWUudXBkYXRlUGxheWVyRGlzcGxheSgpO1xuICAgIGdhbWUuY2hlY2tCbGFja2phY2soZ2FtZS5jYWxjdWxhdGVUb3RhbEhhbmQoZ2FtZS5wbGF5ZXIuY3VycmVudENhcmRzKSk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9