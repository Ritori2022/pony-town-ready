"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var canvasUtils_1 = require("./canvasUtils");
var contextSpriteBatch_1 = require("../graphics/contextSpriteBatch");
var colors_1 = require("../common/colors");
var sprites_1 = require("../generated/sprites");
var utils_1 = require("../common/utils");
exports.emojis = [
    // faces
    ['🙂', 'face', 'tiny', 'tinyface', 'slight_smile'],
    ['😵', 'derp', 'dizzy_face'],
    ['😠', 'angry'],
    ['😐', 'neutral', 'neutral_face'],
    ['😑', 'expressionless'],
    ['😆', 'laughing'],
    ['😍', 'heart_eyes'],
    ['😟', 'worried'],
    ['🤔', 'thinking'],
    ['🙃', 'upside_down'],
    ['😈', 'evil', 'smiling_imp'],
    ['👿', 'imp', 'angry_evil'],
    ['👃', 'nose', 'c'],
    // cat faces
    ['🐱', 'cat'],
    ['😺', 'smiley_cat'],
    ['😸', 'smile_cat'],
    ['😹', 'joy_cat'],
    ['😻', 'heart_eyes_cat'],
    ['😼', 'smirk_cat'],
    ['😽', 'kissing_cat'],
    ['🙀', 'scream_cat'],
    ['😿', 'cryingcat', 'crying_cat_face'],
    ['😾', 'pouting_cat'],
    // hearts
    ['❤', 'heart'],
    ['💙', 'blue_heart', 'meno'],
    ['💚', 'green_heart', 'chira'],
    ['💛', 'yellow_heart'],
    ['💜', 'purple_heart'],
    ['🖤', 'black_heart', 'shino'],
    ['💔', 'broken_heart'],
    ['💖', 'sparkling_heart'],
    ['💗', 'heartpulse'],
    ['💕', 'two_hearts'],
    // food / objects
    ['🥌', 'rock', 'stone'],
    ['🍕', 'pizza'],
    ['🍎', 'apple'],
    ['🍏', 'gapple', 'green_apple'],
    ['🍊', 'orange', 'tangerine'],
    ['🍐', 'pear'],
    ['🥭', 'mango'],
    ['🥕', 'carrot'],
    ['🍇', 'grapes'],
    ['🍌', 'banana'],
    ['⛏', 'pick'],
    ['🥚', 'egg'],
    ['💮', 'flower', 'white_flower'],
    ['🌸', 'cherry_blossom'],
    ['🍬', 'candy'],
    ['🍡', 'candy_cane'],
    ['🍭', 'lollipop'],
    ['⭐', 'star'],
    ['🌟', 'star2'],
    ['🌠', 'shooting_star'],
    ['⚡', 'zap'],
    ['❄', 'snow', 'snowflake'],
    ['⛄', 'snowpony', 'snowman'],
    ['🏀', 'pumpkin'],
    ['🎃', 'jacko', 'jack_o_lantern'],
    ['🌲', 'evergreen_tree', 'pinetree'],
    ['🎄', 'christmas_tree'],
    ['🕯', 'candle'],
    ['🎅', 'santa_hat', 'santa_claus'],
    ['💐', 'holly'],
    ['🌿', 'mistletoe'],
    ['🎲', 'die', 'dice', 'game_die'],
    ['✨', 'sparkles'],
    ['🎁', 'gift', 'present'],
    ['🔥', 'fire'],
    ['🎵', 'musical_note'],
    ['🎶', 'notes'],
    ['🌈', 'rainbow'],
    ['🐾', 'feet', 'paw', 'paws'],
    ['👑', 'crown'],
    ['💎', 'gem'],
    ['☘', 'shamrock', 'clover'],
    ['🍀', 'four_leaf_clover'],
    ['🍪', 'cookie'],
    // animals
    ['🦋', 'butterfly'],
    ['🦇', 'bat'],
    ['🕷', 'spider'],
    ['👻', 'ghost'],
    ['🐈', 'cat2'],
    // other
    ['™', 'tm'],
    ['♂', 'male'],
    ['♀', 'female'],
    ['⚧', 'trans', 'transgender'],
].map(createEmoji);
exports.emojiMap = new Map();
exports.emojiNames = exports.emojis.slice().sort().map(function (e) { return ":" + e.names[0] + ":"; });
exports.emojis.forEach(function (e) { return e.names.forEach(function (name) { return exports.emojiMap.set(":" + name + ":", e.symbol); }); });
function findEmoji(name) {
    return exports.emojis.find(function (e) { return name === e.symbol || utils_1.includes(e.names, name); });
}
exports.findEmoji = findEmoji;
function replaceEmojis(text) {
    return (text || '').replace(/:[a-z0-9_]+:/ig, function (match) { return exports.emojiMap.get(match) || match; });
}
exports.replaceEmojis = replaceEmojis;
function createEmoji(_a) {
    var symbol = _a[0], names = _a.slice(1);
    return { symbol: symbol, names: names.concat(names.filter(function (n) { return /_/.test(n); }).map(function (n) { return n.replace(/_/g, ''); })) };
}
var emojiImages = new Map();
var emojiImagePromises = new Map();
function getEmojiImageAsync(sprite, callback) {
    var src = emojiImages.get(sprite);
    if (src) {
        callback(src);
        return;
    }
    var promise = emojiImagePromises.get(sprite);
    if (promise) {
        promise.then(callback);
        return;
    }
    var width = sprite.w + sprite.ox;
    // const height = sprite.h + sprite.oy;
    var canvas = contextSpriteBatch_1.drawCanvas(width, 10, sprites_1.normalSpriteSheet, undefined, function (batch) { return batch.drawSprite(sprite, colors_1.WHITE, 0, 0); });
    var newPromise = canvasUtils_1.canvasToSource(canvas);
    emojiImagePromises.set(sprite, newPromise);
    newPromise
        .then(function (src) {
        emojiImages.set(sprite, src);
        emojiImagePromises.delete(sprite);
        return src;
    })
        .then(callback);
}
exports.getEmojiImageAsync = getEmojiImageAsync;
var emojisRegex = new RegExp("(" + exports.emojis.map(function (e) { return e.symbol; }).concat([
    '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎',
]).join('|') + ")", 'g');
function splitEmojis(text) {
    return text.split(emojisRegex);
}
exports.splitEmojis = splitEmojis;
function hasEmojis(text) {
    return emojisRegex.test(text);
}
exports.hasEmojis = hasEmojis;
function nameToHTML(name) {
    return lodash_1.escape(name);
}
exports.nameToHTML = nameToHTML;
var names = exports.emojiNames.slice().sort();
function autocompleteMesssage(message, shift, state) {
    return message.replace(/:[a-z0-9_]+:?$/, function (match) {
        state.lastEmoji = state.lastEmoji || match;
        var matches = names.filter(function (e) { return e.indexOf(state.lastEmoji) === 0; });
        var index = matches.indexOf(match);
        var offset = index === -1 ? 0 : (index + matches.length + (shift ? -1 : 1)) % matches.length;
        return matches[offset] || match;
    });
}
exports.autocompleteMesssage = autocompleteMesssage;
