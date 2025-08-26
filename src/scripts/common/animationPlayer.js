"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var graphicsUtils_1 = require("../graphics/graphicsUtils");
var utils_1 = require("./utils");
var colors_1 = require("./colors");
function createAnimationPlayer(palette) {
    return {
        nextAnimation: undefined,
        currentAnimation: undefined,
        time: 0,
        frame: 0,
        phase: 0 /* Starting */,
        dirty: true,
        palette: palette,
    };
}
exports.createAnimationPlayer = createAnimationPlayer;
function isAnimationPlaying(player) {
    return player.currentAnimation !== undefined;
}
exports.isAnimationPlaying = isAnimationPlaying;
function playOneOfAnimations(player, animations) {
    if (player.phase === 2 /* Ending */ || !utils_1.includes(animations, player.currentAnimation)) {
        playAnimation(player, lodash_1.sample(animations));
    }
}
exports.playOneOfAnimations = playOneOfAnimations;
function playAnimation(player, animation) {
    if (player.currentAnimation !== animation) {
        if (player.currentAnimation) {
            if (player.nextAnimation !== animation || player.phase !== 2 /* Ending */) {
                player.nextAnimation = animation;
                player.time = (player.frame + 1) / player.currentAnimation.fps;
                player.phase = 2 /* Ending */;
            }
        }
        else {
            player.currentAnimation = animation;
            player.time = 0;
            player.phase = 0 /* Starting */;
        }
        player.dirty = true;
    }
    else if (player.phase === 2 /* Ending */) {
        player.nextAnimation = animation;
        player.dirty = true;
    }
}
exports.playAnimation = playAnimation;
function updateAnimation(player, delta) {
    if (player.currentAnimation !== undefined) {
        player.time += delta;
        var _a = player.currentAnimation, start = _a.start, middle = _a.middle, end = _a.end, fps = _a.fps, loop = _a.loop;
        var extraFrame = Math.floor(player.time * fps);
        if (player.phase === 0 /* Starting */ && extraFrame > start) {
            player.phase = loop ? 1 /* Playing */ : 2 /* Ending */;
            player.dirty = true;
        }
        if (player.phase === 1 /* Playing */) {
            extraFrame = start + ((extraFrame - start) % middle);
        }
        if (player.phase === 2 /* Ending */ && extraFrame > (start + middle + end)) {
            player.currentAnimation = undefined;
            player.dirty = true;
            if (player.nextAnimation !== undefined) {
                var nextAnimation = player.nextAnimation;
                player.nextAnimation = undefined;
                playAnimation(player, nextAnimation);
            }
        }
        if (player.frame !== extraFrame) {
            player.frame = extraFrame;
            player.dirty = true;
        }
    }
}
exports.updateAnimation = updateAnimation;
function drawAnimation(batch, player, x, y, color, flip, maxY) {
    if (color === void 0) { color = colors_1.WHITE; }
    if (flip === void 0) { flip = false; }
    if (maxY === void 0) { maxY = 0; }
    var animation = player.currentAnimation;
    if (animation !== undefined) {
        var frames_1 = (flip && animation.flipFrames) ? animation.flipFrames : animation.frames;
        if (player.frame < frames_1.length) {
            var frame = frames_1[player.frame];
            if (DEVELOPMENT && !frame) {
                throw new Error('Undefined frame in sprite animation');
            }
            if (!frame) // TEMP
                return;
            if (maxY === 0) {
                batch.drawSprite(frame, color, player.palette, x, y);
            }
            else {
                graphicsUtils_1.drawSpriteCropped(batch, frame, color, player.palette, x, y, maxY);
            }
        }
    }
}
exports.drawAnimation = drawAnimation;
