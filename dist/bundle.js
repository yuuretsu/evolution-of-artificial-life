/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/Bot.ts":
/*!************************!*\
  !*** ./src/lib/Bot.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Genome = void 0;
var drawing_1 = __webpack_require__(/*! ./drawing */ "./src/lib/drawing.ts");
var math_functions_1 = __webpack_require__(/*! ./math-functions */ "./src/lib/math-functions.ts");
var world_1 = __webpack_require__(/*! ./world */ "./src/lib/world.ts");
var Bot = /** @class */ (function (_super) {
    __extends(Bot, _super);
    function Bot(world, x, y, color, energy, genome, family, abilities) {
        var _this = _super.call(this, world, x, y, color) || this;
        _this.energy = energy;
        _this.genome = genome;
        _this.family = family;
        _this.abilities = abilities;
        Bot.amount++;
        _this._narrow = math_functions_1.randInt(0, 8);
        _this.age = 0;
        _this.lastAction = new drawing_1.Rgba(20, 20, 20, 255);
        return _this;
    }
    Object.defineProperty(Bot.prototype, "narrow", {
        get: function () {
            return this._narrow;
        },
        set: function (n) {
            this._narrow = math_functions_1.fixNumber(0, 8, n);
        },
        enumerable: false,
        configurable: true
    });
    Bot.prototype.narrowToCoords = function () {
        var x = this.x + world_1.MOORE_NEIGHBOURHOOD[this.narrow][0];
        var y = this.y + world_1.MOORE_NEIGHBOURHOOD[this.narrow][1];
        return this.world.fixCoords(x, y);
    };
    Bot.prototype.getForvard = function () {
        var _a;
        var coords = this.narrowToCoords();
        return { block: (_a = this.world).get.apply(_a, coords), coords: coords };
    };
    Bot.prototype.moveTo = function (x, y) {
        this.world.swap(this.x, this.y, x, y);
    };
    Bot.prototype.multiplyTo = function (x, y) {
        new Bot(this.world, x, y, this.color.interpolate(new drawing_1.Rgba(255, 255, 255, 255), 0.25), this.energy / 3, this.genome.replication(), this.family.mutateRgb(10), __assign({}, this.abilities));
        this.energy /= 3;
    };
    Bot.prototype.randMove = function () {
        var coords = this.world.fixCoords(this.x + math_functions_1.randInt(-1, 2), this.y + math_functions_1.randInt(-1, 2));
        this.moveTo.apply(this, coords);
    };
    Bot.prototype.onStep = function () {
        if (this.energy < 1 || this.energy > 100 || this.age > 2000) {
            this.alive = false;
            return;
        }
        this.genome.doAction(this);
        this.energy -= 0.1;
        this.age += 1;
    };
    Bot.prototype.onDie = function () {
        Bot.amount--;
        // new DeadBot(this);
    };
    Bot.amount = 0;
    return Bot;
}(world_1.DynamicBlock));
exports.default = Bot;
var DeadBot = /** @class */ (function (_super) {
    __extends(DeadBot, _super);
    function DeadBot(bot) {
        var _this = _super.call(this, bot.world, bot.x, bot.y, bot.color.interpolate(new drawing_1.Rgba(0, 0, 0, 255), 0.5)) || this;
        _this.age = 0;
        return _this;
    }
    DeadBot.prototype.onStep = function () {
        if (this.age > 500) {
            this.alive = false;
        }
        this.color = this.color.interpolate(new drawing_1.Rgba(10, 10, 50, 255), 0.005);
        this.age++;
    };
    return DeadBot;
}(world_1.DynamicBlock));
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
            this._pointer = math_functions_1.fixNumber(0, this.length, n);
        },
        enumerable: false,
        configurable: true
    });
    Genome.prototype.randGene = function () {
        return {
            action: math_functions_1.randChoice(GENE_TEMPLATES),
            property: Math.random(),
            branches: [
                math_functions_1.randInt(0, this.length),
                math_functions_1.randInt(0, this.length),
                math_functions_1.randInt(0, this.length),
                math_functions_1.randInt(0, this.length)
            ]
        };
    };
    Genome.prototype.mutateGene = function (gene) {
        var _this = this;
        return {
            action: Math.random() > 0.9 ? math_functions_1.randChoice(GENE_TEMPLATES) : gene.action,
            property: math_functions_1.limNumber(0, 1, gene.property + math_functions_1.randFloat(-0.01, 0.01)),
            branches: gene.branches.map(function (i) { return Math.random() > 0.9
                ? math_functions_1.randInt(0, _this.length)
                : i; })
        };
    };
    Genome.prototype.fillRandom = function (start) {
        if (start === void 0) { start = 0; }
        for (var i = start; i < this.length; i++) {
            this.genes[i] = this.randGene();
        }
        return this;
    };
    Genome.prototype.create = function (genes) {
        for (var i = 0; i < genes.length; i++) {
            this.genes[i] = genes[i];
        }
        this.fillRandom(genes.length);
        return this;
    };
    Genome.prototype.fillPlant = function () {
        for (var i = 0; i < this.length; i++) {
            this.genes[i] = {
                action: GENE_TEMPLATES[math_functions_1.randInt(0, 3)],
                property: Math.random(),
                branches: [
                    math_functions_1.randInt(0, this.length),
                    math_functions_1.randInt(0, this.length),
                    math_functions_1.randInt(0, this.length),
                    math_functions_1.randInt(0, this.length)
                ]
            };
        }
        return this;
    };
    // replication2() {
    //     const genome = new Genome(this.length);
    //     for (let i = 0; i < this.length; i++) {
    //         genome.genes[i] = this.mutateGene(this.genes[i]);
    //     }
    //     return genome;
    // }
    // replication() {
    //     const genome = new Genome(this.length);
    //     for (let i = 0; i < this.length; i++) {
    //         genome.genes[i] = this.genes[i];
    //     }
    //     const pointer = randInt(0, genome.length);
    //     genome.genes[pointer] = this.mutateGene(this.genes[pointer]);
    //     return genome;
    // }
    Genome.prototype.replication = function () {
        var genome = new Genome(this.length);
        for (var i = 0; i < this.length; i++) {
            genome.genes[i] = Math.random() > 0.995
                ? this.mutateGene(this.genes[i])
                : this.genes[i];
        }
        return genome;
    };
    Genome.prototype.doAction = function (bot) {
        bot.lastAction = new drawing_1.Rgba(20, 20, 20, 255);
        for (var i = 0; i < 20; i++) {
            var GENE = this.genes[this.pointer];
            var RESULT = GENE.action(bot, GENE.property, GENE.branches);
            if (RESULT.goto) {
                this.pointer = RESULT.goto;
            }
            else {
                this.pointer++;
            }
            if (RESULT.completed)
                return;
        }
        bot.color = bot.color.interpolate(new drawing_1.Rgba(100, 100, 100, 255), 0.1);
    };
    return Genome;
}());
exports.Genome = Genome;
var GENE_TEMPLATES = [
    // Restart
    function (bot, property, branches) {
        return { completed: false, goto: 0 };
    },
    // Photosynthesis
    function (bot, property, branches) {
        bot.energy += 0.5 * Math.pow(bot.abilities.photo, 2);
        bot.abilities.photo = Math.min(1, bot.abilities.photo + 0.01);
        bot.abilities.attack = Math.max(0, bot.abilities.attack - 0.01);
        bot.color = bot.color.interpolate(new drawing_1.Rgba(0, 255, 0, 255), 0.01);
        bot.lastAction = new drawing_1.Rgba(0, 255, 0, 255);
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
        if (!forward.block && bot.age > 2) {
            bot.multiplyTo.apply(bot, forward.coords);
            bot.lastAction = new drawing_1.Rgba(0, 0, 255, 255);
        }
        // bot.lastAction = new Rgba(0, 0, 255, 255);
        return { completed: true };
    },
    // Share energy
    function (bot, property, branches) {
        bot.color = bot.color.interpolate(new drawing_1.Rgba(0, 0, 255, 255), 0.005);
        var forward = bot.getForvard();
        if (forward.block instanceof Bot && forward.block.energy < bot.energy) {
            var E = (forward.block.energy + bot.energy) / 2;
            bot.energy = E;
            forward.block.energy = E;
            bot.lastAction = new drawing_1.Rgba(0, 100, 255, 255);
        }
        // bot.lastAction = new Rgba(0, 100, 255, 255);
        return { completed: true };
    },
    // Look forward
    function (bot, property, branches) {
        // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
        var forward = bot.getForvard();
        if (forward.block instanceof Bot) {
            if (forward.block.family.difference(bot.color) < property) {
                return { completed: false, goto: branches[0] };
            }
            else {
                return { completed: false, goto: branches[1] };
            }
        }
        else if (forward.block instanceof DeadBot) {
            return { completed: false, goto: branches[2] };
        }
        else {
            return { completed: false, goto: branches[3] };
        }
    },
    function (bot, property, branches) {
        if (bot.energy / 100 < property) {
            return { completed: false, goto: branches[0] };
        }
        else {
            return { completed: false, goto: branches[1] };
        }
    },
    // DestroyDead
    function (bot, property, branches) {
        // bot.color = bot.color.interpolate(new Rgba(0, 0, 255, 255), 0.01);
        var forward = bot.getForvard();
        if (forward.block instanceof DeadBot && forward.block.age > 2) {
            forward.block.alive = false;
            bot.lastAction = new drawing_1.Rgba(255, 255, 0, 255);
        }
        // bot.lastAction = new Rgba(255, 255, 0, 255);
        return { completed: true };
    },
    // Move
    function (bot, property, branches) {
        // bot.color = bot.color.interpolate(new Rgba(255, 0, 0, 255), 0.01);
        var forward = bot.getForvard();
        if (!forward.block)
            bot.moveTo.apply(bot, forward.coords);
        bot.lastAction = new drawing_1.Rgba(255, 255, 255, 255);
        return { completed: true };
    },
    // // Move 2
    // (bot, property, branches) => {
    //     // bot.color = bot.color.interpolate(new Rgba(255, 255, 255, 255), 0.01);
    //     const forward = bot.getForvard();
    //     bot.moveTo(...forward.coords);
    //     bot.energy -= 0.1;
    //     return { completed: true }
    // },
    // Kill
    function (bot, property, branches) {
        bot.energy -= 0.1;
        bot.color = bot.color.interpolate(new drawing_1.Rgba(255, 0, 0, 255), 0.01);
        bot.abilities.attack = Math.min(1, bot.abilities.attack + 0.01);
        bot.abilities.photo = Math.max(0, bot.abilities.photo - 0.01);
        var forward = bot.getForvard();
        if (forward.block instanceof Bot) {
            var E = (forward.block.energy / 2) * Math.pow(bot.abilities.attack, 2);
            forward.block.energy -= forward.block.energy / 2;
            bot.energy += E;
            bot.lastAction = new drawing_1.Rgba(255, 0, 0, 255);
        }
        // bot.lastAction = new Rgba(255, 0, 0, 255);
        return { completed: true };
    },
];


/***/ }),

/***/ "./src/lib/Grid.ts":
/*!*************************!*\
  !*** ./src/lib/Grid.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var math_functions_1 = __webpack_require__(/*! ./math-functions */ "./src/lib/math-functions.ts");
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
            math_functions_1.fixNumber(0, this.width, x),
            math_functions_1.fixNumber(0, this.height, y),
        ];
    };
    Grid.prototype.randCoords = function () {
        return [
            math_functions_1.randInt(0, this.width),
            math_functions_1.randInt(0, this.height)
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
exports.default = Grid;


/***/ }),

/***/ "./src/lib/drawing.ts":
/*!****************************!*\
  !*** ./src/lib/drawing.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PixelsData = exports.Canvas = exports.Rgba = void 0;
var math_functions_1 = __webpack_require__(/*! ./math-functions */ "./src/lib/math-functions.ts");
var Rgba = /** @class */ (function () {
    function Rgba(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    Rgba.randRgb = function () {
        return new Rgba(math_functions_1.randInt(0, 256), math_functions_1.randInt(0, 256), math_functions_1.randInt(0, 256), 255);
    };
    Rgba.prototype.interpolate = function (other, t) {
        return new Rgba(math_functions_1.interpolate(this.red, other.red, t), math_functions_1.interpolate(this.green, other.green, t), math_functions_1.interpolate(this.blue, other.blue, t), math_functions_1.interpolate(this.alpha, other.alpha, t));
    };
    Rgba.prototype.normalise = function () {
        return new Rgba(math_functions_1.limNumber(0, 255, this.red), math_functions_1.limNumber(0, 255, this.green), math_functions_1.limNumber(0, 255, this.blue), math_functions_1.limNumber(0, 255, this.alpha));
    };
    Rgba.prototype.mutateRgb = function (value) {
        return new Rgba(this.red + math_functions_1.randFloat(-value, value), this.green + math_functions_1.randFloat(-value, value), this.blue + math_functions_1.randFloat(-value, value), this.alpha).normalise();
    };
    Rgba.prototype.difference = function (other) {
        return ((Math.abs(this.red - other.red) +
            Math.abs(this.green - other.green) +
            Math.abs(this.blue - other.blue) +
            Math.abs(this.alpha - other.alpha)) / Rgba.MAX_DIF);
    };
    Rgba.MAX_DIF = 255 * 4;
    return Rgba;
}());
exports.Rgba = Rgba;
var Canvas = /** @class */ (function () {
    function Canvas(width, height, node) {
        this.node = node || document.createElement("canvas");
        this.node.width = width;
        this.node.height = height;
        this.ctx = this.node.getContext("2d");
    }
    return Canvas;
}());
exports.Canvas = Canvas;
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
exports.PixelsData = PixelsData;


/***/ }),

/***/ "./src/lib/math-functions.ts":
/*!***********************************!*\
  !*** ./src/lib/math-functions.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports) {


var __generator = (this && this.__generator) || function (thisArg, body) {
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.interpolate = exports.limNumber = exports.normalizeNumber = exports.fixNumber = exports.randChoice = exports.randInt = exports.randFloat = exports.range = void 0;
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
exports.range = range;
function randFloat(bottom, top) {
    return Math.random() * (top - bottom) + bottom;
}
exports.randFloat = randFloat;
function randInt(bottom, top) {
    return Math.floor(randFloat(bottom, top));
}
exports.randInt = randInt;
function randChoice(arr) {
    return arr[randInt(0, arr.length)];
}
exports.randChoice = randChoice;
function fixNumber(min, max, number) {
    return number >= min ? number % max : max - (-number % max);
}
exports.fixNumber = fixNumber;
function normalizeNumber(min, max, number) {
    return (number - min) / (max - min);
}
exports.normalizeNumber = normalizeNumber;
function limNumber(min, max, number) {
    return Math.max(Math.min(number, max), min);
}
exports.limNumber = limNumber;
function interpolate(a, b, t) {
    return a + (b - a) * t;
}
exports.interpolate = interpolate;


/***/ }),

/***/ "./src/lib/world.ts":
/*!**************************!*\
  !*** ./src/lib/world.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = exports.DynamicBlock = exports.Block = exports.MOORE_NEIGHBOURHOOD = void 0;
var drawing_1 = __webpack_require__(/*! ./drawing */ "./src/lib/drawing.ts");
var Grid_1 = __webpack_require__(/*! ./Grid */ "./src/lib/Grid.ts");
var math_functions_1 = __webpack_require__(/*! ./math-functions */ "./src/lib/math-functions.ts");
exports.MOORE_NEIGHBOURHOOD = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
];
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
exports.Block = Block;
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
exports.DynamicBlock = DynamicBlock;
var World = /** @class */ (function (_super) {
    __extends(World, _super);
    function World(width, height, pixelSize, node) {
        var _this = _super.call(this, width, height) || this;
        _this.width = width;
        _this.height = height;
        _this.img = new drawing_1.Canvas(width * pixelSize, height * pixelSize, node);
        _this.img.ctx.imageSmoothingEnabled = false;
        _this.dynamic = { a: {}, b: {} };
        _this.age = 0;
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
        var img = new drawing_1.PixelsData(this.width, this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var col = func(this.get(x, y), x, y);
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
            i = math_functions_1.randInt(0, this.width * this.height * 1000);
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
        this.age++;
    };
    return World;
}(Grid_1.default));
exports.World = World;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Bot_1 = __webpack_require__(/*! ./lib/Bot */ "./src/lib/Bot.ts");
var drawing_1 = __webpack_require__(/*! ./lib/drawing */ "./src/lib/drawing.ts");
var math_functions_1 = __webpack_require__(/*! ./lib/math-functions */ "./src/lib/math-functions.ts");
var world_1 = __webpack_require__(/*! ./lib/world */ "./src/lib/world.ts");
function onResizeWindow() {
    document.querySelector('.wrapper').style.maxHeight = window.innerHeight + "px";
}
function start() {
    Bot_1.default.amount = 0;
    world = new world_1.World(parseInt(document.querySelector('#input-width').value), parseInt(document.querySelector('#input-height').value), parseInt(document.querySelector('#input-pixel').value), document.querySelector('#img'));
    var BOTS_AMOUNT = parseInt(document.querySelector('#input-bots').value);
    for (var i = 0; i < Math.min(world.width * world.height, BOTS_AMOUNT); i++) {
        var a = new (Bot_1.default.bind.apply(Bot_1.default, __spreadArrays([void 0, world], world.randEmpty(), [new drawing_1.Rgba(100, 100, 100, 255),
            100,
            new Bot_1.Genome(64).fillRandom(),
            drawing_1.Rgba.randRgb(),
            { photo: 0.5, attack: 0.5 }])))();
    }
    world.init();
}
function drawColors(block) {
    if (block instanceof world_1.Block) {
        return block.color;
    }
    return null;
}
function drawEnergy(block) {
    if (block instanceof Bot_1.default) {
        return new drawing_1.Rgba(20, 20, 100, 255)
            .interpolate(new drawing_1.Rgba(255, 255, 0, 255), block.energy / 100);
    }
    return null;
}
function drawAbilities(block) {
    if (block instanceof Bot_1.default) {
        return new drawing_1.Rgba(math_functions_1.normalizeNumber(0.5, 1, block.abilities.attack) * 255, math_functions_1.normalizeNumber(0.5, 1, block.abilities.photo) * 255, 50, 255);
    }
    return null;
}
function drawFamilies(block) {
    if (block instanceof Bot_1.default) {
        return block.family;
    }
    return null;
}
function drawLastAction(block) {
    if (block instanceof Bot_1.default) {
        return block.lastAction;
    }
    return null;
}
function getNarrowImg(world) {
    var img = new drawing_1.PixelsData(world.width * 3, world.height * 3);
    for (var x = 0; x < world.width; x++) {
        for (var y = 0; y < world.height; y++) {
            var block = world.get(x, y);
            if (block instanceof Bot_1.default) {
                var xy = [
                    block.x * 3 + 1 + world_1.MOORE_NEIGHBOURHOOD[block.narrow][0],
                    block.y * 3 + 1 + world_1.MOORE_NEIGHBOURHOOD[block.narrow][1],
                ];
                img.setPixel.apply(img, __spreadArrays(xy, [new drawing_1.Rgba(0, 0, 0, 255)]));
            }
        }
    }
    img.update();
    return img.node;
}
function updateImage(world, mode, drawBotsNarrow) {
    switch (mode) {
        case 'normal':
            world.clearImage();
            world.visualize(drawColors);
            break;
        case 'energy':
            world.clearImage();
            world.visualize(drawEnergy);
            break;
        case 'families':
            world.clearImage();
            world.visualize(drawFamilies);
            break;
        case 'abilities':
            world.clearImage();
            world.visualize(drawAbilities);
            break;
        case 'last-action':
            world.clearImage();
            world.visualize(drawLastAction);
            break;
        default: break;
    }
    if (drawBotsNarrow) {
        world.drawLayer(getNarrowImg(world));
    }
}
var world;
window.addEventListener('resize', onResizeWindow);
onResizeWindow();
window.addEventListener('load', function () {
    var _a, _b, _c, _d, _e;
    (_a = document.querySelector('#input-width')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', function (e) {
        var target = e.target;
        target.value = math_functions_1.limNumber(1, 2048, parseInt(target.value)).toString();
    });
    (_b = document.querySelector('#input-height')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function (e) {
        var target = e.target;
        target.value = math_functions_1.limNumber(1, 2048, parseInt(target.value)).toString();
    });
    (_c = document.querySelector('#input-pixel')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', function (e) {
        var target = e.target;
        target.value = math_functions_1.limNumber(1, 50, parseInt(target.value)).toString();
    });
    var $btnMenu = document.querySelector('#btn-menu');
    var $imgContainer = document.querySelector('#img-container');
    var $img = document.querySelector('#img');
    // const $fpsLimit = document.querySelector('#fps-limit') as HTMLInputElement;
    // $fpsLimit.addEventListener('input', () => {
    //     $fpsLimit.value = limNumber(1, 250, parseInt($fpsLimit.value) || 60).toString();
    // });
    $btnMenu.addEventListener('change', function () {
        var _a, _b;
        if ($btnMenu.checked) {
            $imgContainer.classList.add('img-wrapper--menu-opened');
            (_a = document.querySelector('#menu')) === null || _a === void 0 ? void 0 : _a.classList.add('wrapper__menu--menu-opened');
        }
        else {
            $imgContainer.classList.remove('img-wrapper--menu-opened');
            (_b = document.querySelector('#menu')) === null || _b === void 0 ? void 0 : _b.classList.remove('wrapper__menu--menu-opened');
        }
    });
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    var active = false;
    function dragStart(e) {
        if (e instanceof TouchEvent) {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        }
        else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === $img) {
            active = true;
        }
    }
    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }
    function drag(e) {
        if (active) {
            e.preventDefault();
            if (e instanceof TouchEvent) {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            }
            else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            $img.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
        }
    }
    $imgContainer.addEventListener("touchstart", dragStart, false);
    $imgContainer.addEventListener("touchend", dragEnd, false);
    $imgContainer.addEventListener("touchmove", drag, false);
    $imgContainer.addEventListener("mousedown", dragStart, false);
    $imgContainer.addEventListener("mouseup", dragEnd, false);
    $imgContainer.addEventListener("mousemove", drag, false);
    var $amount = document.querySelector('#amount');
    var $fps = document.querySelector('#fps');
    var $frameNumber = document.querySelector('#frame-number');
    var $viewMode = document.querySelector('#view-mode');
    var $narrows = document.querySelector('#chbx-narrows');
    var $chbxUpdImg = document.querySelector('#chbx-upd-img');
    (_d = document.querySelector('#btn-start')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', start);
    (_e = document.querySelector('#btn-step')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
        world.step();
        updateImage(world, $viewMode.value, $narrows.checked);
    });
    var $btnPause = document.querySelector('#btn-pause');
    $btnPause.addEventListener('click', function (e) {
        switch (paused) {
            case true:
                paused = false;
                break;
            case false:
                paused = true;
                break;
        }
    });
    start();
    var lastLoop = Date.now();
    var fps = 0;
    var paused = false;
    setInterval(function () {
        if (Date.now() - lastLoop > 1000) {
            $fps.innerHTML = fps.toFixed(0);
            fps = 0;
            lastLoop = Date.now();
        }
        fps++;
        if (!paused)
            world.step();
        if ($chbxUpdImg.checked) {
            updateImage(world, $viewMode.value, $narrows.checked);
            // switch ($viewMode.value) {
            //     case 'normal': world.clearImage(); world.visualize(drawColors); break;
            //     case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
            //     case 'families': world.clearImage(); world.visualize(drawFamilies); break;
            //     case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
            //     case 'last-action': world.clearImage(); world.visualize(drawLastAction); break;
            //     default: break;
            // }
            // if (!($viewMode.value === 'disabled') && $narrows.checked) {
            //     world.drawLayer(getNarrowImg(world));
            // }
        }
        $amount.innerHTML = Bot_1.default.amount.toString();
        $frameNumber.innerHTML = (world.age / 1000).toFixed(1) + " \u0442\u044B\u0441. \u043A\u0430\u0434\u0440\u043E\u0432";
    });
    // (function step() {
    //     if (Date.now() - lastLoop > 1000) {
    //         $fps.innerHTML = fps.toFixed(0);
    //         fps = 0;
    //         lastLoop = Date.now();
    //     }
    //     fps++;
    //     if (!paused) world.step();
    //     switch ($viewMode.value) {
    //         case 'normal': world.clearImage(); world.visualize(drawColors); break;
    //         case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
    //         case 'families': world.clearImage(); world.visualize(drawFamilies); break;
    //         case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
    //         case 'last-action': world.clearImage(); world.visualize(drawLastAction); break;
    //         default: break;
    //     }
    //     if (!($viewMode.value === 'disabled') && $narrows.checked) {
    //         world.drawLayer(getNarrowImg(world));
    //     }
    //     $amount.innerHTML = Bot.amount.toString();
    //     $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)} тыс. кадров`;
    //     setTimeout(step);
    // })();
});


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map