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
            template: '<div class="form-group" *ngIf="hasTooManyPonies"><div class="alert alert-warning" role="alert">You have more than the allowed number of {{characterLimit}} ponies, the additional ones may get deleted. Remove some of your unused ponies to prevent losing the ones you want to keep.</div></div><div class="form-group" *ngIf="isMarkedForMultiples"><div class="alert alert-warning" role="alert">Your account has been flagged for creating multiple accounts. Creating more accounts may result in a permanent ban.</div></div><div class="form-group" *ngIf="accountAlert"><div class="alert alert-warning" role="alert">{{accountAlert}}</div></div><div class="form-group" *ngIf="leftMessage"><div class="alert alert-warning" role="alert">{{leftMessage}}</div></div><div class="form-group" *ngIf="isAndroidBrowser"><div class="alert alert-warning" role="alert">Your browser is outdated and is not able to correctly run Pony Town. Please install different browser to be able to play the game.</div></div><div class="form-group" *ngIf="model.missingBirthdate && !birthdateSet && requestBirthdate"><div class="alert alert-warning text-left" role="alert"><label for="birthdate">Set your date of birth</label><date-picker [(date)]="birthdate"></date-picker><div class="mt-2 text-right"><button class="btn btn-default px-4" (click)="saveBirthdate()">Save</button></div><p class="mb-0 mt-2">Please fill-in your <b>date of birth</b> in order to not lose access to the game in future updates.</p></div></div><div class="form-group dropdown" dropdown><div class="btn-group d-flex"><button class="btn btn-lg btn-success text-ellipsis flex-grow-1" #playButton (click)="joining ? cancel() : play()" [disabled]="!canPlay && !joining"><div *ngIf="joining"><fa-icon class="mr-1" [icon]="spinnerIcon" [spin]="true"></fa-icon>Cancel</div><div *ngIf="!joining && server"><strong>{{label || \'Play\'}}</strong> on <span>{{server.name}}</span></div><div class="text-faded" *ngIf="!joining && !server">select server to play</div></button><button class="btn btn-lg btn-success flex-grow-0 dropdown-toggle" dropdownToggle aria-label="select server" [disabled]="joining" style="position: relative"></button></div><div class="dropdown-menu w-100" *dropdownMenu style="overflow: hidden"><button class="dropdown-item" *ngFor="let s of servers" (click)="server = s; playButton.focus()"><div><div class="float-right" style="position: relative;"><div class="text-unsafe" *ngIf="s.offline"><span class="sr-only">server</span> offline</div><div class="text-muted" *ngIf="!s.offline">online <span class="sr-only">players</span> ({{s.online}})</div></div><div class="flag mr-2" *ngFor="let f of s.countryFlags" [ngClass]="\'flag-\' + f"></div><fa-icon class="text-muted mr-2" *ngIf="!hasFlag(s)" [icon]="getIcon(s)" size="lg"></fa-icon><strong>{{s.name}}</strong></div><div class="text-muted text-wrap">{{s.desc}}</div></button></div></div><div class="form-group text-left text-muted server-alert" *ngIf="server?.alert === \'18+\'"><fa-icon class="float-left p-2" [icon]="warningIcon" size="2x"></fa-icon>By playing on this server you confirm that you are over 18 years old and you take no issue with seeing adult topics.</div><div class="form-group text-left text-info server-alert" *ngIf="server?.alert === \'test\'"><fa-icon class="float-left p-2" [icon]="infoIcon" size="2x"></fa-icon>Supporter test server: Here you can try experimental and unfinished features that we\'re working on. Keep in mind everything is subject to change.</div><div class="form-group" *ngIf="server?.offline"><div class="alert alert-info" role="alert">Selected server is offline, try again later</div></div><div class="form-group" *ngIf="offline"><div class="alert alert-info" role="alert">Server is offline, try again later</div></div><div class="form-group" *ngIf="protectionError && !offline"><div class="alert alert-info" role="alert">Cloudflare error, <button class="btn btn-sm btn-outline-default" (click)="reload()">reload</button> to continue.</div></div><div class="form-group" *ngIf="updateWarning"><div class="alert alert-warning" role="alert">Server will restart shortly for updates and maintenance. Save your character to avoid losing any progress.</div></div><div class="form-group" *ngIf="isBrowserOutdated"><div class="alert alert-warning" role="alert"><button class="close float-right" (click)="dismissOutdatedBrowser()" aria-label="Close" style="font-size: 20px;">&times;</button>Your browser is outdated and is known to have issues running Pony Town. Make sure you have latest version installed.</div></div><div class="form-group" *ngIf="invalidVersion && !offline"><div class="alert alert-danger" role="alert">Your client version is outdated, <button class="btn btn-sm btn-outline-default" (click)="reload()">reload</button> to be able to play.</div></div><div class="form-group" *ngIf="isAccessError"><div class="alert alert-danger" role="alert">You\'re no longer signed-in, <button class="btn btn-sm btn-outline-default" (click)="reload()">reload</button> to be able to sign-in again.</div></div><div class="form-group" *ngIf="failedToLoadImages"><div class="alert alert-danger" role="alert">Failed to load game assets, <button class="btn btn-sm btn-outline-default" (click)="hardReload()">reload</button> to retry.</div></div><div class="form-group" *ngIf="isWebGLError"><div class="alert alert-danger" role="alert">Failed to create WebGL context. Your graphics card drivers or browser are outdated or graphics acceleration is disabled. Go to <a class="alert-link" href="http://webglreport.com/" tabindex>WebGL Report</a> to check WebGL support in your browser.</div></div><div class="form-group" *ngIf="isBrowserError"><div class="alert alert-danger" role="alert">Your browser is outdated, make sure you have the latest version installed.</div></div><div class="form-group" *ngIf="isOtherError"><div class="alert alert-danger" role="alert">{{error}}</div></div><div class="form-group text-left text-large" *ngIf="server"><h5>Server rules</h5><p class="text-muted list-rules">{{server.desc}}</p></div>',
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
