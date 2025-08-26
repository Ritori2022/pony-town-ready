"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var ponyInfo_1 = require("../../../common/ponyInfo");
var colors_1 = require("../../../common/colors");
var canvasUtils_1 = require("../../../client/canvasUtils");
var ponyUtils_1 = require("../../../client/ponyUtils");
var ponyHelpers_1 = require("../../../client/ponyHelpers");
var contextSpriteBatch_1 = require("../../../graphics/contextSpriteBatch");
var color_1 = require("../../../common/color");
var spriteUtils_1 = require("../../../client/spriteUtils");
var graphicsUtils_1 = require("../../../graphics/graphicsUtils");
var ponyDraw_1 = require("../../../client/ponyDraw");
var sprites_1 = require("../../../generated/sprites");
var emoji_1 = require("../../../client/emoji");
var DEFAULT_STATE = ponyHelpers_1.defaultPonyState();
var DEFAULT_OPTIONS = ponyHelpers_1.defaultDrawPonyOptions();
var CharacterPreview = /** @class */ (function () {
    function CharacterPreview(zone) {
        var _this = this;
        this.zone = zone;
        this.scale = 3;
        this.state = ponyHelpers_1.defaultPonyState();
        this.noBackground = false;
        this.noOutline = false;
        this.noShadow = false;
        this.extra = false;
        this.passive = false;
        this.blinks = true;
        this.frame = 0;
        this.lastFrame = 0;
        this.initialized = false;
        this.nextBlink = performance.now() + 2000;
        this.blinkFrame = -1;
        this.onFrame = function () {
            if (_this.passive && _this.initialized) {
                _this.frame = 0;
                _this.tryDraw();
                return;
            }
            _this.frame = requestAnimationFrame(_this.onFrame);
            var now = performance.now();
            if ((now - _this.lastFrame) > (1000 / 24)) {
                if (_this.blinks) {
                    if (_this.blinkFrame === -1) {
                        if (_this.nextBlink < now) {
                            _this.blinkFrame = 0;
                        }
                    }
                    else {
                        _this.blinkFrame++;
                        if (_this.blinkFrame >= ponyUtils_1.BLINK_FRAMES.length) {
                            _this.nextBlink = now + Math.random() * 2000 + 3000;
                            _this.blinkFrame = -1;
                        }
                    }
                    if (_this.state) {
                        _this.state.blinkFrame = _this.blinkFrame === -1 ? 1 : ponyUtils_1.BLINK_FRAMES[_this.blinkFrame];
                    }
                }
                _this.lastFrame = now;
                _this.tryDraw();
            }
        };
    }
    CharacterPreview.prototype.ngAfterViewInit = function () {
        var _this = this;
        return spriteUtils_1.loadAndInitSpriteSheets()
            .then(function () { return _this.initialized = true; })
            .then(function () { return _this.ngOnChanges(); });
    };
    CharacterPreview.prototype.ngOnDestroy = function () {
        cancelAnimationFrame(this.frame);
    };
    CharacterPreview.prototype.ngOnChanges = function () {
        var _this = this;
        if (!this.frame) {
            this.zone.runOutsideAngular(function () { return _this.frame = requestAnimationFrame(_this.onFrame); });
        }
    };
    CharacterPreview.prototype.redraw = function () {
        this.tryDraw();
    };
    CharacterPreview.prototype.blink = function () {
        this.nextBlink = performance.now();
    };
    CharacterPreview.prototype.tryDraw = function () {
        try {
            this.draw();
        }
        catch (_a) { }
    };
    CharacterPreview.prototype.draw = function () {
        if (!this.initialized)
            return;
        var canvas = this.canvas.nativeElement;
        var _a = canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
        canvasUtils_1.resizeCanvasWithRatio(canvas, width, height, false);
        var scale = this.scale * canvasUtils_1.getPixelRatio();
        var bufferWidth = Math.round(canvas.width / scale);
        var bufferHeight = Math.round(canvas.height / scale);
        if (!bufferWidth || !bufferHeight)
            return;
        this.batch = this.batch || new contextSpriteBatch_1.ContextSpriteBatch(canvasUtils_1.createCanvas(bufferWidth, bufferHeight));
        canvasUtils_1.resizeCanvas(this.batch.canvas, bufferWidth, bufferHeight);
        var x = Math.round(bufferWidth / 2);
        var y = Math.round(bufferHeight / 2 + 28);
        if (this.pony) {
            this.batch.start(sprites_1.paletteSpriteSheet, this.noBackground ? colors_1.TRANSPARENT : colors_1.GRASS_COLOR);
            try {
                var options = __assign({}, DEFAULT_OPTIONS, { shadow: !this.noShadow, extra: !!this.extra });
                ponyDraw_1.drawPony(this.batch, ponyInfo_1.toPalette(this.pony), this.state || DEFAULT_STATE, x, y, options);
            }
            catch (e) {
                console.error(e);
            }
            this.batch.end();
        }
        var viewContext = canvas.getContext('2d');
        if (!viewContext)
            return;
        canvasUtils_1.disableImageSmoothing(viewContext);
        if (this.noBackground) {
            viewContext.clearRect(0, 0, canvas.width, canvas.height);
        }
        viewContext.save();
        viewContext.scale(scale, scale);
        // draw outline
        if (this.pony && this.noShadow && this.noBackground && !this.noOutline) {
            for (var x_1 = -1; x_1 <= 1; x_1++) {
                for (var y_1 = -1; y_1 <= 1; y_1++) {
                    viewContext.drawImage(this.batch.canvas, x_1, y_1);
                }
            }
            viewContext.globalCompositeOperation = 'source-in';
            viewContext.fillStyle = color_1.colorToCSS(colors_1.GRASS_COLOR);
            viewContext.fillRect(0, 0, viewContext.canvas.width, viewContext.canvas.height);
            viewContext.globalCompositeOperation = 'source-over';
        }
        viewContext.drawImage(this.batch.canvas, 0, 0);
        viewContext.restore();
        // draw name plate
        if (!this.noShadow && this.name) {
            var name_1 = emoji_1.replaceEmojis(this.name);
            var scale_1 = 2 * canvasUtils_1.getPixelRatio();
            var nameBufferWidth = Math.round(canvas.width / scale_1);
            this.nameBatch = this.nameBatch || new contextSpriteBatch_1.ContextSpriteBatch(canvasUtils_1.createCanvas(nameBufferWidth, 25));
            canvasUtils_1.resizeCanvas(this.nameBatch.canvas, nameBufferWidth, 25);
            this.nameBatch.start(sprites_1.paletteSpriteSheet, colors_1.TRANSPARENT);
            graphicsUtils_1.drawNamePlate(this.nameBatch, name_1, nameBufferWidth / 2, 11, graphicsUtils_1.DrawNameFlags.None, graphicsUtils_1.commonPalettes, this.tag);
            this.nameBatch.end();
            viewContext.save();
            viewContext.scale(scale_1, scale_1);
            viewContext.drawImage(this.nameBatch.canvas, 0, 10);
            viewContext.restore();
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "scale", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CharacterPreview.prototype, "name", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CharacterPreview.prototype, "tag", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "pony", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "state", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "noBackground", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "noOutline", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "noShadow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "extra", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "passive", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterPreview.prototype, "blinks", void 0);
    __decorate([
        core_1.ViewChild('canvas', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], CharacterPreview.prototype, "canvas", void 0);
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], CharacterPreview.prototype, "redraw", null);
    CharacterPreview = __decorate([
        core_1.Component({
            selector: 'character-preview',
            template: '<canvas class="rounded" #canvas></canvas>',
            styles: [":host { display: block; } canvas { width: 100%; height: 100%; }"],
        }),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], CharacterPreview);
    return CharacterPreview;
}());
exports.CharacterPreview = CharacterPreview;
