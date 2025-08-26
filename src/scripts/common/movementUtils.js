"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var positionUtils_1 = require("./positionUtils");
var rect_1 = require("./rect");
var DIRS = [
    [0, -1],
    [0.5, -1],
    [1, -1],
    [1, -0.5],
    [1, 0],
    [1, 0.5],
    [1, 1],
    [0.5, 1],
    [0, 1],
    [-0.5, 1],
    [-1, 1],
    [-1, 0.5],
    [-1, 0],
    [-1, -0.5],
    [-1, -1],
    [-0.5, -1],
];
var SECA = 0xcd3003ca;
var SECB = 0x5b903a62;
var SECC = 0x1c267e56;
var SECD = 0x1921ba6f;
var SECE = 0x0000bc0e;
var PI2 = Math.PI * 2;
var DIRS_ANGLE = DIRS.length / PI2;
function flagsToSpeed(flags) {
    var state = flags & 240 /* PonyStateMask */;
    if (state === 32 /* PonyTrotting */) {
        return constants_1.PONY_SPEED_TROT;
    }
    else if (state === 16 /* PonyWalking */) {
        return constants_1.PONY_SPEED_WALK;
    }
    else {
        return 0;
    }
}
exports.flagsToSpeed = flagsToSpeed;
function dirToVector(dir) {
    var _a = DIRS[(dir | 0) % DIRS.length], x = _a[0], y = _a[1];
    return { x: x, y: y };
}
exports.dirToVector = dirToVector;
function vectorToDir(x, y) {
    var angle = Math.atan2(x, -y);
    return Math.round((angle < 0 ? angle + PI2 : angle) * DIRS_ANGLE) % DIRS.length;
}
exports.vectorToDir = vectorToDir;
exports.POSITION_MIN = 0;
exports.POSITION_MAX = 100000;
function encodeMovement(x, y, dir, flags, time, camera) {
    var pixelX = Math.floor(utils_1.clamp(x, exports.POSITION_MIN, exports.POSITION_MAX) * constants_1.tileWidth);
    var pixelY = Math.floor(utils_1.clamp(y, exports.POSITION_MIN, exports.POSITION_MAX) * constants_1.tileHeight);
    var camX = ((pixelX - camera.x) & 0xfff) >>> 0;
    var camY = ((pixelY - camera.y) & 0xfff) >>> 0;
    var camW = (camera.w & 0xfff) >>> 0;
    var camH = (camera.h & 0xfff) >>> 0;
    var a = pixelX | ((dir & 0xff) << 24);
    var b = pixelY | ((flags & 0xff) << 24);
    var c = time;
    var d = (camX << 20) | (camY << 8) | (camW >>> 4);
    var e = ((camW & 0xf) << 12) | camH;
    return [
        (a ^ SECA) >>> 0,
        (b ^ SECB) >>> 0,
        (c ^ SECC) >>> 0,
        (d ^ SECD) >>> 0,
        (e ^ SECE) >>> 0,
    ];
}
exports.encodeMovement = encodeMovement;
function decodeMovement(a, b, c, d, e) {
    a = (a >>> 0) ^ SECA;
    b = (b >>> 0) ^ SECB;
    c = (c >>> 0) ^ SECC;
    d = (d >>> 0) ^ SECD;
    e = (e >>> 0) ^ SECE;
    var pixelX = a & 0xffffff;
    var pixelY = b & 0xffffff;
    var x = positionUtils_1.toWorldX(pixelX + 0.5);
    var y = positionUtils_1.toWorldY(pixelY + 0.5);
    var dir = (a >>> 24) & 0xff;
    var flags = (b >>> 24) & 0xff;
    var time = c;
    var camX = pixelX - ((d >>> 20) & 0xfff);
    var camY = pixelY - ((d >>> 8) & 0xfff);
    var camW = ((d & 0xff) << 4) | ((e >>> 12) & 0xf);
    var camH = e & 0xfff;
    return { x: x, y: y, dir: dir, flags: flags, time: time, camera: rect_1.rect(camX, camY, camW, camH) };
}
exports.decodeMovement = decodeMovement;
function isMovingRight(vx, right) {
    return vx < 0 ? false : (vx > 0 ? true : right);
}
exports.isMovingRight = isMovingRight;
function shouldBeFacingRight(entity) {
    return isMovingRight(entity.vx, utils_1.hasFlag(entity.state, 2 /* FacingRight */));
}
exports.shouldBeFacingRight = shouldBeFacingRight;
