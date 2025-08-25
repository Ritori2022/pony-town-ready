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
var data_1 = require("../../../client/data");
var icons_1 = require("../../../client/icons");
function getProviderIcon(id) {
    return icons_1.oauthIcons[id] || icons_1.emptyIcon;
}
exports.getProviderIcon = getProviderIcon;
var SignInBox = /** @class */ (function () {
    function SignInBox() {
        this.signUpProviders = data_1.signUpProviders;
        this.signInProviders = data_1.signInProviders;
        this.local = data_1.local || DEVELOPMENT;
        this.signIn = new core_1.EventEmitter();
    }
    SignInBox.prototype.icon = function (id) {
        return getProviderIcon(id);
    };
    SignInBox.prototype.signInTo = function (provider) {
        this.signIn.emit(provider);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SignInBox.prototype, "signIn", void 0);
    SignInBox = __decorate([
        core_1.Component({
            selector: 'sign-in-box',
            templateUrl: 'sign-in-box.pug',
            styleUrls: ['sign-in-box.scss'],
        })
    ], SignInBox);
    return SignInBox;
}());
exports.SignInBox = SignInBox;
