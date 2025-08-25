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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var emoji_1 = require("../../../client/emoji");
var rev_1 = require("../../../client/rev");
var credits_1 = require("../../../client/credits");
var changelog_1 = require("../../../generated/changelog");
var constants_1 = require("../../../common/constants");
var data_1 = require("../../../client/data");
function toCredit(credit) {
    return __assign({}, credit, { background: "url(" + rev_1.getUrl('images/avatars.jpg') + ")", position: (credit.avatarIndex % 4) * -82 + "px " + Math.floor(credit.avatarIndex / 4) * -82 + "px" });
}
var About = /** @class */ (function () {
    function About() {
        this.title = document.title;
        this.emotes = emoji_1.emojis;
        this.credits = credits_1.CREDITS.map(toCredit);
        this.contributors = credits_1.CONTRIBUTORS;
        this.changelog = changelog_1.CHANGELOG;
        this.rewards = constants_1.SUPPORTER_REWARDS_LIST;
        this.patreonLink = data_1.supporterLink;
        this.contactEmail = data_1.contactEmail;
    }
    About = __decorate([
        core_1.Component({
            selector: 'about',
            templateUrl: 'about.pug',
            styleUrls: ['about.scss'],
        })
    ], About);
    return About;
}());
exports.About = About;
