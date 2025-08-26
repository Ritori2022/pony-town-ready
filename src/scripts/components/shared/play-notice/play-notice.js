"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var data_1 = require("../../../client/data");
var constants_1 = require("../../../common/constants");
var PlayNotice = /** @class */ (function () {
    function PlayNotice() {
        this.patreonLink = data_1.supporterLink;
        this.rules = constants_1.GENERAL_RULES;
    }
    PlayNotice = __decorate([
        core_1.Component({
            selector: 'play-notice',
            template: '<div class="mx-auto text-left text-large" style="max-width: 400px;"><h5>General rules</h5><ul class="text-muted list-rules"><li *ngFor="let r of rules">{{r}}</li></ul><h5>Notice</h5><p class="text-muted">This game is very <strong>early in development</strong>. There might be bugs and occasional downtimes.</p><p class="text-muted">Please do not redistribute any of the game files or code.</p></div>',
        })
    ], PlayNotice);
    return PlayNotice;
}());
exports.PlayNotice = PlayNotice;
