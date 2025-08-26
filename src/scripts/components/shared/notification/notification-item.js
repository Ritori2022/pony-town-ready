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
var utils_1 = require("../../../common/utils");
var icons_1 = require("../../../client/icons");
var pony_1 = require("../../../common/pony");
var NotificationItem = /** @class */ (function () {
    function NotificationItem(game) {
        this.game = game;
        this.banIcon = icons_1.faBan;
    }
    Object.defineProperty(NotificationItem.prototype, "isOpen", {
        get: function () {
            return this.notification.open;
        },
        set: function (value) {
            if (value) {
                this.game.notifications.forEach(function (n) { return n.open = false; });
            }
            this.notification.open = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "okButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 1 /* Ok */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "yesButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 2 /* Yes */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "acceptButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 8 /* Accept */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "noButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 4 /* No */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "rejectButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 16 /* Reject */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "ignoreButton", {
        get: function () {
            return utils_1.hasFlag(this.notification.flags, 64 /* Ignore */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationItem.prototype, "paletteInfo", {
        get: function () {
            return pony_1.getPaletteInfo(this.notification.pony);
        },
        enumerable: true,
        configurable: true
    });
    NotificationItem.prototype.ngOnDestroy = function () {
        this.isOpen = false;
    };
    NotificationItem.prototype.accept = function () {
        var _this = this;
        this.game.send(function (server) { return server.acceptNotification(_this.notification.id); });
    };
    NotificationItem.prototype.reject = function () {
        var _this = this;
        this.game.send(function (server) { return server.rejectNotification(_this.notification.id); });
    };
    NotificationItem.prototype.ignore = function () {
        this.reject();
        var pony = this.notification.pony;
        if (pony !== this.game.player) {
            this.game.send(function (server) { return server.playerAction(pony.id, 1 /* Ignore */, undefined); });
            pony.playerState = utils_1.setFlag(pony.playerState, 1 /* Ignored */, true);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], NotificationItem.prototype, "notification", void 0);
    NotificationItem = __decorate([
        core_1.Component({
            selector: 'notification-item',
            templateUrl: 'notification-item.pug',
            styleUrls: ['notification-item.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame])
    ], NotificationItem);
    return NotificationItem;
}());
exports.NotificationItem = NotificationItem;
