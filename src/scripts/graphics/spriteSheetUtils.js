"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var texture2d_1 = require("./webgl/texture2d");
function createTexturesForSpriteSheets(gl, sheets, texture) {
    if (texture === void 0) { texture = texture2d_1.createTexture; }
    sheets.forEach(function (sheet) {
        if (sheet.data) {
            sheet.texture = texture(gl, sheet.data);
        }
    });
}
exports.createTexturesForSpriteSheets = createTexturesForSpriteSheets;
function disposeTexturesForSpriteSheets(gl, sheets) {
    sheets.forEach(function (sheet) {
        sheet.texture = texture2d_1.disposeTexture(gl, sheet.texture);
    });
}
exports.disposeTexturesForSpriteSheets = disposeTexturesForSpriteSheets;
