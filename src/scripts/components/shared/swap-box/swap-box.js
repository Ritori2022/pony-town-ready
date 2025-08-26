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
var game_1 = require("../../../client/game");
var dropdown_1 = require("../directives/dropdown");
var icons_1 = require("../../../client/icons");
var ponyInfo_1 = require("../../../common/ponyInfo");
var model_1 = require("../../services/model");
// import { SWAP_TIMEOUT, SECOND } from '../../../common/constants';
var SwapBox = /** @class */ (function () {
    function SwapBox(game, zone, model) {
        this.game = game;
        this.zone = zone;
        this.model = model;
        this.swapIcon = icons_1.faExchangeAlt;
        this.timerIcon = icons_1.faClock;
        this.timeout = false;
    }
    SwapBox.prototype.toggleSwapDropdown = function () {
        this.zone.run(function () { return setTimeout(function () { }, 10); });
    };
    SwapBox.prototype.swapPony = function (pony) {
        var _this = this;
        this.game.send(function (server) { return server.actionParam(11 /* SwapCharacter */, pony.id); });
        setTimeout(function () {
            _this.dropdown && _this.dropdown.close();
            pony.lastUsed = (new Date()).toISOString();
            _this.model.sortPonies();
        });
        // if (!this.timeout) {
        // 	this.timeout = true;
        // 	setTimeout(() => this.timeout = false, SWAP_TIMEOUT + SECOND);
        // }
    };
    SwapBox.prototype.preview = function (pony) {
        var info = pony && pony.ponyInfo;
        this.previewInfo = info && ponyInfo_1.toPalette(info, ponyInfo_1.mockPaletteManager);
    };
    __decorate([
        core_1.ViewChild('dropdown', { static: true }),
        __metadata("design:type", dropdown_1.Dropdown)
    ], SwapBox.prototype, "dropdown", void 0);
    SwapBox = __decorate([
        core_1.Component({
            selector: 'swap-box',
            templateUrl: 'swap-box.pug',
            styleUrls: ['swap-box.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame, core_1.NgZone, model_1.Model])
    ], SwapBox);
    return SwapBox;
}());
exports.SwapBox = SwapBox;
