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
var htmlUtils_1 = require("../../../client/htmlUtils");
var data_1 = require("../../../client/data");
var FocusTrap = /** @class */ (function () {
    function FocusTrap(element) {
        var _this = this;
        this.element = element;
        this.on = true;
        this.focus = function (e) {
            if (htmlUtils_1.isParentOf(_this.element.nativeElement, e.target)) {
                _this.lastActiveElement = e.target;
            }
            else {
                var focusable = htmlUtils_1.findFocusableElements(_this.element.nativeElement);
                if (focusable.length) {
                    if (_this.lastActiveElement === focusable[0]) {
                        _this.lastActiveElement = focusable[focusable.length - 1];
                    }
                    else {
                        _this.lastActiveElement = focusable[0];
                    }
                    _this.lastActiveElement.focus();
                }
            }
        };
    }
    Object.defineProperty(FocusTrap.prototype, "focusTrap", {
        set: function (value) {
            if (this.on !== value) {
                this.on = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    FocusTrap.prototype.ngOnInit = function () {
        this.update();
    };
    FocusTrap.prototype.ngOnDestroy = function () {
        this.focusTrap = false;
    };
    FocusTrap.prototype.update = function () {
        var _this = this;
        if (!data_1.isMobile) {
            if (this.on) {
                this.lastActiveElement = document.activeElement;
                document.addEventListener('focusin', this.focus);
                if (!htmlUtils_1.isParentOf(this.element.nativeElement, this.lastActiveElement)) {
                    setTimeout(function () { return _this.lastActiveElement = htmlUtils_1.focusFirstElement(_this.element.nativeElement); });
                }
            }
            else {
                this.lastActiveElement = undefined;
                document.removeEventListener('focusin', this.focus);
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], FocusTrap.prototype, "focusTrap", null);
    FocusTrap = __decorate([
        core_1.Directive({
            selector: '[focusTrap]',
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], FocusTrap);
    return FocusTrap;
}());
exports.FocusTrap = FocusTrap;
