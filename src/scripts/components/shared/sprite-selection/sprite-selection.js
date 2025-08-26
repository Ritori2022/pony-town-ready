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
var htmlUtils_1 = require("../../../client/htmlUtils");
var MAX = 999999;
var SpriteSelection = /** @class */ (function () {
    function SpriteSelection(element) {
        this.element = element;
        this.selected = 0;
        this.selectedChange = new core_1.EventEmitter();
        this.reverseExtra = false;
        this.limit = MAX;
        this.skip = 0;
        this.disabled = false;
        this.invisible = false;
        this.darken = true;
        this.id = lodash_1.uniqueId('sprite-selection-');
    }
    Object.defineProperty(SpriteSelection.prototype, "hasMore", {
        get: function () {
            return this.sprites && this.sprites.length > this.limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpriteSelection.prototype, "end", {
        get: function () {
            return this.skip + this.limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpriteSelection.prototype, "activeDescendant", {
        get: function () {
            return this.id + "-" + (this.selected - this.skip);
        },
        enumerable: true,
        configurable: true
    });
    SpriteSelection.prototype.isSelected = function (index) {
        return this.selected === (index + this.skip);
    };
    SpriteSelection.prototype.select = function (index, focus) {
        if (focus === void 0) { focus = false; }
        if (!this.disabled && this.selected !== index) {
            this.selected = index;
            this.selectedChange.emit(index);
            if (this.hasMore && index >= this.end) {
                this.showMore();
            }
            if (focus) {
                htmlUtils_1.focusElementAfterTimeout(this.element.nativeElement, '.active');
            }
        }
    };
    SpriteSelection.prototype.showMore = function () {
        this.limit = MAX;
    };
    SpriteSelection.prototype.keydown = function (e) {
        var select = this.handleKey(e.keyCode);
        if (select !== undefined) {
            e.preventDefault();
            this.select(select, true);
        }
    };
    SpriteSelection.prototype.handleKey = function (keyCode) {
        if (this.sprites) {
            if (keyCode === 39 /* RIGHT */ || keyCode === 40 /* DOWN */) {
                if (this.selected >= (this.sprites.length - 1)) {
                    return this.skip;
                }
                else {
                    return this.selected + 1;
                }
            }
            else if (keyCode === 37 /* LEFT */ || keyCode === 38 /* UP */) {
                if (this.selected <= this.skip) {
                    return this.sprites.length - 1;
                }
                else {
                    return this.selected - 1;
                }
            }
            else if (keyCode === 36 /* HOME */) {
                return this.skip;
            }
            else if (keyCode === 35 /* END */) {
                return this.sprites.length - 1;
            }
        }
        return undefined;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "selected", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "selectedChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], SpriteSelection.prototype, "sprites", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "fill", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "outline", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SpriteSelection.prototype, "circle", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "reverseExtra", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "limit", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "skip", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SpriteSelection.prototype, "emptyLabel", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "invisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteSelection.prototype, "darken", void 0);
    SpriteSelection = __decorate([
        core_1.Component({
            selector: 'sprite-selection',
            templateUrl: 'sprite-selection.pug',
            styleUrls: ['sprite-selection.scss'],
            host: {
                'role': 'radiogroup',
                'tabindex': '0',
                '(keydown)': 'keydown($event)',
                '[attr.aria-activedescendant]': 'activeDescendant',
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], SpriteSelection);
    return SpriteSelection;
}());
exports.SpriteSelection = SpriteSelection;
