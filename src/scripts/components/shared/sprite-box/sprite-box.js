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
var ponyInfo_1 = require("../../../common/ponyInfo");
var contextSpriteBatch_1 = require("../../../graphics/contextSpriteBatch");
var canvasUtils_1 = require("../../../client/canvasUtils");
var colors_1 = require("../../../common/colors");
var rect_1 = require("../../../common/rect");
var spriteUtils_1 = require("../../../client/spriteUtils");
var icons_1 = require("../../../client/icons");
var sprites_1 = require("../../../generated/sprites");
var redrawFrame = 0;
var forRedraw = [];
function drawAll() {
    redrawFrame = 0;
    forRedraw.forEach(function (box) { return box.draw(); });
    forRedraw.length = 0;
}
var SpriteBox = /** @class */ (function () {
    function SpriteBox(zone, iterableDiffers) {
        this.zone = zone;
        this.debug = DEVELOPMENT;
        this.noneIcon = icons_1.faTimes;
        this.size = 52;
        this.scale = 2;
        this.x = 0;
        this.y = 0;
        this.center = true;
        this.invisible = false;
        this.darken = true;
        this.fillDiffer = iterableDiffers.find([]).create();
        this.outlineDiffer = iterableDiffers.find([]).create();
    }
    Object.defineProperty(SpriteBox.prototype, "circle", {
        get: function () {
            return this._circle;
        },
        set: function (value) {
            this._circle = color_1.colorToCSS(color_1.parseColor(value || ''));
        },
        enumerable: true,
        configurable: true
    });
    SpriteBox.prototype.ngAfterViewInit = function () {
        var _this = this;
        spriteUtils_1.loadAndInitSpriteSheets().then(function () { return _this.redraw(); });
    };
    SpriteBox.prototype.ngDoCheck = function () {
        var fillChanges = this.fill && Array.isArray(this.fill) && this.fillDiffer.diff(this.fill);
        var outlineChanges = this.outline && Array.isArray(this.outline) && this.outlineDiffer.diff(this.outline);
        if (fillChanges || outlineChanges) {
            this.redraw();
        }
    };
    SpriteBox.prototype.ngOnChanges = function () {
        this.redraw();
    };
    SpriteBox.prototype.redraw = function () {
        if (!redrawFrame) {
            this.zone.runOutsideAngular(function () { return redrawFrame = requestAnimationFrame(drawAll); });
        }
        if (forRedraw.indexOf(this) === -1) {
            forRedraw.push(this);
        }
    };
    SpriteBox.prototype.draw = function () {
        var size = this.size;
        var scale = this.scale;
        var canvas = this.canvas.nativeElement;
        if (!size || this.invisible)
            return;
        if (canvas.width !== size || canvas.height !== size) {
            canvas.width = size;
            canvas.height = size;
        }
        var context = canvas.getContext('2d');
        if (!context)
            return;
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        var sprite = this.sprite;
        if (sprite) {
            if (this.circle) {
                context.fillStyle = this.circle;
                context.beginPath();
                context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 3, 0, Math.PI * 2);
                context.fill();
            }
            var bufferSize = size / scale;
            var batch = this.batch = this.batch || new contextSpriteBatch_1.ContextSpriteBatch(canvasUtils_1.createCanvas(bufferSize, bufferSize));
            canvasUtils_1.resizeCanvas(batch.canvas, bufferSize, bufferSize);
            var fills = Array.isArray(this.fill) ? this.fill : [this.fill];
            var outlines = Array.isArray(this.outline) ? this.outline : [this.outline];
            var paletteColors = ponyInfo_1.toColorList(ponyInfo_1.getColorsFromSet({ fills: fills, outlines: outlines }, '000000', this.darken));
            var palette = ponyInfo_1.mockPaletteManager.addArray(paletteColors);
            var extraPalette = sprite.palettes && ponyInfo_1.mockPaletteManager.addArray(sprite.palettes[0]);
            var x = this.x;
            var y = this.y;
            if (this.center) {
                var bounds_1 = rect_1.rect(0, 0, 0, 0);
                addRect(bounds_1, sprite.color);
                addRect(bounds_1, sprite.extra);
                if (sprite.colorMany) {
                    sprite.colorMany.forEach(function (c) { return addRect(bounds_1, c); });
                }
                x = Math.round((bufferSize - bounds_1.w) / 2 - bounds_1.x);
                y = Math.round((bufferSize - bounds_1.h) / 2 - bounds_1.y);
            }
            batch.start(sprites_1.paletteSpriteSheet, 0);
            if (this.reverseExtra) {
                batch.drawSprite(sprite.extra, colors_1.WHITE, extraPalette, x, y);
            }
            if (sprite.colorMany) {
                for (var _i = 0, _a = sprite.colorMany; _i < _a.length; _i++) {
                    var color = _a[_i];
                    batch.drawSprite(color, colors_1.WHITE, palette, x, y);
                }
            }
            else {
                batch.drawSprite(sprite.color, colors_1.WHITE, palette, x, y);
            }
            if (!this.reverseExtra) {
                batch.drawSprite(sprite.extra, colors_1.WHITE, extraPalette, x, y);
            }
            batch.end();
            canvasUtils_1.disableImageSmoothing(context);
            context.scale(scale, scale);
            context.drawImage(batch.canvas, 0, 0);
        }
        context.restore();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "size", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "scale", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "x", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "y", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "center", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SpriteBox.prototype, "index", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "sprite", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "palette", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "fill", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "outline", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], SpriteBox.prototype, "reverseExtra", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "timestamp", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "invisible", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SpriteBox.prototype, "darken", void 0);
    __decorate([
        core_1.ViewChild('canvas', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], SpriteBox.prototype, "canvas", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], SpriteBox.prototype, "circle", null);
    SpriteBox = __decorate([
        core_1.Component({
            selector: 'sprite-box',
            templateUrl: 'sprite-box.pug',
            styleUrls: ['sprite-box.scss'],
        }),
        __metadata("design:paramtypes", [core_1.NgZone, core_1.IterableDiffers])
    ], SpriteBox);
    return SpriteBox;
}());
exports.SpriteBox = SpriteBox;
function addRect(rect, sprite) {
    if (sprite && sprite.w && sprite.h) {
        if (rect.w === 0 || rect.h === 0) {
            rect.x = sprite.ox;
            rect.y = sprite.oy;
            rect.w = sprite.w;
            rect.h = sprite.h;
        }
        else {
            var x = Math.min(rect.x, sprite.ox);
            var y = Math.min(rect.y, sprite.oy);
            rect.w = Math.max(rect.x + rect.w, sprite.ox + sprite.w) - x;
            rect.h = Math.max(rect.y + rect.h, sprite.oy + sprite.h) - y;
            rect.x = x;
            rect.y = y;
        }
    }
}
