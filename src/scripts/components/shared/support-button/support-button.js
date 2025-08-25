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
            templateUrl: 'support-button.pug',
            styleUrls: ['support-button.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model])
    ], SupportButton);
    return SupportButton;
}());
exports.SupportButton = SupportButton;
