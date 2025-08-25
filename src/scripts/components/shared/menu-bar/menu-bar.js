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
            template: '<nav class="navbar navbar-expand justify-content-end" role="navigation"><div class="d-none d-md-block"><a class="pixelart logo" *ngIf="logo" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"><img class="pixelart logo-large" revSrc="images/logo-large.png" alt="Pony Town" width="287" height="65"><img class="pixelart logo-small" revSrc="images/logo-small.png" alt="Pony Town" width="37" height="43"></a></div><div class="navbar-collapse text-right"><div class="navbar-nav ml-auto"><ng-content></ng-content><div class="dropdown" *ngIf="account" #dropdown="ag-dropdown" dropdown autoClose="outsideClick"><button class="btn cursor-pointer dropdown-toggle" dropdownToggle [attr.aria-label]="\'Signed-in as \' + account.name"><fa-icon class="mr-1" *ngIf="hasSupporterIcon" [icon]="starIcon" [ngClass]="supporterClass" [title]="supporterTitle" [attr.aria-label]="supporterTitle" aria-hidden="true"></fa-icon><div class="d-none d-sm-inline" aria-hidden="true">{{account.name}}</div><fa-icon class="d-inline-block d-sm-none" [icon]="userIcon" [title]="account.name" [fixedWidth]="true" size="lg" aria-hidden="true"></fa-icon><fa-icon class="text-danger account-alert-icon" *ngIf="showAccountAlert" [icon]="alertIcon" [fixedWidth]="true" size="sm" aria-hidden="true"></fa-icon></button><div class="dropdown-menu dropdown-menu-right" *dropdownMenu><div class="dropdown-item d-flex align-items-center"><div class="flex-grow-1 mr-3">Status:</div><div class="dropdown" dropdown style="width: 65px;"><button class="online-offline no-highlight p-0 dropdown-toggle no-arrow" dropdownToggle><span class="text-success" *ngIf="!hidden">online</span><span class="text-muted" *ngIf="hidden">offline</span><fa-icon class="ml-2" [icon]="cogIcon"></fa-icon></button><div class="dropdown-menu dropdown-menu-right" *dropdownMenu><button class="dropdown-item" (click)="setStatus(\'online\')"><fa-icon class="mr-2 text-success" [icon]="statusIcon" size="xs" [fixedWidth]="true"></fa-icon>Online</button><button class="dropdown-item" (click)="setStatus(\'invisible\')"><fa-icon class="mr-2 text-muted" [icon]="statusIcon" size="xs" [fixedWidth]="true"></fa-icon>Show as Offline</button></div></div></div><a class="dropdown-item" routerLink="/account" (click)="dropdown.close()" tabindex>Account settings<fa-icon class="text-danger ml-1" *ngIf="showAccountAlert" [icon]="alertIcon" aria-hidden="true"></fa-icon></a><div class="dropdown-divider"></div><button class="dropdown-item" (click)="signOut.emit(); dropdown.close()">Sign out</button></div></div><div class="text-muted" *ngIf="loading" style="font-size: 20px; padding: 10px 20px;"><fa-icon [icon]="spinnerIcon" [fixedWidth]="true" [spin]="true"></fa-icon></div><form class="navbar-form ml-2" *ngIf="!loading && !account"><div class="button-group dropdown" dropdown><button class="btn btn-default dropdown-toggle" dropdownToggle [disabled]="!!loadingError">Sign in</button><div class="dropdown-menu dropdown-menu-right" *dropdownMenu><div class="dropdown-header" *ngIf="signUpProviders.length">Sign in or sign up</div><button class="dropdown-item" *ngFor="let p of signUpProviders" (click)="signInTo(p)" title="Sign in using {{p.name}}"><fa-icon class="mr-1" [icon]="icon(p.id)" [fixedWidth]="true"></fa-icon>{{p.name}}</button><div class="dropdown-header" *ngIf="signInProviders.length">Sign in only</div><button class="dropdown-item sign-in-only" *ngFor="let p of signInProviders" (click)="signInTo(p)" title="Sign in using {{p.name}}"><fa-icon class="mr-1" [icon]="icon(p.id)" [fixedWidth]="true"></fa-icon>{{p.name}}</button></div></div></form></div></div></nav>',
            styleUrls: ['menu-bar.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model, settingsService_1.SettingsService])
    ], MenuBar);
    return MenuBar;
}());
exports.MenuBar = MenuBar;
