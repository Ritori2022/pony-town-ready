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
var utils_1 = require("../../../common/utils");
var color_1 = require("../../../common/color");
var icons_1 = require("../../../client/icons");
var SIZE = 175;
var ColorPicker = /** @class */ (function () {
    function ColorPicker() {
        var _this = this;
        this.chevronIcon = icons_1.faChevronDown;
        this.isOpen = false;
        this.isDisabled = false;
        this.disabledColor = '';
        this.color = '';
        this.indicatorColor = '';
        this.label = undefined;
        this.labelledBy = undefined;
        this.colorChange = new core_1.EventEmitter();
        this.s = 0;
        this.v = 0;
        this.h = 0;
        this.lastColor = '';
        this.closeHandler = function () { return _this.close(); };
    }
    Object.defineProperty(ColorPicker.prototype, "inputColor", {
        get: function () {
            return this.isDisabled && this.disabledColor ? this.disabledColor : this.color;
        },
        set: function (value) {
            if (!this.isDisabled) {
                this.color = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPicker.prototype, "bg", {
        get: function () {
            return color_1.colorToCSS(color_1.parseColorFast(this.inputColor));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPicker.prototype, "svLeft", {
        get: function () {
            this.updateHsv();
            return this.s * 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPicker.prototype, "svTop", {
        get: function () {
            this.updateHsv();
            return (1 - this.v) * 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPicker.prototype, "hueTop", {
        get: function () {
            this.updateHsv();
            return this.h * 100 / 360;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorPicker.prototype, "hue", {
        get: function () {
            this.updateHsv();
            return color_1.colorToCSS(color_1.colorFromHSVA(this.h, 1, 1, 1));
        },
        enumerable: true,
        configurable: true
    });
    ColorPicker.prototype.focus = function (e) {
        this.isOpen = true;
        e.target.select();
    };
    ColorPicker.prototype.dragSV = function (_a) {
        var event = _a.event, x = _a.x, y = _a.y;
        event.preventDefault();
        this.updateHsv();
        this.s = utils_1.clamp(x / SIZE, 0, 1);
        this.v = 1 - utils_1.clamp(y / SIZE, 0, 1);
        this.updateColor();
    };
    ColorPicker.prototype.dragHue = function (_a) {
        var event = _a.event, y = _a.y;
        event.preventDefault();
        this.updateHsv();
        this.h = utils_1.clamp(360 * y / SIZE, 0, 360);
        this.updateColor();
    };
    ColorPicker.prototype.updateHsv = function () {
        if (this.lastColor !== this.color) {
            var _a = color_1.colorToHSVA(color_1.parseColorFast(this.color), this.h), h = _a.h, s = _a.s, v = _a.v;
            this.h = h;
            this.s = s;
            this.v = v;
            this.lastColor = this.color;
        }
    };
    ColorPicker.prototype.updateColor = function () {
        var color = color_1.colorToHexRGB(color_1.colorFromHSVA(this.h, this.s, this.v, 1));
        var changed = this.color !== color;
        this.lastColor = this.color = color;
        if (changed) {
            this.colorChange.emit(color);
        }
    };
    ColorPicker.prototype.inputChanged = function (value) {
        this.color = value;
        this.colorChange.emit(this.color);
    };
    ColorPicker.prototype.stopEvent = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
    ColorPicker.prototype.open = function () {
        var _this = this;
        if (!this.isOpen) {
            this.isOpen = true;
            setTimeout(function () {
                document.addEventListener('mousedown', _this.closeHandler);
                document.addEventListener('touchstart', _this.closeHandler);
            });
        }
    };
    ColorPicker.prototype.close = function () {
        this.isOpen = false;
        document.removeEventListener('mousedown', this.closeHandler);
        document.removeEventListener('touchstart', this.closeHandler);
    };
    ColorPicker.prototype.toggleOpen = function () {
        if (!this.isDisabled) {
            if (this.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "isOpen", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "isDisabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "disabledColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "color", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "indicatorColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ColorPicker.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ColorPicker.prototype, "labelledBy", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ColorPicker.prototype, "colorChange", void 0);
    ColorPicker = __decorate([
        core_1.Component({
            selector: 'color-picker',
            templateUrl: 'color-picker.pug',
            styleUrls: ['color-picker.scss'],
        })
    ], ColorPicker);
    return ColorPicker;
}());
exports.ColorPicker = ColorPicker;
