/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (rotationSystem, bar, wellDepth, wellWidth) {
  return (
    /**
      Input {well, score, piece} and a move, return
      the new {well, score, piece}.
    */
    function (state, move) {
      var nextWell = state.well;
      var nextScore = state.score;
      var nextPiece = {
        id: state.piece.id,
        x: state.piece.x,
        y: state.piece.y,
        o: state.piece.o

        // apply transform (very fast now)
      };if (move === 'L') {
        nextPiece.x--;
      }
      if (move === 'R') {
        nextPiece.x++;
      }
      if (move === 'D') {
        nextPiece.y++;
      }
      if (move === 'U') {
        nextPiece.o = (nextPiece.o + 1) % 4;
      }

      var orientation = rotationSystem[nextPiece.id][nextPiece.o];
      var xActual = nextPiece.x + orientation.xMin;
      var yActual = nextPiece.y + orientation.yMin;

      if (xActual < 0 || // off left side
      xActual + orientation.xDim > wellWidth || // off right side
      yActual < 0 || // off top (??)
      yActual + orientation.yDim > wellDepth || // off bottom
      orientation.rows.some(function (row, y) {
        return state.well[yActual + y] & row << xActual;
      }) // obstruction
      ) {
          if (move === 'D') {
            // Lock piece
            nextWell = state.well.slice();

            var _orientation = rotationSystem[state.piece.id][state.piece.o];

            // this is the top left point in the bounding box of this orientation of this piece
            var _xActual = state.piece.x + _orientation.xMin;
            var _yActual = state.piece.y + _orientation.yMin;

            // row by row bitwise line alteration
            for (var row = 0; row < _orientation.yDim; row++) {
              // can't negative bit-shift, but alas X can be negative
              nextWell[_yActual + row] |= _orientation.rows[row] << _xActual;
            }

            // check for complete lines now
            // NOTE: completed lines don't count if you've lost
            for (var _row = 0; _row < _orientation.yDim; _row++) {
              if (_yActual >= bar && nextWell[_yActual + _row] === (1 << wellWidth) - 1) {
                // move all lines above this point down
                for (var k = _yActual + _row; k > 1; k--) {
                  nextWell[k] = nextWell[k - 1];
                }

                // insert a new blank line at the top
                // though of course the top line will always be blank anyway
                nextWell[0] = 0;

                nextScore++;
              }
            }
            nextPiece = null;
          } else {
            // No move
            nextPiece = state.piece;
          }
        }

      return {
        well: nextWell,
        score: nextScore,
        piece: nextPiece
      };
    }
  );
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var encode = function encode(arr, maxRunLength) {
  var runs = [];

  arr.forEach(function (entry) {
    if (runs.length === 0 || runs[runs.length - 1].entry !== entry || runs[runs.length - 1].length === maxRunLength) {
      runs.push({
        entry: entry,
        length: 0
      });
    }

    runs[runs.length - 1].length++;
  });
  return runs;
};

var decode = function decode(runs) {
  var entries = [];
  runs.forEach(function (run) {
    for (var i = 0; i < run.length; i++) {
      entries.push(run.entry);
    }
  });
  return entries;
};

exports.default = { encode: encode, decode: decode };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  HATETRIS
*/



var _reactDom = __webpack_require__(4);

var _reactDom2 = _interopRequireDefault(_reactDom);

__webpack_require__(5);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

var _game = __webpack_require__(10);

var _game2 = _interopRequireDefault(_game);

var _getHatetris = __webpack_require__(21);

var _getHatetris2 = _interopRequireDefault(_getHatetris);

var _getHatetris3 = __webpack_require__(24);

var _getHatetris4 = _interopRequireDefault(_getHatetris3);

var _getHatetris5 = __webpack_require__(25);

var _getHatetris6 = _interopRequireDefault(_getHatetris5);

var _hatetris = __webpack_require__(26);

var _hatetris2 = _interopRequireDefault(_hatetris);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fixed attributes of all of Tetris
var bar = 4;
var wellDepth = 20; // min = bar
var wellWidth = 10; // min = 4

var placeFirstPiece = (0, _getHatetris6.default)(wellWidth);
var gameIsOver = (0, _getHatetris4.default)(bar);
var enemyAi = (0, _getHatetris2.default)(_hatetris2.default, placeFirstPiece, bar, wellDepth, wellWidth);
var replayTimeout = 50; // milliseconds per frame

_reactDom2.default.render(React.createElement(_game2.default, {
  bar: bar,
  enemyAi: enemyAi,
  gameIsOver: gameIsOver,
  placeFirstPiece: placeFirstPiece,
  replayTimeout: replayTimeout,
  rotationSystem: _hatetris2.default,
  wellDepth: wellDepth,
  wellWidth: wellWidth
}), document.body);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "favicon.ico";

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "hatetris.html";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.sc_project = 667681;
window.sc_invisible = 1;
window.sc_partition = 5;
window.sc_security = 'f56850e2';
window.sc_remove_link = 1;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  HATETRIS instance builder
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _getFirstState = __webpack_require__(12);

var _getFirstState2 = _interopRequireDefault(_getFirstState);

var _getGetNextState = __webpack_require__(0);

var _getGetNextState2 = _interopRequireDefault(_getGetNextState);

var _replay = __webpack_require__(13);

var _replay2 = _interopRequireDefault(_replay);

var _well = __webpack_require__(19);

var _well2 = _interopRequireDefault(_well);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var minWidth = 4;

var Game = function (_React$Component) {
  _inherits(Game, _React$Component);

  function Game(props) {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, props));

    var _this$props = _this.props,
        rotationSystem = _this$props.rotationSystem,
        placeFirstPiece = _this$props.placeFirstPiece,
        bar = _this$props.bar,
        wellDepth = _this$props.wellDepth,
        wellWidth = _this$props.wellWidth,
        enemyAi = _this$props.enemyAi;


    if (rotationSystem.length < 1) {
      throw Error('Have to have at least one piece!');
    }

    if (wellDepth < bar) {
      throw Error("Can't have well with depth " + String(wellDepth) + ' less than bar at ' + String(bar));
    }

    if (wellWidth < minWidth) {
      throw Error("Can't have well with width " + String(wellWidth) + ' less than ' + String(minWidth));
    }

    _this.firstState = (0, _getFirstState2.default)(wellDepth, placeFirstPiece, enemyAi);
    _this.getNextState = (0, _getGetNextState2.default)(rotationSystem, bar, wellDepth, wellWidth);

    _this.state = {
      mode: 'GAME_OVER',
      wellStateId: -1,
      wellStates: [],
      replay: [],
      replayTimeoutId: undefined
    };

    _this.startGame = _this.startGame.bind(_this);
    _this.startReplay = _this.startReplay.bind(_this);
    _this.inputReplayStep = _this.inputReplayStep.bind(_this);
    _this.left = _this.left.bind(_this);
    _this.right = _this.right.bind(_this);
    _this.rotate = _this.rotate.bind(_this);
    _this.down = _this.down.bind(_this);
    _this.undo = _this.undo.bind(_this);
    _this.redo = _this.redo.bind(_this);
    return _this;
  }

  _createClass(Game, [{
    key: 'startGame',
    value: function startGame() {
      var replayTimeoutId = this.state.replayTimeoutId;

      // there may be a replay in progress, this
      // must be killed

      if (replayTimeoutId) {
        clearTimeout(replayTimeoutId);
      }

      // clear the field and get ready for a new game
      this.setState({
        mode: 'PLAYING',
        wellStateId: 0,
        wellStates: [this.firstState],
        replay: [],
        replayTimeoutId: undefined
      });
    }
  }, {
    key: 'startReplay',
    value: function startReplay() {
      var replayTimeout = this.props.replayTimeout;
      var replayTimeoutId = this.state.replayTimeoutId;

      // there may be a replay in progress, this
      // must be killed

      if (replayTimeoutId) {
        clearTimeout(replayTimeoutId);
      }

      // user inputs replay string
      var string = window.prompt() || ''; // change for IE

      var replay = _replay2.default.decode(string);

      var wellStateId = 0;
      var nextReplayTimeoutId = wellStateId in replay ? setTimeout(this.inputReplayStep, replayTimeout) : undefined;

      // GO
      this.setState({
        mode: 'REPLAYING',
        wellStateId: wellStateId,
        wellStates: [this.firstState],
        replay: replay,
        replayTimeoutId: nextReplayTimeoutId
      });
    }
  }, {
    key: 'inputReplayStep',
    value: function inputReplayStep() {
      var replayTimeout = this.props.replayTimeout;
      var _state = this.state,
          mode = _state.mode,
          replay = _state.replay,
          wellStateId = _state.wellStateId;


      var nextReplayTimeoutId = void 0;

      if (mode === 'REPLAYING') {
        this.redo();

        if (wellStateId + 1 in replay) {
          nextReplayTimeoutId = setTimeout(this.inputReplayStep, replayTimeout);
        }
      } else {
        console.warn('Ignoring input replay step because mode is', mode);
      }

      this.setState({
        replayTimeoutId: nextReplayTimeoutId
      });
    }

    // Accepts the input of a move and attempts to apply that
    // transform to the live piece in the live well.
    // Returns the new state.

  }, {
    key: 'handleMove',
    value: function handleMove(move) {
      var _props = this.props,
          enemyAi = _props.enemyAi,
          gameIsOver = _props.gameIsOver,
          placeFirstPiece = _props.placeFirstPiece;
      var _state2 = this.state,
          mode = _state2.mode,
          replay = _state2.replay,
          wellStateId = _state2.wellStateId,
          wellStates = _state2.wellStates;


      var nextWellStateId = wellStateId + 1;

      var nextReplay = void 0;
      var nextWellStates = void 0;

      if (wellStateId in replay && move === replay[wellStateId]) {
        nextReplay = replay;
        nextWellStates = wellStates;
      } else {
        // Push the new move
        nextReplay = replay.slice(0, wellStateId).concat([move]);

        // And truncate the future
        nextWellStates = wellStates.slice(0, wellStateId + 1);
      }

      if (!(nextWellStateId in nextWellStates)) {
        var _nextWellState = this.getNextState(nextWellStates[wellStateId], move);
        nextWellStates = nextWellStates.slice().concat([_nextWellState]);
      }

      var nextWellState = nextWellStates[nextWellStateId];

      var nextMode = gameIsOver(nextWellState) ? 'GAME_OVER' : mode === 'REPLAYING' && !(nextWellStateId in replay) ? 'PLAYING' : mode;

      // no live piece? make a new one
      // suited to the new world, of course
      if (nextWellState.piece === null && nextMode !== 'GAME_OVER') {
        nextWellState.piece = placeFirstPiece(enemyAi(nextWellState.well));
      }

      this.setState({
        mode: nextMode,
        wellStateId: nextWellStateId,
        wellStates: nextWellStates,
        replay: nextReplay
      });
    }
  }, {
    key: 'left',
    value: function left() {
      var mode = this.state.mode;

      if (mode === 'PLAYING') {
        this.handleMove('L');
      } else {
        console.warn('Ignoring event L because mode is', mode);
      }
    }
  }, {
    key: 'right',
    value: function right() {
      var mode = this.state.mode;

      if (mode === 'PLAYING') {
        this.handleMove('R');
      } else {
        console.warn('Ignoring event R because mode is', mode);
      }
    }
  }, {
    key: 'down',
    value: function down() {
      var mode = this.state.mode;

      if (mode === 'PLAYING') {
        this.handleMove('D');
      } else {
        console.warn('Ignoring event D because mode is', mode);
      }
    }
  }, {
    key: 'rotate',
    value: function rotate() {
      var mode = this.state.mode;

      if (mode === 'PLAYING') {
        this.handleMove('U');
      } else {
        console.warn('Ignoring event U because mode is', mode);
      }
    }
  }, {
    key: 'undo',
    value: function undo() {
      var _state3 = this.state,
          replayTimeoutId = _state3.replayTimeoutId,
          wellStateId = _state3.wellStateId,
          wellStates = _state3.wellStates;

      // There may be a replay in progress, this
      // must be killed

      if (replayTimeoutId) {
        clearTimeout(replayTimeoutId);
        this.setState({
          replayTimeoutId: undefined
        });
      }

      var nextWellStateId = wellStateId - 1;
      if (nextWellStateId in wellStates) {
        this.setState({
          mode: 'PLAYING',
          wellStateId: nextWellStateId,
          replayTimeoutId: undefined
        });
      } else {
        console.warn('Ignoring undo event because start of history has been reached');
      }
    }
  }, {
    key: 'redo',
    value: function redo() {
      var _state4 = this.state,
          mode = _state4.mode,
          replay = _state4.replay,
          wellStateId = _state4.wellStateId;


      if (mode === 'PLAYING' || mode === 'REPLAYING') {
        if (wellStateId in replay) {
          this.handleMove(replay[wellStateId]);
        } else {
          console.warn('Ignoring redo event because end of history has been reached');
        }
      } else {
        console.warn('Ignoring redo event because mode is', mode);
      }
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(event) {
      event = event || window.event; // add for IE

      if (event.keyCode === 37) {
        this.left();
      } else if (event.keyCode === 39) {
        this.right();
      } else if (event.keyCode === 40) {
        this.down();
      } else if (event.keyCode === 38) {
        this.rotate();
      } else if (event.keyCode === 90 && event.ctrlKey === true) {
        this.undo();
      } else if (event.keyCode === 89 && event.ctrlKey === true) {
        this.redo();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          bar = _props2.bar,
          rotationSystem = _props2.rotationSystem,
          wellDepth = _props2.wellDepth,
          wellWidth = _props2.wellWidth;
      var _state5 = this.state,
          mode = _state5.mode,
          replay = _state5.replay,
          wellStateId = _state5.wellStateId,
          wellStates = _state5.wellStates;


      var wellState = wellStateId === -1 ? null : wellStates[wellStateId];

      var score = wellState && wellState.score;
      var replayOut = mode === 'GAME_OVER' && replay.length > 0 ? 'replay of last game: ' + _replay2.default.encode(replay) : null;

      return _react2.default.createElement(
        'div',
        { className: 'hatetris' },
        _react2.default.createElement(
          'div',
          { className: 'hatetris__left' },
          _react2.default.createElement(_well2.default, {
            bar: bar,
            rotationSystem: rotationSystem,
            wellDepth: wellDepth,
            wellWidth: wellWidth,
            wellState: wellState,
            onClickL: this.left,
            onClickR: this.right,
            onClickU: this.rotate,
            onClickD: this.down,
            onClickZ: this.undo,
            onClickY: this.redo
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'hatetris__right' },
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'a',
              { href: 'http://qntm.org/hatetris' },
              'You\'re playing HATETRIS by qntm'
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'button',
              { type: 'button', onClick: this.startGame },
              'start new game'
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'button',
              { type: 'button', onClick: this.startReplay },
              'show a replay'
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'span',
              { className: 'hatetris__score' },
              score
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'span',
              { className: 'hatetris__replay-out' },
              replayOut
            )
          ),
          _react2.default.createElement('div', { className: 'hatetris__spacer' }),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            _react2.default.createElement(
              'a',
              { href: 'https://github.com/qntm/hatetris' },
              'source code'
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'hatetris__paragraph' },
            'replays encoded using ',
            _react2.default.createElement(
              'a',
              { href: 'https://github.com/qntm/base2048' },
              'Base2048'
            ),
            _react2.default.createElement('br', null)
          )
        )
      );
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  }]);

  return Game;
}(_react2.default.Component);

exports.default = Game;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (wellDepth, placeFirstPiece, enemyAi) {
  var well = [];
  for (var row = 0; row < wellDepth; row++) {
    well.push(0);
  }

  return {
    well: well,
    score: 0,
    piece: placeFirstPiece(enemyAi(well))
  };
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  Replay handling
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hex = __webpack_require__(14);

var _hex2 = _interopRequireDefault(_hex);

var _base = __webpack_require__(15);

var _base2 = _interopRequireDefault(_base);

var _base3 = __webpack_require__(17);

var _base4 = _interopRequireDefault(_base3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  Convert an array of moves into a replay
*/
// const encode = moves => hex.encode(moves)
// const encode = moves => base65536.encode(moves)
var encode = function encode(moves) {
  return _base4.default.encode(moves);
};

/**
  Convert a string back into an array of moves
*/
var decode = function decode(string) {
  if (/^[0123456789ABCDEF# ]*$/.test(string)) {
    return _hex2.default.decode(string);
  }
  try {
    return _base2.default.decode(string);
  } catch (e) {}
  return _base4.default.decode(string);
};

exports.default = { encode: encode, decode: decode };

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  Old hex-mode replays.
*/



/**
  Convert an array of moves into a replay
*/

Object.defineProperty(exports, "__esModule", {
  value: true
});
var encode = function encode(moves) {
  // Replays must have an even number of moves in order
  // for the encoding to work correctly
  if (moves.length % 2 === 1) {
    moves.push('D');
  }

  var movePairs = [];
  var movePair = '';
  moves.forEach(function (move) {
    movePair += move;
    if (movePair.length === 2) {
      movePairs.push(movePair);
      movePair = '';
    }
  });

  return movePairs.map(function (movePair) {
    if (movePair === 'LL') {
      return '0';
    }
    if (movePair === 'LR') {
      return '1';
    }
    if (movePair === 'LD') {
      return '2';
    }
    if (movePair === 'LU') {
      return '3';
    }
    if (movePair === 'RL') {
      return '4';
    }
    if (movePair === 'RR') {
      return '5';
    }
    if (movePair === 'RD') {
      return '6';
    }
    if (movePair === 'RU') {
      return '7';
    }
    if (movePair === 'DL') {
      return '8';
    }
    if (movePair === 'DR') {
      return '9';
    }
    if (movePair === 'DD') {
      return 'A';
    }
    if (movePair === 'DU') {
      return 'B';
    }
    if (movePair === 'UL') {
      return 'C';
    }
    if (movePair === 'UR') {
      return 'D';
    }
    if (movePair === 'UD') {
      return 'E';
    }
    if (movePair === 'UU') {
      return 'F';
    }
    throw Error('Unrecognised move pair: ' + movePair);
  }).replace(/(....)/g, '$1 '); // add a space every 4 characters
};

/**
  Convert a string back into an array of moves
*/
var decode = function decode(string) {
  var moves = [];
  string.split('').forEach(function (chr) {
    if (chr === '0') {
      moves.push('L', 'L');
    }
    if (chr === '1') {
      moves.push('L', 'R');
    }
    if (chr === '2') {
      moves.push('L', 'D');
    }
    if (chr === '3') {
      moves.push('L', 'U');
    }
    if (chr === '4') {
      moves.push('R', 'L');
    }
    if (chr === '5') {
      moves.push('R', 'R');
    }
    if (chr === '6') {
      moves.push('R', 'D');
    }
    if (chr === '7') {
      moves.push('R', 'U');
    }
    if (chr === '8') {
      moves.push('D', 'L');
    }
    if (chr === '9') {
      moves.push('D', 'R');
    }
    if (chr === 'A') {
      moves.push('D', 'D');
    }
    if (chr === 'B') {
      moves.push('D', 'U');
    }
    if (chr === 'C') {
      moves.push('U', 'L');
    }
    if (chr === 'D') {
      moves.push('U', 'R');
    }
    if (chr === 'E') {
      moves.push('U', 'D');
    }
    if (chr === 'F') {
      moves.push('U', 'U');
    }
    // Ignore others
  });
  return moves;
};

exports.default = { encode: encode, decode: decode };

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  New Base65536 replays.
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = __webpack_require__(16);

var _base2 = _interopRequireDefault(_base);

var _runLength = __webpack_require__(1);

var _runLength2 = _interopRequireDefault(_runLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  Convert an array of key strokes into a replay
*/
var encode = function encode(keys) {
  var rle = _runLength2.default.encode(keys, 4);

  // Can't have an odd number of runs. This would break in mid-byte!
  if (rle.length % 2 === 1) {
    rle.push({ entry: 'L', length: 1 });
  }

  rle = rle.map(function (run) {
    return {
      key: {
        L: 0,
        R: 1,
        D: 2,
        U: 3
      }[run.entry],
      rl: run.length - 1
    };
  });
  rle = rle.map(function (run) {
    return (run.key << 2) + run.rl;
  });

  var octets = [];
  for (var i = 0; i < rle.length; i += 2) {
    octets.push((rle[i] << 4) + rle[i + 1]);
  }

  var uint8Array = new Uint8Array(octets);

  return _base2.default.encode(uint8Array.buffer);
};

/**
  Convert a Base65536 string back into a list of keystrokes
*/
var decode = function decode(string) {
  var uint8Array = new Uint8Array(_base2.default.decode(string));

  var octets = [];
  for (var i = 0; i < uint8Array.length; i++) {
    octets.push(uint8Array[i]);
  }

  var rle = [];
  octets.forEach(function (octet) {
    rle.push(octet >> 4);
    rle.push(octet & (1 << 4) - 1);
  });

  rle = rle.map(function (run) {
    return {
      key: run >> 2,
      rl: run & (1 << 2) - 1
    };
  });

  rle = rle.map(function (run) {
    return {
      entry: {
        0: 'L',
        1: 'R',
        2: 'D',
        3: 'U'
      }[run.key],
      length: run.rl + 1
    };
  });

  return _runLength2.default.decode(rle);
};

exports.default = { encode: encode, decode: decode };

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Routines for converting binary data into text data which can be sent safely
 * through 'Unicode-clean' text systems without information being lost. Analogous
 * to Base64 with a significantly larger character repertoire enabling the
 * encoding of 2.00 bytes per character (for comparison, Base64 manages 0.75 bytes
 * per character).
 */


exports.__esModule = true;
// Some constants for UTF-16 encoding/decoding of
// code points outside the BMP
// Code points outside of the BMP are from 65536 to
// 1114111, so we subtract this figure to make them
// from 0 to 1048575, 20 bits.
var bmpThreshold = 1 << 16;
// 10 most significant bits go in the high surrogate,
// the rest in the low surrogate
var offset = 1 << 10;
// High surrogate. Lowest 10 bits are free
var high = 0xD800;
// Low surrogate. Lowest 10 bits are free. So a
// high surrogate and a low surrogate between them
// can encode 20 bits.
var low = 0xDC00;
// Because the spread operator isn't universal. :-/
// Return code points directly instead of individual
// characters to save some steps
var spreadString = function spreadString(str) {
    var codePoints = [];
    var i = 0;
    while (i < str.length) {
        var first = str.charCodeAt(i);
        i++;
        if (high <= first && first < high + offset) {
            // UTF-16 decode
            var second = str.charCodeAt(i);
            i++;
            if (low <= second && second < low + offset) {
                codePoints.push((first - high) * offset + (second - low) + bmpThreshold);
            } else {
                throw Error('Invalid UTF-16');
            }
        } else {
            codePoints.push(first);
        }
    }
    return codePoints;
};
var unspreadString = function unspreadString(codePoints) {
    return codePoints.map(function (codePoint) {
        if (codePoint < bmpThreshold) {
            return String.fromCharCode(codePoint);
        }
        // UTF-16 post-BMP encode
        var first = high + (codePoint - bmpThreshold) / offset;
        var second = low + codePoint % offset;
        return String.fromCharCode(first) + String.fromCharCode(second);
    }).join('');
};
var paddingBlockStart = spreadString('ᔀ')[0];
var blockStarts = spreadString('㐀㔀㘀㜀㠀㤀㨀㬀㰀㴀㸀㼀䀀䄀䈀䌀' + '䐀䔀䘀䜀䠀䤀䨀䬀䰀一伀倀儀刀匀吀' + '唀嘀圀堀夀娀嬀尀崀帀开怀愀戀挀搀' + '攀昀最栀椀樀欀氀洀渀漀瀀焀爀猀琀' + '甀瘀眀砀礀稀笀簀紀縀缀耀脀舀茀萀' + '蔀蘀蜀蠀褀言謀谀贀踀輀退鄀鈀錀鐀' + '销阀需頀餀騀鬀鰀鴀鸀ꄀꈀꌀꔀ𐘀𒀀' + '𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀𠀀𠄀𠈀𠌀𠐀𠔀' + '𠘀𠜀𠠀𠤀𠨀𠬀𠰀𠴀𠸀𠼀𡀀𡄀𡈀𡌀𡐀𡔀' + '𡘀𡜀𡠀𡤀𡨀𡬀𡰀𡴀𡸀𡼀𢀀𢄀𢈀𢌀𢐀𢔀' + '𢘀𢜀𢠀𢤀𢨀𢬀𢰀𢴀𢸀𢼀𣀀𣄀𣈀𣌀𣐀𣔀' + '𣘀𣜀𣠀𣤀𣨀𣬀𣰀𣴀𣸀𣼀𤀀𤄀𤈀𤌀𤐀𤔀' + '𤘀𤜀𤠀𤤀𤨀𤬀𤰀𤴀𤸀𤼀𥀀𥄀𥈀𥌀𥐀𥔀' + '𥘀𥜀𥠀𥤀𥨀𥬀𥰀𥴀𥸀𥼀𦀀𦄀𦈀𦌀𦐀𦔀' + '𦘀𦜀𦠀𦤀𦨀𦬀𦰀𦴀𦸀𦼀𧀀𧄀𧈀𧌀𧐀𧔀' + '𧘀𧜀𧠀𧤀𧨀𧬀𧰀𧴀𧸀𧼀𨀀𨄀𨈀𨌀𨐀𨔀');
var possibleBytes = 1 << 8;
var b2s = {};
for (var b = 0; b < possibleBytes; b++) {
    b2s[blockStarts[b]] = b;
}
exports.encode = function (arrayBuffer, wrap) {
    if (wrap === void 0) {
        wrap = Infinity;
    }
    var uint8Array = new Uint8Array(arrayBuffer);
    var oddByte;
    var codePoints = [];
    for (var i = 0; i < uint8Array.length; i++) {
        if (oddByte === undefined) {
            oddByte = uint8Array[i];
        } else {
            codePoints.push(blockStarts[uint8Array[i]] + oddByte);
            oddByte = undefined;
        }
    }
    if (oddByte !== undefined) {
        codePoints.push(paddingBlockStart + oddByte);
        oddByte = undefined;
    }
    for (var i = wrap; i < codePoints.length; i += wrap + 1) {
        codePoints.splice(i, 0, 0x0A);
    }
    return unspreadString(codePoints);
};
exports.decode = function (str, ignoreGarbage) {
    if (ignoreGarbage === void 0) {
        ignoreGarbage = false;
    }
    var done = false;
    var bytes = [];
    spreadString(str).forEach(function (codePoint) {
        var b1 = codePoint & possibleBytes - 1;
        var blockStart = codePoint - b1;
        if (blockStart === paddingBlockStart) {
            if (done) {
                throw Error('Base65536 sequence continued after final byte');
            }
            bytes.push(b1);
            done = true;
        } else {
            var b2 = b2s[blockStart];
            if (b2 !== undefined) {
                if (done) {
                    throw Error('Base65536 sequence continued after final byte');
                }
                bytes.push(b1, b2);
            } else if (!ignoreGarbage) {
                throw Error('Not a valid Base65536 code point: ' + String(codePoint));
            }
        }
    });
    var uint8Array = new Uint8Array(bytes);
    var arrayBuffer = uint8Array.buffer;
    return arrayBuffer;
};
exports["default"] = { encode: exports.encode, decode: exports.decode };

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  New new Base2048 replays!
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = __webpack_require__(18);

var _base2 = _interopRequireDefault(_base);

var _runLength = __webpack_require__(1);

var _runLength2 = _interopRequireDefault(_runLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  Convert an array of key strokes into a replay
*/
var encode = function encode(keys) {
  var rle = _runLength2.default.encode(keys, 4);

  // Can't have an odd number of runs. This would break in mid-byte!
  if (rle.length % 2 === 1) {
    rle.push({ entry: 'L', length: 1 });
  }

  rle = rle.map(function (run) {
    return {
      key: {
        L: 0,
        R: 1,
        D: 2,
        U: 3
      }[run.entry],
      rl: run.length - 1
    };
  });

  rle = rle.map(function (run) {
    return (run.key << 2) + run.rl;
  });

  var octets = [];
  for (var i = 0; i < rle.length; i += 2) {
    octets.push((rle[i] << 4) + rle[i + 1]);
  }

  var uint8Array = new Uint8Array(octets);

  return _base2.default.encode(uint8Array.buffer);
};

/**
  Convert a Base2048 string back into a list of keystrokes
*/
var decode = function decode(string) {
  var uint8Array = new Uint8Array(_base2.default.decode(string));

  var octets = [];
  for (var i = 0; i < uint8Array.length; i++) {
    octets.push(uint8Array[i]);
  }

  var rle = [];
  octets.forEach(function (octet) {
    rle.push(octet >> 4);
    rle.push(octet & (1 << 4) - 1);
  });

  rle = rle.map(function (run) {
    return {
      key: run >> 2,
      rl: run & (1 << 2) - 1
    };
  });

  rle = rle.map(function (run) {
    return {
      entry: {
        0: 'L',
        1: 'R',
        2: 'D',
        3: 'U'
      }[run.key],
      length: run.rl + 1
    };
  });

  return _runLength2.default.decode(rle);
};

exports.default = { encode: encode, decode: decode };

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var repertoires = ['89ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÆÐØÞßæðøþĐđĦħıĸŁłŊŋŒœŦŧƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƢƣƤƥƦƧƨƩƪƫƬƭƮƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǝǤǥǶǷȜȝȠȡȢȣȤȥȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯͰͱͲͳͶͷͻͼͽͿΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϏϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϳϷϸϺϻϼϽϾϿЂЄЅІЈЉЊЋЏАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюяђєѕіјљњћџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѸѹѺѻѼѽѾѿҀҁҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӃӄӅӆӇӈӉӊӋӌӍӎӏӔӕӘәӠӡӨөӶӷӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆאבגדהוזחטיךכלםמןנסעףפץצקרשתװױײؠءابةتثجحخدذرزسشصضطظعغػؼؽؾؿفقكلمنهوىي٠١٢٣٤٥٦٧٨٩ٮٯٱٲٳٴٹٺٻټٽپٿڀځڂڃڄڅچڇڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙښڛڜڝڞڟڠڡڢڣڤڥڦڧڨکڪګڬڭڮگڰڱڲڳڴڵڶڷڸڹںڻڼڽھڿہۃۄۅۆۇۈۉۊۋیۍێۏېۑےەۮۯ۰۱۲۳۴۵۶۷۸۹ۺۻۼۿܐܒܓܔܕܖܗܘܙܚܛܜܝܞܟܠܡܢܣܤܥܦܧܨܩܪܫܬܭܮܯݍݎݏݐݑݒݓݔݕݖݗݘݙݚݛݜݝݞݟݠݡݢݣݤݥݦݧݨݩݪݫݬݭݮݯݰݱݲݳݴݵݶݷݸݹݺݻݼݽݾݿހށނރބޅކއވމފދތލގޏސޑޒޓޔޕޖޗޘޙޚޛޜޝޞޟޠޡޢޣޤޥޱ߀߁߂߃߄߅߆߇߈߉ߊߋߌߍߎߏߐߑߒߓߔߕߖߗߘߙߚߛߜߝߞߟߠߡߢߣߤߥߦߧߨߩߪࠀࠁࠂࠃࠄࠅࠆࠇࠈࠉࠊࠋࠌࠍࠎࠏࠐࠑࠒࠓࠔࠕࡀࡁࡂࡃࡄࡅࡆࡇࡈࡉࡊࡋࡌࡍࡎࡏࡐࡑࡒࡓࡔࡕࡖࡗࡘࡠࡡࡢࡣࡤࡥࡦࡧࡨࡩࡪࢠࢡࢢࢣࢤࢥࢦࢧࢨࢩࢪࢫࢬࢭࢮࢯࢰࢱࢲࢳࢴࢶࢷࢸࢹࢺࢻࢼࢽऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहऽॐॠॡ०१२३४५६७८९ॲॳॴॵॶॷॸॹॺॻॼॽॾॿঀঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঽৎৠৡ০১২৩৪৫৬৭৮৯ৰৱ৴৵৶৷৸৹ৼਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹੜ੦੧੨੩੪੫੬੭੮੯ੲੳੴઅઆઇઈઉઊઋઌઍએઐઑઓઔકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલળવશષસહઽૐૠૡ૦૧૨૩૪૫૬૭૮૯ૹଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହଽୟୠୡ୦୧୨୩୪୫୬୭୮୯ୱ୲୳୴୵୶୷ஃஅஆஇஈஉஊஎஏஐஒஓகஙசஜஞடணதநனபமயரறலளழவஶஷஸஹௐ௦௧௨௩௪௫௬௭௮௯௰௱௲అఆఇఈఉఊఋఌఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరఱలళఴవశషసహఽౘౙౚౠౡ౦౧౨౩౪౫౬౭౮౯౸౹౺౻౼౽౾ಀಅಆಇಈಉಊಋಌಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಱಲಳವಶಷಸಹಽೞೠೡ೦೧೨೩೪೫೬೭೮೯ೱೲഅആഇഈഉഊഋഌഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനഩപഫബഭമയരറലളഴവശഷസഹഺഽൎൔൕൖ൘൙൚൛൜൝൞ൟൠൡ൦൧൨൩൪൫൬൭൮൯൰൱൲൳൴൵൶൷൸ൺൻർൽൾൿඅආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤඥඦටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහළෆ෦෧෨෩෪෫෬෭෮෯กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะาเแโใไๅ๐๑๒๓๔๕๖๗๘๙ກຂຄງຈຊຍດຕຖທນບປຜຝພຟມຢຣລວສຫອຮຯະາຽເແໂໃໄ໐໑໒໓໔໕໖໗໘໙ໞໟༀ༠༡༢༣༤༥༦༧༨༩༪༫༬༭༮༯༰༱༲༳ཀཁགངཅཆཇཉཊཋཌཎཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤཥསཧཨཪཫཬྈྉྊྋྌကခဂဃငစဆဇဈဉညဋဌဍဎဏတထဒဓနပဖဗဘမယရလဝသဟဠအဢဣဤဥဧဨဩဪဿ၀၁၂၃၄၅၆၇၈၉ၐၑၒၓၔၕ', '01234567'];

var MAGIC_NUMBER_A = 11; // Base2048 is an 11-bit encoding
var MAGIC_NUMBER_B = 8; // Bits in a byte

var lookupEncode = {};
var lookupDecode = {};
repertoires.forEach(function (repertoire, r) {
  lookupEncode[r] = {};
  lookupDecode[r] = {};
  repertoire.split('').forEach(function (chr, k) {
    var codePoint = chr.charCodeAt(0); // All CPs are in the BMP which means we don't need String.prototype.codePointAt
    lookupEncode[r][k] = codePoint;
    lookupDecode[r][codePoint] = k;
  });
});

/**
  Input an array of {byte, numBits}. Output an array of bits.
*/
var sizedBytesToBits = function sizedBytesToBits(sizedBytes) {
  var bits = [];
  sizedBytes.forEach(function (sizedByte) {
    var byte = sizedByte.byte;
    var numBits = sizedByte.numBits;

    if (byte !== Number(byte)) {
      throw new Error('Not an number: ' + String(byte));
    }
    if (Math.floor(byte) !== byte) {
      throw new Error('Not an integer: ' + String(byte));
    }
    if (byte < 0 || 1 << numBits <= byte) {
      throw new Error('Integer out of range: ' + String(byte));
    }

    // Take most significant bit first
    for (var i = numBits - 1; i >= 0; i--) {
      var bit = (byte & 1 << i) >> i;
      if (bit !== 0 && bit !== 1) {
        throw new Error('Not a bit: ' + String(bit));
      }
      bits.push(bit === 1);
      byte -= bit << i;
    }

    if (byte !== 0) {
      throw new Error('Somehow did not consume all bits: ' + String(byte));
    }
  });
  return bits;
};

/**
  Input an array of bits and a desired size. Output an array of {byte,
  numBits}. The latter will be the desired size except possibly for the
  final element in the array which will likely be smaller (but not zero)
*/
var bitsToSizedBytes = function bitsToSizedBytes(bits, size) {
  var sizedBytes = [];
  var byte = 0;
  var numBits = 0;
  bits.forEach(function (bit, n) {
    byte = (byte << 1) + (bit ? 1 : 0);
    numBits++;
    if (numBits === size || n === bits.length - 1) {
      sizedBytes.push({
        byte: byte,
        numBits: numBits
      });
      byte = 0;
      numBits = 0;
    }
  });
  return sizedBytes;
};

module.exports = {
  encode: function encode(arrayBuffer) {
    var uint8Array = new Uint8Array(arrayBuffer);

    var uint8s = [].concat(_toConsumableArray(uint8Array.values()));

    var sizedBytes = uint8s.map(function (uint8) {
      return {
        byte: uint8,
        numBits: MAGIC_NUMBER_B
      };
    });

    var bits = sizedBytesToBits(sizedBytes);

    var resizedBytes = bitsToSizedBytes(bits, MAGIC_NUMBER_A);

    var ks = resizedBytes.map(function (sizedByte, i, arr) {
      var byte = sizedByte.byte;
      var numBits = sizedByte.numBits;

      // The final character requires special treatment.
      if (numBits !== MAGIC_NUMBER_A) {
        if (i !== arr.length - 1) {
          throw new Error('Incomplete byte found midway through stream');
        }

        // byte = bbbcccccccc, numBits = 11, padBits = 0
        // byte = bbcccccccc, numBits = 10, padBits = 1
        // byte = bcccccccc, numBits = 9, padBits = 2
        // byte = cccccccc, numBits = 8, padBits = 3
        // byte = ccccccc, numBits = 7, padBits = 4
        // byte = cccccc, numBits = 6, padBits = 5
        // byte = ccccc, numBits = 5, padBits = 6
        // byte = cccc, numBits = 4, padBits = 7
        // => Pad `byte` out to 11 bits using 1s, then encode as normal (repertoire 0)

        // byte = ccc, numBits = 3, padBits = 0
        // byte = cc, numBits = 2, padBits = 1
        // byte = c, numBits = 1, padBits = 2
        // => Pad `byte` out to 3 bits using 1s, then encode specially (repertoire 1)

        var padBits = (MAGIC_NUMBER_A - numBits) % MAGIC_NUMBER_B; // 0 to 7
        byte = (byte << padBits) + ((1 << padBits) - 1);
        numBits += padBits; // 11 or 3
      }

      var r = (MAGIC_NUMBER_A - numBits) / MAGIC_NUMBER_B; // 0 or 1
      return {
        k: byte,
        r: r
      };
    });

    var codePoints = ks.map(function (pair) {
      var k = pair.k;
      var r = pair.r;

      if (!(r in lookupEncode)) {
        throw new Error('Unrecognised `r`: ' + String(r));
      }
      if (!(k in lookupEncode[r])) {
        throw new Error('Unrecognised `k`: ' + String(k));
      }

      return lookupEncode[r][k];
    });

    var chars = codePoints.map(function (codePoint) {
      return String.fromCharCode(codePoint);
    });

    var str = chars.join('');

    return str;
  },

  decode: function decode(str) {
    var chars = str.split('');

    var codePoints = chars.map(function (ch) {
      return ch.charCodeAt(0);
    });

    var ks = codePoints.map(function (codePoint) {
      for (var r = 0; r in lookupDecode; r++) {
        if (codePoint in lookupDecode[r]) {
          return {
            k: lookupDecode[r][codePoint],
            r: r
          };
        }
      }
      throw new Error('Unrecognised `codePoint`: ' + String(codePoint));
    });

    var resizedBytes = ks.map(function (pair, i, arr) {
      // Check for padding characters in the middle.
      if (pair.r !== 0 && i !== arr.length - 1) {
        throw new Error('Padding character found before end of input at position ' + String(i));
      }
      var numBits = MAGIC_NUMBER_A - MAGIC_NUMBER_B * pair.r; // 11 or 3
      return {
        byte: pair.k,
        numBits: numBits
      };
    });

    var bits = sizedBytesToBits(resizedBytes);

    var sizedBytes = bitsToSizedBytes(bits, MAGIC_NUMBER_B).filter(function (sizedByte, i, arr) {
      if (sizedByte.numBits === MAGIC_NUMBER_B) {
        return true;
      }

      if (i !== arr.length - 1) {
        throw new Error('Incomplete byte found midway through stream');
      }

      // Final padding byte! Requires special consideration!
      // Remember how we always pad with 1s?
      if (sizedByte.byte !== (1 << sizedByte.numBits) - 1) {
        throw new Error('Padding mismatch');
      }

      return false;
    });

    var uint8s = sizedBytes.map(function (sizedByte) {
      return sizedByte.byte;
    });

    var uint8Array = new Uint8Array(uint8s);

    var arrayBuffer = uint8Array.buffer;

    return arrayBuffer;
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classnames = __webpack_require__(20);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  var bar = props.bar,
      rotationSystem = props.rotationSystem,
      wellDepth = props.wellDepth,
      wellWidth = props.wellWidth,
      onClickL = props.onClickL,
      onClickR = props.onClickR,
      onClickU = props.onClickU,
      onClickD = props.onClickD,
      onClickZ = props.onClickZ,
      onClickY = props.onClickY,
      wellState = props.wellState;


  var well = wellState && wellState.well;
  var piece = wellState && wellState.piece;

  var cellses = [];
  for (var y = 0; y < wellDepth; y++) {
    var cells = [];
    for (var x = 0; x < wellWidth; x++) {
      var cell = {};

      if (well === null) {
        cell.landed = false;
      } else {
        cell.landed = well[y] & 1 << x;
      }

      if (piece === null) {
        cell.live = false;
      } else {
        var orientation = rotationSystem[piece.id][piece.o];
        var y2 = y - piece.y - orientation.yMin;
        var x2 = x - piece.x - orientation.xMin;
        cell.live = y2 >= 0 && y2 < orientation.yDim && x2 >= 0 && x2 < orientation.xDim && orientation.rows[y2] & 1 << x2;
      }

      cells.push(cell);
    }
    cellses.push(cells);
  }

  // put some buttons on the playing field
  var buttons = [{ y: 0, x: 0, onClick: onClickZ, symbol: '\u21B6', title: 'Press Ctrl+Z to undo' }, { y: 0, x: 1, onClick: onClickU, symbol: '\u27F3', title: 'Press Up to rotate' }, { y: 0, x: 2, onClick: onClickY, symbol: '\u21B7', title: 'Press Ctrl+Y to redo' }, { y: 1, x: 0, onClick: onClickL, symbol: '\u2190', title: 'Press Left to move left' }, { y: 1, x: 1, onClick: onClickD, symbol: '\u2193', title: 'Press Down to move down' }, { y: 1, x: 2, onClick: onClickR, symbol: '\u2192', title: 'Press Right to move right' }];

  buttons.forEach(function (button) {
    cellses[button.y][button.x].onClick = button.onClick;
    cellses[button.y][button.x].symbol = button.symbol;
    cellses[button.y][button.x].title = button.title;
  });

  return React.createElement(
    'table',
    null,
    React.createElement(
      'tbody',
      { className: 'hatetris__welltbody' },
      cellses.map(function (cells, y) {
        return React.createElement(
          'tr',
          { key: y },
          cells.map(function (cell, x) {
            return React.createElement(
              'td',
              {
                key: x,
                className: (0, _classnames2.default)({
                  hatetris__cell: true,
                  'hatetris__cell--bar': y === bar,
                  'hatetris__cell--manual': 'event' in cell,
                  'hatetris__cell--landed': cell.landed,
                  'hatetris__cell--live': cell.live
                }),
                onClick: cell.onClick || null,
                title: cell.title
              },
              cell.symbol
            );
          })
        );
      })
    )
  );
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if ("function" === 'function' && _typeof(__webpack_require__(2)) === 'object' && __webpack_require__(2)) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
})();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// TODO: this AI is needs to be made agnostic to the order of pieces
// given in the rotation system. At present it just returns whatever
// the first one is!

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getGetPossibleFutures = __webpack_require__(22);

var _getGetPossibleFutures2 = _interopRequireDefault(_getGetPossibleFutures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchDepth = 0; // min = 0, suggested max = 1

exports.default = function (rotationSystem, placeFirstPiece, bar, wellDepth, wellWidth) {
  var getPossibleFutures = (0, _getGetPossibleFutures2.default)(rotationSystem, placeFirstPiece, bar, wellDepth, wellWidth);

  var getHighestBlue = function getHighestBlue(well) {
    var row = void 0;
    for (row = 0; row < well.length; row++) {
      if (well[row] !== 0) {
        break;
      }
    }
    return row;
  };

  // deeper lines are worth less than immediate lines
  // this is so the game will never give you a line if it can avoid it
  // NOTE: make sure rating doesn't return a range of more than 100 values...
  var getWellRating = function getWellRating(well, depthRemaining) {
    return getHighestBlue(well) + (depthRemaining === 0 ? 0 : getWorstPieceRating(well, depthRemaining - 1) / 100);
  };

  /**
    Given a well and a piece, find the best possible location to put it.
    Return the best rating found.
  */
  var getBestWellRating = function getBestWellRating(well, pieceId, depthRemaining) {
    return Math.max.apply(Math, getPossibleFutures(well, pieceId).map(function (possibleFuture) {
      return getWellRating(possibleFuture.well, depthRemaining);
    }));
  };

  var getWorstPieceDetails = function getWorstPieceDetails(well, depthRemaining) {
    return Object.keys(rotationSystem).map(function (pieceId) {
      return {
        pieceId: pieceId,
        rating: getBestWellRating(well, pieceId, depthRemaining)
      };
    }).sort(function (a, b) {
      return a.rating - b.rating;
    })[0];
  };

  // pick the worst piece that could be put into this well
  // return the rating of this piece
  // but NOT the piece itself...
  var getWorstPieceRating = function getWorstPieceRating(well, depthRemaining) {
    return getWorstPieceDetails(well, depthRemaining).rating;
  };

  // pick the worst piece that could be put into this well
  // return the piece but not its rating
  var getWorstPiece = function getWorstPiece(well) {
    return getWorstPieceDetails(well, searchDepth).pieceId;
  };

  return getWorstPiece;
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getGetNextState = __webpack_require__(0);

var _getGetNextState2 = _interopRequireDefault(_getGetNextState);

var _moves = __webpack_require__(23);

var _moves2 = _interopRequireDefault(_moves);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (rotationSystem, placeFirstPiece, bar, wellDepth, wellWidth) {
  var getNextState = (0, _getGetNextState2.default)(rotationSystem, bar, wellDepth, wellWidth);

  /**
    Given a well and a piece ID, find all possible places where it could land
    and return the array of "possible future" states. All of these states
    will have `null` `piece` because the piece is landed; some will have
    an increased `score`.
  */
  return function (well, pieceId) {
    /**
      Generate a unique integer to describe the position and orientation of this piece.
      `x` varies between -3 and (`wellWidth` - 1) inclusive, so range = `wellWidth` + 3
      `y` varies between 0 and (`wellDepth` + 2) inclusive, so range = `wellDepth` + 3
      `o` varies between 0 and 3 inclusive, so range = 4
    */
    var hashCode = function hashCode(x, y, o) {
      return (x * (wellDepth + 3) + y) * 4 + o;
    };

    var piece = placeFirstPiece(pieceId);

    // move the piece down to a lower position before we have to
    // start pathfinding for it
    // move through empty rows
    while (piece.y + 4 < wellDepth && // piece is above the bottom
    well[piece.y + 4] === 0 // nothing immediately below it
    ) {
      piece = getNextState({
        well: well,
        score: 0,
        piece: piece
      }, 'D').piece;
    }

    // push first position
    var piecePositions = [piece];

    var seen = [];
    seen[hashCode(piece.x, piece.y, piece.o)] = 1;

    var possibleFutures = [];

    // a simple for loop won't work here because
    // we are increasing the list as we go
    var i = 0;
    while (i < piecePositions.length) {
      piece = piecePositions[i];

      // apply all possible moves
      _moves2.default.forEach(function (move) {
        var nextState = getNextState({
          well: well,
          score: 0,
          piece: piece
        }, move);
        var newPiece = nextState.piece;

        // transformation failed?
        if (newPiece === null) {
          // piece locked? better add that to the list
          // do NOT check locations, they aren't significant here
          if (move === 'D') {
            possibleFutures.push(nextState);
          }
        } else {
          // transform succeeded?
          // new location? append to list
          // check locations, they are significant
          var newHashCode = hashCode(newPiece.x, newPiece.y, newPiece.o);

          if (seen[newHashCode] === undefined) {
            piecePositions.push(newPiece);
            seen[newHashCode] = 1;
          }
        }
      });
      i++;
    }

    return possibleFutures;
  };
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['L', 'R', 'D', 'U'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
  Game over conditions for HATETRIS. This is very simple, all we need
  to do is test for whether there is a piece above the bar
*/

exports.default = function (bar) {
  return (
    // Is the game over?
    // It is impossible to get bits at row (bar - 2) or higher without getting a bit at row (bar - 1),
    // so there is only one line which we need to check.
    function (wellState) {
      return wellState.well[bar - 1] !== 0;
    }
  );
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (wellWidth) {
  return function (pieceId) {
    return {
      id: pieceId,
      x: Math.floor((wellWidth - 4) / 2),
      y: 0,
      o: 0
    };
  };
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  The HATETRIS rotation system
*/



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._doPiece = _doPiece;
var dim = 4;
var directions = 4;

function _doPiece(piece) {
  if (piece.length !== dim) {
    throw Error('Pieces must be ' + String(dim) + ' by ' + String(dim));
  }

  var bits = [];
  piece.forEach(function (string, y) {
    if (string.length !== dim) {
      throw Error('Pieces must be ' + String(dim) + ' by ' + String(dim));
    }

    for (var x = 0; x < string.length; x++) {
      if (string.charAt(x) === '#') {
        bits.push({ x: x, y: y });
      } else if (string.charAt(x) !== '.') {
        throw Error('Misconfigured pieces');
      }
    }
  });

  var layouts = [];

  var _loop = function _loop(o) {
    var layout = [];
    for (var y = 0; y < dim; y++) {
      var row = [];
      for (var x = 0; x < dim; x++) {
        row.push(false);
      }
      layout.push(row);
    }

    bits.forEach(function (bit) {
      layout[bit.y][bit.x] = true;
    });

    layouts.push(layout);

    // Rotate bits around the middle of the 4x4 grid
    bits = bits.map(function (bit) {
      return {
        x: dim - 1 - bit.y,
        y: bit.x
      };
    });
  };

  for (var o = 0; o < directions; o++) {
    _loop(o);
  }

  return layouts.map(function (layout) {
    var xMin = Infinity; // minimum X coordinate of bits in this orientation (0, 1, 2 or 3)
    var yMin = Infinity; // minimum Y coordinate of bits in this orientation (0, 1, 2 or 3)
    var xMax = -Infinity; // width
    var yMax = -Infinity; // height
    var rows = []; // binary representation of the bits on each row
    for (var y = 0; y < dim; y++) {
      var row = 0;
      for (var x = 0; x < dim; x++) {
        if (layout[y][x]) {
          row += 1 << x;
          if (x < xMin) {
            xMin = x;
          }
          if (x > xMax) {
            xMax = x;
          }
          if (y < yMin) {
            yMin = y;
          }
          if (y > yMax) {
            yMax = y;
          }
        }
      }
      rows[y] = row;
    }
    xMax++;
    yMax++;

    // truncate top rows
    // truncate bottom rows
    // shift right as many times as necessary
    rows = rows.slice(yMin, yMax).map(function (row) {
      return row >> xMin;
    });
    var xDim = xMax - xMin;
    var yDim = yMax - yMin;

    return {
      xMin: xMin,
      yMin: yMin,
      xDim: xDim,
      yDim: yDim,
      rows: rows
    };
  });
}

// Note that the order here is significant,
// the least convenient piece is placed first.
var pieces = [['....', '..##', '.##.', '....'], ['....', '.##.', '..##', '....'], ['....', '.##.', '.##.', '....'], ['....', '####', '....', '....'], ['....', '.###', '.#..', '....'], ['....', '.##.', '.#..', '.#..'], ['....', '.###', '..#.', '....']];

exports.default = pieces.map(_doPiece);

/***/ })
/******/ ]);