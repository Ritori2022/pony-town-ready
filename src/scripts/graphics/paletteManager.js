"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var texture2d_1 = require("./webgl/texture2d");
var utils_1 = require("../common/utils");
var INITIAL_SIZE = 512;
var MAX_SIZE = 2048;
function createPalette(colors) {
    return { x: 0, y: 0, u: 0, v: 0, refs: 1, colors: colors };
}
exports.createPalette = createPalette;
function releasePalette(palette) {
    if (palette && palette.refs) {
        palette.refs--;
    }
}
exports.releasePalette = releasePalette;
function colorsEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.colorsEqual = colorsEqual;
function isInUse(palette) {
    return palette.refs > 0;
}
var PaletteManager = /** @class */ (function () {
    function PaletteManager(size) {
        if (size === void 0) { size = INITIAL_SIZE; }
        this.size = size;
        this.palettes = utils_1.times(512, function () { return []; });
        this.dirty = [];
        this.dirtyMinY = 0;
        this.dirtyMaxY = -1;
        this.lastX = 0;
        this.lastY = 0;
        this.initialized = true;
        this.deduplicate = true;
    }
    Object.defineProperty(PaletteManager.prototype, "texture", {
        get: function () {
            return this.paletteTexture;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaletteManager.prototype, "textureSize", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaletteManager.prototype, "pixelSize", {
        get: function () {
            return 256 / this.size;
        },
        enumerable: true,
        configurable: true
    });
    PaletteManager.prototype.activePalettes = function () {
        return this.palettes.reduce(function (sum, p) { return sum + p.reduce(function (sum, p) { return sum + (p.refs > 0 ? 1 : 0); }, 0); }, 0);
    };
    PaletteManager.prototype.add = function (colorValues) {
        var colors = new Uint32Array(colorValues.length);
        for (var i = 0; i < colorValues.length; i++) {
            colors[i] = colorValues[i] >>> 0;
        }
        return this.addArray(colors);
    };
    PaletteManager.prototype.addArray = function (colors) {
        var hash = utils_1.computeCRC(colors) & 0x1ff;
        var palettes = this.palettes[hash];
        if (this.deduplicate) {
            for (var i = 0; i < palettes.length; i++) {
                var existing = palettes[i];
                if (colorsEqual(existing.colors, colors)) {
                    existing.refs = (existing.refs + 1) | 0;
                    return existing;
                }
            }
        }
        var palette = createPalette(colors);
        palettes.push(palette);
        this.dirty.push(palette);
        return palette;
    };
    PaletteManager.prototype.commit = function (gl) {
        var changed = this.initialized;
        if (!this.paletteTexture) {
            this.initializeTexture(gl, this.size);
            changed = true;
        }
        if (this.dirty.length) {
            if (!this.arrange(this.dirty)) {
                this.cleanupPalettes();
                changed = true;
                while (!this.arrange(this.dirty)) {
                    if (this.size < MAX_SIZE) {
                        this.initializeTexture(gl, this.size * 2);
                    }
                    else {
                        throw new Error('Exceeded maximum palettes limit');
                    }
                }
            }
            this.updateTexture(gl);
            this.dirty = [];
        }
        this.initialized = false;
        return changed;
    };
    PaletteManager.prototype.init = function (gl) {
        this.initialized = true;
        this.paletteTexture = undefined;
        this.initializeTexture(gl, this.size);
    };
    PaletteManager.prototype.dispose = function (gl) {
        this.paletteTexture = texture2d_1.disposeTexture(gl, this.paletteTexture);
        for (var i = 0; i < this.palettes.length; i++) {
            if (this.palettes[i].length > 0) {
                this.palettes[i] = [];
            }
        }
        this.size = INITIAL_SIZE;
        this.resetPalettes();
    };
    PaletteManager.prototype.cleanup = function () {
        this.cleanupPalettes();
    };
    PaletteManager.prototype.resetPalettes = function () {
        this.dirty = utils_1.flatten(this.palettes);
        this.lastX = 0;
        this.lastY = 0;
    };
    PaletteManager.prototype.cleanupPalettes = function () {
        var palettes = this.palettes;
        for (var i = 0; i < palettes.length; i++) {
            if (palettes[i].length > 0) {
                palettes[i] = palettes[i].filter(isInUse);
            }
        }
        this.resetPalettes();
    };
    PaletteManager.prototype.initializeTexture = function (gl, size) {
        try {
            if (!this.paletteTexture) {
                this.paletteTexture = texture2d_1.createEmptyTexture(gl, size, size, gl.RGBA, gl.UNSIGNED_BYTE);
            }
            else if (this.paletteTexture.width !== size) {
                texture2d_1.resizeTexture(gl, this.paletteTexture, size, size);
            }
        }
        catch (e) {
            throw new Error("Failed to create/resize texture (" + size + ") " + e.stack);
        }
        this.size = size;
        this.resetPalettes();
    };
    PaletteManager.prototype.arrange = function (palettes) {
        if (!palettes.length) {
            return true;
        }
        var size = this.size | 0;
        var x = this.lastX | 0;
        var y = this.lastY | 0;
        var minY = -1;
        var maxY = -1;
        for (var i = 0; i < palettes.length; i++) {
            var p = palettes[i];
            var colorCount = p.colors.length | 0;
            if ((size - x) < colorCount) {
                x = 0;
                y++;
                if (y >= size) {
                    return false;
                }
            }
            p.x = x;
            p.y = y;
            p.u = (x + 0.5) / size;
            p.v = (y + 0.5) / size;
            x = (x + colorCount) | 0;
            minY = minY === -1 ? y : minY;
            maxY = Math.max(maxY, y);
        }
        this.lastX = x;
        this.lastY = y;
        this.dirtyMinY = minY;
        this.dirtyMaxY = maxY;
        return true;
    };
    PaletteManager.prototype.updateTexture = function (gl) {
        if (!this.paletteTexture || this.dirtyMinY > this.dirtyMaxY)
            return;
        var width = this.size;
        var height = (this.dirtyMaxY - this.dirtyMinY) + 1;
        var data = new Uint8Array(width * height * 4);
        for (var k = 0; k < this.palettes.length; k++) {
            var palettes = this.palettes[k];
            for (var i = 0; i < palettes.length; i++) {
                var _a = palettes[i], x = _a.x, y = _a.y, colors = _a.colors;
                if (y < this.dirtyMinY || y > this.dirtyMaxY)
                    continue;
                var offset = (x + (y - this.dirtyMinY) * width) << 2;
                for (var j = 0; j < colors.length; j++) {
                    var c = colors[j];
                    data[offset++] = (c >>> 24) & 0xff;
                    data[offset++] = (c >>> 16) & 0xff;
                    data[offset++] = (c >>> 8) & 0xff;
                    data[offset++] = (c >>> 0) & 0xff;
                }
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture.handle);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, this.dirtyMinY, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);
        this.dirtyMinY = 0;
        this.dirtyMaxY = -1;
    };
    return PaletteManager;
}());
exports.PaletteManager = PaletteManager;
