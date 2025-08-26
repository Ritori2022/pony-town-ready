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
var baseSpriteBatch_1 = require("./baseSpriteBatch");
function vertex(vertices, _verticesUint32, index, x, y, u, v, c, transform) {
    vertices[index++] = transform[0] * x + transform[2] * y + transform[4];
    vertices[index++] = transform[1] * x + transform[3] * y + transform[5];
    vertices[index++] = u;
    vertices[index++] = v;
    vertices[index++] = c;
}
// function colorWithAlpha(color: number, alpha: number) {
// 	return ((color & 0xffffff00) | (((color & 0xff) * alpha) & 0xff)) >>> 0;
// }
var SpriteBatch = /** @class */ (function (_super) {
    __extends(SpriteBatch, _super);
    function SpriteBatch(gl, capacity, buffer, vertexBuffer, indexBuffer) {
        var _this = _super.call(this, gl, capacity, buffer, vertexBuffer, indexBuffer, [
            { name: 'position', size: 2 },
            { name: 'texcoord0', size: 2 },
            { name: 'color', size: 4, type: gl.UNSIGNED_BYTE, normalized: true },
        ]) || this;
        _this.palette = false;
        _this.depth = 0;
        return _this;
    }
    SpriteBatch.prototype.drawImage = function (color, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (this.capacity <= this.spritesCount) {
            this.flush();
        }
        var c = baseSpriteBatch_1.getColorFloat(color, this.globalAlpha);
        var x2 = dx + dw;
        var y2 = dy + dh;
        var u1 = sx;
        var v1 = sy;
        var u2 = sx + sw;
        var v2 = sy + sh;
        var vertices = this.vertices;
        var verticesUint32 = this.verticesUint32;
        var transform = this.transform;
        var index = this.index;
        vertex(vertices, verticesUint32, index, dx, dy, u1, v1, c, transform);
        vertex(vertices, verticesUint32, index + 5, x2, dy, u2, v1, c, transform);
        vertex(vertices, verticesUint32, index + 10, x2, y2, u2, v2, c, transform);
        vertex(vertices, verticesUint32, index + 15, dx, y2, u1, v2, c, transform);
        this.index += 20;
        this.spritesCount++;
        this.tris += 2;
    };
    SpriteBatch.prototype.drawRect = function (color, x, y, w, h) {
        if (w && h) {
            var rect = this.rectSprite;
            if (rect) {
                this.drawImage(color, rect.x, rect.y, rect.w, rect.h, x, y, w, h);
            }
            else {
                this.drawImage(color, 0, 0, 1, 1, x, y, w, h);
            }
        }
    };
    SpriteBatch.prototype.drawSprite = function (s, color, x, y) {
        if (s && s.w && s.h) {
            this.drawImage(color, s.x, s.y, s.w, s.h, x + s.ox, y + s.oy, s.w, s.h);
        }
    };
    return SpriteBatch;
}(baseSpriteBatch_1.BaseSpriteBatch));
exports.SpriteBatch = SpriteBatch;
