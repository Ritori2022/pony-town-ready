"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var buttonActions_1 = require("../../../client/buttonActions");
var sprites = require("../../../generated/sprites");
var clientUtils_1 = require("../../../client/clientUtils");
var colors_1 = require("../../../common/colors");
var icons_1 = require("../../../client/icons");
var spriteUtils_1 = require("../../../client/spriteUtils");
var utils_1 = require("../../../common/utils");
var game_1 = require("../../../client/game");
var model_1 = require("../../services/model");
function eyeSprite(e) {
    return spriteUtils_1.createEyeSprite(e, 0, sprites.defaultPalette);
}
var ActionsModal = /** @class */ (function () {
    function ActionsModal(game) {
        this.game = game;
        this.lockIcon = icons_1.faLock;
        this.actionsIcon = icons_1.faApple;
        this.expressionsIcon = icons_1.faLaughBeam;
        this.chatIcon = icons_1.faComment;
        this.optionsIcon = icons_1.faCog;
        this.devIcon = icons_1.faCogs;
        this.dev = BETA;
        this.close = new core_1.EventEmitter();
        this.actions = buttonActions_1.createButtionActionActions();
        this.commands = buttonActions_1.createButtonCommandActions();
        this.emoteAction = buttonActions_1.expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 0 /* Smile */));
        this.entityAction = buttonActions_1.entityButtonAction('apple');
        this.entityActions = [];
        this.entityName = 'apple';
        this.lockEyes = true;
        this.lockIrises = true;
        this.eyesLeft = sprites.eyeLeft.map(function (e) { return e && e[0]; }).map(eyeSprite);
        this.eyesRight = sprites.eyeRight.map(function (e) { return e && e[0]; }).map(eyeSprite);
        this.irisesLeft = utils_1.times(8 /* COUNT */, function (i) { return spriteUtils_1.createEyeSprite(sprites.eyeLeft[1][0], i, sprites.defaultPalette); });
        this.irisesRight = utils_1.times(8 /* COUNT */, function (i) { return spriteUtils_1.createEyeSprite(sprites.eyeRight[1][0], i, sprites.defaultPalette); });
        this.muzzles = sprites.noses
            .map(function (n) { return n[0][0]; })
            .map(function (_a) {
            var color = _a.color, colors = _a.colors, mouth = _a.mouth;
            return ({
                color: color, colors: colors, extra: mouth, palettes: [buttonActions_1.actionExpressionDefaultPalette.colors]
            });
        });
        this.noseFills = [colors_1.ACTION_EXPRESSION_BG];
        this.noseOutlines = [colors_1.fillToOutline(colors_1.ACTION_EXPRESSION_BG)];
        this.coatFill = colors_1.ACTION_EXPRESSION_BG;
        this.eyeColor = colors_1.ACTION_EXPRESSION_EYE_COLOR;
        this.muzzle = 0;
        this.eyeLeft = 1;
        this.eyeRight = 1;
        this.irisLeft = 0;
        this.irisRight = 0;
        this.tabIndex = 0;
        this.blush = false;
        this.sleeping = false;
        this.tears = false;
        this.crying = false;
        this.hearts = false;
        this.activeTab = 'right-eye';
        this.interval = 0;
        this.actionsToUndo = [];
        this.updateEmoteAction();
    }
    ActionsModal.prototype.ngOnInit = function () {
        var _this = this;
        document.body.classList.add('actions-modal-opened');
        this.game.editingActions = true;
        this.interval = setInterval(function () { return _this.game.send(function (server) { return server.action(21 /* KeepAlive */); }); }, 10000);
        this.subscription = this.game.onLeft.subscribe(function () { return _this.ok(); });
        if (BETA) {
            this.entityActions = model_1.getEntityNames().map(function (name) { return buttonActions_1.entityButtonAction(name); });
        }
    };
    ActionsModal.prototype.ngOnDestroy = function () {
        document.body.classList.remove('actions-modal-opened');
        this.game.editingActions = false;
        clearInterval(this.interval);
        this.subscription && this.subscription.unsubscribe();
    };
    ActionsModal.prototype.ok = function () {
        this.close.emit();
    };
    ActionsModal.prototype.changed = function (locked) {
        if (locked) {
            this.eyeLeft = this.eyeRight;
        }
        if (this.lockIrises) {
            this.irisLeft = this.irisRight;
        }
        this.updateEmoteAction();
    };
    ActionsModal.prototype.drop = function (action) {
        if (action.type === 'expression' && action.expression) {
            var e = action.expression;
            this.lockEyes = e.right === e.left;
            this.lockIrises = e.rightIris === e.leftIris;
            this.eyeRight = e.right;
            this.eyeLeft = e.left;
            this.muzzle = e.muzzle;
            this.irisRight = e.rightIris;
            this.irisLeft = e.leftIris;
            this.blush = utils_1.hasFlag(e.extra, 1 /* Blush */);
            this.sleeping = utils_1.hasFlag(e.extra, 2 /* Zzz */);
            this.tears = utils_1.hasFlag(e.extra, 8 /* Tears */);
            this.crying = utils_1.hasFlag(e.extra, 4 /* Cry */);
            this.hearts = utils_1.hasFlag(e.extra, 16 /* Hearts */);
            this.changed(this.lockEyes);
        }
    };
    ActionsModal.prototype.updateEmoteAction = function () {
        var extra = (this.blush ? 1 /* Blush */ : 0) |
            (this.sleeping ? 2 /* Zzz */ : 0) |
            (this.tears ? 8 /* Tears */ : 0) |
            (this.crying ? 4 /* Cry */ : 0) |
            (this.hearts ? 16 /* Hearts */ : 0);
        var expression = clientUtils_1.createExpression(this.eyeRight, this.eyeLeft, this.muzzle, this.irisRight, this.irisLeft, extra);
        this.emoteAction = buttonActions_1.expressionButtonAction(expression);
    };
    ActionsModal.prototype.resetToDefault = function () {
        this.actionsToUndo.push(this.game.actions);
        this.game.actions = buttonActions_1.createDefaultButtonActions().concat([{ action: undefined }]);
    };
    ActionsModal.prototype.clearActionBar = function () {
        this.actionsToUndo.push(this.game.actions);
        this.game.actions = this.game.actions.map(function () { return ({ action: undefined }); });
    };
    ActionsModal.prototype.undo = function () {
        if (this.actionsToUndo.length) {
            this.game.actions = this.actionsToUndo.pop();
        }
    };
    ActionsModal.prototype.updateEntity = function () {
        if (BETA) {
            this.entityAction = buttonActions_1.entityButtonAction(this.entityName);
        }
    };
    ActionsModal.prototype.export = function () {
        var data = buttonActions_1.serializeActions(this.game.actions);
        saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), "pony-town-actions.json");
    };
    ActionsModal.prototype.import = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!file) return [3 /*break*/, 2];
                        return [4 /*yield*/, clientUtils_1.readFileAsText(file)];
                    case 1:
                        text = _a.sent();
                        this.game.actions = buttonActions_1.deserializeActions(text);
                        this.game.editingActions = false;
                        setTimeout(function () { return _this.game.editingActions = true; }, 500);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ActionsModal.prototype, "close", void 0);
    ActionsModal = __decorate([
        core_1.Component({
            selector: 'actions-modal',
            templateUrl: 'actions-modal.pug',
            styleUrls: ['actions-modal.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame])
    ], ActionsModal);
    return ActionsModal;
}());
exports.ActionsModal = ActionsModal;
