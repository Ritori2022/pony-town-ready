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
var modal_1 = require("ngx-bootstrap/modal");
var operators_1 = require("rxjs/operators");
var gameService_1 = require("../../services/gameService");
var model_1 = require("../../services/model");
var game_1 = require("../../../client/game");
var dropdown_1 = require("../directives/dropdown");
var icons_1 = require("../../../client/icons");
var settingsService_1 = require("../../services/settingsService");
var audio_1 = require("../../services/audio");
var SettingsBox = /** @class */ (function () {
    function SettingsBox(model, modalService, settingsService, gameService, game, audio, zone) {
        this.model = model;
        this.modalService = modalService;
        this.settingsService = settingsService;
        this.gameService = gameService;
        this.game = game;
        this.audio = audio;
        this.zone = zone;
        this.cogIcon = icons_1.faCog;
        this.searchIcon = icons_1.faSearch;
        this.signOutIcon = icons_1.faSignOutAlt;
        this.forwardIcon = icons_1.faStepForward;
        this.emptyIcon = icons_1.emptyIcon;
        this.plusIcon = icons_1.faPlus;
        this.minusIcon = icons_1.faMinus;
    }
    Object.defineProperty(SettingsBox.prototype, "scale", {
        get: function () {
            return this.game.scale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "volume", {
        get: function () {
            return this.game.volume;
        },
        set: function (value) {
            this.settingsService.browser.volume = value;
            this.settingsService.saveBrowserSettings();
            this.audio.setVolume(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "server", {
        get: function () {
            return this.gameService.server && this.gameService.server.name || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "settings", {
        get: function () {
            return this.model.account && this.model.account.settings || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "track", {
        get: function () {
            return this.game.audio.trackName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "volumeIcon", {
        get: function () {
            return this.volume === 0 ? icons_1.faVolumeOff : (this.volume < 50 ? icons_1.faVolumeDown : icons_1.faVolumeUp);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "isMod", {
        get: function () {
            return this.model.isMod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SettingsBox.prototype, "hasInvites", {
        get: function () {
            return this.isMod; // TEMP
        },
        enumerable: true,
        configurable: true
    });
    SettingsBox.prototype.ngOnInit = function () {
        var _this = this;
        this.game.onClock
            .pipe(operators_1.distinctUntilChanged())
            .subscribe(function (text) {
            if (_this.dropdown && _this.dropdown.isOpen) {
                _this.zone.run(function () { return _this.time = text; });
            }
            else {
                _this.time = text;
            }
        });
    };
    SettingsBox.prototype.ngOnDestroy = function () {
        this.subscription && this.subscription.unsubscribe();
    };
    SettingsBox.prototype.toggleVolume = function () {
        this.volume = this.volume === 0 ? 50 : 0;
    };
    SettingsBox.prototype.volumeStarted = function () {
        this.game.audio.forcePlay();
    };
    SettingsBox.prototype.nextTrack = function () {
        this.game.audio.playRandomTrack();
    };
    SettingsBox.prototype.leave = function () {
        this.gameService.leave('From settings dropdown');
        this.dropdown.close();
    };
    SettingsBox.prototype.zoomOut = function () {
        this.game.zoomOut();
    };
    SettingsBox.prototype.zoomIn = function () {
        this.game.zoomIn();
    };
    SettingsBox.prototype.unhideAllHiddenPlayers = function () {
        this.game.send(function (server) { return server.action(9 /* UnhideAllHiddenPlayers */); });
        this.dropdown.close();
    };
    SettingsBox.prototype.openModal = function (template) {
        this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true });
    };
    SettingsBox.prototype.openSettings = function () {
        this.openModal(this.settingsModal);
        this.dropdown.close();
    };
    SettingsBox.prototype.openActions = function () {
        this.openModal(this.actionsModal);
        this.dropdown.close();
    };
    SettingsBox.prototype.openInvites = function () {
        if (BETA) {
            this.openModal(this.invitesModal);
            this.dropdown.close();
        }
    };
    __decorate([
        core_1.ViewChild('dropdown', { static: true }),
        __metadata("design:type", dropdown_1.Dropdown)
    ], SettingsBox.prototype, "dropdown", void 0);
    __decorate([
        core_1.ViewChild('actionsModal', { static: true }),
        __metadata("design:type", core_1.TemplateRef)
    ], SettingsBox.prototype, "actionsModal", void 0);
    __decorate([
        core_1.ViewChild('settingsModal', { static: true }),
        __metadata("design:type", core_1.TemplateRef)
    ], SettingsBox.prototype, "settingsModal", void 0);
    __decorate([
        core_1.ViewChild('invitesModal', { static: true }),
        __metadata("design:type", core_1.TemplateRef)
    ], SettingsBox.prototype, "invitesModal", void 0);
    SettingsBox = __decorate([
        core_1.Component({
            selector: 'settings-box',
            templateUrl: 'settings-box.pug',
            styleUrls: ['settings-box.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model,
            modal_1.BsModalService,
            settingsService_1.SettingsService,
            gameService_1.GameService,
            game_1.PonyTownGame,
            audio_1.Audio,
            core_1.NgZone])
    ], SettingsBox);
    return SettingsBox;
}());
exports.SettingsBox = SettingsBox;
