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
var sign_in_box_1 = require("../sign-in-box/sign-in-box");
var icons_1 = require("../../../client/icons");
var model_1 = require("../../services/model");
var clientUtils_1 = require("../../../client/clientUtils");
var settingsService_1 = require("../../services/settingsService");
var constants_1 = require("../../../common/constants");
var MenuBar = /** @class */ (function () {
    function MenuBar(model, settings) {
        this.model = model;
        this.settings = settings;
        this.signUpProviders = data_1.signUpProviders;
        this.signInProviders = data_1.signInProviders;
        this.starIcon = icons_1.faStar;
        this.spinnerIcon = icons_1.faSpinner;
        this.userIcon = icons_1.faUser;
        this.alertIcon = icons_1.faExclamationCircle;
        this.cogIcon = icons_1.faCog;
        this.statusIcon = icons_1.faCircle;
        this.logo = false;
        this.loading = false;
        this.loadingError = false;
        this.signOut = new core_1.EventEmitter();
        this.signIn = new core_1.EventEmitter();
    }
    Object.defineProperty(MenuBar.prototype, "hasSupporterIcon", {
        get: function () {
            return clientUtils_1.isSupporterOrPastSupporter(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuBar.prototype, "supporterTitle", {
        get: function () {
            return clientUtils_1.supporterTitle(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuBar.prototype, "supporterClass", {
        get: function () {
            return clientUtils_1.supporterClass(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuBar.prototype, "showAccountAlert", {
        get: function () {
            return this.model.missingBirthdate && constants_1.REQUEST_DATE_OF_BIRTH;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MenuBar.prototype, "hidden", {
        get: function () {
            return !!this.settings.account.hidden;
        },
        enumerable: true,
        configurable: true
    });
    MenuBar.prototype.icon = function (id) {
        return sign_in_box_1.getProviderIcon(id);
    };
    MenuBar.prototype.signInTo = function (provider) {
        this.signIn.emit(provider);
    };
    MenuBar.prototype.resize = function () {
    };
    MenuBar.prototype.setStatus = function (status) {
        this.settings.account.hidden = status === 'invisible';
        this.settings.saveAccountSettings(this.settings.account);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "logo", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "loading", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "loadingError", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "account", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "signOut", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MenuBar.prototype, "signIn", void 0);
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MenuBar.prototype, "resize", null);
    MenuBar = __decorate([
        core_1.Component({
            selector: 'menu-bar',
            templateUrl: 'menu-bar.pug',
            styleUrls: ['menu-bar.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model, settingsService_1.SettingsService])
    ], MenuBar);
    return MenuBar;
}());
exports.MenuBar = MenuBar;
