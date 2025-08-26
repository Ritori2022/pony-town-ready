"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lowercaseCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789_';
var uppercaseCharacters = lowercaseCharacters + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var CARRIAGERETURN = '\r'.charCodeAt(0);
function randomString(length, useUpperCase) {
    if (useUpperCase === void 0) { useUpperCase = false; }
    var characters = useUpperCase ? uppercaseCharacters : lowercaseCharacters;
    var result = '';
    for (var i = 0; i < length; i++) {
        result += characters[(Math.random() * characters.length) | 0];
    }
    return result;
}
exports.randomString = randomString;
function isSurrogate(code) {
    return code >= 0xd800 && code <= 0xdbff;
}
exports.isSurrogate = isSurrogate;
function isLowSurrogate(code) {
    return (code & 0xfc00) === 0xdc00;
}
exports.isLowSurrogate = isLowSurrogate;
function fromSurrogate(high, low) {
    return (((high & 0x3ff) << 10) + (low & 0x3ff) + 0x10000) | 0;
}
exports.fromSurrogate = fromSurrogate;
function charsToCodes(text) {
    var chars = [];
    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (isSurrogate(code) && (i + 1) < text.length) {
            var extra = text.charCodeAt(i + 1);
            if (isLowSurrogate(extra)) {
                code = fromSurrogate(code, extra);
                i++;
            }
        }
        chars.push(code);
    }
    return chars;
}
exports.charsToCodes = charsToCodes;
function stringToCodes(buffer, text) {
    var textLength = text.length | 0;
    var length = 0 | 0;
    for (var i = 0; i < textLength; i = (i + 1) | 0) {
        var code = text.charCodeAt(i) | 0;
        if (isSurrogate(code) && ((i + 1) | 0) < textLength) {
            var extra = text.charCodeAt(i + 1) | 0;
            if (isLowSurrogate(extra)) {
                code = fromSurrogate(code, extra) | 0;
                i = (i + 1) | 0;
            }
        }
        if (isVisibleChar(code)) {
            buffer[length] = code;
            length = (length + 1) | 0;
        }
    }
    return length;
}
exports.stringToCodes = stringToCodes;
exports.codesBuffer = new Uint32Array(32);
function stringToCodesTemp(text) {
    while (text.length > exports.codesBuffer.length) {
        exports.codesBuffer = new Uint32Array(exports.codesBuffer.length * 2);
    }
    return stringToCodes(exports.codesBuffer, text);
}
exports.stringToCodesTemp = stringToCodesTemp;
function matcher(regex) {
    return function (text) { return !!text && regex.test(text); };
}
exports.matcher = matcher;
function isVisibleChar(code) {
    return code !== CARRIAGERETURN && !(code >= 0xfe00 && code <= 0xfe0f);
}
exports.isVisibleChar = isVisibleChar;
