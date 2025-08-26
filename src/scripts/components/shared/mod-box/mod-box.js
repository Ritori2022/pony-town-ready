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
var constants_1 = require("../../../common/constants");
var model_1 = require("../../services/model");
var game_1 = require("../../../client/game");
var icons_1 = require("../../../client/icons");
var ageLabels = ['', 'M', 'A', '', '', '[M]', '[A]'];
var ageTitles = ['Not set', 'Minor', 'Adult', '', '', 'Minor (locked)', 'Adult (locked)'];
var ModBox = /** @class */ (function () {
    function ModBox(model, game) {
        this.model = model;
        this.game = game;
        this.flagIcon = icons_1.faFlag;
        this.noteIcon = icons_1.faStickyNote;
        this.muteIcon = icons_1.faMicrophoneSlash;
        this.hideIcon = icons_1.faEyeSlash;
        this.moreIcon = icons_1.faUserCog;
        this.dangerIcon = icons_1.faExclamationCircle;
        this.timeouts = constants_1.TIMEOUTS;
        this.isNoteOpen = false;
    }
    Object.defineProperty(ModBox.prototype, "ageLabel", {
        get: function () {
            return ageLabels[this.modInfo && this.modInfo.age || 0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "ageTitle", {
        get: function () {
            return ageTitles[this.modInfo && this.modInfo.age || 0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "modInfo", {
        get: function () {
            return this.pony.modInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "account", {
        get: function () {
            return this.modInfo && this.modInfo.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "country", {
        get: function () {
            return this.modInfo && this.modInfo.country;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "mute", {
        get: function () {
            return this.modInfo && this.modInfo.mute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "muteTooltip", {
        get: function () {
            return this.mute ? (this.mute === 'perma' ? 'Permanently Muted' : "Muted for " + this.mute) : 'Mute';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "shadow", {
        get: function () {
            return this.modInfo && this.modInfo.shadow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "shadowTooltip", {
        get: function () {
            return this.shadow ? (this.shadow === 'perma' ? 'Permanently Shadowed' : "Shadowed for " + this.shadow) : 'Shadow';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "counters", {
        get: function () {
            return this.modInfo && this.modInfo.counters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "hasCounters", {
        get: function () {
            var counters = this.counters;
            return counters && (counters.spam || counters.swears || counters.timeouts);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "check", {
        get: function () {
            return this.model.modCheck;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModBox.prototype, "note", {
        get: function () {
            return this.modInfo && this.modInfo.note;
        },
        set: function (value) {
            if (this.modInfo) {
                this.modInfo.note = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    ModBox.prototype.ngOnDestroy = function () {
        if (this.isNoteOpen) {
            this.blur();
        }
    };
    ModBox.prototype.className = function (value) {
        return value ? (value === 'perma' ? 'btn-danger' : 'btn-warning') : 'btn-default';
    };
    ModBox.prototype.report = function () {
        this.modAction(1 /* Report */);
    };
    ModBox.prototype.setMute = function (value) {
        this.modAction(2 /* Mute */, value);
    };
    ModBox.prototype.setShadow = function (value) {
        this.modAction(3 /* Shadow */, value);
    };
    ModBox.prototype.blur = function () {
        var _this = this;
        this.game.send(function (server) { return server.setNote(_this.pony.id, _this.modInfo && _this.modInfo.note || ''); });
        this.isNoteOpen = false;
    };
    ModBox.prototype.modAction = function (type, param) {
        var _this = this;
        if (param === void 0) { param = 0; }
        return this.game.send(function (server) { return server.otherAction(_this.pony.id, type, param); });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ModBox.prototype, "pony", void 0);
    ModBox = __decorate([
        core_1.Component({
            selector: 'mod-box',
            templateUrl: 'mod-box.pug',
            styleUrls: ['mod-box.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model, game_1.PonyTownGame])
    ], ModBox);
    return ModBox;
}());
exports.ModBox = ModBox;
