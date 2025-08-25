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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var BtnHighlight = /** @class */ (function () {
    function BtnHighlight(model) {
        this.model = model;
        this.btnHighlight = undefined;
    }
    Object.defineProperty(BtnHighlight.prototype, "on", {
        get: function () {
            var value = this.btnHighlight;
            return (value === true || value === false || !this.model) ? value : !!this.model.value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], BtnHighlight.prototype, "btnHighlight", void 0);
    BtnHighlight = __decorate([
        core_1.Directive({
            selector: '[btnHighlight]',
            host: {
                '[class.btn-default]': '!on',
                '[class.btn-primary]': 'on',
            },
        }),
        __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [forms_1.NgModel])
    ], BtnHighlight);
    return BtnHighlight;
}());
exports.BtnHighlight = BtnHighlight;
var BtnHighlightDanger = /** @class */ (function () {
    function BtnHighlightDanger() {
        this.btnHighlightDanger = false;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BtnHighlightDanger.prototype, "btnHighlightDanger", void 0);
    BtnHighlightDanger = __decorate([
        core_1.Directive({
            selector: '[btnHighlightDanger]',
            host: {
                '[class.btn-default]': '!btnHighlightDanger',
                '[class.btn-danger]': 'btnHighlightDanger',
            },
        })
    ], BtnHighlightDanger);
    return BtnHighlightDanger;
}());
exports.BtnHighlightDanger = BtnHighlightDanger;
