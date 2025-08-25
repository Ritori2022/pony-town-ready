"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var canvasUtils_1 = require("../client/canvasUtils");
var color_1 = require("../common/color");
var baseStateBatch_1 = require("./baseStateBatch");
var graphicsUtils_1 = require("./graphicsUtils");
var mat2d_1 = require("../common/mat2d");
var colors_1 = require("../common/colors");
function drawBatch(canvas, sheet, bg, action) {
    var batch = new ContextSpriteBatch(canvas);
    batch.start(sheet, bg || colors_1.TRANSPARENT);
    action(batch);
    batch.end();
    return canvas;
}
exports.drawBatch = drawBatch;
function drawCanvas(width, height, sheet, bg, action) {
    return drawBatch(canvasUtils_1.createCanvas(width, height), sheet, bg, action);
}
exports.drawCanvas = drawCanvas;
var ContextSpriteBatch = /** @class */ (function (_super) {
    __extends(ContextSpriteBatch, _super);
    function ContextSpriteBatch(canvas) {
        var _this = _super.call(this) || this;
        _this.canvas = canvas;
        _this.pixelSize = 1;
        _this.disableShading = false;
        _this.ignoreColor = 0;
        _this.palette = false;
        _this.started = false;
        _this.data = undefined;
        _this.sheet = undefined;
        _this.sheetData = undefined;
        return _this;
    }
    ContextSpriteBatch.prototype.start = function (sheet, clearColor) {
        if (!this.data || this.data.width !== this.canvas.width || this.data.height !== this.canvas.height) {
            if (this.canvas && this.canvas.width && this.canvas.height) {
                this.data = this.canvas.getContext('2d').getImageData(0, 0, this.canvas.width, this.canvas.height);
            }
        }
        if (this.data) {
            var color = clearColor || 0;
            var r = color_1.getR(color);
            var g = color_1.getG(color);
            var b = color_1.getB(color);
            var a = color_1.getAlpha(color);
            var data = this.data.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = a;
            }
        }
        this.sheet = sheet;
        this.sheetData = sheet.data;
        this.palette = this.sheet.palette;
        this.started = true;
    };
    // clear(color?: number) {
    // 	this.end();
    // 	const context = this.canvas.getContext('2d')!;
    // 	if (color !== undefined) {
    // 		context.fillStyle = colorToCSS(color);
    // 		context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // 	} else {
    // 		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 	}
    // }
    ContextSpriteBatch.prototype.end = function () {
        if (this.started) {
            if (this.data) {
                this.canvas.getContext('2d').putImageData(this.data, 0, 0);
            }
            this.started = false;
        }
    };
    ContextSpriteBatch.prototype.drawSprite = function (s, color, palette, x, y) {
        if (s !== undefined) {
            if (y === undefined) {
                y = x;
                x = palette;
                drawImageNormal(this.sheetData, this.data, this.transform, this.globalAlpha, color, s.x, s.y, s.w, s.h, x + s.ox, y + s.oy, s.w, s.h);
            }
            else {
                drawImagePalette(this.sheetData, this.data, this.transform, this.globalAlpha, this.ignoreColor, this.disableShading, s.type, color, palette, s.x, s.y, s.w, s.h, x + s.ox, y + s.oy, s.w, s.h);
            }
        }
    };
    ContextSpriteBatch.prototype.drawImage = function (colorOrType, sxOrColor, syOrPalette, swOrSx, shOrSy, dxOrSw, dyOrSh, dwOrDx, dhOrDy, _OrDw, _OrDh) {
        if (_OrDh === undefined) {
            drawImageNormal(this.sheetData, this.data, this.transform, this.globalAlpha, colorOrType, sxOrColor, syOrPalette, swOrSx, shOrSy, dxOrSw, dyOrSh, dwOrDx, dhOrDy);
        }
        else {
            drawImagePalette(this.sheetData, this.data, this.transform, this.globalAlpha, this.ignoreColor, this.disableShading, colorOrType, sxOrColor, syOrPalette, swOrSx, shOrSy, dxOrSw, dyOrSh, dwOrDx, dhOrDy, _OrDw, _OrDh);
        }
    };
    ContextSpriteBatch.prototype.drawRect = function (color, x, y, w, h) {
        drawRect(this.data, this.transform, this.globalAlpha, color, x, y, w, h);
    };
    ContextSpriteBatch.prototype.drawBatch = function () {
        throw new Error('drawBatch not supported');
    };
    ContextSpriteBatch.prototype.startBatch = function () {
    };
    ContextSpriteBatch.prototype.finishBatch = function () {
        return undefined;
    };
    ContextSpriteBatch.prototype.releaseBatch = function () {
    };
    return ContextSpriteBatch;
}(baseStateBatch_1.BaseStateBatch));
exports.ContextSpriteBatch = ContextSpriteBatch;
var min = Math.min;
var typeOffsets = [0, 2, 3, 0, 1, 2, 3];
function drawRect(dst, transform, globalAlpha, color, x, y, w, h) {
    if (DEVELOPMENT && !mat2d_1.isTranslation(transform)) {
        console.error('Transform not supported');
    }
    if (!dst)
        return;
    x = Math.round(x + transform[4]);
    y = Math.round(y + transform[5]);
    var xx = min(0, x, x);
    w += xx;
    x -= xx;
    var yy = min(0, y, y);
    h += yy;
    y -= yy;
    w += min(0, dst.width - (x + w));
    h += min(0, dst.height - (y + h));
    if (w <= 0 && h <= 0)
        return;
    var _a = color_1.colorToRGBA(color), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    var alpha = (globalAlpha * a) | 0;
    if (alpha === 0)
        return;
    var dstData = dst.data;
    var dstWidth = dst.width | 0;
    for (var iy = 0; iy < h; iy++) {
        for (var ix = 0; ix < w; ix++) {
            var dst0 = ((ix + x) + (iy + y) * dstWidth) << 2;
            blendPrecise(dstData, dst0, r, g, b, alpha);
        }
    }
}
function drawImageNormal(src, dst, transform, globalAlpha, tint, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (sw !== dw || sh !== dh)
        throw new Error('Different dimentions not supported');
    if (DEVELOPMENT && !mat2d_1.isTranslation(transform)) {
        console.error('Transform not supported');
    }
    if (!src || !dst)
        return;
    dx = Math.round(dx + transform[4]);
    dy = Math.round(dy + transform[5]);
    var w = sw;
    var h = sh;
    var xx = min(0, sx, dx);
    w += xx;
    dx -= xx;
    sx -= xx;
    var yy = min(0, sy, dy);
    h += yy;
    dy -= yy;
    sy -= yy;
    w += min(0, src.width - (sx + w), dst.width - (dx + w));
    h += min(0, src.height - (sy + h), dst.height - (dy + h));
    if (w <= 0 && h <= 0)
        return;
    var _a = color_1.colorToRGBA(tint), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    var alpha = (globalAlpha * a) | 0;
    var dstData = dst.data;
    var srcData = src.data;
    var dstWidth = dst.width | 0;
    var srcWidth = src.width | 0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var srcO = ((sx + x) + (sy + y) * srcWidth) << 2;
            var sr = srcData[srcO];
            var sg = srcData[srcO + 1];
            var sb = srcData[srcO + 2];
            var sa = srcData[srcO + 3];
            var srcAlpha = blendColor(alpha, sa, 255);
            if (srcAlpha !== 0) {
                var rr = blendColor(r, sr, 255);
                var gg = blendColor(g, sg, 255);
                var bb = blendColor(b, sb, 255);
                var dst0 = ((dx + x) + (dy + y) * dstWidth) << 2;
                blendPrecise(dstData, dst0, rr, gg, bb, srcAlpha);
            }
        }
    }
}
function drawImagePalette(src, dst, transform, globalAlpha, ignoreColorOption, disableShadingOption, type, tint, palette, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (sw !== dw || sh !== dh)
        throw new Error('Different dimentions not supported');
    if (DEVELOPMENT && !mat2d_1.isTranslation(transform)) {
        console.error('Transform not supported');
    }
    if (palette === undefined) {
        palette = graphicsUtils_1.commonPalettes.defaultPalette;
    }
    if (!src || !dst)
        return;
    dx = Math.round(dx + transform[4]);
    dy = Math.round(dy + transform[5]);
    var w = sw;
    var h = sh;
    var xx = min(0, sx, dx);
    w += xx;
    dx -= xx;
    sx -= xx;
    var yy = min(0, sy, dy);
    h += yy;
    dy -= yy;
    sy -= yy;
    w += min(0, src.width - (sx + w), dst.width - (dx + w));
    h += min(0, src.height - (sy + h), dst.height - (dy + h));
    if (w <= 0 && h <= 0)
        return;
    var _a = color_1.colorToRGBA(tint), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    var alpha = (globalAlpha * a) | 0;
    var colors = palette.colors;
    var dstData = dst.data;
    var srcData = src.data;
    var dstWidth = dst.width | 0;
    var srcWidth = src.width | 0;
    var ignoreColor = ignoreColorOption >>> 0;
    var disableShading = disableShadingOption || type > 2;
    var offset = typeOffsets[type];
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var srcO = ((sx + x) + (sy + y) * srcWidth) << 2;
            var index = srcData[srcO + offset];
            var color = colors[index];
            var srcAlpha = ignoreColor === color ? 0 : blendColor(color_1.getAlpha(color), alpha, 255);
            if (srcAlpha !== 0) {
                var shade = disableShading ? 255 : srcData[srcO + 1];
                var rr = blendColor(color_1.getR(color), r, shade);
                var gg = blendColor(color_1.getG(color), g, shade);
                var bb = blendColor(color_1.getB(color), b, shade);
                var dst0 = ((dx + x) + (dy + y) * dstWidth) << 2;
                blendPrecise(dstData, dst0, rr, gg, bb, srcAlpha);
            }
        }
    }
}
function blendColor(base, tint, shade) {
    return (((((base * tint) | 0) * shade) | 0) / 65025) | 0;
}
function blendPrecise(dstData, dst0, r, g, b, alpha) {
    if (alpha === 0xff || dstData[dst0 + 3] === 0) {
        dstData[dst0] = r;
        dstData[dst0 + 1] = g;
        dstData[dst0 + 2] = b;
        dstData[dst0 + 3] = alpha;
    }
    else {
        var dstAlpha = (0xff - alpha) | 0;
        dstData[dst0] = ((((r * alpha) | 0) / 255) | 0) + ((((dstData[dst0] * dstAlpha) | 0) / 255) | 0);
        dstData[dst0 + 1] = ((((g * alpha) | 0) / 255) | 0) + ((((dstData[dst0 + 1] * dstAlpha) | 0) / 255) | 0);
        dstData[dst0 + 2] = ((((b * alpha) | 0) / 255) | 0) + ((((dstData[dst0 + 2] * dstAlpha) | 0) / 255) | 0);
        var a = (alpha + ((((dstData[dst0 + 3] * dstAlpha) | 0) / 255) | 0)) | 0;
        dstData[dst0 + 3] = a > 0xff ? 0xff : a;
    }
}
// function blendFast(dstData: Uint8ClampedArray, dst0: number, r: number, g: number, b: number, alpha: number) {
// 	if (alpha === 0xff) {
// 		dstData[dst0] = r;
// 		dstData[dst0 + 1] = g;
// 		dstData[dst0 + 2] = b;
// 		dstData[dst0 + 3] = alpha;
// 	} else {
// 		const dstAlpha = (0xff - alpha) | 0;
// 		dstData[dst0] = ((r * alpha) >> 8) + ((dstData[dst0] * dstAlpha) >> 8);
// 		dstData[dst0 + 1] = ((g * alpha) >> 8) + ((dstData[dst0 + 1] * dstAlpha) >> 8);
// 		dstData[dst0 + 2] = ((b * alpha) >> 8) + ((dstData[dst0 + 2] * dstAlpha) >> 8);
// 		dstData[dst0 + 3] = min(0xff, alpha + ((dstData[dst0 + 3] * dstAlpha) >> 8));
// 	}
// }
