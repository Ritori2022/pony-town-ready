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
var icons_1 = require("../../../client/icons");
var pony_1 = require("../../../common/pony");
var PartyBox = /** @class */ (function () {
    function PartyBox(game) {
        this.game = game;
        this.leaderIcon = icons_1.partyLeaderIcon;
        this.offlineIcon = icons_1.offlineIcon;
    }
    Object.defineProperty(PartyBox.prototype, "paletteInfo", {
        get: function () {
            return this.member.pony && pony_1.getPaletteInfo(this.member.pony);
        },
        enumerable: true,
        configurable: true
    });
    PartyBox.prototype.click = function () {
        this.game.select(this.member.pony);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PartyBox.prototype, "member", void 0);
    PartyBox = __decorate([
        core_1.Component({
            selector: 'party-box',
            templateUrl: 'party-box.pug',
            styleUrls: ['party-box.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame])
    ], PartyBox);
    return PartyBox;
}());
exports.PartyBox = PartyBox;
