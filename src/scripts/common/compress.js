"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_js_1 = require("base64-js");
var bitUtils_1 = require("./bitUtils");
var constants_1 = require("./constants");
function getBitsForNumber(value) {
    var bits = 0;
    var max = value - 1;
    while (max > 0) {
        bits++;
        max >>= 1;
    }
    return bits;
}
function compressTiles(tiles) {
    var types = [];
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (types.indexOf(tile) === -1) {
            types.push(tile);
        }
    }
    var bitsPerTile = getBitsForNumber(types.length);
    var bitsPerRun = 4;
    return bitUtils_1.bitWriter(function (write) {
        write(types.length, 8);
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            write(type, 8);
        }
        if (types.length > 1) {
            for (var i = 0; i < tiles.length; i++) {
                var value = tiles[i];
                var count = 1;
                if (i === (tiles.length - 1)) {
                    write(count | 8, bitsPerRun);
                    write(types.indexOf(value), bitsPerTile);
                }
                else {
                    i++;
                    if (value === tiles[i]) {
                        while (i < tiles.length && count < 7 && tiles[i] === value) {
                            i++;
                            count++;
                        }
                        i--;
                        write(count, bitsPerRun);
                        write(types.indexOf(value), bitsPerTile);
                    }
                    else {
                        var last = tiles[i];
                        var last2 = last;
                        var pushLast = true;
                        var values = [value];
                        count++;
                        for (i++; i < tiles.length; i++) {
                            last2 = tiles[i];
                            if (last2 === last) {
                                i -= 2;
                                count--;
                                pushLast = false;
                                break;
                            }
                            else if (count === 7) {
                                i -= 1;
                                break;
                            }
                            else {
                                values.push(last);
                                count++;
                                last = last2;
                            }
                        }
                        write(count | 8, bitsPerRun);
                        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
                            var v = values_1[_a];
                            write(types.indexOf(v), bitsPerTile);
                        }
                        if (pushLast) {
                            write(types.indexOf(last), bitsPerTile);
                        }
                    }
                }
            }
        }
    });
}
exports.compressTiles = compressTiles;
function decompressTiles(data) {
    var size = constants_1.REGION_SIZE * constants_1.REGION_SIZE;
    var result = new Uint8Array(size);
    var read = bitUtils_1.bitReader(data);
    var typesCount = read(8);
    var types = [];
    for (var i = 0; i < typesCount; i++) {
        types.push(read(8));
    }
    if (types.length === 1) {
        result.fill(types[0]);
    }
    else {
        var bitsPerTile = getBitsForNumber(typesCount);
        var bitsPerRun = 4;
        for (var i = 0; i < size;) {
            var value = read(bitsPerRun);
            if ((value & 8) === 0) {
                var count = value;
                var entry = read(bitsPerTile);
                for (var j = 0; j < count; j++) {
                    result[i] = types[entry];
                    i++;
                }
            }
            else {
                var count = value & 7;
                for (var j = 0; j < count; j++) {
                    result[i] = types[read(bitsPerTile)];
                    i++;
                }
            }
        }
    }
    return result;
}
exports.decompressTiles = decompressTiles;
function deserializeTiles(tiles) {
    var decodedTiles = base64_js_1.toByteArray(tiles);
    var result = [];
    for (var i = 0; i < decodedTiles.length; i += 2) {
        var count = decodedTiles[i];
        var tile = decodedTiles[i + 1];
        while (count > 0) {
            result.push(tile);
            count--;
        }
    }
    return result;
}
exports.deserializeTiles = deserializeTiles;
