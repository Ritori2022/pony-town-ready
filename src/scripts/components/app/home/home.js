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
var model_1 = require("../../services/model");
var ponyHelpers_1 = require("../../../client/ponyHelpers");
var gameService_1 = require("../../services/gameService");
var installService_1 = require("../../services/installService");
var Home = /** @class */ (function () {
    function Home(gameService, model, installService) {
        this.gameService = gameService;
        this.model = model;
        this.installService = installService;
        this.state = ponyHelpers_1.defaultPonyState();
        this.previewPony = undefined;
    }
    Object.defineProperty(Home.prototype, "authError", {
        get: function () {
            return this.model.authError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "accountAlert", {
        get: function () {
            return this.model.accountAlert;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "canInstall", {
        get: function () {
            return this.installService.canInstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "playing", {
        get: function () {
            return this.gameService.playing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "loading", {
        get: function () {
            return this.model.loading || this.model.updating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "account", {
        get: function () {
            return this.model.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "pony", {
        get: function () {
            return this.model.pony;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "previewInfo", {
        get: function () {
            return this.previewPony ? this.previewPony.ponyInfo : this.pony.ponyInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "previewName", {
        get: function () {
            return this.previewPony ? this.previewPony.name : this.pony.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Home.prototype, "previewTag", {
        get: function () {
            return model_1.getPonyTag(this.previewPony || this.pony, this.account);
        },
        enumerable: true,
        configurable: true
    });
    Home.prototype.signIn = function (provider) {
        this.model.signIn(provider);
    };
    Home = __decorate([
        core_1.Component({
            selector: 'home',
            template: '<div *ngIf="!playing"><div class="text-center heading"><img class="pixelart home-logo" revSrc="images/logo-large.png" alt="Pony Town"></div><div class="mx-auto home-content"><page-loader></page-loader><div *ngIf="!loading"><h1 class="sr-only" focusTitle>Home</h1><div class="form-group" *ngIf="authError"><div class="alert alert-danger" role="alert">{{authError}}</div><div class="alert alert-warning" role="alert" *ngIf="accountAlert">{{accountAlert}}</div></div><div class="form-group" *ngIf="!account"><sign-in-box (signIn)="signIn($event)"></sign-in-box></div><div *ngIf="!!account"><div class="form-group"><support-button></support-button></div><div class="form-group" *ngIf="canInstall"><install-button></install-button></div><div class="form-group"><character-select [(error)]="error" [editButton]="true" (preview)="previewPony = $event"></character-select></div><div class="form-group"><character-preview [pony]="previewInfo" [state]="state" [passive]="true" [name]="previewName" [tag]="previewTag"></character-preview></div><div class="form-group text-center"><play-box [(error)]="error"></play-box></div><play-notice></play-notice></div></div></div></div>',
            styleUrls: ['home.scss'],
        }),
        __metadata("design:paramtypes", [gameService_1.GameService,
            model_1.Model,
            installService_1.InstallService])
    ], Home);
    return Home;
}());
exports.Home = Home;
