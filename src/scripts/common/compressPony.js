"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var base64_js_1 = require("base64-js");
var ponyInfo_1 = require("./ponyInfo");
var bitUtils_1 = require("./bitUtils");
var colors_1 = require("./colors");
var utils_1 = require("./utils");
var spriteUtils_1 = require("../client/spriteUtils");
var sprites = require("../generated/sprites");
var color_1 = require("./color");
var ponyUtils_1 = require("../client/ponyUtils");
var constants_1 = require("./constants");
exports.VERSION = 4;
var identity = function (x) { return x; };
var not = function (x) { return !x; };
function emptyOrUnlocked(set) {
    return !set || !set.type || !set.lockFills || set.lockFills.every(function (x) { return !x; });
}
function emptyOrZeroLocked(set, customOutlines) {
    return !set || (set.type === 0 && set.pattern === 0 && set.lockFills !== undefined && set.lockFills[0] === true &&
        (!customOutlines || (set.lockOutlines !== undefined && set.lockOutlines[0] === true)));
}
function empty(set) {
    return !set || !set.type;
}
function omitMane(info) {
    return empty(info.mane) && emptyOrUnlocked(info.backMane)
        && emptyOrUnlocked(info.tail) && emptyOrUnlocked(info.facialHair);
}
function omitHead(info) {
    return emptyOrZeroLocked(info.head, !!info.customOutlines);
}
function omitSleeves(info) {
    return !info.chestAccessory || !utils_1.includes(ponyUtils_1.SLEEVED_ACCESSORIES, utils_1.toInt(info.chestAccessory.type));
}
function omitFrontHooves(info) {
    return empty(info.frontHooves) && emptyOrUnlocked(info.backHooves);
}
function readTimes(read, count, bitsPerItem) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result[i] = read(bitsPerItem);
    }
    return result;
}
// NOTE: do not reorder or remove
var setFields = [
    { name: 'extraAccessory', sets: ponyUtils_1.mergedExtraAccessories, preserveOnZero: true },
    { name: 'nose', sets: sprites.noses[0], preserveOnZero: true },
    { name: 'ears', sets: sprites.ears, preserveOnZero: true },
    { name: 'mane', sets: ponyUtils_1.mergedManes, preserveOnZero: true, minColors: 1, omit: omitMane },
    { name: 'backMane', sets: ponyUtils_1.mergedBackManes },
    { name: 'tail', sets: sprites.tails[0] },
    { name: 'horn', sets: sprites.horns },
    { name: 'wings', sets: sprites.wings[0] },
    { name: 'frontHooves', sets: ponyUtils_1.frontHooves[1], preserveOnZero: true, minColors: 1, omit: omitFrontHooves },
    { name: 'backHooves', sets: sprites.backLegHooves[1] },
    { name: 'facialHair', sets: ponyUtils_1.mergedFacialHair },
    { name: 'headAccessory', sets: ponyUtils_1.mergedHeadAccessories },
    { name: 'earAccessory', sets: sprites.earAccessories },
    { name: 'faceAccessory', sets: sprites.faceAccessories },
    { name: 'neckAccessory', sets: sprites.neckAccessories[1] },
    { name: 'frontLegAccessory', sets: sprites.frontLegAccessories[1] },
    { name: 'backLegAccessory', sets: sprites.backLegAccessories[1], omit: function (info) { return !!info.lockBackLegAccessory; } },
    { name: 'backAccessory', sets: ponyUtils_1.mergedBackAccessories },
    { name: 'waistAccessory', sets: sprites.waistAccessories[1] },
    { name: 'chestAccessory', sets: sprites.chestAccessories[1] },
    { name: 'sleeveAccessory', sets: sprites.frontLegSleeves[1], preserveOnZero: true, omit: omitSleeves },
    { name: 'head', sets: sprites.head0[1], preserveOnZero: true, omit: omitHead },
    {
        name: 'frontLegAccessoryRight',
        sets: sprites.frontLegAccessories[1],
        omit: function (info) { return !info.unlockFrontLegAccessory; },
    },
    {
        name: 'backLegAccessoryRight',
        sets: sprites.backLegAccessories[1],
        omit: function (info) { return !info.unlockBackLegAccessory || !!info.lockBackLegAccessory; },
    },
];
var booleanFields = [
    { name: 'customOutlines' },
    { name: 'lockEyes' },
    { name: 'lockEyeColor' },
    { name: 'lockCoatOutline', omit: function (info) { return !info.customOutlines; } },
    {
        name: 'lockBackLegAccessory', omit: function (info) {
            return empty(info.frontLegAccessory) && empty(info.backLegAccessory) &&
                empty(info.frontLegAccessoryRight) && empty(info.backLegAccessoryRight);
        }
    },
    { name: 'eyeshadow' },
    { name: 'cmFlip', omit: function (info) { return info.cm === undefined || info.cm.every(not); } },
    { name: 'unlockEyeWhites' },
    { name: 'freeOutlines' },
    { name: 'unlockFrontLegAccessory' },
    { name: 'unlockBackLegAccessory', omit: function (info) { return !!info.lockBackLegAccessory; } },
    { name: 'unlockEyelashColor' },
    { name: 'darkenLockedOutlines', omit: function (info) { return !info.freeOutlines; } },
];
var numberFields = [
    { name: 'eyelashes' },
    { name: 'eyeOpennessRight' },
    { name: 'eyeOpennessLeft', omit: function (info) { return !!info.lockEyes; } },
    { name: 'fangs' },
    { name: 'muzzle' },
    { name: 'freckles', dontSave: true },
];
var colorFields = [
    { name: 'coatFill' },
    { name: 'coatOutline', omit: function (info) { return !info.customOutlines || !!info.lockCoatOutline; } },
    { name: 'eyeColorRight' },
    { name: 'eyeColorLeft', omit: function (info) { return !!info.lockEyeColor; } },
    { name: 'eyeWhites', default: colors_1.WHITE },
    { name: 'eyeshadowColor', omit: function (info) { return !info.eyeshadow; } },
    { name: 'frecklesColor', omit: function (info) { return !info.freckles; }, dontSave: true },
    { name: 'eyeWhitesLeft', default: colors_1.WHITE, omit: function (info) { return !info.unlockEyeWhites; } },
    { name: 'eyelashColor' },
    { name: 'eyelashColorLeft', omit: function (info) { return !info.unlockEyelashColor; } },
    { name: 'magicColor', default: colors_1.WHITE },
];
var omittableFields = setFields.concat(booleanFields, numberFields, colorFields).filter(function (f) { return !!f.omit; });
var VERSION_BITS = 6; // max 63
var COLORS_LENGTH_BITS = 10; // max 1024
var BOOLEAN_FIELDS_LENGTH_BITS = 4; // max 15
var NUMBER_FIELDS_LENGTH_BITS = 4; // max 15
var COLOR_FIELDS_LENGTH_BITS = 4; // max 15
var SET_FIELDS_LENGTH_BITS = 6; // max 63
var CM_LENGTH_BITS = 5; // max 31
var NUMBERS_BITS = 6; // max 63
/* istanbul ignore next */
if (DEVELOPMENT) {
    (function () {
        function verifyFields(obj, lengthBits, defs, verify) {
            var missing = Object.keys(obj)
                .filter(function (key) { return verify(obj[key]); })
                .filter(function (key) { return defs.every(function (d) { return d.name !== key; }); });
            var unnecessary = defs
                .filter(function (_a) {
                var name = _a.name;
                return !verify(obj[name]);
            });
            if (missing.length || unnecessary.length) {
                throw new Error("Incorrect fields (" + missing + " / " + unnecessary + ")");
            }
            if (lengthBits < bitUtils_1.countBits(defs.length)) {
                throw new Error("Incorrect field length bits (" + lengthBits + "/" + bitUtils_1.countBits(defs.length) + ")");
            }
        }
        var defaultPony = ponyInfo_1.createBasePony();
        verifyFields(defaultPony, SET_FIELDS_LENGTH_BITS, setFields, function (f) { return f.type !== undefined; });
        verifyFields(defaultPony, COLOR_FIELDS_LENGTH_BITS, colorFields, lodash_1.isString);
        verifyFields(defaultPony, NUMBER_FIELDS_LENGTH_BITS, numberFields, lodash_1.isNumber);
        verifyFields(defaultPony, BOOLEAN_FIELDS_LENGTH_BITS, booleanFields, lodash_1.isBoolean);
        if (setFields.some(function (f) { return !f.sets; })) {
            throw new Error("Undefined set in set field (" + setFields.find(function (f) { return !f.sets; }).name + ")");
        }
    })();
}
function trimRight(items) {
    var index = lodash_1.findLastIndex(items, function (x) { return !!x; });
    return (index !== (items.length - 1)) ? items.slice(0, index + 1) : items;
}
function precompressCM(cm, addColor) {
    var result = [];
    if (cm) {
        var length_1 = constants_1.CM_SIZE * constants_1.CM_SIZE;
        while (length_1 > 0 && !cm[length_1 - 1]) {
            length_1--;
        }
        for (var i = 0; i < length_1; i++) {
            result.push(addColor(cm[i]));
        }
    }
    return result;
}
exports.precompressCM = precompressCM;
// lock sets
function compressLockSet(set, count) {
    var locks = set && set.slice ? set.slice(0, count) : [];
    return locks.reduce(function (result, l, i) { return result | (l ? (1 << i) : 0); }, 0);
}
exports.compressLockSet = compressLockSet;
function decompressLockSet(set, count, defaultValues) {
    var result = [];
    for (var i = 0; i < MAX_COLORS; i++) {
        result[i] = i < count ? !!(set & (1 << i)) : defaultValues[i];
    }
    return result;
}
exports.decompressLockSet = decompressLockSet;
// colors
function precompressColorSet(set, count, locks, defaultColor, addColor) {
    var result = [];
    if (set) {
        for (var i = 0; i < count; i++) {
            if ((locks & (1 << i)) === 0) {
                var color = set[i];
                result.push(!color || color === defaultColor ? 0 : addColor(color));
            }
        }
    }
    return result;
}
exports.precompressColorSet = precompressColorSet;
function postdecompressColorSet(colors, count, locks, colorList, parseColor) {
    var result = [];
    for (var i = 0, j = 0; i < count; i++) {
        var locked = (locks & (1 << i)) !== 0;
        result.push(parseColor((locked ? 0 : colorList[colors[j++] - 1]) || colors_1.BLACK));
    }
    return result;
}
exports.postdecompressColorSet = postdecompressColorSet;
// set
var MAX_COLORS = 6;
var ALL_UNLOCKED = utils_1.array(MAX_COLORS, false);
var ALL_LOCKED = utils_1.array(MAX_COLORS, true);
function precompressSet(set, def, customOutlines, defaultColor, addColor) {
    if (!set)
        return undefined;
    var type = utils_1.clamp(utils_1.toInt(set.type), 0, def.sets.length - 1);
    if (type === 0 && !def.preserveOnZero)
        return undefined;
    var patterns = utils_1.at(def.sets, type);
    var pattern = utils_1.clamp(utils_1.toInt(set.pattern), 0, patterns ? patterns.length - 1 : 0);
    var sprite = utils_1.att(patterns, pattern);
    var colors = Math.max(spriteUtils_1.getColorCount(sprite), def.minColors || 0);
    /* istanbul ignore next */
    if (type === 0 && pattern === 0 && colors === 0)
        return undefined;
    var fillLocks = compressLockSet(set.lockFills, colors);
    var fills = precompressColorSet(set.fills, colors, fillLocks, defaultColor, addColor);
    var outlineLocks = customOutlines ? compressLockSet(set.lockOutlines, colors) : 0;
    var outlines = customOutlines ? precompressColorSet(set.outlines, colors, outlineLocks, defaultColor, addColor) : [];
    return { type: type, pattern: pattern, colors: colors, fillLocks: fillLocks, fills: fills, outlineLocks: outlineLocks, outlines: outlines };
}
exports.precompressSet = precompressSet;
function postdecompressSet(set, _def, customOutlines, colorList, parseColor) {
    return {
        type: set.type,
        pattern: set.pattern,
        lockFills: decompressLockSet(set.fillLocks, set.colors, /*def.defaultLockFills ||*/ ALL_UNLOCKED),
        fills: postdecompressColorSet(set.fills, set.colors, set.fillLocks, colorList, parseColor),
        lockOutlines: customOutlines ?
            decompressLockSet(set.outlineLocks, set.colors, /*def.defaultLockOutlines ||*/ ALL_LOCKED) :
            ALL_LOCKED,
        outlines: customOutlines ? postdecompressColorSet(set.outlines, set.colors, set.outlineLocks, colorList, parseColor) : [],
    };
}
exports.postdecompressSet = postdecompressSet;
// helpers
function precompressFields(data, defs, defaultValue, encode) {
    return trimRight(defs.map(function (def) {
        if (def.dontSave || (def.omit && def.omit(data))) {
            return defaultValue;
        }
        else {
            return encode(data[def.name], def);
        }
    }));
}
function postdecompressFields(result, defs, values, defaultValue, decode) {
    for (var i = 0; i < defs.length; i++) {
        var def = defs[i];
        var value = i >= values.length ? undefined : values[i];
        result[def.name] = decode(value === undefined ? defaultValue : value, def);
    }
}
function precompressPony(info, defaultColor, parseColor) {
    var colors = [];
    var customOutlines = !!info.customOutlines;
    var addColor = function (color) {
        var c = color === undefined ? 0 : parseColor(color);
        return c === 0 ? 0 : utils_1.pushUniq(colors, c);
    };
    return {
        version: exports.VERSION,
        colors: colors,
        booleanFields: precompressFields(info, booleanFields, false, function (x) { return !!x; }),
        numberFields: precompressFields(info, numberFields, 0, utils_1.toInt),
        colorFields: precompressFields(info, colorFields, 0, function (x, def) { return (x === undefined || parseColor(x) === (def.default || colors_1.BLACK)) ? 0 : addColor(x); }),
        setFields: precompressFields(info, setFields, undefined, function (x, def) { return precompressSet(x, def, customOutlines, defaultColor, addColor); }),
        cm: precompressCM(info.cm, addColor),
    };
}
exports.precompressPony = precompressPony;
var frecklesToPattern = [0, 1, 1, 2, 2, 2, 1];
var frecklesToColor = [[], [1], [1, 2], [2], [1], [1, 2], [2]];
function fixVersion(result, data, parseColor) {
    if (data.version < 3) {
        result.head = {
            type: 0,
            pattern: frecklesToPattern[result.freckles || 0] || 0,
            fills: [result.coatFill],
            outlines: [result.coatOutline],
            lockFills: [true, true, true, true, true, true],
            lockOutlines: [true, true, true, true, true, true],
        };
        frecklesToColor[result.freckles || 0].forEach(function (index) {
            result.head.fills[index] = result.frecklesColor || parseColor(colors_1.BLACK);
            result.head.lockFills[index] = false;
        });
    }
}
function createPostDecompressPony() {
    return new Function('postdecompressSet', 'setFields', 'ommitableFields', 'fixVersion', [
        'function identity(x) { return x; }',
        'function getColor(colors, i) { return (i >= 0 && i < colors.length) ? colors[i] : 0; }',
        'function getCM(cm, colors) {',
        '  var result = [];',
        '  for(var i = 0; i < cm.length; i++) { result.push(getColor(colors, cm[i] - 1) || 0); }',
        '  return result;',
        '}'
    ].concat(omittableFields.map(function (def, i) { return "var omit_" + def.name + " = ommitableFields[" + i + "].omit;"; }), [
        'return function (data) {',
        '  var dataColors = data.colors;',
        '  var bools = data.booleanFields;',
        '  var numbers = data.numberFields;',
        '  var colors = data.colorFields;',
        '  var sets = data.setFields;',
        '  var result = {};'
    ], booleanFields.map(function (def, i) { return "  result." + def.name + " = bools.length > " + i + " ? bools[" + i + "] : false;"; }), numberFields.map(function (def, i) { return "  result." + def.name + " = numbers.length > " + i + " ? numbers[" + i + "] : 0;"; }), colorFields.map(function (def, i) { return "  result." + def.name + " = colors.length > " + i + " ? " +
        ("getColor(dataColors, colors[" + i + "] - 1) || " + (def.default || colors_1.BLACK) + " : " + (def.default || colors_1.BLACK) + ";"); }), [
        '  var customOutlines = !!result.customOutlines;'
    ], setFields.map(function (def, i) { return "  result." + def.name + " = sets.length > " + i + " && sets[" + i + "] !== undefined ? " +
        ("postdecompressSet(sets[" + i + "], setFields[" + i + "], customOutlines, data.colors, identity) : undefined;"); }), [
        "  result.cm = data.cm.length ? getCM(data.cm, dataColors) : undefined;"
    ], omittableFields.map(function (def) { return "  if (omit_" + def.name + "(result)) result." + def.name + " = undefined;"; }), [
        '  fixVersion(result, data, identity);',
        '  return result;',
        '};',
    ]).join('\n'));
}
exports.createPostDecompressPony = createPostDecompressPony;
exports.fastPostdecompressPony = createPostDecompressPony()(postdecompressSet, setFields, omittableFields, fixVersion);
function postdecompressPony(data, parseColor) {
    // NOTE: when updating also update createPostDecompressPony()
    var result = {};
    postdecompressFields(result, booleanFields, data.booleanFields, false, identity);
    postdecompressFields(result, numberFields, data.numberFields, 0, identity);
    postdecompressFields(result, colorFields, data.colorFields, 0, function (x, def) { return parseColor(data.colors[x - 1] || def.default || colors_1.BLACK); });
    var customOutlines = !!result.customOutlines;
    postdecompressFields(result, setFields, data.setFields, undefined, function (x, def) { return x === undefined ? undefined : postdecompressSet(x, def, customOutlines, data.colors, parseColor); });
    result.cm = data.cm.length ? data.cm.map(function (x) { return parseColor(data.colors[x - 1] || colors_1.TRANSPARENT); }) : undefined;
    omittableFields.forEach(function (def) {
        if (def.omit && def.omit(result)) {
            result[def.name] = undefined;
        }
    });
    fixVersion(result, data, parseColor);
    return result;
}
exports.postdecompressPony = postdecompressPony;
// set
var TYPE_BITS = 5; // max 31
var PATTERN_BITS = 4; // max 15
var COLORS_BITS = 3; // max 7
function writeSet(write, colorBits, customOutlines, set) {
    write(set ? 1 : 0, 1);
    if (set) {
        write(set.type, TYPE_BITS);
        write(set.pattern, PATTERN_BITS);
        write(set.colors - 1, COLORS_BITS);
        write(set.fillLocks, set.colors);
        set.fills.forEach(function (c) { return write(c, colorBits); });
        if (customOutlines) {
            write(set.outlineLocks, set.colors);
            set.outlines.forEach(function (c) { return write(c, colorBits); });
        }
    }
}
exports.writeSet = writeSet;
function readSet(read, colorBits, customOutlines) {
    var has = read(1);
    if (has) {
        var type = read(TYPE_BITS);
        var pattern = read(PATTERN_BITS);
        var colors = read(COLORS_BITS) + 1;
        var fillLocks = read(colors);
        var fills = readTimes(read, colors - bitUtils_1.countBits(fillLocks), colorBits);
        var outlineLocks = customOutlines ? read(colors) : 0;
        var outlines = customOutlines ? readTimes(read, colors - bitUtils_1.countBits(outlineLocks), colorBits) : [];
        return { type: type, pattern: pattern, colors: colors, fillLocks: fillLocks, fills: fills, outlineLocks: outlineLocks, outlines: outlines };
    }
    else {
        return undefined;
    }
}
exports.readSet = readSet;
// helpers
function writeFields(write, lengthBits, fields, writeField) {
    write(fields.length, lengthBits);
    fields.forEach(writeField);
}
function readFields(read, lengthBits, readField) {
    var length = read(lengthBits);
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(readField(read));
    }
    return result;
}
// pony
function writePony(write, data) {
    var colorBits = Math.max(bitUtils_1.numberToBitCount(data.colors.length), 1);
    var customOutlines = !!data.booleanFields[0];
    write(data.version, VERSION_BITS);
    writeFields(write, COLORS_LENGTH_BITS, data.colors, function (x) { return write(x >> 8, 24); });
    writeFields(write, BOOLEAN_FIELDS_LENGTH_BITS, data.booleanFields, function (x) { return write(x ? 1 : 0, 1); });
    writeFields(write, NUMBER_FIELDS_LENGTH_BITS, data.numberFields, function (x) { return write(x, NUMBERS_BITS); });
    writeFields(write, COLOR_FIELDS_LENGTH_BITS, data.colorFields, function (x) { return write(x, colorBits); });
    writeFields(write, SET_FIELDS_LENGTH_BITS, data.setFields, function (x) { return writeSet(write, colorBits, customOutlines, x); });
    writeFields(write, CM_LENGTH_BITS, data.cm, function (x) { return write(x, colorBits); });
}
exports.writePony = writePony;
var readColorValue = function (read) { return ((read(24) << 8) | 0xff) >>> 0; };
var readBoolean = function (read) { return !!read(1); };
var readBits = function (bits) { return function (read) { return read(bits); }; };
var readNumber = readBits(NUMBERS_BITS);
function readPony(read) {
    var version = read(VERSION_BITS);
    if (version > exports.VERSION) {
        throw new Error('Invalid version');
    }
    var colors = readFields(read, COLORS_LENGTH_BITS, readColorValue);
    var colorBits = Math.max(bitUtils_1.numberToBitCount(colors.length), 1);
    var readColor = readBits(colorBits);
    var booleanFields = readFields(read, BOOLEAN_FIELDS_LENGTH_BITS, readBoolean);
    var customOutlines = !!booleanFields[0];
    var numberFields = readFields(read, NUMBER_FIELDS_LENGTH_BITS, readNumber);
    var colorFields = readFields(read, COLOR_FIELDS_LENGTH_BITS, readColor);
    var setFields = readFields(read, version < 4 ? 5 : SET_FIELDS_LENGTH_BITS, function (read) { return readSet(read, colorBits, customOutlines); });
    var cm = readFields(read, CM_LENGTH_BITS, readColor);
    return { version: version, colors: colors, booleanFields: booleanFields, numberFields: numberFields, colorFields: colorFields, setFields: setFields, cm: cm };
}
exports.readPony = readPony;
function writePonyToString(data) {
    return base64_js_1.fromByteArray(bitUtils_1.bitWriter(function (write) { return writePony(write, data); }));
}
function readPonyFromBuffer(info) {
    return readPony(bitUtils_1.bitReader(info));
}
function readPonyFromString(info) {
    return info ? readPonyFromBuffer(base64_js_1.toByteArray(info)) : {
        version: exports.VERSION,
        colors: [],
        booleanFields: [],
        numberFields: [],
        colorFields: [],
        setFields: [],
        cm: [],
    };
}
// compress
function compressPony(info) {
    return writePonyToString(precompressPony(info, colors_1.BLACK, identity));
}
exports.compressPony = compressPony;
function decompressPony(info) {
    var data = typeof info === 'string' ? readPonyFromString(info) : readPonyFromBuffer(info);
    var pony = exports.fastPostdecompressPony(data); // postdecompressPony(data, identity);
    return ponyInfo_1.syncLockedPonyInfoNumber(pony);
}
exports.decompressPony = decompressPony;
// compress (string)
function parseColorFastSafe(color) {
    return color ? color_1.parseColorFast(color) : colors_1.TRANSPARENT;
}
function colorToString(color) {
    return color ? color_1.colorToHexRGB(color) : '';
}
function compressPonyString(info) {
    return writePonyToString(precompressPony(info, '000000', parseColorFastSafe));
}
exports.compressPonyString = compressPonyString;
function decompressPonyString(info, editable) {
    if (editable === void 0) { editable = false; }
    var data = readPonyFromString(info);
    var pony = postdecompressPony(data, colorToString);
    var result = editable ? lodash_1.merge(ponyInfo_1.createBasePony(), pony) : pony;
    return ponyInfo_1.syncLockedPonyInfo(result);
}
exports.decompressPonyString = decompressPonyString;
// decode
function decodePonyInfo(info, paletteManager) {
    return ponyInfo_1.toPaletteNumber(decompressPony(info), paletteManager);
}
exports.decodePonyInfo = decodePonyInfo;
