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
            template: '<div class="sign-in-box mx-auto text-center"><p class="lead">Sign in with your social site account</p><div *ngIf="signUpProviders.length"><div class="sign-in-heading"><span aria-hidden="true">Sign in <i>or</i> sign up</span></div><div class="sign-in-box-providers"><button class="btn btn-lg btn-dark" *ngFor="let p of signUpProviders" (click)="signInTo(p)" [class.disabled]="p.disabled" [style.border-bottom-color]="p.color" title="Sign in using {{p.name}}"><fa-icon [icon]="icon(p.id)" [fixedWidth]="true" size="lg"></fa-icon><div class="sr-only">Sign in or sign up using {{p.name}}</div></button></div></div><div *ngIf="signInProviders.length"><div class="sign-in-heading"><span aria-hidden="true">Sign in <i>only</i></span></div><div class="text-muted mb-3">(You <b>cannot</b> use these social sites to create new account)</div><div class="sign-in-box-providers sign-in-only"><button class="btn btn-lg btn-dark" *ngFor="let p of signInProviders" (click)="signInTo(p)" [class.disabled]="p.disabled" [style.border-bottom-color]="p.color" title="Sign in using {{p.name}}"><fa-icon [icon]="icon(p.id)" [fixedWidth]="true" size="lg"></fa-icon><div class="sr-only">Sign in using {{p.name}}</div></button></div></div><div *ngIf="local"><div class="btn-group dropdown" dropdown><button class="btn btn-lg btn-dark dropdown-toggle" dropdownToggle>Mock login</button><div class="dropdown-menu" *dropdownMenu><a class="dropdown-item" href="/auth/local?password=x&username=57a3dc6f2f0019a161cdebf6" target="_self">Admin</a><a class="dropdown-item" href="/auth/local?password=x&username=57ae2332a67f4dc52e123e14" target="_self">Test</a><a class="dropdown-item" href="/auth/local?password=x&username=57ae2332a67f4dc52e123e15" target="_self">Other</a></div></div></div></div>',
            styleUrls: ['sign-in-box.scss'],
        })
    ], SignInBox);
    return SignInBox;
}());
exports.SignInBox = SignInBox;
