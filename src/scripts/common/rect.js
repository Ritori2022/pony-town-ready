"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function rect(x, y, w, h) {
    return { x: x, y: y, w: w, h: h };
}
exports.rect = rect;
function centerPoint(rect) {
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}
exports.centerPoint = centerPoint;
function copyRect(dst, src) {
    dst.x = src.x;
    dst.y = src.y;
    dst.w = src.w;
    dst.h = src.h;
}
exports.copyRect = copyRect;
function withBorder(_a, border) {
    var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
    return rect(x - border, y - border, w + border * 2, h + border * 2);
}
exports.withBorder = withBorder;
function withPadding(_a, top, right, bottom, left) {
    var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
    return rect(x - top, y - left, w + left + right, h + top + bottom);
}
exports.withPadding = withPadding;
function rectsIntersect(a, b) {
    return utils_1.intersect(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
}
exports.rectsIntersect = rectsIntersect;
function addRect(a, b) {
    var x = Math.min(a.x, b.x);
    var y = Math.min(a.y, b.y);
    a.w = Math.max(a.x + a.w, b.x + b.w) - x;
    a.h = Math.max(a.y + a.h, b.y + b.h) - y;
    a.x = x;
    a.y = y;
}
exports.addRect = addRect;
function addRects(a, b) {
    var x = Math.min(a.x, b.x);
    var y = Math.min(a.y, b.y);
    return {
        x: x, y: y,
        w: Math.max(a.x + a.w, b.x + b.w) - x,
        h: Math.max(a.y + a.h, b.y + b.h) - y,
    };
}
exports.addRects = addRects;
