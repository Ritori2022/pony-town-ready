"use strict";
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
var settingsService_1 = require("../../services/settingsService");
var constants_1 = require("../../../common/constants");
var storageService_1 = require("../../services/storageService");
var utils_1 = require("../../../common/utils");
var game_1 = require("../../../client/game");
var clientUtils_1 = require("../../../client/clientUtils");
var icons_1 = require("../../../client/icons");
var SettingsModal = /** @class */ (function () {
    function SettingsModal(settingsService, storage, game) {
        this.settingsService = settingsService;
        this.storage = storage;
        this.game = game;
        this.maxChatlogRange = constants_1.MAX_CHATLOG_RANGE;
        this.minChatlogRange = constants_1.MIN_CHATLOG_RANGE;
        this.gameIcon = icons_1.faSlidersH;
        this.chatIcon = icons_1.faCommentSlash;
        this.filtersIcon = icons_1.faCommentSlash;
        this.controlsIcon = icons_1.faGamepad;
        this.graphicsIcon = icons_1.faImage;
        this.exportIcon = icons_1.faDownload;
        this.importIcon = icons_1.faUpload;
        this.close = new core_1.EventEmitter();
        this.account = {};
        this.browser = {};
        this.accountBackup = {};
        this.browserBackup = {};
        this.done = false;
    }
    Object.defineProperty(SettingsModal.prototype, "pane", {
        get: function () {
            return this.storage.getItem('settings-modal-pane') || 'game';
        },
        set: function (value) {
            this.storage.setItem('settings-modal-pane', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsModal.prototype, "lockLowGraphicsMode", {
        get: function () {
            return this.game.failedFBO;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsModal.prototype, "chatlogRangeText", {
        get: function () {
            var range = this.account.chatlogRange;
            return constants_1.isChatlogRangeUnlimited(range) ? 'entire screen' : range + " tiles";
        },
        enumerable: true,
        configurable: true
    });
    SettingsModal.prototype.ngOnInit = function () {
        var _this = this;
        this.accountBackup = utils_1.cloneDeep(this.settingsService.account);
        this.browserBackup = utils_1.cloneDeep(this.settingsService.browser);
        this.account = this.settingsService.account;
        this.browser = this.settingsService.browser;
        this.setupDefaults();
        this.subscription = this.game.onLeft.subscribe(function () { return _this.cancel(); });
    };
    SettingsModal.prototype.ngOnDestroy = function () {
        this.finishChatlogRange();
        if (!this.done) {
            this.cancel();
        }
        this.subscription && this.subscription.unsubscribe();
    };
    SettingsModal.prototype.reset = function () {
        this.account = this.settingsService.account = {};
        this.browser = this.settingsService.browser = {};
        this.setupDefaults();
    };
    SettingsModal.prototype.cancel = function () {
        this.done = true;
        this.settingsService.account = this.accountBackup;
        this.settingsService.browser = this.browserBackup;
        this.close.emit();
    };
    SettingsModal.prototype.ok = function () {
        if (this.account.filterWords) {
            var filter = this.account.filterWords;
            while (filter.length > constants_1.MAX_FILTER_WORDS_LENGTH && /\s/.test(filter)) {
                filter = filter.trim().replace(/\s+\S+$/, '');
            }
            if (filter.length > constants_1.MAX_FILTER_WORDS_LENGTH) {
                this.account.filterWords = '';
            }
            else {
                this.account.filterWords = filter;
            }
        }
        this.done = true;
        this.settingsService.saveAccountSettings(this.account);
        this.settingsService.saveBrowserSettings(this.browser);
        this.close.emit();
    };
    SettingsModal.prototype.updateChatlogRange = function (range) {
        document.body.classList.add('translucent-modals');
        clientUtils_1.updateRangeIndicator(range, this.game);
    };
    SettingsModal.prototype.finishChatlogRange = function () {
        document.body.classList.remove('translucent-modals');
        clientUtils_1.updateRangeIndicator(undefined, this.game);
    };
    SettingsModal.prototype.setupDefaults = function () {
        if (this.account.chatlogOpacity === undefined) {
            this.account.chatlogOpacity = constants_1.DEFAULT_CHATLOG_OPACITY;
        }
        if (this.account.chatlogRange === undefined) {
            this.account.chatlogRange = constants_1.MAX_CHATLOG_RANGE;
        }
        if (this.account.filterWords === undefined) {
            this.account.filterWords = '';
        }
    };
    SettingsModal.prototype.export = function () {
        var account = __assign({}, this.account, { actions: undefined });
        var browser = this.browser;
        var data = JSON.stringify({ account: account, browser: browser });
        saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), "pony-town-settings.json");
    };
    SettingsModal.prototype.import = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var text, _a, account, browser, actions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!file) return [3 /*break*/, 2];
                        return [4 /*yield*/, clientUtils_1.readFileAsText(file)];
                    case 1:
                        text = _b.sent();
                        _a = JSON.parse(text), account = _a.account, browser = _a.browser;
                        actions = this.account.actions;
                        Object.assign(this.account, __assign({}, account, { actions: actions }));
                        Object.assign(this.browser, browser);
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SettingsModal.prototype, "close", void 0);
    SettingsModal = __decorate([
        core_1.Component({
            selector: 'settings-modal',
            templateUrl: 'settings-modal.pug',
            styleUrls: ['settings-modal.scss'],
        }),
        __metadata("design:paramtypes", [settingsService_1.SettingsService,
            storageService_1.StorageService,
            game_1.PonyTownGame])
    ], SettingsModal);
    return SettingsModal;
}());
exports.SettingsModal = SettingsModal;
