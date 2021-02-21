/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/Bot.ts":
/*!********************!*\
  !*** ./lib/Bot.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "Genome": () => (/* binding */ Genome)
/* harmony export */ });
/* harmony import */ var _drawing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawing */ "./lib/drawing.ts");
/* harmony import */ var _math_functions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math-functions */ "./lib/math-functions.ts");
/* harmony import */ var _world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./world */ "./lib/world.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Bot = /** @class */ (function (_super) {
    __extends(Bot, _super);
    function Bot(world, x, y, color, energy, genome) {
        var _this = _super.call(this, world, x, y, color) || this;
        _this.energy = energy;
        _this.genome = genome;
        Bot.amount++;
        _this._narrow = (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(0, 8);
        _this.age = 0;
        return _this;
    }
    Object.defineProperty(Bot.prototype, "narrow", {
        get: function () {
            return this._narrow;
        },
        set: function (n) {
            this._narrow = (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.fixNumber)(0, 8, n);
        },
        enumerable: false,
        configurable: true
    });
    Bot.prototype.narrowToCoords = function () {
        //   0 1 2
        //   7   3
        //   6 5 4
        var coords = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
        ];
        var x = this.x + coords[this.narrow][0];
        var y = this.y + coords[this.narrow][1];
        return [x, y];
    };
    Bot.prototype.getForvard = function () {
        var _a, _b;
        var coords = (_a = this.world).fixCoords.apply(_a, this.narrowToCoords());
        return { block: (_b = this.world).get.apply(_b, coords), coords: coords };
    };
    Bot.prototype.moveTo = function (x, y) {
        this.world.swap(this.x, this.y, x, y);
    };
    Bot.prototype.multiplyTo = function (x, y) {
        new Bot(this.world, x, y, this.color, this.energy / 3, this.genome.replication());
        this.energy /= 3;
    };
    Bot.prototype.randMove = function () {
        var coords = this.world.fixCoords(this.x + (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(-1, 2), this.y + (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(-1, 2));
        this.moveTo.apply(this, coords);
    };
    Bot.prototype.onStep = function () {
        if (this.energy < 1 || this.age > 200) {
            this.alive = false;
            return;
        }
        this.genome.doAction(this);
        this.age += 1;
    };
    Bot.prototype.onDie = function () {
        Bot.amount--;
    };
    Bot.amount = 0;
    return Bot;
}(_world__WEBPACK_IMPORTED_MODULE_2__.DynamicBlock));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Bot);
var Genome = /** @class */ (function () {
    function Genome(length) {
        this.length = length;
        this.genes = [];
        this._pointer = 0;
    }
    Object.defineProperty(Genome.prototype, "pointer", {
        get: function () {
            return this._pointer;
        },
        set: function (n) {
            this._pointer = (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.fixNumber)(0, this.length, n);
        },
        enumerable: false,
        configurable: true
    });
    Genome.prototype.randGene = function () {
        return {
            action: (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randChoice)(GENE_TEMPLATES),
            property: Math.random(),
            branches: [
                (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(0, this.length),
                (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(0, this.length),
                (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(0, this.length),
                (0,_math_functions__WEBPACK_IMPORTED_MODULE_1__.randInt)(0, this.length)
            ]
        };
    };
    Genome.prototype.fillRandom = function () {
        for (var i = 0; i < this.length; i++) {
            this.genes[i] = this.randGene();
        }
        return this;
    };
    Genome.prototype.replication = function () {
        var genome = new Genome(this.length);
        for (var i = 0; i < this.length; i++) {
            if (Math.random() > 0.99) {
                genome.genes[i] = this.randGene();
            }
            else {
                genome.genes[i] = this.genes[i];
            }
        }
        return genome;
    };
    Genome.prototype.doAction = function (bot) {
        var GENE = this.genes[this.pointer];
        var RESULT = GENE.action(bot, GENE.property, GENE.branches);
        if (RESULT.goto) {
            this.pointer = RESULT.goto;
        }
        else {
            this.pointer++;
        }
    };
    return Genome;
}());

var GENE_TEMPLATES = [
    // Photosynthesis
    function (bot, property, branches) {
        bot.energy += 1;
        bot.color = bot.color.interpolate(new _drawing__WEBPACK_IMPORTED_MODULE_0__.Rgba(0, 255, 0, 255), 0.01);
        return { completed: true };
    },
    // Rotate
    function (bot, property, branches) {
        if (property > 0.5) {
            bot.narrow++;
        }
        else {
            bot.narrow--;
        }
        return { completed: false };
    },
    // Multiply
    function (bot, property, branches) {
        var forward = bot.getForvard();
        if (!forward.block) {
            bot.multiplyTo.apply(bot, forward.coords);
        }
        return { completed: true };
    },
    // Look forward
    function (bot, property, branches) {
        bot.color = bot.color.interpolate(new _drawing__WEBPACK_IMPORTED_MODULE_0__.Rgba(0, 0, 0, 255), 0.01);
        var forward = bot.getForvard();
        if (!forward.block) {
            return { completed: false, goto: branches[0] };
        }
        else {
            return { completed: false, goto: branches[1] };
        }
    },
];


/***/ }),

/***/ "./lib/Grid.ts":
/*!*********************!*\
  !*** ./lib/Grid.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _math_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-functions */ "./lib/math-functions.ts");

var Grid = /** @class */ (function () {
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        for (var x = 0; x < width; x++) {
            this.cells[x] = [];
        }
    }
    Grid.prototype.get = function (x, y) {
        return this.cells[x][y];
    };
    Grid.prototype.set = function (x, y, value) {
        this.cells[x][y] = value;
    };
    Grid.prototype.remove = function (x, y) {
        delete this.cells[x][y];
    };
    Grid.prototype.swap = function (x, y, x2, y2) {
        var bufferA = this.get(x, y);
        var bufferB = this.get(x2, y2);
        this.set(x, y, bufferB);
        this.set(x2, y2, bufferA);
    };
    Grid.prototype.fixCoords = function (x, y) {
        return [
            (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.fixNumber)(0, this.width, x),
            (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.fixNumber)(0, this.height, y),
        ];
    };
    Grid.prototype.randCoords = function () {
        return [
            (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randInt)(0, this.width),
            (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randInt)(0, this.height)
        ];
    };
    Grid.prototype.randEmpty = function () {
        var coords;
        do {
            coords = this.randCoords();
        } while (this.get.apply(this, coords));
        return coords;
    };
    return Grid;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Grid);


/***/ }),

/***/ "./lib/drawing.ts":
/*!************************!*\
  !*** ./lib/drawing.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rgba": () => (/* binding */ Rgba),
/* harmony export */   "Canvas": () => (/* binding */ Canvas),
/* harmony export */   "PixelsData": () => (/* binding */ PixelsData)
/* harmony export */ });
/* harmony import */ var _math_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math-functions */ "./lib/math-functions.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Rgba = /** @class */ (function () {
    function Rgba(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    Rgba.randRgb = function () {
        return new Rgba((0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randInt)(0, 256), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randInt)(0, 256), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randInt)(0, 256), 255);
    };
    Rgba.prototype.interpolate = function (other, t) {
        return new Rgba((0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.interpolate)(this.red, other.red, t), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.interpolate)(this.green, other.green, t), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.interpolate)(this.blue, other.blue, t), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.interpolate)(this.alpha, other.alpha, t));
    };
    Rgba.prototype.normalise = function () {
        return new Rgba((0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.limNumber)(0, 255, this.red), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.limNumber)(0, 255, this.green), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.limNumber)(0, 255, this.blue), (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.limNumber)(0, 255, this.alpha));
    };
    Rgba.prototype.mutateRgb = function (value) {
        return new Rgba(this.red + (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randFloat)(-value, value), this.green + (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randFloat)(-value, value), this.blue + (0,_math_functions__WEBPACK_IMPORTED_MODULE_0__.randFloat)(-value, value), this.alpha).normalise();
    };
    return Rgba;
}());

var Canvas = /** @class */ (function () {
    function Canvas(width, height, node) {
        this.node = node || document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.ctx = this.node.getContext("2d");
    }
    return Canvas;
}());

var PixelsData = /** @class */ (function (_super) {
    __extends(PixelsData, _super);
    function PixelsData(width, height, node) {
        var _this = _super.call(this, width, height, node) || this;
        _this.data = _this.ctx.getImageData(0, 0, _this.node.width, _this.node.height);
        return _this;
    }
    PixelsData.prototype.setPixel = function (x, y, color) {
        var POINTER = (y * this.data.width + x) * 4;
        this.data.data[POINTER] = color.red;
        this.data.data[POINTER + 1] = color.green;
        this.data.data[POINTER + 2] = color.blue;
        this.data.data[POINTER + 3] = color.alpha;
    };
    PixelsData.prototype.update = function () {
        this.ctx.putImageData(this.data, 0, 0);
        return this;
    };
    return PixelsData;
}(Canvas));



/***/ }),

/***/ "./lib/math-functions.ts":
/*!*******************************!*\
  !*** ./lib/math-functions.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "range": () => (/* binding */ range),
/* harmony export */   "randFloat": () => (/* binding */ randFloat),
/* harmony export */   "randInt": () => (/* binding */ randInt),
/* harmony export */   "randChoice": () => (/* binding */ randChoice),
/* harmony export */   "fixNumber": () => (/* binding */ fixNumber),
/* harmony export */   "normalizeNumber": () => (/* binding */ normalizeNumber),
/* harmony export */   "limNumber": () => (/* binding */ limNumber),
/* harmony export */   "interpolate": () => (/* binding */ interpolate)
/* harmony export */ });
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function range(from, to) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(from < to)) return [3 /*break*/, 2];
                return [4 /*yield*/, from++];
            case 1:
                _a.sent();
                return [3 /*break*/, 0];
            case 2: return [2 /*return*/];
        }
    });
}
function randFloat(bottom, top) {
    return Math.random() * (top - bottom) + bottom;
}
function randInt(bottom, top) {
    return Math.floor(randFloat(bottom, top));
}
function randChoice(arr) {
    return arr[randInt(0, arr.length)];
}
function fixNumber(min, max, number) {
    return number >= min ? number % max : max - (-number % max);
}
function normalizeNumber(min, max, number) {
    return (number - min) / (max - min);
}
function limNumber(min, max, number) {
    return Math.max(Math.min(number, max), min);
}
function interpolate(a, b, t) {
    return a + (b - a) * t;
}


/***/ }),

/***/ "./lib/world.ts":
/*!**********************!*\
  !*** ./lib/world.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Block": () => (/* binding */ Block),
/* harmony export */   "DynamicBlock": () => (/* binding */ DynamicBlock),
/* harmony export */   "World": () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _drawing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawing */ "./lib/drawing.ts");
/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Grid */ "./lib/Grid.ts");
/* harmony import */ var _math_functions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math-functions */ "./lib/math-functions.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var Block = /** @class */ (function () {
    function Block(world, x, y, color) {
        this.world = world;
        this.x = x;
        this.y = y;
        this.color = color;
        world.set(x, y, this);
    }
    return Block;
}());

var DynamicBlock = /** @class */ (function (_super) {
    __extends(DynamicBlock, _super);
    function DynamicBlock(world, x, y, color) {
        var _this = _super.call(this, world, x, y, color) || this;
        world.assign(_this);
        _this.alive = true;
        return _this;
    }
    DynamicBlock.prototype.onStep = function () {
    };
    DynamicBlock.prototype.onDie = function () {
    };
    return DynamicBlock;
}(Block));

var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World(width, height, pixelSize, node) {
        var _this = _super.call(this, width, height) || this;
        _this.width = width;
        _this.height = height;
        _this.img = new _drawing__WEBPACK_IMPORTED_MODULE_0__.Canvas(width * pixelSize, height * pixelSize, node);
        _this.img.ctx.imageSmoothingEnabled = false;
        _this.dynamic = { a: {}, b: {} };
        return _this;
    }
    World.prototype.set = function (x, y, block) {
        _super.prototype.set.call(this, x, y, block);
        if (block) {
            block.x = x;
            block.y = y;
        }
    };
    World.prototype.drawLayer = function (layer) {
        this.img.ctx.drawImage(layer, 0, 0, this.img.node.width, this.img.node.height);
    };
    World.prototype.clearImage = function () {
        this.img.ctx.clearRect(0, 0, this.img.node.width, this.img.node.height);
    };
    World.prototype.visualize = function (func) {
        var img = new _drawing__WEBPACK_IMPORTED_MODULE_0__.PixelsData(this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var col = func(this.get(x, y));
                if (col) {
                    img.setPixel(x, y, col);
                }
            }
        }
        this.drawLayer(img.update().node);
    };
    World.prototype.assign = function (block) {
        var i;
        do {
            i = (0,_math_functions__WEBPACK_IMPORTED_MODULE_2__.randInt)(0, this.width * this.height * 1000);
        } while (this.dynamic.a[i]);
        this.dynamic.a[i] = block;
    };
    World.prototype.init = function () {
        this.dynamic.b = this.dynamic.a;
    };
    World.prototype.step = function () {
        this.dynamic.a = {};
        for (var key in this.dynamic.b) {
            var block = this.dynamic.b[key];
            if (!block.alive) {
                this.set(block.x, block.y, undefined);
                block.onDie();
            }
            else {
                block.onStep();
                this.assign(block);
            }
        }
        this.dynamic.b = this.dynamic.a;
    };
    return World;
}(_Grid__WEBPACK_IMPORTED_MODULE_1__.default));



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_Bot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Bot */ "./lib/Bot.ts");
/* harmony import */ var _lib_drawing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/drawing */ "./lib/drawing.ts");
/* harmony import */ var _lib_world__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/world */ "./lib/world.ts");
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};



function start() {
    _lib_Bot__WEBPACK_IMPORTED_MODULE_0__.default.amount = 0;
    world = new _lib_world__WEBPACK_IMPORTED_MODULE_2__.World(parseInt(document.querySelector('#input-width').value), parseInt(document.querySelector('#input-height').value), parseInt(document.querySelector('#input-pixel').value), document.querySelector('#img'));
    var BOTS_AMOUNT = parseInt(document.querySelector('#input-bots').value);
    // for (let x = 0; x < world.width; x++) {
    //     new Block(world, x, world.height - 1, new Rgba(20, 20, 20, 255));
    // }
    for (var i = 0; i < Math.min(world.width * world.height, BOTS_AMOUNT); i++) {
        new (_lib_Bot__WEBPACK_IMPORTED_MODULE_0__.default.bind.apply(_lib_Bot__WEBPACK_IMPORTED_MODULE_0__.default, __spreadArrays([void 0, world], world.randEmpty(), [_lib_drawing__WEBPACK_IMPORTED_MODULE_1__.Rgba.randRgb(),
            100,
            new _lib_Bot__WEBPACK_IMPORTED_MODULE_0__.Genome(64).fillRandom()])))();
    }
    world.init();
}
function drawColors(block) {
    if (block instanceof _lib_world__WEBPACK_IMPORTED_MODULE_2__.Block) {
        return block.color;
    }
    return null;
}
function drawEnergy(block) {
    if (block instanceof _lib_Bot__WEBPACK_IMPORTED_MODULE_0__.default) {
        return new _lib_drawing__WEBPACK_IMPORTED_MODULE_1__.Rgba(0, 0, 50, 255)
            .interpolate(new _lib_drawing__WEBPACK_IMPORTED_MODULE_1__.Rgba(255, 255, 0, 255), block.energy / 50);
    }
    return null;
}
var world;
window.addEventListener('load', function () {
    var _a;
    var $amount = document.querySelector('#amount');
    var $fps = document.querySelector('#fps');
    var $viewMode = document.querySelector('#view-mode');
    (_a = document.querySelector('#btn-start')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', start);
    start();
    var cycle = 0;
    var lastLoop = performance.now();
    var fps = 0;
    setInterval(function () {
        var thisLoop = performance.now();
        fps = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;
        world.step();
        if (cycle % 2 === 0) {
            switch ($viewMode.value) {
                case 'normal':
                    world.clearImage();
                    world.visualize(drawColors);
                    break;
                case 'energy':
                    world.clearImage();
                    world.visualize(drawEnergy);
                    break;
                default: break;
            }
        }
        $amount.innerHTML = _lib_Bot__WEBPACK_IMPORTED_MODULE_0__.default.amount.toString();
        $fps.innerHTML = fps.toFixed(1);
        cycle++;
    });
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map