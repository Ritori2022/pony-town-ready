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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var utils_1 = require("../../../common/utils");
var errors_1 = require("../../../common/errors");
var data_1 = require("../../../client/data");
var gameService_1 = require("../../services/gameService");
var model_1 = require("../../services/model");
var icons_1 = require("../../../client/icons");
var clientUtils_1 = require("../../../client/clientUtils");
var spriteUtils_1 = require("../../../client/spriteUtils");
var storageService_1 = require("../../services/storageService");
var errorReporter_1 = require("../../services/errorReporter");
var constants_1 = require("../../../common/constants");
var ignoredErrors = [
    errors_1.WEBGL_CREATION_ERROR,
    errors_1.BROWSER_NOT_SUPPORTED_ERROR,
    errors_1.NAME_ERROR,
    errors_1.OFFLINE_ERROR,
    errors_1.VERSION_ERROR,
    errors_1.ACCESS_ERROR,
    errors_1.PROTECTION_ERROR,
    errors_1.NOT_AUTHENTICATED_ERROR,
    errors_1.CHARACTER_LIMIT_ERROR,
    'Saving in progress',
];
var PlayBox = /** @class */ (function () {
    function PlayBox(gameService, model, storage, errorReporter) {
        this.gameService = gameService;
        this.model = model;
        this.storage = storage;
        this.errorReporter = errorReporter;
        this.spinnerIcon = icons_1.faSpinner;
        this.warningIcon = icons_1.faExclamationCircle;
        this.infoIcon = icons_1.faInfoCircle;
        this.requestBirthdate = constants_1.REQUEST_DATE_OF_BIRTH;
        this.errorChange = new core_1.EventEmitter();
        this.joining = false;
        this.failedToLoadImages = false;
        this.birthdate = '';
        this.birthdateSet = false;
        this.locked = false;
    }
    Object.defineProperty(PlayBox.prototype, "error", {
        get: function () {
            return this.gameService.error;
        },
        set: function (value) {
            if (this.gameService) {
                this.gameService.error = value;
                this.errorChange.emit(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "server", {
        get: function () {
            return this.gameService.server;
        },
        set: function (value) {
            this.gameService.server = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "servers", {
        get: function () {
            return this.gameService.servers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "offline", {
        get: function () {
            return this.gameService.offline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "updateWarning", {
        get: function () {
            return this.gameService.updateWarning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "invalidVersion", {
        get: function () {
            return !!(this.gameService.versionError || this.error === errors_1.VERSION_ERROR
                || (this.gameService.version && this.gameService.version !== data_1.version));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "protectionError", {
        get: function () {
            return this.gameService.protectionError || this.error === errors_1.PROTECTION_ERROR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "canPlay", {
        get: function () {
            return !!this.server && this.gameService.canPlay && !this.locked && !this.invalidVersion && !this.failedToLoadImages;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isAccessError", {
        get: function () {
            return this.error === errors_1.ACCESS_ERROR || this.error === errors_1.ACCOUNT_ERROR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isWebGLError", {
        get: function () {
            return this.error === errors_1.WEBGL_CREATION_ERROR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isBrowserError", {
        get: function () {
            return this.error === errors_1.BROWSER_NOT_SUPPORTED_ERROR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isOtherError", {
        get: function () {
            return !!this.error && !this.invalidVersion && !this.isAccessError && !this.isWebGLError && !this.isBrowserError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "ponyLimit", {
        get: function () {
            return this.model.characterLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "hasTooManyPonies", {
        get: function () {
            return this.model.ponies.length > this.ponyLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isMarkedForMultiples", {
        get: function () {
            var account = this.model.account;
            return !!account && utils_1.hasFlag(account.flags, 1 /* Duplicates */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isAndroidBrowser", {
        get: function () {
            return clientUtils_1.isAndroidBrowser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "isBrowserOutdated", {
        get: function () {
            return !clientUtils_1.isAndroidBrowser && clientUtils_1.isBrowserOutdated && !this.storage.getBoolean('dismiss-outdated-browser');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "leftMessage", {
        get: function () {
            return this.gameService.leftMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayBox.prototype, "accountAlert", {
        get: function () {
            return this.model.accountAlert;
        },
        enumerable: true,
        configurable: true
    });
    PlayBox.prototype.ngOnInit = function () {
        var _this = this;
        spriteUtils_1.loadAndInitSpriteSheets()
            .then(function (loaded) { return _this.failedToLoadImages = !loaded; });
    };
    PlayBox.prototype.play = function () {
        var _this = this;
        if (this.canPlay) {
            this.joining = true;
            this.locked = true;
            this.error = undefined;
            var delayTime = (!DEVELOPMENT && this.gameService.wasPlaying) ? 1500 : 10;
            utils_1.delay(delayTime) // delay joing if user reloaded the game instead of leaving cleanly
                .then(function () { return _this.model.savePony(_this.model.pony); })
                .then(function (pony) { return _this.joining ? _this.gameService.join(pony.id) : Promise.resolve(); })
                .catch(function (e) {
                if (!/^Cancelled/.test(e.message)) {
                    _this.error = e.message;
                    if (!utils_1.includes(ignoredErrors, e.message) && !/shader/.test(e.message)) {
                        _this.errorReporter.reportError(e, { status: e.status, text: e.text });
                    }
                    DEVELOPMENT && console.error(e);
                }
            })
                .finally(function () { return _this.joining = false; })
                .then(function () { return utils_1.delay(1500); })
                .finally(function () { return _this.locked = false; });
        }
    };
    PlayBox.prototype.cancel = function () {
        this.gameService.leave('Cancelled joining');
    };
    PlayBox.prototype.reload = function () {
        location.reload(true);
    };
    PlayBox.prototype.hardReload = function () {
        clientUtils_1.hardReload();
    };
    PlayBox.prototype.hasFlag = function (server) {
        return server.countryFlags && server.countryFlags.length;
    };
    PlayBox.prototype.getIcon = function (server) {
        switch (server.flag) {
            case 'star': return icons_1.faStar;
            case 'test': return icons_1.faWrench;
            default: return icons_1.faGlobe;
        }
    };
    PlayBox.prototype.dismissOutdatedBrowser = function () {
        this.storage.setBoolean('dismiss-outdated-browser', true);
    };
    PlayBox.prototype.saveBirthdate = function () {
        if (this.birthdate) {
            this.model.updateAccount({ birthdate: this.birthdate });
            this.birthdateSet = true;
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PlayBox.prototype, "errorChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], PlayBox.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], PlayBox.prototype, "error", null);
    PlayBox = __decorate([
        core_1.Component({
            selector: 'play-box',
            templateUrl: 'play-box.pug',
            styleUrls: ['play-box.scss'],
        }),
        __metadata("design:paramtypes", [gameService_1.GameService,
            model_1.Model,
            storageService_1.StorageService,
            errorReporter_1.ErrorReporter])
    ], PlayBox);
    return PlayBox;
}());
exports.PlayBox = PlayBox;
