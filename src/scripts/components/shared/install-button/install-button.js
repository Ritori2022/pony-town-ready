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
var icons_1 = require("../../../client/icons");
var installService_1 = require("../../services/installService");
var data_1 = require("../../../client/data");
var InstallButton = /** @class */ (function () {
    function InstallButton(installService) {
        this.installService = installService;
        this.closeIcon = icons_1.faTimes;
    }
    Object.defineProperty(InstallButton.prototype, "canInstall", {
        get: function () {
            return this.installService.canInstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InstallButton.prototype, "isMobile", {
        get: function () {
            return data_1.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    InstallButton.prototype.install = function () {
        this.installService.install();
    };
    InstallButton.prototype.dismiss = function () {
        this.installService.dismiss();
    };
    InstallButton = __decorate([
        core_1.Component({
            selector: 'install-button',
            template: '<div class="btn-group d-flex" *ngIf="canInstall"><button class="btn btn-lg btn-outline-success text-wrap flex-grow-1" (click)="install()">Add <b>Pony Town</b> to {{isMobile ? \'home screen\' : \'desktop\'}}</button><button class="btn btn-lg btn-outline-success flex-grow-0" (click)="dismiss()" title="Dismiss" [attr.aria-label]="\'Dismiss add to \' + (isMobile ? \'home screen\' : \'desktop\')"><fa-icon [icon]="closeIcon"></fa-icon></button></div>',
            styleUrls: ['install-button.scss'],
        }),
        __metadata("design:paramtypes", [installService_1.InstallService])
    ], InstallButton);
    return InstallButton;
}());
exports.InstallButton = InstallButton;
