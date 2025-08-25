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
var data_1 = require("../../../client/data");
var SupportButton = /** @class */ (function () {
    function SupportButton(model) {
        this.model = model;
        this.patreonLink = data_1.supporterLink;
    }
    Object.defineProperty(SupportButton.prototype, "supporter", {
        get: function () {
            return this.model.supporter;
        },
        enumerable: true,
        configurable: true
    });
    SupportButton = __decorate([
        core_1.Component({
            selector: 'support-button',
            template: '<a class="btn btn-lg btn-outline-patreon btn-block mb-2" *ngIf="patreonLink" (mouseenter)="pony.excite()" (mouseout)="pony.reset()" [href]="patreonLink" target="_blank" rel="noopener noreferrer">{{supporter ? \'Thank you for supporting us!\' : \'Support us on Patreon!\'}}<svg class="patreon-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><circle fill="#f9685f" cx="75" cy="75" r="75"></circle><path fill="#052d49" d="M31.729 27.659h17.578v95.888H31.729z"></path><circle fill="#fff" cy="63.565" cx="95.783" r="35.955"></circle></svg><div class="supporter-pony"><supporter-pony #pony [scale]="2"></supporter-pony></div></a>',
            styleUrls: ['support-button.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model])
    ], SupportButton);
    return SupportButton;
}());
exports.SupportButton = SupportButton;
