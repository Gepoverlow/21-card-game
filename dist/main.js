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
        if (value === null) {
          baseAlt++;
          continue;
        }
        let cardName = `${values[value]} of ${types[type]}`;
        let card = this.cardToObject(
          cardName,
          this.assignCardValue(cardName),
          `&#${baseAlt}`
        );
        baseAlt++;
        this.deck.push(card);
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

    this.initialDeal();
    this.updateCardDisplay(this.player, this.house);
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());

    console.log(this.player.currentCards);
    console.log(this.house.currentCards);
  }

  updateCardDisplay(player, house) {
    for (let i = 0; i < player.currentCards.length; i++) {
      const pCard = document.createElement("span");
      pCard.innerHTML = `${player.currentCards[i].altCode}`;
      playerContainer.appendChild(pCard);
    }

    for (let i = 0; i < house.currentCards.length; i++) {
      const hCard = document.createElement("span");
      hCard.innerHTML = `${house.currentCards[i].altCode}`;
      houseContainer.appendChild(hCard);
    }
  }

  turn(player, deck, house) {}
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLGVBQWUsS0FBSyxZQUFZO0FBQzFEO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Rk07QUFDSTs7QUFFOUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDZDQUFJO0FBQ3hCLHNCQUFzQiwrQ0FBTTtBQUM1QixxQkFBcUIsK0NBQU07O0FBRTNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsZ0NBQWdDO0FBQ3BEO0FBQ0EsMkJBQTJCLCtCQUErQjtBQUMxRDtBQUNBOztBQUVBLG9CQUFvQiwrQkFBK0I7QUFDbkQ7QUFDQSwyQkFBMkIsOEJBQThCO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDOUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7VUNWdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBQ0E7QUFDSTs7QUFFakMsZUFBZSxnREFBSTs7QUFFbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvRGVjay5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvR2FtZS5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRGVjayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNodWZmbGVEZWNrKCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG5cbiAgICBjb25zdCB0eXBlcyA9IFtcIlNwYWRlc1wiLCBcIkhlYXJ0c1wiLCBcIkRpYW1vbmRzXCIsIFwiQ2x1YnNcIl07XG4gICAgY29uc3QgdmFsdWVzID0gW1xuICAgICAgXCJBY2VcIixcbiAgICAgIDIsXG4gICAgICAzLFxuICAgICAgNCxcbiAgICAgIDUsXG4gICAgICA2LFxuICAgICAgNyxcbiAgICAgIDgsXG4gICAgICA5LFxuICAgICAgMTAsXG4gICAgICBcIkphY2tcIixcbiAgICAgIG51bGwsXG4gICAgICBcIlF1ZWVuXCIsXG4gICAgICBcIktpbmdcIixcbiAgICBdO1xuICAgIGxldCBiYXNlQWx0ID0gMTI3MTM3O1xuXG4gICAgZm9yIChsZXQgdHlwZSBpbiB0eXBlcykge1xuICAgICAgZm9yIChsZXQgdmFsdWUgaW4gdmFsdWVzKSB7XG4gICAgICAgIC8vQmVjYXVzZSBvZiBpdGFsaWFuIGFuZCBzcGFuaXNoIFwiS25pZ2h0XCIgY2FyZCwgSSBoYWQgdG8gaW5jbHVkZSBhIG51bGwgZWxlbWVudCB3aXRoaW4gdGhlIHZhbHVlcyBhcnJheSB0byBza2lwIGl0IHdoZW4gbG9vcGluZyBvdmVyIGFuZCBkaXNwbGF5aW5nIHRoZSBjb3JyZWN0IGJhc2VBbGUgdmFsdWVcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgYmFzZUFsdCsrO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYXJkTmFtZSA9IGAke3ZhbHVlc1t2YWx1ZV19IG9mICR7dHlwZXNbdHlwZV19YDtcbiAgICAgICAgbGV0IGNhcmQgPSB0aGlzLmNhcmRUb09iamVjdChcbiAgICAgICAgICBjYXJkTmFtZSxcbiAgICAgICAgICB0aGlzLmFzc2lnbkNhcmRWYWx1ZShjYXJkTmFtZSksXG4gICAgICAgICAgYCYjJHtiYXNlQWx0fWBcbiAgICAgICAgKTtcbiAgICAgICAgYmFzZUFsdCsrO1xuICAgICAgICB0aGlzLmRlY2sucHVzaChjYXJkKTtcbiAgICAgIH1cbiAgICAgIGJhc2VBbHQgKz0gMjtcbiAgICB9XG4gIH1cblxuICBjYXJkVG9PYmplY3QobmFtZSwgdmFsdWUsIGFsdENvZGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGFsdENvZGU6IGFsdENvZGUsXG4gICAgfTtcbiAgfVxuXG4gIGFzc2lnbkNhcmRWYWx1ZShjYXJkKSB7XG4gICAgbGV0IHZhbHVlID0gL0phY2t8UXVlZW58S2luZy8udGVzdChjYXJkKTtcbiAgICBsZXQgc3BsaXRTdHJpbmcgPSBjYXJkLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAodmFsdWUgfHwgc3BsaXRTdHJpbmdbMF0gPT09IFwiMTBcIikge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0gZWxzZSBpZiAoc3BsaXRTdHJpbmdbMF0gPT09IFwiQWNlXCIpIHtcbiAgICAgIHJldHVybiAxMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE51bWJlcihzcGxpdFN0cmluZ1swXSk7XG4gICAgfVxuICB9XG5cbiAgc2h1ZmZsZURlY2soKSB7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVjaztcbiAgICBsZXQgbGVuZ3RoID0gZGVjay5sZW5ndGg7XG4gICAgbGV0IGk7XG5cbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoLS0pO1xuXG4gICAgICBbZGVja1tsZW5ndGhdLCBkZWNrW2ldXSA9IFtkZWNrW2ldLCBkZWNrW2xlbmd0aF1dO1xuICAgIH1cbiAgICByZXR1cm4gZGVjaztcbiAgfVxuXG4gIGRlYWxDYXJkKCkge1xuICAgIHJldHVybiB0aGlzLmRlY2sucG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVjaztcbiIsImltcG9ydCBEZWNrIGZyb20gXCIuL0RlY2tcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmNvbnN0IGhvdXNlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXItaG91c2VcIik7XG5jb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lci1wbGF5ZXJcIik7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRlY2sgPSBuZXcgRGVjaygpO1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuaG91c2UgPSBuZXcgUGxheWVyKCk7XG5cbiAgICB0aGlzLmluaXRpYWxEZWFsKCk7XG4gICAgdGhpcy51cGRhdGVDYXJkRGlzcGxheSh0aGlzLnBsYXllciwgdGhpcy5ob3VzZSk7XG4gIH1cblxuICBpbml0aWFsRGVhbCgpIHtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuXG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuaG91c2UuY3VycmVudENhcmRzKTtcbiAgfVxuXG4gIHVwZGF0ZUNhcmREaXNwbGF5KHBsYXllciwgaG91c2UpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllci5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBwQ2FyZC5pbm5lckhUTUwgPSBgJHtwbGF5ZXIuY3VycmVudENhcmRzW2ldLmFsdENvZGV9YDtcbiAgICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChwQ2FyZCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBob3VzZS5jdXJyZW50Q2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGhDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICBoQ2FyZC5pbm5lckhUTUwgPSBgJHtob3VzZS5jdXJyZW50Q2FyZHNbaV0uYWx0Q29kZX1gO1xuICAgICAgaG91c2VDb250YWluZXIuYXBwZW5kQ2hpbGQoaENhcmQpO1xuICAgIH1cbiAgfVxuXG4gIHR1cm4ocGxheWVyLCBkZWNrLCBob3VzZSkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZTtcbiIsImNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY3VycmVudENhcmRzID0gW107XG4gIH1cblxuICBoaXQoY2FyZCkge1xuICAgIHRoaXMuY3VycmVudENhcmRzLnB1c2goY2FyZCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgR2FtZSBmcm9tIFwiLi9HYW1lLmpzXCI7XG5pbXBvcnQgRGVjayBmcm9tIFwiLi9EZWNrLmpzXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllci5qc1wiO1xuXG5sZXQgZ2FtZSA9IG5ldyBHYW1lKCk7XG5cbmdhbWUuaW5pdCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9