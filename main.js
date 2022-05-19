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
    const values = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];
    let baseAlt = 127137;

    for (let type in types) {
      for (let value in values) {
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

    console.log(this.deck);
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



class Game {
  constructor() {}

  init() {
    this.deck = new _Deck__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.house = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]();

    this.initialDeal();
  }

  initialDeal() {
    this.player.currentCards.push(this.deck.dealCard());
    this.player.currentCards.push(this.deck.dealCard());

    this.house.currentCards.push(this.deck.dealCard());
    this.house.currentCards.push(this.deck.dealCard());

    console.log(this.player.currentCards);
    console.log(this.house.currentCards);
  }

  displayCards(player, house) {
    const card = document.createElement("span");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsZUFBZSxLQUFLLFlBQVk7QUFDMUQ7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3BFTTtBQUNJOztBQUU5QjtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLDZDQUFJO0FBQ3hCLHNCQUFzQiwrQ0FBTTtBQUM1QixxQkFBcUIsK0NBQU07O0FBRTNCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDaENwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7VUNWdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBQ0E7QUFDSTs7QUFFakMsZUFBZSxnREFBSTs7QUFFbkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvRGVjay5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvR2FtZS5qcyIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8yMV9jYXJkX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzIxX2NhcmRfZ2FtZS8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRGVjayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZGVjayA9IFtdO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLnNodWZmbGVEZWNrKCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kZWNrID0gW107XG5cbiAgICBjb25zdCB0eXBlcyA9IFtcIlNwYWRlc1wiLCBcIkhlYXJ0c1wiLCBcIkRpYW1vbmRzXCIsIFwiQ2x1YnNcIl07XG4gICAgY29uc3QgdmFsdWVzID0gW1wiQWNlXCIsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCBcIkphY2tcIiwgXCJRdWVlblwiLCBcIktpbmdcIl07XG4gICAgbGV0IGJhc2VBbHQgPSAxMjcxMzc7XG5cbiAgICBmb3IgKGxldCB0eXBlIGluIHR5cGVzKSB7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgbGV0IGNhcmROYW1lID0gYCR7dmFsdWVzW3ZhbHVlXX0gb2YgJHt0eXBlc1t0eXBlXX1gO1xuICAgICAgICBsZXQgY2FyZCA9IHRoaXMuY2FyZFRvT2JqZWN0KFxuICAgICAgICAgIGNhcmROYW1lLFxuICAgICAgICAgIHRoaXMuYXNzaWduQ2FyZFZhbHVlKGNhcmROYW1lKSxcbiAgICAgICAgICBgJiMke2Jhc2VBbHR9YFxuICAgICAgICApO1xuICAgICAgICBiYXNlQWx0Kys7XG4gICAgICAgIHRoaXMuZGVjay5wdXNoKGNhcmQpO1xuICAgICAgfVxuICAgICAgYmFzZUFsdCArPSAyO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZGVjayk7XG4gIH1cblxuICBjYXJkVG9PYmplY3QobmFtZSwgdmFsdWUsIGFsdENvZGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGFsdENvZGU6IGFsdENvZGUsXG4gICAgfTtcbiAgfVxuXG4gIGFzc2lnbkNhcmRWYWx1ZShjYXJkKSB7XG4gICAgbGV0IHZhbHVlID0gL0phY2t8UXVlZW58S2luZy8udGVzdChjYXJkKTtcbiAgICBsZXQgc3BsaXRTdHJpbmcgPSBjYXJkLnNwbGl0KFwiIFwiKTtcbiAgICBpZiAodmFsdWUgfHwgc3BsaXRTdHJpbmdbMF0gPT09IFwiMTBcIikge1xuICAgICAgcmV0dXJuIDEwO1xuICAgIH0gZWxzZSBpZiAoc3BsaXRTdHJpbmdbMF0gPT09IFwiQWNlXCIpIHtcbiAgICAgIHJldHVybiAxMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE51bWJlcihzcGxpdFN0cmluZ1swXSk7XG4gICAgfVxuICB9XG5cbiAgc2h1ZmZsZURlY2soKSB7XG4gICAgY29uc3QgZGVjayA9IHRoaXMuZGVjaztcbiAgICBsZXQgbGVuZ3RoID0gZGVjay5sZW5ndGg7XG4gICAgbGV0IGk7XG5cbiAgICB3aGlsZSAobGVuZ3RoKSB7XG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGVuZ3RoLS0pO1xuXG4gICAgICBbZGVja1tsZW5ndGhdLCBkZWNrW2ldXSA9IFtkZWNrW2ldLCBkZWNrW2xlbmd0aF1dO1xuICAgIH1cbiAgICByZXR1cm4gZGVjaztcbiAgfVxuXG4gIGRlYWxDYXJkKCkge1xuICAgIHJldHVybiB0aGlzLmRlY2sucG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVjaztcbiIsImltcG9ydCBEZWNrIGZyb20gXCIuL0RlY2tcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRlY2sgPSBuZXcgRGVjaygpO1xuICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcigpO1xuICAgIHRoaXMuaG91c2UgPSBuZXcgUGxheWVyKCk7XG5cbiAgICB0aGlzLmluaXRpYWxEZWFsKCk7XG4gIH1cblxuICBpbml0aWFsRGVhbCgpIHtcbiAgICB0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5wbGF5ZXIuY3VycmVudENhcmRzLnB1c2godGhpcy5kZWNrLmRlYWxDYXJkKCkpO1xuXG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG4gICAgdGhpcy5ob3VzZS5jdXJyZW50Q2FyZHMucHVzaCh0aGlzLmRlY2suZGVhbENhcmQoKSk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLnBsYXllci5jdXJyZW50Q2FyZHMpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuaG91c2UuY3VycmVudENhcmRzKTtcbiAgfVxuXG4gIGRpc3BsYXlDYXJkcyhwbGF5ZXIsIGhvdXNlKSB7XG4gICAgY29uc3QgY2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICB9XG5cbiAgdHVybihwbGF5ZXIsIGRlY2ssIGhvdXNlKSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jdXJyZW50Q2FyZHMgPSBbXTtcbiAgfVxuXG4gIGhpdChjYXJkKSB7XG4gICAgdGhpcy5jdXJyZW50Q2FyZHMucHVzaChjYXJkKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWUuanNcIjtcbmltcG9ydCBEZWNrIGZyb20gXCIuL0RlY2suanNcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyLmpzXCI7XG5cbmxldCBnYW1lID0gbmV3IEdhbWUoKTtcblxuZ2FtZS5pbml0KCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=