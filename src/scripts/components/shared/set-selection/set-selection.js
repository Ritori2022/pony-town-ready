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
var lodash_1 = require("lodash");
var spriteUtils_1 = require("../../../client/spriteUtils");
var FILLS = ['Orange', 'DodgerBlue', 'LimeGreen', 'Orchid', 'crimson', 'Aquamarine'];
var OUTLINES = ['Chocolate', 'SteelBlue', 'ForestGreen', 'DarkOrchid', 'darkred', 'DarkTurquoise'];
var SetOutlineHidden = /** @class */ (function () {
    function SetOutlineHidden() {
        this.setOutlineHidden = false;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetOutlineHidden.prototype, "setOutlineHidden", void 0);
    SetOutlineHidden = __decorate([
        core_1.Directive({
            selector: '[setOutlineHidden]',
        })
    ], SetOutlineHidden);
    return SetOutlineHidden;
}());
exports.SetOutlineHidden = SetOutlineHidden;
var SetSelection = /** @class */ (function () {
    function SetSelection(hidden) {
        this.hidden = hidden;
        this.exampleFills = FILLS;
        this.exampleOutlines = OUTLINES;
        this.outlineHidden = false;
        this.nonLockable = false;
        this.compact = false;
        this.onlyPatterns = false;
        this.darken = true;
        this.change = new core_1.EventEmitter();
    }
    Object.defineProperty(SetSelection.prototype, "isOutlineHidden", {
        get: function () {
            return this.hidden ? this.hidden.setOutlineHidden : this.outlineHidden;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SetSelection.prototype, "patternColors", {
        get: function () {
            var set = this.getSet();
            var pat = this.set && set && set[this.set.pattern || 0];
            if (pat && !pat.colors) {
                return 0;
            }
            else if (pat) {
                return spriteUtils_1.getColorCount(pat);
            }
            else {
                return this.nonLockable ? 1 : 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SetSelection.prototype, "showColorPatterns", {
        get: function () {
            var type = this.set && this.set.type || 0;
            var set = this.sets && this.sets[type];
            return !!set && set.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    SetSelection.prototype.ngOnChanges = function () {
        this.sprites = this.sets ? this.sets.map(function (s) { return s ? s[0] : undefined; }) : undefined;
    };
    SetSelection.prototype.onChange = function () {
        var set = this.getSet();
        if (this.set && set) {
            this.set.pattern = lodash_1.clamp(this.set.pattern || 0, 0, set.length - 1);
        }
        this.change.emit();
    };
    SetSelection.prototype.getSet = function () {
        return this.set && this.sets && this.sets[this.set.type || 0];
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SetSelection.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SetSelection.prototype, "base", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "set", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], SetSelection.prototype, "sets", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], SetSelection.prototype, "sprites", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SetSelection.prototype, "circle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "outlineHidden", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "nonLockable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "compact", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "onlyPatterns", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "darken", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SetSelection.prototype, "change", void 0);
    SetSelection = __decorate([
        core_1.Component({
            selector: 'set-selection',
            templateUrl: 'set-selection.pug',
            styleUrls: ['set-selection.scss'],
        }),
        __param(0, core_1.Optional()),
        __metadata("design:paramtypes", [SetOutlineHidden])
    ], SetSelection);
    return SetSelection;
}());
exports.SetSelection = SetSelection;
