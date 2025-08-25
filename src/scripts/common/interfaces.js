"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("./colors");
function isPaletteSpriteBatch(batch) {
    return batch.palette;
}
exports.isPaletteSpriteBatch = isPaletteSpriteBatch;
function getAnimationFromEntityState(state) {
    return (state & 240 /* AnimationMask */) >> 4;
}
exports.getAnimationFromEntityState = getAnimationFromEntityState;
function setAnimationToEntityState(state, animation) {
    return (state & ~240 /* AnimationMask */) | (animation << 4);
}
exports.setAnimationToEntityState = setAnimationToEntityState;
function toMessageType(type) {
    if (type === 15 /* WhisperAnnouncement */) {
        return 16 /* WhisperToAnnouncement */;
    }
    else {
        return 14 /* WhisperTo */;
    }
}
exports.toMessageType = toMessageType;
function toAnnouncementMessageType(type) {
    switch (type) {
        case 1 /* Party */: return 8 /* PartyAnnouncement */;
        case 9 /* Whisper */: return 15 /* WhisperAnnouncement */;
        default: return 7 /* Announcement */;
    }
}
exports.toAnnouncementMessageType = toAnnouncementMessageType;
function isWhisper(type) {
    return type === 13 /* Whisper */ ||
        type === 15 /* WhisperAnnouncement */;
}
exports.isWhisper = isWhisper;
function isWhisperTo(type) {
    return type === 14 /* WhisperTo */ ||
        type === 16 /* WhisperToAnnouncement */;
}
exports.isWhisperTo = isWhisperTo;
function isThinking(type) {
    return type === 5 /* Thinking */ ||
        type === 6 /* PartyThinking */;
}
exports.isThinking = isThinking;
function isModOrAdminMessage(type) {
    return type === 3 /* Mod */ ||
        type === 2 /* Admin */;
}
exports.isModOrAdminMessage = isModOrAdminMessage;
function isPartyMessage(type) {
    return type === 4 /* Party */ ||
        type === 6 /* PartyThinking */ ||
        type === 8 /* PartyAnnouncement */;
}
exports.isPartyMessage = isPartyMessage;
function isPublicMessage(type) {
    return type === 0 /* Chat */ ||
        type === 5 /* Thinking */ ||
        type === 7 /* Announcement */ ||
        type === 2 /* Admin */ ||
        type === 3 /* Mod */ ||
        type === 9 /* Supporter1 */ ||
        type === 10 /* Supporter2 */ ||
        type === 11 /* Supporter3 */;
}
exports.isPublicMessage = isPublicMessage;
function isNonIgnorableMessage(type) {
    return isModOrAdminMessage(type) ||
        isPartyMessage(type) ||
        type === 1 /* System */ ||
        type === 12 /* Dismiss */ ||
        type === 7 /* Announcement */;
}
exports.isNonIgnorableMessage = isNonIgnorableMessage;
function isPartyChat(type) {
    return type === 1 /* Party */ || type === 3 /* PartyThink */;
}
exports.isPartyChat = isPartyChat;
function isPublicChat(type) {
    return type !== 1 /* Party */ &&
        type !== 3 /* PartyThink */ &&
        type !== 8 /* Dismiss */ &&
        type !== 9 /* Whisper */;
}
exports.isPublicChat = isPublicChat;
exports.defaultMapState = {
    weather: 0 /* None */,
};
exports.tileTypeNames = [
    'none', 'dirt', 'grass', 'water', 'wood', 'ice', 'snow-on-ice', 'walkable-water', 'boat', 'walkable-ice',
    'stone', 'stone-2', 'elevated-dirt',
];
exports.houseTiles = [
    { type: 1 /* Dirt */, name: 'Dirt' },
    { type: 4 /* Wood */, name: 'Wood' },
    { type: 2 /* Grass */, name: 'Grass' },
    { type: 3 /* Water */, name: 'Water' },
    { type: 5 /* Ice */, name: 'Ice' },
    { type: 10 /* Stone */, name: 'Stone' },
    { type: 11 /* Stone2 */, name: 'Brick' },
];
function canWalk(tile) {
    return tile !== 0 /* None */;
}
exports.canWalk = canWalk;
function isValidTile(tile) {
    return tile === 1 /* Dirt */ || tile === 2 /* Grass */;
}
exports.isValidTile = isValidTile;
function isValidModTile(tile) {
    return tile >= 0 /* None */ && tile < 100 /* WallH */;
}
exports.isValidModTile = isValidModTile;
function isExpressionAction(action) {
    return action === 3 /* Yawn */ || action === 4 /* Laugh */ || action === 5 /* Sneeze */;
}
exports.isExpressionAction = isExpressionAction;
exports.CLOSED_MUZZLES = [
    0 /* Smile */, 1 /* Frown */, 2 /* Neutral */, 3 /* Scrunch */, 6 /* Flat */, 7 /* Concerned */,
    13 /* Kiss */, 17 /* Kiss2 */,
];
function isEyeSleeping(eye) {
    return eye === 6 /* Closed */ ||
        (eye >= 11 /* Lines */ && eye <= 14 /* ClosedHappy */) ||
        (eye >= 21 /* Peaceful */ && eye <= 24 /* X2 */);
}
exports.isEyeSleeping = isEyeSleeping;
var Engine;
(function (Engine) {
    Engine[Engine["Default"] = 0] = "Default";
    Engine[Engine["LayeredTiles"] = 1] = "LayeredTiles";
    Engine[Engine["Whiteness"] = 2] = "Whiteness";
    Engine[Engine["NewLighting"] = 3] = "NewLighting";
    Engine[Engine["Total"] = 4] = "Total";
})(Engine = exports.Engine || (exports.Engine = {}));
exports.defaultDrawOptions = {
    gameTime: 0,
    lightColor: colors_1.WHITE,
    shadowColor: colors_1.SHADOW_COLOR,
    drawHidden: false,
    showColliderMap: false,
    showHeightmap: false,
    debug: {},
    gridLines: false,
    tileIndices: false,
    tileGrid: false,
    engine: Engine.Default,
    season: 1 /* Summer */,
    error: function () { },
};
exports.defaultWorldState = {
    season: 1 /* Summer */,
};
