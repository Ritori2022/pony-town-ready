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
var clientUtils_1 = require("../../../client/clientUtils");
var sign_in_box_1 = require("../sign-in-box/sign-in-box");
var SiteInfo = /** @class */ (function () {
    function SiteInfo() {
    }
    Object.defineProperty(SiteInfo.prototype, "site", {
        set: function (value) {
            this.info = value && clientUtils_1.toSocialSiteInfo(value);
            this.icon = sign_in_box_1.getProviderIcon(this.info && this.info.icon || '');
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SiteInfo.prototype, "site", null);
    SiteInfo = __decorate([
        core_1.Component({
            selector: 'site-info',
            templateUrl: 'site-info.pug',
            styleUrls: ['site-info.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        })
    ], SiteInfo);
    return SiteInfo;
}());
exports.SiteInfo = SiteInfo;
