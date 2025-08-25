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
var LIMIT = 8;
var NotificationList = /** @class */ (function () {
    function NotificationList() {
        this.ellipsisIcon = icons_1.faEllipsisV;
        this.start = 0;
    }
    Object.defineProperty(NotificationList.prototype, "notificationsLength", {
        set: function (value) {
            while (this.start > value) {
                this.prev();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationList.prototype, "limit", {
        get: function () {
            return this.start + LIMIT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NotificationList.prototype, "hasMore", {
        get: function () {
            return this.notifications.length > (this.start + this.limit);
        },
        enumerable: true,
        configurable: true
    });
    NotificationList.prototype.next = function () {
        this.start += this.limit;
    };
    NotificationList.prototype.prev = function () {
        this.start -= this.start <= LIMIT ? LIMIT : LIMIT - 1;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], NotificationList.prototype, "notifications", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], NotificationList.prototype, "notificationsLength", null);
    NotificationList = __decorate([
        core_1.Component({
            selector: 'notification-list',
            templateUrl: 'notification-list.pug',
            styleUrls: ['notification-list.scss'],
        })
    ], NotificationList);
    return NotificationList;
}());
exports.NotificationList = NotificationList;
