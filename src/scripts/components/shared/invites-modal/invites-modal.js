"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var ponyInfo_1 = require("../../../common/ponyInfo");
var compressPony_1 = require("../../../common/compressPony");
var game_1 = require("../../../client/game");
var utils_1 = require("../../../common/utils");
var model_1 = require("../../services/model");
var InvitesModal = /** @class */ (function () {
    function InvitesModal(model, game) {
        this.model = model;
        this.game = game;
        this.close = new core_1.EventEmitter();
        this.invites = [];
    }
    Object.defineProperty(InvitesModal.prototype, "inviteLimit", {
        get: function () {
            return this.model.supporterInviteLimit;
        },
        enumerable: true,
        configurable: true
    });
    InvitesModal.prototype.ngOnInit = function () {
        var _this = this;
        this.game.send(function (server) { return server.getInvites(); })
            .then(function (invites) { return invites.map(function (i) { return (__assign({}, i, { pony: ponyInfo_1.toPalette(compressPony_1.decompressPonyString(i.info)) })); }); })
            .then(function (invites) { return _this.invites = invites; });
    };
    InvitesModal.prototype.remove = function (invite) {
        this.error = undefined;
        this.game.send(function (server) { return server.actionParam(19 /* CancelSupporterInvite */, invite.id); });
        utils_1.removeItem(this.invites, invite);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], InvitesModal.prototype, "close", void 0);
    InvitesModal = __decorate([
        core_1.Component({
            selector: 'invites-modal',
            templateUrl: 'invites-modal.pug',
        }),
        __metadata("design:paramtypes", [model_1.Model, game_1.PonyTownGame])
    ], InvitesModal);
    return InvitesModal;
}());
exports.InvitesModal = InvitesModal;
