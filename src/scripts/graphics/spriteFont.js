"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../common/interfaces");
var colors_1 = require("../common/colors");
var stringUtils_1 = require("../common/stringUtils");
var spriteUtils_1 = require("../client/spriteUtils");
var SPACE = ' '.charCodeAt(0);
var TAB = '\t'.charCodeAt(0);
var DEFAULT = '?'.charCodeAt(0);
var LINEFEED = '\n'.charCodeAt(0);
var defaultOptions = {};
function createSpriteFont(charset, emojiCharset, spaceWidth) {
    var lineSpacing = 2;
    var letterSpacing = 1;
    var letterShiftX = 0;
    var letterShiftY = 0;
    var letterShiftWidth = 0;
    var letterShiftHeight = 0;
    var chars = new Map();
    var emoji = new Map();
    charset.filter(function (c) { return !!c; }).forEach(function (c) { return chars.set(c.code, c.sprite); });
    emojiCharset.filter(function (e) { return !!e && !!e.code; }).forEach(function (e) { return emoji.set(e.code, e.sprite); });
    var char0 = chars.get(0);
    var letterHeight = char0.h;
    var letterWidth = char0.w;
    var letterHeightReal = char0.h + char0.oy;
    chars.set(SPACE, spriteUtils_1.createSprite(0, 0, 0, 0, spaceWidth, char0.h, 0));
    chars.set(TAB, spriteUtils_1.createSprite(0, 0, 0, 0, spaceWidth * 4, char0.h, 0));
    var defaultChar = chars.get(DEFAULT);
    return {
        lineSpacing: lineSpacing, letterSpacing: letterSpacing, letterShiftX: letterShiftX, letterShiftY: letterShiftY, letterShiftWidth: letterShiftWidth, letterShiftHeight: letterShiftHeight,
        letterHeight: letterHeight, letterHeightReal: letterHeightReal, letterWidth: letterWidth, chars: chars, emoji: emoji, defaultChar: defaultChar,
    };
}
exports.createSpriteFont = createSpriteFont;
function drawChars(batch, chars, length, font, color, x, y, options) {
    var _a = options.lineSpacing, lineSpacing = _a === void 0 ? font.lineSpacing : _a, _b = options.monospace, monospace = _b === void 0 ? false : _b;
    x = Math.round(x) | 0;
    y = Math.round(y) | 0;
    var currentX = x;
    for (var i = 0; i < length; i++) {
        var code = chars[i];
        if (code === LINEFEED) {
            currentX = x;
            y += font.letterHeight + lineSpacing;
        }
        else {
            var charWidth = drawChar(batch, font, code, color, currentX, y, options);
            currentX += (monospace ? font.letterWidth : charWidth) + font.letterSpacing;
        }
    }
}
function drawText(batch, text, font, color, x, y, options) {
    if (options === void 0) { options = defaultOptions; }
    var length = stringUtils_1.stringToCodesTemp(text);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, color, x, y, options);
}
exports.drawText = drawText;
function drawOutlinedText(batch, text, font, color, outlineColor, x, y, options) {
    if (options === void 0) { options = defaultOptions; }
    var length = stringUtils_1.stringToCodesTemp(text);
    options.skipEmotes = true;
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x - 1, y - 1, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x + 1, y - 1, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x - 1, y + 1, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x + 1, y + 1, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x - 1, y, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x, y - 1, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x + 1, y, options);
    drawChars(batch, stringUtils_1.codesBuffer, length, font, outlineColor, x, y + 1, options);
    options.skipEmotes = false;
    drawChars(batch, stringUtils_1.codesBuffer, length, font, color, x, y, options);
}
exports.drawOutlinedText = drawOutlinedText;
function drawTextAligned(spriteBatch, text, font, color, rect, halign, valign, options) {
    if (halign === void 0) { halign = 0 /* Left */; }
    if (valign === void 0) { valign = 0 /* Top */; }
    if (options === void 0) { options = defaultOptions; }
    var length = stringUtils_1.stringToCodesTemp(text);
    var _a = alignChars(font, stringUtils_1.codesBuffer, length, rect, halign, valign), x = _a.x, y = _a.y;
    drawChars(spriteBatch, stringUtils_1.codesBuffer, length, font, color, x, y, options);
}
exports.drawTextAligned = drawTextAligned;
function lineBreak(text, font, width) {
    var lines = [];
    var spaceWidth = measureChar(font, SPACE) + font.letterSpacing * 2;
    var line = [];
    var lineWidth = 0;
    for (var _i = 0, _a = text.split(' '); _i < _a.length; _i++) {
        var word = _a[_i];
        var w = measureText(word, font).w;
        if (lineWidth) {
            lineWidth += spaceWidth;
            if (lineWidth + w > width) {
                lines.push(line);
                line = [];
                lineWidth = 0;
            }
        }
        line.push(word);
        lineWidth += w;
    }
    if (line.length) {
        lines.push(line);
    }
    return lines.map(function (x) { return x.join(' '); }).join('\n');
}
exports.lineBreak = lineBreak;
function measureChars(chars, length, font) {
    var maxW = 0;
    var lines = 1;
    var w = 0;
    for (var i = 0; i < length; i++) {
        var code = chars[i];
        if (code === LINEFEED) {
            maxW = Math.max(maxW, w);
            w = 0;
            lines++;
        }
        else {
            if (w) {
                w += font.letterSpacing;
            }
            w += measureChar(font, code);
        }
    }
    return {
        w: Math.max(maxW, w),
        h: lines * font.letterHeight + (lines - 1) * font.lineSpacing
    };
}
function measureText(text, font) {
    var length = stringUtils_1.stringToCodesTemp(text);
    return measureChars(stringUtils_1.codesBuffer, length, font);
}
exports.measureText = measureText;
function getCharacterSprite(char, font) {
    var sprite;
    var unset = false;
    var length = stringUtils_1.stringToCodesTemp(char);
    for (var i = 0; i < length; i++) {
        var code = stringUtils_1.codesBuffer[i];
        unset = !!sprite;
        sprite = font.emoji.get(code) || getChar(font, code);
    }
    return unset ? undefined : sprite;
}
exports.getCharacterSprite = getCharacterSprite;
function measureChar(font, code) {
    var sprite = font.emoji.get(code) || getChar(font, code);
    return sprite.w + sprite.ox;
}
function drawChar(batch, font, code, color, x, y, options) {
    var emote = font.emoji.get(code);
    var px = x + font.letterShiftX;
    var py = y + font.letterShiftY;
    if (emote) {
        var skipEmote = !!options.skipEmotes;
        var colorEmote = !!options.colorEmotes;
        var emoteColor = colorEmote ? color : colors_1.WHITE;
        if (!skipEmote) {
            if (interfaces_1.isPaletteSpriteBatch(batch)) {
                batch.drawSprite(emote, emoteColor, options.emojiPalette, px, py);
            }
            else {
                batch.drawSprite(emote, emoteColor, px, py);
            }
        }
        return emote.w + emote.ox;
    }
    else {
        var c = getChar(font, code);
        if (interfaces_1.isPaletteSpriteBatch(batch)) {
            batch.drawSprite(c, color, options.palette, px, py);
        }
        else {
            batch.drawSprite(c, color, px, py);
        }
        return c.w + c.ox + font.letterShiftWidth;
    }
}
function alignChars(font, chars, length, rect, halign, valign) {
    var x = rect.x;
    var y = rect.y;
    if (halign !== 0 /* Left */ || valign !== 0 /* Top */) {
        var size = measureChars(chars, length, font);
        if (halign !== 0 /* Left */) {
            x += halign === 2 /* Center */ ? (rect.w - size.w) / 2 : (rect.w - size.w);
        }
        if (valign !== 0 /* Top */) {
            y += valign === 2 /* Middle */ ? (rect.h - size.h) / 2 : (rect.h - size.h);
        }
    }
    return { x: x, y: y };
}
function getChar(font, code) {
    return font.chars.get(code) || font.defaultChar;
}
