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
var color_1 = require("../../../common/color");
var BitmapBox = /** @class */ (function () {
    function BitmapBox() {
        this.width = 5;
        this.height = 5;
        this.color = 'red';
        this.colorChange = new core_1.EventEmitter();
    }
    BitmapBox.prototype.ngOnChanges = function (changes) {
        if (changes.width || changes.height) {
            this.rows = [];
            for (var y = 0; y < this.height; y++) {
                this.rows[y] = [];
                for (var x = 0; x < this.width; x++) {
                    this.rows[y][x] = x + this.width * y;
                }
            }
        }
    };
    BitmapBox.prototype.draw = function (index) {
        if (this.bitmap) {
            if (this.tool === 'eraser') {
                this.bitmap[index] = '';
            }
            else if (this.tool === 'brush') {
                this.bitmap[index] = color_1.parseColor(this.bitmap[index]) === color_1.parseColor(this.color) ? '' : this.color;
            }
            else if (this.tool === 'eyedropper') {
                this.color = this.bitmap[index];
                this.colorChange.emit(this.color);
            }
        }
    };
    BitmapBox.prototype.colorAt = function (index) {
        return this.bitmap && this.bitmap[index] ? color_1.colorToCSS(color_1.parseColor(this.bitmap[index])) : '';
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BitmapBox.prototype, "width", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BitmapBox.prototype, "height", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], BitmapBox.prototype, "bitmap", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], BitmapBox.prototype, "tool", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], BitmapBox.prototype, "color", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], BitmapBox.prototype, "colorChange", void 0);
    BitmapBox = __decorate([
        core_1.Component({
            selector: 'bitmap-box',
            templateUrl: 'bitmap-box.pug',
            styleUrls: ['bitmap-box.scss'],
        })
    ], BitmapBox);
    return BitmapBox;
}());
exports.BitmapBox = BitmapBox;
