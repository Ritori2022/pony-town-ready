"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var mat2d_1 = require("../common/mat2d");
var rect_1 = require("../common/rect");
function createEmptyState() {
    return {
        transform: mat2d_1.createMat2D(),
        globalAlpha: 1,
        hasCrop: false,
        cropRect: rect_1.rect(0, 0, 0, 0),
    };
}
var stateCache = new utils_1.ObjectCache(10, createEmptyState);
var BaseStateBatch = /** @class */ (function () {
    function BaseStateBatch() {
        this.globalAlpha = 1;
        this.transform = mat2d_1.createMat2D();
        this.savedStates = [];
        this.hasCrop = false;
        this.cropRect = rect_1.rect(0, 0, 0, 0);
    }
    BaseStateBatch.prototype.crop = function (x, y, w, h) {
        // console.error('Crop not supported');
        this.hasCrop = true;
        this.cropRect.x = x;
        this.cropRect.y = y;
        this.cropRect.w = w;
        this.cropRect.h = h;
    };
    BaseStateBatch.prototype.clearCrop = function () {
        this.hasCrop = false;
    };
    BaseStateBatch.prototype.save = function () {
        var state = stateCache.get();
        state.globalAlpha = this.globalAlpha;
        state.hasCrop = this.hasCrop;
        mat2d_1.copyMat2D(state.transform, this.transform);
        rect_1.copyRect(state.cropRect, this.cropRect);
        this.savedStates.push(state);
        if (DEVELOPMENT && this.savedStates.length > 100) {
            console.error('More than 100 save states');
        }
    };
    BaseStateBatch.prototype.restore = function () {
        var state = this.savedStates.pop();
        if (state !== undefined) {
            this.globalAlpha = state.globalAlpha;
            this.hasCrop = state.hasCrop;
            mat2d_1.copyMat2D(this.transform, state.transform);
            rect_1.copyRect(this.cropRect, state.cropRect);
            stateCache.put(state);
        }
    };
    BaseStateBatch.prototype.translate = function (x, y) {
        mat2d_1.translateMat2D(this.transform, this.transform, x, y);
    };
    BaseStateBatch.prototype.scale = function (x, y) {
        mat2d_1.scaleMat2D(this.transform, this.transform, x, y);
    };
    BaseStateBatch.prototype.rotate = function (angle) {
        mat2d_1.rotateMat2D(this.transform, this.transform, angle);
    };
    BaseStateBatch.prototype.multiplyTransform = function (mat) {
        mat2d_1.mulMat2D(this.transform, this.transform, mat);
    };
    return BaseStateBatch;
}());
exports.BaseStateBatch = BaseStateBatch;
