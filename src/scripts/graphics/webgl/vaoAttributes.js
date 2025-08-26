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
Object.defineProperty(exports, "__esModule", { value: true });
function getVAOAttributesSize(gl, attributes) {
    return attributes.reduce(function (sum, a) { return sum + a.size * sizeOfType(gl, a.type); }, 0);
}
exports.getVAOAttributesSize = getVAOAttributesSize;
function createVAOAttributes(gl, attributes, buffer) {
    var result = [];
    var stride = getVAOAttributesSize(gl, attributes);
    var offset = 0;
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var a = attributes_1[_i];
        result.push(__assign({}, a, { stride: stride, buffer: buffer, offset: offset }));
        offset += a.size * sizeOfType(gl, a.type);
    }
    return result;
}
exports.createVAOAttributes = createVAOAttributes;
function sizeOfType(gl, type) {
    switch (type) {
        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
            return 1;
        case gl.SHORT:
        case gl.UNSIGNED_SHORT:
            return 2;
        case gl.FLOAT:
        case undefined:
            return 4;
        default:
            throw new Error("Invalid attribute type (" + type + ")");
    }
}
