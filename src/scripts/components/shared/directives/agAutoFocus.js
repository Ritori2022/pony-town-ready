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
var AgAutoFocus = /** @class */ (function () {
    function AgAutoFocus(element) {
        this.element = element;
    }
    AgAutoFocus.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.element.nativeElement.focus(); }, 100);
    };
    AgAutoFocus = __decorate([
        core_1.Directive({
            selector: '[agAutoFocus]'
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AgAutoFocus);
    return AgAutoFocus;
}());
exports.AgAutoFocus = AgAutoFocus;
