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
var contextSpriteBatch_1 = require("../../../graphics/contextSpriteBatch");
var canvasUtils_1 = require("../../../client/canvasUtils");
var ponyHelpers_1 = require("../../../client/ponyHelpers");
var spriteUtils_1 = require("../../../client/spriteUtils");
var ponyDraw_1 = require("../../../client/ponyDraw");
var sprites_1 = require("../../../generated/sprites");
var scales = {
    large: 3,
    medium: 2,
    small: 1,
};
var sizes = {
    large: 100,
    medium: 66,
    small: 33,
};
var BUFFER_SIZE = 34;
var options = ponyHelpers_1.defaultDrawPonyOptions();
var state = ponyHelpers_1.defaultPonyState();
var PortraitBox = /** @class */ (function () {
    function PortraitBox(zone) {
        this.zone = zone;
        this.noBorder = false;
        this.flip = false;
        this.size = 'large';
        this.pony = undefined;
        this.frame = 0;
    }
    PortraitBox.prototype.ngAfterViewInit = function () {
        var _this = this;
        spriteUtils_1.loadAndInitSpriteSheets()
            .then(function () { return _this.redraw(); });
    };
    PortraitBox.prototype.ngOnChanges = function () {
        this.redraw();
    };
    PortraitBox.prototype.redraw = function () {
        var _this = this;
        this.frame = this.frame || this.zone.runOutsideAngular(function () { return requestAnimationFrame(function () {
            _this.frame = 0;
            _this.draw();
        }); });
    };
    PortraitBox.prototype.draw = function () {
        var canvas = this.canvas.nativeElement;
        var size = sizes[this.size];
        canvasUtils_1.resizeCanvasWithRatio(canvas, size, size);
        var context = canvas.getContext('2d');
        if (context) {
            context.save();
            context.fillStyle = '#444';
            context.fillRect(0, 0, canvas.width, canvas.height);
            if (this.pony) {
                var scale = scales[this.size] * canvasUtils_1.getPixelRatio();
                this.batch = this.batch || new contextSpriteBatch_1.ContextSpriteBatch(canvasUtils_1.createCanvas(BUFFER_SIZE, BUFFER_SIZE));
                options.flipped = !this.flip;
                this.batch.start(sprites_1.paletteSpriteSheet, 0);
                ponyDraw_1.drawPony(this.batch, this.pony, state, 25, 54, options);
                this.batch.end();
                canvasUtils_1.disableImageSmoothing(context);
                context.scale(this.flip ? scale : -scale, scale);
                context.drawImage(this.batch.canvas, this.flip ? 0 : -BUFFER_SIZE, 0);
            }
            context.restore();
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PortraitBox.prototype, "noBorder", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PortraitBox.prototype, "flip", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PortraitBox.prototype, "size", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], PortraitBox.prototype, "pony", void 0);
    __decorate([
        core_1.ViewChild('canvas', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], PortraitBox.prototype, "canvas", void 0);
    PortraitBox = __decorate([
        core_1.Component({
            selector: 'portrait-box',
            templateUrl: 'portrait-box.pug',
            styleUrls: ['portrait-box.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], PortraitBox);
    return PortraitBox;
}());
exports.PortraitBox = PortraitBox;
