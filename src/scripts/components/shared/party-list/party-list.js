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
var game_1 = require("../../../client/game");
var icons_1 = require("../../../client/icons");
var utils_1 = require("../../../common/utils");
var partyUtils_1 = require("../../../client/partyUtils");
function visibleMembers(members, max, start) {
    return members.length > max ? Math.max(max - (start > 0 ? 2 : 1), 1) : max;
}
var PartyList = /** @class */ (function () {
    function PartyList(game) {
        this.game = game;
        this.ellipsisIcon = icons_1.faEllipsisV;
        this.leaderIcon = icons_1.partyLeaderIcon;
        this.cogIcon = icons_1.faCog;
        this.hidden = false;
        this.start = 0;
        this.maxMembers = constants_1.PARTY_LIMIT - 1;
        this.members = [];
    }
    Object.defineProperty(PartyList.prototype, "hasParty", {
        get: function () {
            return this.game.party !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartyList.prototype, "isLeader", {
        get: function () {
            return partyUtils_1.isPartyLeader(this.game);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartyList.prototype, "hasMore", {
        get: function () {
            return this.members.length > (this.start + this.visible);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartyList.prototype, "visible", {
        get: function () {
            return visibleMembers(this.members, this.maxMembers, this.start);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PartyList.prototype, "limit", {
        get: function () {
            return this.start + this.visible;
        },
        enumerable: true,
        configurable: true
    });
    PartyList.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this.game.onPartyUpdate.subscribe(function () { return _this.update(); });
        this.resized();
    };
    PartyList.prototype.ngOnDestroy = function () {
        this.subscription && this.subscription.unsubscribe();
    };
    PartyList.prototype.isMe = function (member) {
        return this.game.player && this.game.player.id === member.id;
    };
    PartyList.prototype.leave = function () {
        this.game.send(function (server) { return server.leaveParty(); });
    };
    PartyList.prototype.update = function () {
        if (this.hasParty) {
            this.members = this.game.party ? this.game.party.members.filter(function (m) { return !m.self; }) : [];
            while (this.start > 0 && this.members.length <= this.start) {
                this.start = 0;
            }
        }
        else {
            this.members = [];
            this.start = 0;
        }
    };
    PartyList.prototype.resized = function () {
        var padding = 140 + 110;
        var max = utils_1.clamp(Math.floor((window.innerHeight - padding) / 43), 0, constants_1.PARTY_LIMIT - 1);
        if (this.maxMembers !== max) {
            this.start = 0;
            this.maxMembers = max;
        }
    };
    PartyList.prototype.next = function () {
        this.start += this.visible;
    };
    PartyList.prototype.prev = function () {
        var max = this.members.length - 1;
        var start = 0;
        while (start < max && (start + visibleMembers(this.members, this.maxMembers, start)) !== this.start) {
            start++;
        }
        this.start = start;
    };
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PartyList.prototype, "resized", null);
    PartyList = __decorate([
        core_1.Component({
            selector: 'party-list',
            templateUrl: 'party-list.pug',
            styleUrls: ['party-list.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame])
    ], PartyList);
    return PartyList;
}());
exports.PartyList = PartyList;
