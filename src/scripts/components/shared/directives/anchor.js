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
var Anchor = /** @class */ (function () {
    function Anchor(element) {
        this.element = element;
    }
    Anchor.prototype.ngOnInit = function () {
        var a = this.element.nativeElement;
        if (/^(https?|mailto):/.test(a.href) && !a.target) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        }
    };
    Anchor = __decorate([
        core_1.Directive({
            selector: 'a[href]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], Anchor);
    return Anchor;
}());
exports.Anchor = Anchor;
