"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var worldMap_1 = require("./worldMap");
var positionUtils_1 = require("./positionUtils");
var mixins_1 = require("./mixins");
var compress_1 = require("./compress");
var min = Math.min, max = Math.max, floor = Math.floor;
function createRegion(x, y, tileData) {
    var size = constants_1.REGION_SIZE;
    var tiles = tileData ? compress_1.decompressTiles(tileData) : new Uint8Array(size * size);
    var tileIndices = new Int16Array(size * size);
    var randoms = new Uint8Array(size * size);
    // const elevation = new Uint8Array(size * size);
    var collider = new Uint8Array(size * size * constants_1.tileWidth * constants_1.tileHeight);
    if (!tileData) {
        tiles.fill(1 /* Dirt */);
    }
    tileIndices.fill(-1);
    for (var i = 0; i < randoms.length; i++) {
        randoms[i] = (Math.random() * 256) | 0;
    }
    return {
        x: x, y: y, tiles: tiles, tileIndices: tileIndices,
        randoms: randoms,
        // elevation,
        entities: [],
        colliders: [],
        collider: collider,
        colliderDirty: true,
        tilesDirty: true,
    };
}
exports.createRegion = createRegion;
function getRegionTile(region, x, y) {
    return region.tiles[x | (y << 3)];
}
exports.getRegionTile = getRegionTile;
function setRegionTile(region, x, y, type) {
    region.tiles[x | (y << 3)] = type;
}
exports.setRegionTile = setRegionTile;
function getRegionTileIndex(region, x, y) {
    return region.tileIndices[x | (y << 3)];
}
exports.getRegionTileIndex = getRegionTileIndex;
function setRegionTileDirty(region, x, y) {
    region.tileIndices[x | (y << 3)] = -1;
    region.tilesDirty = true;
}
exports.setRegionTileDirty = setRegionTileDirty;
function getRegionElevation(_region, _x, _y) {
    return 0; // region.elevation[x | (y << 3)];
}
exports.getRegionElevation = getRegionElevation;
function setRegionElevation(_region, _x, _y, _value) {
    // region.elevation[x | (y << 3)] = value;
}
exports.setRegionElevation = setRegionElevation;
function worldToRegionX(x, map) {
    return utils_1.clamp(floor(x / constants_1.REGION_SIZE), 0, map.regionsX - 1);
}
exports.worldToRegionX = worldToRegionX;
function worldToRegionY(y, map) {
    return utils_1.clamp(floor(y / constants_1.REGION_SIZE), 0, map.regionsY - 1);
}
exports.worldToRegionY = worldToRegionY;
function invalidateRegionsCollider(region, map) {
    var minY = max(0, region.y - 1);
    var maxY = min(map.regionsY - 1, region.y + 1);
    var minX = max(0, region.x - 1);
    var maxX = min(map.regionsX - 1, region.x + 1);
    for (var ry = minY; ry <= maxY; ry++) {
        for (var rx = minX; rx <= maxX; rx++) {
            var r = worldMap_1.getRegion(map, rx, ry);
            if (r) {
                r.colliderDirty = true;
            }
        }
    }
}
exports.invalidateRegionsCollider = invalidateRegionsCollider;
function generateRegionCollider(region, map) {
    var regionCollider = region.collider;
    var tileTypes = region.tiles;
    region.colliderDirty = false;
    regionCollider.fill(0);
    for (var ty = 0, i = 0; ty < constants_1.REGION_SIZE; ty++) {
        for (var tx = 0; tx < constants_1.REGION_SIZE; tx++, i++) {
            var type = tileTypes[i];
            if (type === 0 /* None */) {
                var x0 = (tx * constants_1.tileWidth) | 0;
                var y0 = (ty * constants_1.tileHeight) | 0;
                var x1 = (x0 + constants_1.tileWidth) | 0;
                var y1 = (y0 + constants_1.tileHeight) | 0;
                for (var y = y0; y < y1; y++) {
                    for (var x = x0; x < x1; x++) {
                        regionCollider[(x + ((y * constants_1.REGION_WIDTH) | 0)) | 0] = 3;
                    }
                }
            }
        }
    }
    var minY = max(0, region.y - 1);
    var maxY = min(map.regionsY - 1, region.y + 1);
    var minX = max(0, region.x - 1);
    var maxX = min(map.regionsX - 1, region.x + 1);
    var pBounds = mixins_1.ponyCollidersBounds;
    var pbX0 = pBounds.x | 0;
    var pbY0 = pBounds.y | 0;
    var pbX1 = (pbX0 + pBounds.w) | 0;
    var pbY1 = (pbY0 + pBounds.h) | 0;
    var baseX = region.x * constants_1.REGION_SIZE;
    var baseY = region.y * constants_1.REGION_SIZE;
    for (var ry = minY; ry <= maxY; ry++) {
        for (var rx = minX; rx <= maxX; rx++) {
            var r = worldMap_1.getRegion(map, rx, ry);
            if (r === undefined)
                continue;
            for (var _i = 0, _a = r.colliders; _i < _a.length; _i++) {
                var entity = _a[_i];
                var entityX = positionUtils_1.toScreenX(entity.x - baseX) | 0;
                var entityY = positionUtils_1.toScreenY(entity.y - baseY) | 0;
                var cBounds = entity.collidersBounds;
                var ecbX = entityX + cBounds.x;
                var ecbY = entityY + cBounds.y;
                if ((ecbX + pbX0) > constants_1.REGION_WIDTH || (ecbY + pbY0) > constants_1.REGION_HEIGHT ||
                    (ecbX + cBounds.w + pbX1) < 0 || (ecbY + cBounds.h + pbY1) < 0) {
                    continue;
                }
                for (var _b = 0, _c = entity.colliders; _b < _c.length; _b++) {
                    var c = _c[_b];
                    var value = (c.tall ? 3 : 1) | 0;
                    var baseX0 = (entityX + c.x) | 0;
                    var baseY0 = (entityY + c.y) | 0;
                    var baseX1 = (baseX0 + c.w) | 0;
                    var baseY1 = (baseY0 + c.h) | 0;
                    if (c.exact) {
                        var x0 = (baseX0 < 0 ? 0 : baseX0) | 0;
                        var y0 = (baseY0 < 0 ? 0 : baseY0) | 0;
                        var x1 = (baseX1 > constants_1.REGION_WIDTH ? constants_1.REGION_WIDTH : baseX1) | 0;
                        var y1 = (baseY1 > constants_1.REGION_HEIGHT ? constants_1.REGION_HEIGHT : baseY1) | 0;
                        if (x1 > x0 && y1 > y0) {
                            for (var y = y0 | 0; y < y1; y = (y + 1) | 0) {
                                var oy = (y * constants_1.REGION_WIDTH) | 0;
                                for (var x = x0 | 0; x < x1; x = (x + 1) | 0) {
                                    regionCollider[(x + oy) | 0] |= value;
                                }
                            }
                        }
                    }
                    else {
                        for (var _d = 0, ponyColliders_1 = mixins_1.ponyColliders; _d < ponyColliders_1.length; _d++) {
                            var pc = ponyColliders_1[_d];
                            var tx0 = (baseX0 + pc.x) | 0;
                            var ty0 = (baseY0 + pc.y) | 0;
                            var tx1 = (baseX1 + ((pc.x + pc.w) | 0)) | 0;
                            var ty1 = (baseY1 + ((pc.y + pc.h) | 0)) | 0;
                            var x0 = (tx0 < 0 ? 0 : tx0) | 0;
                            var y0 = (ty0 < 0 ? 0 : ty0) | 0;
                            var x1 = (tx1 > constants_1.REGION_WIDTH ? constants_1.REGION_WIDTH : tx1) | 0;
                            var y1 = (ty1 > constants_1.REGION_HEIGHT ? constants_1.REGION_HEIGHT : ty1) | 0;
                            if (x1 > x0 && y1 > y0) {
                                for (var y = y0 | 0; y < y1; y = (y + 1) | 0) {
                                    var oy = (y * constants_1.REGION_WIDTH) | 0;
                                    for (var x = x0 | 0; x < x1; x = (x + 1) | 0) {
                                        regionCollider[(x + oy) | 0] |= value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.generateRegionCollider = generateRegionCollider;
