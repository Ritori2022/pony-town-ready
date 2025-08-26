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
var pony_1 = require("../../../common/pony");
var model_1 = require("../../services/model");
var game_1 = require("../../../client/game");
var icons_1 = require("../../../client/icons");
var constants_1 = require("../../../common/constants");
var partyUtils_1 = require("../../../client/partyUtils");
var tags_1 = require("../../../common/tags");
var entityUtils_1 = require("../../../common/entityUtils");
var utils_1 = require("../../../common/utils");
var PonyBox = /** @class */ (function () {
    function PonyBox(model, game) {
        this.model = model;
        this.game = game;
        this.leaderIcon = icons_1.partyLeaderIcon;
        this.inviteIcon = icons_1.faUserPlus;
        this.removeIcon = icons_1.faUserTimes;
        this.cogIcon = icons_1.faUserCog;
        this.checkIcon = icons_1.faCheck;
        this.ignoreIcon = icons_1.faMicrophoneSlash;
        this.hideIcon = icons_1.faEyeSlash;
        this.starIcon = icons_1.faStar;
        this.addFriendIcon = icons_1.faUserPlus;
        this.removeFriendIcon = icons_1.faUserMinus;
        this.messageIcon = icons_1.faComment;
        this.isIgnored = entityUtils_1.isIgnored;
        this.isFriend = entityUtils_1.isFriend;
        this.removingFriend = false;
        this.sendMessage = new core_1.EventEmitter();
    }
    Object.defineProperty(PonyBox.prototype, "ignoredOrHidden", {
        get: function () {
            return this.pony && (entityUtils_1.isIgnored(this.pony) || entityUtils_1.isHidden(this.pony));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "isMod", {
        get: function () {
            return this.model.isMod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "canInviteToParty", {
        get: function () {
            return this.pony && (!this.game.party || (partyUtils_1.isPartyLeader(this.game) && !partyUtils_1.isPonyInParty(this.game.party, this.pony, true)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "canRemoveFromParty", {
        get: function () {
            return this.pony && partyUtils_1.isPartyLeader(this.game) && partyUtils_1.isPonyInParty(this.game.party, this.pony, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "canPromoteToLeader", {
        get: function () {
            return this.pony && partyUtils_1.isPartyLeader(this.game) && partyUtils_1.isPonyInParty(this.game.party, this.pony, false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "special", {
        get: function () {
            var tag = tags_1.getTag(this.pony && this.pony.tag);
            return tag && tag.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "specialClass", {
        get: function () {
            var tag = tags_1.getTag(this.pony && this.pony.tag);
            return tag && tag.tagClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "paletteInfo", {
        get: function () {
            return this.pony && pony_1.getPaletteInfo(this.pony);
        },
        enumerable: true,
        configurable: true
    });
    PonyBox.prototype.inviteToParty = function () {
        this.playerAction(3 /* InviteToParty */);
    };
    PonyBox.prototype.removeFromParty = function () {
        this.playerAction(4 /* RemoveFromParty */);
    };
    PonyBox.prototype.promoteToLeader = function () {
        this.playerAction(5 /* PromotePartyLeader */);
    };
    PonyBox.prototype.toggleIgnore = function () {
        if (this.pony) {
            var ignored = entityUtils_1.isIgnored(this.pony);
            this.playerAction(ignored ? 2 /* Unignore */ : 1 /* Ignore */);
            this.pony.playerState = utils_1.setFlag(this.pony.playerState, 1 /* Ignored */, !ignored);
        }
    };
    PonyBox.prototype.hidePlayer = function (days) {
        this.playerAction(6 /* HidePlayer */, days * constants_1.DAY);
    };
    PonyBox.prototype.addFriend = function () {
        this.playerAction(8 /* AddFriend */);
    };
    PonyBox.prototype.removeFriend = function () {
        this.playerAction(9 /* RemoveFriend */);
    };
    PonyBox.prototype.playerAction = function (type, param) {
        if (param === void 0) { param = undefined; }
        var ponyId = this.pony && this.pony.id;
        if (ponyId) {
            this.game.send(function (server) { return server.playerAction(ponyId, type, param); });
        }
    };
    PonyBox.prototype.sendMessageTo = function () {
        if (this.pony) {
            this.sendMessage.emit(this.pony);
        }
    };
    Object.defineProperty(PonyBox.prototype, "canInviteToSupporterServers", {
        // supporter servers
        get: function () {
            return false; // DEVELOPMENT; // TODO: check if ignored or hidden
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyBox.prototype, "isInvitedToSupporterServers", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    PonyBox.prototype.inviteToSupporterServers = function () {
        this.playerAction(7 /* InviteToSupporterServers */);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PonyBox.prototype, "pony", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], PonyBox.prototype, "sendMessage", void 0);
    PonyBox = __decorate([
        core_1.Component({
            selector: 'pony-box',
            templateUrl: 'pony-box.pug',
            styleUrls: ['pony-box.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model, game_1.PonyTownGame])
    ], PonyBox);
    return PonyBox;
}());
exports.PonyBox = PonyBox;
