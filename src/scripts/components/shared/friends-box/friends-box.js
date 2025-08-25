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
var icons_1 = require("../../../client/icons");
var model_1 = require("../../services/model");
var game_1 = require("../../../client/game");
var utils_1 = require("../../../common/utils");
var settingsService_1 = require("../../services/settingsService");
var FriendsBox = /** @class */ (function () {
    function FriendsBox(settings, model, game) {
        this.settings = settings;
        this.model = model;
        this.game = game;
        this.friendsIcon = icons_1.faUserFriends;
        this.cogIcon = icons_1.faCog;
        this.addToPartyIcon = icons_1.faUserPlus;
        this.userOptionsIcon = icons_1.faUserCog;
        this.statusIcon = icons_1.faCircle;
        this.sendMessage = new core_1.EventEmitter();
    }
    Object.defineProperty(FriendsBox.prototype, "friends", {
        get: function () {
            return this.model.friends;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FriendsBox.prototype, "hidden", {
        get: function () {
            return !!this.settings.account.hidden;
        },
        enumerable: true,
        configurable: true
    });
    FriendsBox.prototype.toggleHidden = function () {
        this.settings.account.hidden = !this.settings.account.hidden;
        this.settings.saveAccountSettings(this.settings.account);
    };
    FriendsBox.prototype.toggle = function () {
        this.removing = undefined;
    };
    FriendsBox.prototype.sendMessageTo = function (friend) {
        this.sendMessage.emit(friend);
    };
    FriendsBox.prototype.inviteToParty = function (friend) {
        this.game.send(function (server) { return server.playerAction(friend.entityId, 3 /* InviteToParty */, undefined); });
    };
    FriendsBox.prototype.remove = function (friend) {
        this.removing = friend;
    };
    FriendsBox.prototype.cancelRemove = function () {
        this.removing = undefined;
    };
    FriendsBox.prototype.confirmRemove = function () {
        if (this.removing && this.model.friends) {
            var accountId_1 = this.removing.accountId;
            this.game.send(function (server) { return server.actionParam(22 /* RemoveFriend */, accountId_1); });
            utils_1.removeItem(this.model.friends, this.removing);
            this.removing = undefined;
        }
    };
    FriendsBox.prototype.setStatus = function (status) {
        this.settings.account.hidden = status === 'invisible';
        this.settings.saveAccountSettings(this.settings.account);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FriendsBox.prototype, "sendMessage", void 0);
    FriendsBox = __decorate([
        core_1.Component({
            selector: 'friends-box',
            templateUrl: 'friends-box.pug',
            styleUrls: ['friends-box.scss'],
        }),
        __metadata("design:paramtypes", [settingsService_1.SettingsService, model_1.Model, game_1.PonyTownGame])
    ], FriendsBox);
    return FriendsBox;
}());
exports.FriendsBox = FriendsBox;
