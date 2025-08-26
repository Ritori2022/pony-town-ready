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
var icons_1 = require("../../../client/icons");
var FillOutline = /** @class */ (function () {
    function FillOutline() {
        this.lockIcon = icons_1.faLock;
        this.label = 'Color';
        this.indicatorColor = '';
        this.fillChange = new core_1.EventEmitter();
        this.outlineChange = new core_1.EventEmitter();
        this.lockedChange = new core_1.EventEmitter();
        this.nonLockable = false;
        this.outlineLocked = false;
        this.outlineLockedChange = new core_1.EventEmitter();
        this.outlineHidden = false;
        this.change = new core_1.EventEmitter();
    }
    Object.defineProperty(FillOutline.prototype, "hasLock", {
        get: function () {
            return this.locked !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    FillOutline.prototype.onChange = function () {
        this.change.emit();
    };
    FillOutline.prototype.onFillChange = function (value) {
        this.fillChange.emit(value);
        this.onChange();
    };
    FillOutline.prototype.onOutlineChange = function (value) {
        this.outlineChange.emit(value);
        this.onChange();
    };
    FillOutline.prototype.onLockedChange = function (value) {
        this.lockedChange.emit(value);
        this.onChange();
    };
    FillOutline.prototype.onOutlineLockedChange = function (value) {
        this.outlineLockedChange.emit(value);
        this.onChange();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "indicatorColor", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FillOutline.prototype, "base", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FillOutline.prototype, "fill", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "fillChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FillOutline.prototype, "outline", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "outlineChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], FillOutline.prototype, "locked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "lockedChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "nonLockable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "outlineLocked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "outlineLockedChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "outlineHidden", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], FillOutline.prototype, "change", void 0);
    FillOutline = __decorate([
        core_1.Component({
            selector: 'fill-outline',
            templateUrl: 'fill-outline.pug',
            styleUrls: ['fill-outline.scss'],
        })
    ], FillOutline);
    return FillOutline;
}());
exports.FillOutline = FillOutline;
