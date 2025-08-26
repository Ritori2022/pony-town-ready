"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var emoji_1 = require("../../../client/emoji");
var icons_1 = require("../../../client/icons");
var data_1 = require("../../../client/data");
var Help = /** @class */ (function () {
    function Help() {
        this.leftIcon = icons_1.faArrowLeft;
        this.rightIcon = icons_1.faArrowRight;
        this.upIcon = icons_1.faArrowUp;
        this.downIcon = icons_1.faArrowDown;
        this.emotes = emoji_1.emojis.map(function (e) { return e.names[0]; });
        this.mac = /Macintosh/.test(navigator.userAgent);
        this.contactEmail = data_1.contactEmail;
    }
    Help = __decorate([
        core_1.Component({
            selector: 'help',
            templateUrl: 'help.pug',
            styleUrls: ['help.scss'],
        })
    ], Help);
    return Help;
}());
exports.Help = Help;
