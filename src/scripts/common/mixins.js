"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var sprites = require("../generated/sprites");
var interfaces_1 = require("./interfaces");
var utils_1 = require("./utils");
var colors_1 = require("./colors");
var positionUtils_1 = require("./positionUtils");
var rect_1 = require("./rect");
var constants_1 = require("./constants");
var ponyInfo_1 = require("./ponyInfo");
var paletteManager_1 = require("../graphics/paletteManager");
var predefinedSteps = [
    [],
    [1],
    [3, 1],
    [3, 2, 1],
    [4, 2, 1, 1],
    [5, 3, 2, 1, 1],
    [9, 5, 3, 2, 1, 1],
    [14, 9, 5, 3, 2, 1, 1],
];
var paletteManager;
function createPalette(palette) {
    return palette && paletteManager && paletteManager.addArray(palette);
}
exports.createPalette = createPalette;
function setPaletteManager(manager) {
    paletteManager = manager;
}
exports.setPaletteManager = setPaletteManager;
function fakePaletteManager(action) {
    var tempPaletteManager = paletteManager;
    paletteManager = ponyInfo_1.mockPaletteManager;
    var result = action();
    paletteManager = tempPaletteManager;
    return result;
}
exports.fakePaletteManager = fakePaletteManager;
function getBounds(sprite, ox, oy) {
    return sprite ? rect_1.rect(sprite.ox + ox, sprite.oy + oy, sprite.w, sprite.h) : rect_1.rect(0, 0, 0, 0);
}
function getRenderableBounds(_a, dx, dy) {
    var color = _a.color, shadow = _a.shadow;
    if (color && shadow) {
        return rect_1.addRects(getBounds(color, -dx, -dy), getBounds(shadow, -dx, -dy));
    }
    else if (color) {
        return getBounds(color, -dx, -dy);
    }
    else if (shadow) {
        return getBounds(shadow, -dx, -dy);
    }
    else {
        return rect_1.rect(0, 0, 0, 0);
    }
}
exports.getRenderableBounds = getRenderableBounds;
function getBoundsForFrames(frames, dx, dy) {
    return frames.reduce(function (bounds, f) { return f ? rect_1.addRects(bounds, getBounds(f, dx, dy)) : bounds; }, rect_1.rect(0, 0, 0, 0));
}
function pickable(pickableX, pickableY) {
    return { pickableX: pickableX, pickableY: pickableY };
}
exports.pickable = pickable;
function mixPickable(pickableX, pickableY) {
    return function (base) {
        base.pickableX = pickableX;
        base.pickableY = pickableY;
    };
}
exports.mixPickable = mixPickable;
function mixTrigger(tileX, tileY, tileW, tileH, tall) {
    var x = positionUtils_1.toWorldX(tileX);
    var y = positionUtils_1.toWorldY(tileY);
    var w = positionUtils_1.toWorldX(tileW);
    var h = positionUtils_1.toWorldY(tileH);
    var bounds = rect_1.rect(x, y, w, h);
    return function (base) {
        base.triggerBounds = bounds;
        base.triggerTall = tall;
        base.triggerOn = false;
    };
}
exports.mixTrigger = mixTrigger;
function collider(x, y, w, h, tall, exact) {
    if (tall === void 0) { tall = true; }
    if (exact === void 0) { exact = false; }
    return { x: x, y: y, w: w, h: h, tall: tall, exact: exact };
}
exports.collider = collider;
exports.ponyColliders = roundedColliderList(-12, -4, 25, 7, 2);
exports.ponyCollidersBounds = getColliderBounds(exports.ponyColliders);
function getColliderBounds(colliders) {
    var bounds = rect_1.rect(0, 0, 0, 0);
    for (var _i = 0, colliders_1 = colliders; _i < colliders_1.length; _i++) {
        var collider_1 = colliders_1[_i];
        rect_1.addRect(bounds, collider_1);
    }
    return bounds;
}
function roundedColliderList(x, y, w, h, stepsCount, tall) {
    if (tall === void 0) { tall = true; }
    var list = [];
    var steps = predefinedSteps[stepsCount];
    if (DEVELOPMENT && !steps) {
        console.error('Invalid step count', steps);
    }
    for (var i = 0; i < steps.length; i++) {
        list.push(collider(x + steps[i], y + i, w - steps[i] * 2, 1, tall));
    }
    list.push(collider(x, y + steps.length, w, h - steps.length * 2, tall));
    for (var i = 0; i < steps.length; i++) {
        var ii = steps.length - (i + 1);
        list.push(collider(x + steps[ii], y + h - steps.length + i, w - steps[ii] * 2, 1, tall));
    }
    return list;
}
function mixColliderRect(x, y, w, h, tall, exact) {
    if (tall === void 0) { tall = true; }
    if (exact === void 0) { exact = false; }
    return mixColliders(collider(x, y, w, h, tall, exact));
}
exports.mixColliderRect = mixColliderRect;
function mixColliderRounded(x, y, w, h, stepsCount, tall) {
    if (tall === void 0) { tall = true; }
    return mixColliders.apply(void 0, roundedColliderList(x, y, w, h, stepsCount, tall));
}
exports.mixColliderRounded = mixColliderRounded;
function mixColliders() {
    var list = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        list[_i] = arguments[_i];
    }
    var bounds = getColliderBounds(list);
    return function (base) {
        base.flags |= 128 /* CanCollideWith */;
        base.colliders = list;
        base.collidersBounds = bounds;
    };
}
exports.mixColliders = mixColliders;
function taperColliderSE(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = w - 2; iy < h; iy++, ix -= ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x + ix, y + iy, w - ix, 1, tall));
    }
    return colliders;
}
exports.taperColliderSE = taperColliderSE;
function taperColliderSW(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = w - 2; iy < h; iy++, ix -= ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x, y + iy, w - ix, 1, tall));
    }
    return colliders;
}
exports.taperColliderSW = taperColliderSW;
function taperColliderNW(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x, y + iy, w - ix, 1, tall));
    }
    return colliders;
}
exports.taperColliderNW = taperColliderNW;
function taperColliderNE(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x + ix, y + iy, w - ix, 1, tall));
    }
    return colliders;
}
exports.taperColliderNE = taperColliderNE;
function skewColliderNW(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x - ix, y + iy, w, 1, tall));
    }
    return colliders;
}
exports.skewColliderNW = skewColliderNW;
function skewColliderNE(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x + ix, y + iy, w, 1, tall));
    }
    return colliders;
}
exports.skewColliderNE = skewColliderNE;
function triangleColliderNW(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x - ix, y + iy, w + ix, 1, tall));
    }
    return colliders;
}
exports.triangleColliderNW = triangleColliderNW;
function triangleColliderNE(x, y, w, h, tall) {
    var colliders = [];
    for (var iy = 0, ix = 2; iy < h; iy++, ix += ((iy % 3) ? 1 : 2)) {
        colliders.push(collider(x, y + iy, w + ix, 1, tall));
    }
    return colliders;
}
exports.triangleColliderNE = triangleColliderNE;
function mixInteract(x, y, w, h, interactRange) {
    var interactBounds = rect_1.rect(x, y, w, h);
    return function (base) {
        base.flags |= 256 /* Interactive */;
        base.interactBounds = interactBounds;
        base.interactRange = interactRange;
    };
}
exports.mixInteract = mixInteract;
function mixInteractAt(interactRange) {
    return function (base) {
        base.flags |= 256 /* Interactive */;
        base.interactRange = interactRange;
    };
}
exports.mixInteractAt = mixInteractAt;
function mixMinimap(color, rect, order) {
    if (order === void 0) { order = 1; }
    var minimap = { color: color, rect: rect, order: order };
    return function (base) { return base.minimap = minimap; };
}
exports.mixMinimap = mixMinimap;
function mixAnimation(anim, fps, dx, dy, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.color, color = _c === void 0 ? colors_1.WHITE : _c, _d = _b.repeat, repeat = _d === void 0 ? true : _d, animations = _b.animations, lightSprite = _b.lightSprite, useGameTime = _b.useGameTime, _e = _b.flipped, flipped = _e === void 0 ? false : _e;
    var bounds = getBoundsForFrames(anim.frames, -dx, -dy);
    var lightSpriteBounds = lightSprite ? getBoundsForFrames(lightSprite.frames, -dx, -dy) : rect_1.rect(0, 0, 0, 0);
    if (SERVER && !TESTS) {
        return function (base) { return base.bounds = bounds; };
    }
    return function (base) {
        var defaultPalette = anim.shadow && createPalette(sprites.defaultPalette);
        var palette = createPalette(anim.palette);
        var time = repeat ? Math.random() * 5 : 0;
        var animation = 0;
        var lastFrame = 0;
        var getFrame = function (options) {
            var frameNumber = Math.floor(time * fps);
            if (useGameTime) {
                frameNumber = Math.floor((options.gameTime / 1000) * fps);
            }
            if (animations) {
                if (repeat) {
                    frameNumber = frameNumber % animations[animation].length;
                }
                return utils_1.at(animations[animation], frameNumber) || 0;
            }
            else {
                return repeat ? (frameNumber % anim.frames.length) : Math.min(frameNumber, anim.frames.length - 1);
            }
        };
        base.bounds = bounds;
        base.palettes = [];
        defaultPalette && base.palettes.push(defaultPalette);
        palette && base.palettes.push(palette);
        base.update = function (delta) {
            time += delta;
            var anim = interfaces_1.getAnimationFromEntityState(this.state);
            if (animations && anim !== animation) {
                animation = anim;
                time = 0;
            }
            var frameNumber = Math.floor(time * fps);
            if (lastFrame !== frameNumber) {
                lastFrame = frameNumber;
                return true;
            }
            else {
                return false;
            }
        };
        base.draw = function (batch, options) {
            var frame = getFrame(options);
            var frameSprite = anim.frames[frame];
            var x = positionUtils_1.toScreenX(this.x);
            var y = positionUtils_1.toScreenYWithZ(this.y, this.z);
            batch.save();
            batch.translate(x, y);
            if (utils_1.hasFlag(this.state, 2 /* FacingRight */) || flipped) {
                batch.scale(-1, 1);
            }
            batch.translate(-dx, -dy);
            anim.shadow && batch.drawSprite(anim.shadow, options.shadowColor, defaultPalette, 0, 0);
            frameSprite && batch.drawSprite(frameSprite, color, palette, 0, 0);
            batch.restore();
        };
        if (lightSprite) {
            base.lightSpriteColor = colors_1.WHITE;
            base.lightSpriteBounds = lightSpriteBounds;
            base.drawLightSprite = function (batch, options) {
                var frame = getFrame(options);
                var frameSprite = lightSprite.frames[frame];
                var x = positionUtils_1.toScreenX(this.x);
                var y = positionUtils_1.toScreenYWithZ(this.y, this.z);
                batch.save();
                batch.translate(x, y);
                if (utils_1.hasFlag(this.state, 2 /* FacingRight */) || flipped) {
                    batch.scale(-1, 1);
                }
                batch.translate(-dx, -dy);
                batch.drawSprite(frameSprite, this.lightSpriteColor, 0, 0);
                batch.restore();
            };
        }
    };
}
exports.mixAnimation = mixAnimation;
function mixDrawWindow(sprite, dx, dy, paletteIndex, padLeft, padTop, padRight, padBottom) {
    var bounds = getRenderableBounds(sprite, dx, dy);
    return function (base) {
        base.bounds = bounds;
        if (!SERVER || TESTS) {
            var defaultPalette_1 = sprite.shadow && createPalette(sprites.defaultPalette);
            var palette_1 = createPalette(utils_1.att(sprite.palettes, paletteIndex));
            base.palettes = [];
            defaultPalette_1 && base.palettes.push(defaultPalette_1);
            palette_1 && base.palettes.push(palette_1);
            base.draw = function (batch, options) {
                var baseX = positionUtils_1.toScreenX(this.x + (this.ox || 0));
                var baseY = positionUtils_1.toScreenYWithZ(this.y + (this.oy || 0), this.z + (this.oz || 0));
                var x = baseX - dx;
                var y = baseY - dy;
                if (sprite.shadow !== undefined) {
                    batch.drawSprite(sprite.shadow, options.shadowColor, defaultPalette_1, x, y);
                }
                if (sprite.color !== undefined) {
                    batch.drawRect(options.lightColor, x + padLeft, y + padTop, sprite.color.w - (padLeft + padRight), sprite.color.h - (padTop + padBottom));
                    batch.drawSprite(sprite.color, colors_1.WHITE, palette_1, x, y);
                }
            };
        }
    };
}
exports.mixDrawWindow = mixDrawWindow;
function mixDraw(sprite, dx, dy, paletteIndex) {
    if (paletteIndex === void 0) { paletteIndex = 0; }
    var bounds = getRenderableBounds(sprite, dx, dy);
    return function (base) {
        base.bounds = bounds;
        if (!SERVER || TESTS) {
            var defaultPalette_2 = sprite.shadow && createPalette(sprites.defaultPalette);
            var palette_2 = createPalette(utils_1.att(sprite.palettes, paletteIndex));
            base.palettes = [];
            defaultPalette_2 && base.palettes.push(defaultPalette_2);
            palette_2 && base.palettes.push(palette_2);
            base.draw = function (batch, options) {
                var x = positionUtils_1.toScreenX(this.x + (this.ox || 0)) - dx;
                var y = positionUtils_1.toScreenYWithZ(this.y + (this.oy || 0), this.z + (this.oz || 0)) - dy;
                var opacity = 1 - 0.6 * (this.coverLifting || 0);
                if (sprite.shadow !== undefined) {
                    batch.drawSprite(sprite.shadow, options.shadowColor, defaultPalette_2, x, y);
                }
                batch.globalAlpha = opacity;
                if (sprite.color !== undefined) {
                    batch.drawSprite(sprite.color, colors_1.WHITE, palette_2, x, y);
                }
                batch.globalAlpha = 1;
            };
        }
    };
}
exports.mixDraw = mixDraw;
function addBounds(bounds, setup) {
    rect_1.addRect(bounds, getRenderableBounds(setup.sprite, setup.dx, setup.dy));
}
function mixDrawSeasonal(setup) {
    var bounds = rect_1.rect(0, 0, 0, 0);
    var summer = setup.summer;
    var autumn = __assign({}, summer, setup.autumn);
    var winter = __assign({}, summer, setup.winter);
    var spring = __assign({}, summer, setup.spring);
    addBounds(bounds, summer);
    addBounds(bounds, autumn);
    addBounds(bounds, winter);
    addBounds(bounds, spring);
    return function (base, _, worldState) {
        base.bounds = bounds;
        if (!SERVER || TESTS) {
            var season_1 = 1 /* Summer */;
            var _a = setup.summer, sprite_1 = _a.sprite, dx_1 = _a.dx, dy_1 = _a.dy, paletteIndex_1 = _a.palette;
            var defaultPalette_3 = undefined;
            var palette_3 = undefined;
            var setupSeason_1 = function (newSeason) {
                season_1 = newSeason;
                var set;
                switch (season_1) {
                    case 1 /* Summer */:
                        set = summer;
                        break;
                    case 2 /* Autumn */:
                        set = autumn;
                        break;
                    case 4 /* Winter */:
                        set = winter;
                        break;
                    case 8 /* Spring */:
                        set = spring;
                        break;
                    default:
                        utils_1.invalidEnum(season_1);
                        return;
                }
                sprite_1 = set.sprite;
                dx_1 = set.dx;
                dy_1 = set.dy;
                paletteIndex_1 = set.palette;
                if (base.palettes) {
                    for (var _i = 0, _a = base.palettes; _i < _a.length; _i++) {
                        var palette_4 = _a[_i];
                        paletteManager_1.releasePalette(palette_4);
                    }
                }
                defaultPalette_3 = sprite_1.shadow && createPalette(sprites.defaultPalette);
                palette_3 = createPalette(utils_1.att(sprite_1.palettes, paletteIndex_1));
                base.palettes = [];
                defaultPalette_3 && base.palettes.push(defaultPalette_3);
                palette_3 && base.palettes.push(palette_3);
            };
            setupSeason_1(worldState.season);
            base.draw = function (batch, options) {
                var x = positionUtils_1.toScreenX(this.x + (this.ox || 0)) - dx_1;
                var y = positionUtils_1.toScreenYWithZ(this.y + (this.oy || 0), this.z + (this.oz || 0)) - dy_1;
                var opacity = 1 - 0.6 * (this.coverLifting || 0);
                if (sprite_1.shadow !== undefined) {
                    batch.drawSprite(sprite_1.shadow, options.shadowColor, defaultPalette_3, x, y);
                }
                batch.globalAlpha = opacity;
                if (sprite_1.color !== undefined) {
                    batch.drawSprite(sprite_1.color, colors_1.WHITE, palette_3, x, y);
                }
                batch.globalAlpha = 1;
                if (season_1 !== options.season) {
                    setupSeason_1(options.season);
                }
            };
        }
    };
}
exports.mixDrawSeasonal = mixDrawSeasonal;
function splitSprite(sprite, x, w, h) {
    var result = [];
    for (var y = 0; y < sprite.h; y += h) {
        result.push({ x: sprite.x + x, y: sprite.y + y, w: w, h: h, ox: sprite.ox, oy: sprite.oy, type: sprite.type });
    }
    return result;
}
var poles = [
    { sprite: sprites.direction_pole_3, dy: -39 },
    { sprite: sprites.direction_pole_4, dy: -50 },
    { sprite: sprites.direction_pole_5, dy: -61 },
];
var shadowLeft = sprites.direction_shadow_left.shadow;
var shadowRight = sprites.direction_shadow_right.shadow;
var leftSprites = splitSprite(sprites.direction_left_right.color, 0, 17, 10);
var rightSprites = splitSprite(sprites.direction_left_right.color, 17, 17, 10);
var dirUpDown = [
    {
        shadowUp: sprites.direction_shadow_up_left.shadow,
        shadowDown: sprites.direction_shadow_down_right.shadow,
        spriteUp: sprites.direction_up_left.color,
        spriteDown: sprites.direction_down_right.color,
        shadowUpDX: -6, shadowUpDY: -9,
        shadowDownDX: -1, shadowDownDY: 3,
        upDX: -6, upDY: -7,
        downDX: -1, downDY: 5,
    },
    {
        shadowUp: sprites.direction_shadow_up_right.shadow,
        shadowDown: sprites.direction_shadow_down_left.shadow,
        spriteUp: sprites.direction_up_right.color,
        spriteDown: sprites.direction_down_left.color,
        shadowUpDX: 1, shadowUpDY: -9,
        shadowDownDX: -4, shadowDownDY: 3,
        upDX: 1, upDY: -7,
        downDX: -5, downDY: 4,
    },
];
function mixDrawDirectionSign() {
    var poleDX = -4;
    var leftDX = -20;
    var rightDX = 3;
    var plateDY = 2;
    var leftRightStep = 11;
    var upDownStep = 11;
    return function (base, options) {
        if (options === void 0) { options = {}; }
        var _a = options.sign, _b = _a === void 0 ? {} : _a, _c = _b.r, r = _c === void 0 ? 0 : _c, _d = _b.w, w = _d === void 0 ? [] : _d, _e = _b.e, e = _e === void 0 ? [] : _e, _f = _b.s, s = _f === void 0 ? [] : _f, _g = _b.n, n = _g === void 0 ? [] : _g;
        var max = lodash_1.clamp(Math.max(w.length, e.length, s.length, n.length), 3, 5);
        var boundsH = 7 + max * 11;
        base.bounds = rect_1.rect(-20, -boundsH, 40, boundsH);
        base.options = options;
        if (SERVER && !TESTS)
            return;
        var _h = dirUpDown[r], shadowUp = _h.shadowUp, shadowDown = _h.shadowDown, spriteUp = _h.spriteUp, spriteDown = _h.spriteDown, upDX = _h.upDX, upDY = _h.upDY, downDX = _h.downDX, downDY = _h.downDY, shadowUpDX = _h.shadowUpDX, shadowUpDY = _h.shadowUpDY, shadowDownDX = _h.shadowDownDX, shadowDownDY = _h.shadowDownDY;
        var leftShadow = !!w.length;
        var rightShadow = !!e.length;
        var upShadow = !!n.length;
        var downShadow = !!s.length;
        var pole = poles[max - 3];
        var defaultPalette = pole.sprite.shadow && createPalette(sprites.defaultPalette);
        var palette = createPalette(utils_1.att(pole.sprite.palettes, 0));
        base.palettes = [];
        defaultPalette && base.palettes.push(defaultPalette);
        palette && base.palettes.push(palette);
        base.draw = function (batch, options) {
            var x = positionUtils_1.toScreenX(this.x);
            var y = positionUtils_1.toScreenYWithZ(this.y, this.z);
            batch.drawSprite(pole.sprite.shadow, options.shadowColor, defaultPalette, x + poleDX, y + pole.dy);
            leftShadow && batch.drawSprite(shadowLeft, options.shadowColor, defaultPalette, x - 18, y - 1);
            rightShadow && batch.drawSprite(shadowRight, options.shadowColor, defaultPalette, x + 4, y - 1);
            upShadow && batch.drawSprite(shadowUp, options.shadowColor, defaultPalette, x + shadowUpDX, y + shadowUpDY);
            downShadow && batch.drawSprite(shadowDown, options.shadowColor, defaultPalette, x + shadowDownDX, y + shadowDownDY);
            for (var i = n.length - 1; i >= 0; i--) {
                if (n[i] !== -1) {
                    batch.drawSprite(spriteUp, colors_1.WHITE, palette, x + upDX, y + pole.dy + upDY + i * upDownStep);
                }
            }
            batch.drawSprite(pole.sprite.color, colors_1.WHITE, palette, x + poleDX, y + pole.dy);
            for (var i = 0; i < w.length; i++) {
                if (w[i] !== -1) {
                    var sprite = leftSprites[w[i]];
                    sprite && batch.drawSprite(sprite, colors_1.WHITE, palette, x + leftDX, y + pole.dy + plateDY + i * leftRightStep);
                }
            }
            for (var i = 0; i < e.length; i++) {
                if (e[i] !== -1) {
                    var sprite = rightSprites[e[i]];
                    sprite && batch.drawSprite(rightSprites[e[i]], colors_1.WHITE, palette, x + rightDX, y + pole.dy + plateDY + i * leftRightStep);
                }
            }
            for (var i = s.length - 1; i >= 0; i--) {
                if (s[i] !== -1) {
                    batch.drawSprite(spriteDown, colors_1.WHITE, palette, x + downDX, y + pole.dy + downDY + i * upDownStep);
                }
            }
        };
    };
}
exports.mixDrawDirectionSign = mixDrawDirectionSign;
function mixLight(color, dx, dy, w, h) {
    return function (base) {
        if (!SERVER || TESTS) {
            base.lightOn = true;
            base.lightColor = color;
            base.lightScale = 1;
            base.lightTarget = 1;
            base.lightScaleAdjust = 1;
            base.lightBounds = rect_1.rect(-(dx + w / 2), -(dy + h / 2), w, h);
            base.drawLight = function (batch) {
                if (!this.lightOn)
                    return;
                var x = positionUtils_1.toScreenX(this.x);
                var y = positionUtils_1.toScreenYWithZ(this.y, this.z);
                var s = this.lightScale * this.lightScaleAdjust;
                var width = w * s;
                var height = h * s;
                var color = this.lightColor;
                batch.drawImage(color, -1, -1, 2, 2, x - (dx + width / 2), y - (dy + height / 2), width, height);
            };
        }
    };
}
exports.mixLight = mixLight;
function mixLightSprite(sprite, color, dx, dy) {
    return function (base) {
        if (!SERVER || TESTS) {
            base.lightSpriteOn = true;
            base.lightSpriteX = dx;
            base.lightSpriteY = dy;
            base.lightSpriteColor = color;
            base.lightSpriteBounds = getBounds(sprite, -dx, -dy);
            base.drawLightSprite = function (batch) {
                if (!this.lightSpriteOn)
                    return;
                var x = positionUtils_1.toScreenX(this.x) - this.lightSpriteX;
                var y = positionUtils_1.toScreenYWithZ(this.y, this.z) - this.lightSpriteY;
                batch.drawSprite(sprite, this.lightSpriteColor || colors_1.BLACK, x, y);
            };
        }
    };
}
exports.mixLightSprite = mixLightSprite;
function mixDrawRain() {
    var sprite = sprites.rainfall.color; // 110x477
    var bounds = rect_1.rect(positionUtils_1.toScreenX(-4), -sprite.h, positionUtils_1.toScreenX(8), sprite.h);
    return function (base) {
        base.bounds = bounds;
        if (SERVER && !TESTS)
            return;
        var time = 0;
        var palette = createPalette(sprites.defaultPalette);
        base.palettes = [palette];
        // update(delta: number) {
        // 	time += delta * 1000;
        // 	if (time > 200) {
        // 		time -= 200;
        // 	}
        // },
        base.draw = function (batch) {
            var x = positionUtils_1.toScreenX(this.x) + bounds.x;
            var y = positionUtils_1.toScreenYWithZ(this.y, this.z) - sprite.h + Math.floor(time);
            batch.drawImage(sprite.type, colors_1.RED, palette, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        };
    };
}
exports.mixDrawRain = mixDrawRain;
function mixDrawShadow(sprite, dx, dy, shadowColor) {
    var bounds = getRenderableBounds(sprite, dx, dy);
    return function (base) {
        base.bounds = bounds;
        if (!SERVER || TESTS) {
            var defaultPalette_4 = createPalette(sprites.defaultPalette);
            base.palettes = [defaultPalette_4];
            base.draw = function (batch, options) {
                var x = positionUtils_1.toScreenX(this.x + (this.ox || 0)) - dx;
                var y = positionUtils_1.toScreenYWithZ(this.y + (this.oy || 0), this.z) - dy;
                var color = shadowColor === undefined ? options.shadowColor : shadowColor;
                sprite.shadow && batch.drawSprite(sprite.shadow, color, defaultPalette_4, x, y);
            };
        }
    };
}
exports.mixDrawShadow = mixDrawShadow;
function mixBobbing(bobsFps, bobs) {
    return function (base) {
        base.flags |= 2048 /* Bobbing */;
        base.bobsFps = bobsFps;
        base.bobs = bobs;
    };
}
exports.mixBobbing = mixBobbing;
var fullWalls = true;
function toggleWalls() {
    fullWalls = !fullWalls;
}
exports.toggleWalls = toggleWalls;
function mixDrawWall(full, half, dx, dy, dy2) {
    var fullBounds = getRenderableBounds(full, dx, dy);
    // const halfBounds = getRenderableBounds(half, dx, dy2);
    return function (base) {
        base.bounds = fullBounds; // fullWalls ? fullBounds : halfBounds
        if (SERVER && !TESTS)
            return;
        var fullPalette = createPalette(utils_1.att(full.palettes, 0));
        var halfPalette = createPalette(utils_1.att(half.palettes, 0));
        base.palettes = [];
        fullPalette && base.palettes.push(fullPalette);
        halfPalette && base.palettes.push(halfPalette);
        base.draw = function (batch) {
            var sprite = fullWalls ? full : half;
            var palette = fullWalls ? fullPalette : halfPalette;
            var x = positionUtils_1.toScreenX(this.x) - dx;
            var y = positionUtils_1.toScreenYWithZ(this.y, this.z) - (fullWalls ? dy : dy2);
            sprite.color && batch.drawSprite(sprite.color, colors_1.WHITE, palette, x, y);
        };
    };
}
exports.mixDrawWall = mixDrawWall;
function mixDrawSpider(sprite, dx, dy) {
    var heightOffset = 30;
    var spriteColor = sprite.color;
    var baseBounds = getRenderableBounds(sprite, dx, dy);
    if (!spriteColor)
        throw new Error('Missing sprite');
    return function (base) {
        var _a = base.options, height = _a.height, time = _a.time;
        var bounds = __assign({}, baseBounds);
        bounds.y -= (height + heightOffset);
        bounds.h += height;
        base.bounds = bounds;
        if (SERVER && !TESTS)
            return;
        var palette = createPalette(sprite.palettes && sprite.palettes[0]);
        base.palettes = [palette];
        base.draw = function (batch, options) {
            var t = options.gameTime / constants_1.SECOND - time;
            var h = lodash_1.clamp(Math.sin(t / 4) * 4, 0, 1) * height;
            if (h < height) {
                var lineLength = height - h - 4;
                var x = positionUtils_1.toScreenX(this.x) - dx;
                var y = positionUtils_1.toScreenYWithZ(this.y, this.z) - dy - heightOffset - h;
                batch.drawRect(0x181818ff, x + 2, y - lineLength, 1, lineLength + 1);
                batch.drawSprite(spriteColor, colors_1.WHITE, palette, x, y);
            }
        };
    };
}
exports.mixDrawSpider = mixDrawSpider;
