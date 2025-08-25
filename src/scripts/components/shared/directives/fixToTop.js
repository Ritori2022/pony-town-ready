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
var FixToTop = /** @class */ (function () {
    function FixToTop(element) {
        this.element = element;
        this.fixToTopOffset = 0;
        this.fixToTop = new core_1.EventEmitter();
        this.fixed = false;
    }
    FixToTop.prototype.scroll = function () {
        var element = this.element.nativeElement;
        var top = element.getBoundingClientRect().top;
        if (this.fixed !== top < this.fixToTopOffset) {
            this.fixed = top < this.fixToTopOffset;
            this.fixToTop.emit(this.fixed);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FixToTop.prototype, "fixToTopOffset", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FixToTop.prototype, "fixToTop", void 0);
    __decorate([
        core_1.HostBinding('class.fixed-to-top'),
        __metadata("design:type", Object)
    ], FixToTop.prototype, "fixed", void 0);
    __decorate([
        core_1.HostListener('window:scroll'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FixToTop.prototype, "scroll", null);
    FixToTop = __decorate([
        core_1.Directive({
            selector: '[fixToTop]',
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], FixToTop);
    return FixToTop;
}());
exports.FixToTop = FixToTop;
