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
var lodash_1 = require("lodash");
var ScalePicker = /** @class */ (function () {
    function ScalePicker() {
        this.scale = 1;
        this.scaleChange = new core_1.EventEmitter();
        this.scales = [1, 2, 3, 4];
    }
    Object.defineProperty(ScalePicker.prototype, "maxScale", {
        set: function (value) {
            this.scales = lodash_1.times(value, function (i) { return i + 1; });
        },
        enumerable: true,
        configurable: true
    });
    ScalePicker.prototype.setScale = function (value) {
        if (value !== this.scale) {
            this.scale = value;
            this.scaleChange.emit(value);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ScalePicker.prototype, "scale", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ScalePicker.prototype, "scaleChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ScalePicker.prototype, "maxScale", null);
    ScalePicker = __decorate([
        core_1.Component({
            selector: 'scale-picker',
            templateUrl: 'scale-picker.pug',
        })
    ], ScalePicker);
    return ScalePicker;
}());
exports.ScalePicker = ScalePicker;
