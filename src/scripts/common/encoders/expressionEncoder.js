"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
exports.EMPTY_EXPRESSION = 0x1fffffff;
function encodeExpression(expression) {
    if (!expression)
        return exports.EMPTY_EXPRESSION;
    var extra = expression.extra, rightIris = expression.rightIris, leftIris = expression.leftIris, right = expression.right, left = expression.left, muzzle = expression.muzzle;
    // bits: 5 | 4 | 4 | 5 | 5 | 5 = 28/32
    return ((extra << 23) | (rightIris << 19) | (leftIris << 15) | (right << 10) | (left << 5) | muzzle) >>> 0;
}
exports.encodeExpression = encodeExpression;
function decodeExpression(value) {
    value = value >>> 0;
    if (value === exports.EMPTY_EXPRESSION)
        return undefined;
    var muzzle = value & 0x1f;
    var left = (value >> 5) & 0x1f;
    var right = (value >> 10) & 0x1f;
    var leftIris = (value >> 15) & 0xf;
    var rightIris = (value >> 19) & 0xf;
    var extra = (value >> 23) & 0x1f;
    return { muzzle: muzzle, left: left, right: right, leftIris: leftIris, rightIris: rightIris, extra: extra };
}
exports.decodeExpression = decodeExpression;
function isCancellableExpression(expression) {
    return utils_1.hasFlag(expression.extra, 2 /* Zzz */);
}
exports.isCancellableExpression = isCancellableExpression;
