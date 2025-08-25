"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var positionUtils_1 = require("./positionUtils");
var worldMap_1 = require("./worldMap");
var constants_1 = require("./constants");
var entityUtils_1 = require("./entityUtils");
var isCollidingCount = 0;
var isCollidingObjectCount = 0;
function getCollisionStats() {
    var stats = { isCollidingCount: isCollidingCount, isCollidingObjectCount: isCollidingObjectCount };
    isCollidingCount = 0;
    isCollidingObjectCount = 0;
    return stats;
}
exports.getCollisionStats = getCollisionStats;
function isOutsideMap(x, y, map) {
    return x < 0 || y < 0 || x >= map.width || y >= map.height;
}
exports.isOutsideMap = isOutsideMap;
function canCollideWith(entity) {
    return (entity.flags & 128 /* CanCollideWith */) !== 0;
}
exports.canCollideWith = canCollideWith;
function isStaticCollision(entity, map, forceOnGround) {
    if (forceOnGround === void 0) { forceOnGround = false; }
    if (DEVELOPMENT && entity.type !== constants_1.PONY_TYPE) {
        console.error("isStaticCollision: non-pony entity");
    }
    var flying = !forceOnGround && entityUtils_1.isInTheAir(entity);
    return isPonyColliding(entity.x, entity.y, map, flying);
}
exports.isStaticCollision = isStaticCollision;
function fixCollision(entity, map) {
    if (DEVELOPMENT && entity.type !== constants_1.PONY_TYPE) {
        console.error("fixCollision: non-pony entity");
    }
    var flying = entityUtils_1.isInTheAir(entity);
    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var tx = entity.x + x;
            var ty = entity.y + y;
            if (!isPonyColliding(tx, ty, map, flying)) {
                entity.x += x;
                entity.y += y;
                return true;
            }
        }
    }
    return false;
}
exports.fixCollision = fixCollision;
function isPonyColliding(x, y, map, flying) {
    if (isOutsideMap(x, y, map)) {
        return true;
    }
    var region = worldMap_1.getRegionGlobal(map, x, y);
    if (region === undefined) {
        return true;
    }
    var rx = utils_1.clamp(Math.floor((x - region.x * constants_1.REGION_SIZE) * constants_1.tileWidth), 0, constants_1.REGION_WIDTH);
    var ry = utils_1.clamp(Math.floor((y - region.y * constants_1.REGION_SIZE) * constants_1.tileHeight), 0, constants_1.REGION_HEIGHT);
    var pixel = region.collider[rx + ry * constants_1.REGION_WIDTH];
    var mask = flying ? 2 : 1;
    return (pixel & mask) !== 0;
}
function isColliding(x, y, mask, map) {
    if (x < 0 || x >= (map.width * constants_1.tileWidth) || y < 0 || y >= (map.height * constants_1.tileHeight)) {
        return true;
    }
    else {
        var regionX = (x / constants_1.REGION_WIDTH) | 0;
        var regionY = (y / constants_1.REGION_HEIGHT) | 0;
        var region = map.regions[regionX + regionY * map.regionsX];
        if (region === undefined) {
            return true;
        }
        else {
            var insideX = (x % constants_1.REGION_WIDTH) | 0;
            var insideY = (y % constants_1.REGION_HEIGHT) | 0;
            return (region.collider[insideX + insideY * constants_1.REGION_WIDTH] & mask) !== 0;
        }
    }
}
function updatePosition(entity, delta, map) {
    var ex = entity.x;
    var ey = entity.y;
    var speed = (!entityUtils_1.isFlying(entity) && worldMap_1.isInWaterAt(map, ex, ey)) ? 0.5 : 1.0;
    var destX = ex + entity.vx * speed * delta;
    var destY = ey + entity.vy * speed * delta;
    if ((entity.flags & 64 /* CanCollide */) === 0) {
        entity.x = destX;
        entity.y = destY;
        return;
    }
    if (DEVELOPMENT && entity.type !== constants_1.PONY_TYPE) {
        console.error("updatePosition: non-pony entity");
    }
    var flying = entityUtils_1.isInTheAir(entity);
    var mask = flying ? 2 : 1;
    var srcX = ex * constants_1.tileWidth;
    var srcY = ey * constants_1.tileHeight;
    var dstX = destX * constants_1.tileWidth;
    var dstY = destY * constants_1.tileHeight;
    var x0 = Math.floor(srcX) | 0;
    var y0 = Math.floor(srcY) | 0;
    var x1 = Math.floor(dstX) | 0;
    var y1 = Math.floor(dstY) | 0;
    var minX = Math.min(x0, x1) | 0;
    var maxX = Math.max(x0, x1) | 0;
    var minY = Math.min(y0, y1) | 0;
    var maxY = Math.max(y0, y1) | 0;
    var x = x0 | 0;
    var y = y0 | 0;
    var actualX = x | 0;
    var actualY = y | 0;
    if (isColliding(actualX, actualY, mask, map)) {
        if (!isOutsideMap(destX, destY, map)) {
            entity.x = destX;
            entity.y = destY;
        }
        return;
    }
    var a = (dstY - srcY) / (dstX - srcX);
    var b = srcY - a * srcX;
    var useGt = srcY < dstY;
    var stepXT = 0 | 0, stepYT = 0 | 0;
    var stepXF = 0 | 0, stepYF = 0 | 0;
    var ox = 0, oy = 0;
    var shiftRight = srcX <= dstX;
    var shiftLeft = srcX >= dstX;
    var shiftUp = srcY >= dstY;
    var shiftDown = srcY <= dstY;
    var horizontalOrVertical = srcX === dstX || srcY === dstY;
    if (srcX < dstX) {
        if (srcY < dstY) {
            ox = 1;
            oy = 1;
            stepYT = 1 | 0;
            stepXF = 1 | 0;
        }
        else {
            ox = 1;
            stepYT = -1 | 0;
            stepXF = 1 | 0;
        }
    }
    else if (srcX > dstX) {
        if (srcY < dstY) {
            oy = 1;
            stepYT = 1 | 0;
            stepXF = -1 | 0;
        }
        else {
            stepYT = -1 | 0;
            stepXF = -1 | 0;
        }
    }
    else {
        if (srcY < dstY) {
            stepYF = stepYT = 1 | 0;
        }
        else {
            stepYF = stepYT = -1 | 0;
        }
    }
    var steps = 1000;
    for (; steps; steps--) {
        var fx = a * (x + ox) + b;
        var fy = y + oy;
        var tx = 0 | 0;
        var ty = 0 | 0;
        if (useGt ? (fx > fy) : (fx < fy)) {
            tx = (tx + stepXT) | 0;
            ty = (ty + stepYT) | 0;
        }
        else {
            tx = (tx + stepXF) | 0;
            ty = (ty + stepYF) | 0;
        }
        x = (x + tx) | 0;
        y = (y + ty) | 0;
        if (x < minX || x > maxX || y < minY || y > maxY) {
            break;
        }
        var actualNX = (actualX + tx) | 0;
        var actualNY = (actualY + ty) | 0;
        var collides = isColliding(actualNX, actualNY, mask, map);
        var canMove = false;
        if (collides) {
            if (tx !== 0) {
                var canShiftUp = false;
                var canShiftDown = false;
                if (shiftUp && (canShiftUp = !isColliding(actualX, actualY - 1, mask, map)) &&
                    !isColliding(actualNX, actualY - 1, mask, map)) {
                    actualNX = actualX;
                    actualNY -= 1;
                    dstY -= 1;
                    collides = false;
                }
                else if (shiftDown && (canShiftDown = !isColliding(actualX, actualY + 1, mask, map)) &&
                    !isColliding(actualNX, actualY + 1, mask, map)) {
                    actualNX = actualX;
                    actualNY += 1;
                    dstY += 1;
                    collides = false;
                }
                else if (shiftUp && canShiftUp && !isColliding(actualNX, actualY - 2, mask, map)) {
                    actualNX = actualX;
                    actualNY -= 1;
                    dstY -= 1;
                    collides = false;
                }
                else if (shiftDown && canShiftDown && !isColliding(actualNX, actualY + 2, mask, map)) {
                    actualNX = actualX;
                    actualNY += 1;
                    dstY += 1;
                    collides = false;
                }
                canMove = canShiftUp || canShiftDown;
            }
            else {
                var canShiftLeft = false;
                var canShiftRight = false;
                if (shiftLeft && (canShiftLeft = !isColliding(actualX - 1, actualY, mask, map)) &&
                    !isColliding(actualX - 1, actualNY, mask, map)) {
                    actualNX -= 1;
                    actualNY = actualY;
                    dstX -= 1;
                    collides = false;
                }
                else if (shiftRight && (canShiftRight = !isColliding(actualX + 1, actualY, mask, map)) &&
                    !isColliding(actualX + 1, actualNY, mask, map)) {
                    actualNX += 1;
                    actualNY = actualY;
                    dstX += 1;
                    collides = false;
                }
                else if (shiftLeft && canShiftLeft && !isColliding(actualX - 2, actualNY, mask, map)) {
                    actualNX -= 1;
                    actualNY = actualY;
                    dstX -= 1;
                    collides = false;
                }
                else if (shiftRight && canShiftRight && !isColliding(actualX + 2, actualNY, mask, map)) {
                    actualNX += 1;
                    actualNY = actualY;
                    dstX += 1;
                    collides = false;
                }
                canMove = canShiftLeft || canShiftRight;
            }
        }
        if (!collides) {
            actualX = actualNX;
            actualY = actualNY;
        }
        else if (!canMove || horizontalOrVertical) {
            break;
        }
    }
    var epsilon = 1 / 1024;
    var left = Math.min(x0, actualX);
    var right = Math.max(x0 + 1, actualX + 1) - epsilon;
    var top = Math.min(y0, actualY);
    var bottom = Math.max(y0 + 1, actualY + 1) - epsilon;
    entity.x = positionUtils_1.toWorldX(utils_1.clamp(dstX, left, right));
    entity.y = positionUtils_1.toWorldY(utils_1.clamp(dstY, top, bottom));
    if (DEVELOPMENT && steps <= 0) {
        console.error('Overflow collision steps');
    }
}
exports.updatePosition = updatePosition;
