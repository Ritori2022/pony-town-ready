"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var sprites_1 = require("../generated/sprites");
var canvasUtils_1 = require("../client/canvasUtils");
var rev_1 = require("./rev");
var fonts_1 = require("./fonts");
function createSprite(x, y, w, h, ox, oy, type) {
    return { x: x, y: y, w: w, h: h, ox: ox, oy: oy, type: type };
}
exports.createSprite = createSprite;
function addTitles(sprites, titles) {
    return sprites && sprites.map(function (ns, i) {
        return ns && ns.map(function (s) { return s && { color: s.color, colors: s.colors, title: titles[i], label: titles[i] }; });
    });
}
exports.addTitles = addTitles;
function addLabels(sprites, labels) {
    sprites && sprites.forEach(function (s, i) { return s && s[0] ? s[0].label = labels[i] : undefined; });
    return sprites;
}
exports.addLabels = addLabels;
function createEyeSprite(eye, iris, defaultPalette) {
    return eye && { color: eye.irises[iris], colors: 2, extra: eye.base, palettes: [defaultPalette] };
}
exports.createEyeSprite = createEyeSprite;
function getColorCount(sprite) {
    return sprite && sprite.colors ? Math.floor((sprite.colors - 1) / 2) : 0;
}
exports.getColorCount = getColorCount;
function createSpriteUtils() {
    fonts_1.createFonts();
}
exports.createSpriteUtils = createSpriteUtils;
function getImageData(img) {
    var canvas = canvasUtils_1.createCanvas(img.width, img.height);
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
}
function loadSpriteSheet(sheet, loadImage) {
    return Promise.all([
        loadImage(sheet.src),
        sheet.srcA ? loadImage(sheet.srcA) : Promise.resolve(undefined)
    ])
        .then(function (_a) {
        var img = _a[0], imgA = _a[1];
        sheet.data = getImageData(img);
        if (imgA) {
            var alpha = getImageData(imgA);
            var alphaData = alpha.data;
            var sheedData = sheet.data.data;
            for (var i = 0; i < sheedData.length; i += 4) {
                sheedData[i + 3] = alphaData[i];
            }
        }
    });
}
function loadSpriteSheets(sheets, loadImage) {
    return Promise.all(sheets.map(function (s) { return loadSpriteSheet(s, loadImage); })).then(lodash_1.noop);
}
exports.loadSpriteSheets = loadSpriteSheets;
exports.spriteSheetsLoaded = false;
function loadAndInitSheets(sheets, loadImage) {
    return loadSpriteSheets(sheets, loadImage)
        .then(createSpriteUtils)
        .then(function () { return true; })
        .catch(function (e) { return (console.error(e), false); })
        .then(function (loaded) { return exports.spriteSheetsLoaded = loaded; });
}
exports.loadAndInitSheets = loadAndInitSheets;
function loadImageFromUrl(url) {
    return canvasUtils_1.loadImage(rev_1.getUrl(url));
}
exports.loadImageFromUrl = loadImageFromUrl;
exports.loadAndInitSpriteSheets = lodash_1.once(function () { return loadAndInitSheets(sprites_1.spriteSheets, loadImageFromUrl); });
