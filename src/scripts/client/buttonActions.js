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
var interfaces_1 = require("../common/interfaces");
var sprites = require("../generated/sprites");
var clientUtils_1 = require("./clientUtils");
var expressionEncoder_1 = require("../common/encoders/expressionEncoder");
var playerActions_1 = require("./playerActions");
var constants_1 = require("../common/constants");
var utils_1 = require("../common/utils");
var ponyAnimations_1 = require("./ponyAnimations");
var ponyInfo_1 = require("../common/ponyInfo");
var colors_1 = require("../common/colors");
var canvasUtils_1 = require("./canvasUtils");
var contextSpriteBatch_1 = require("../graphics/contextSpriteBatch");
var ponyHelpers_1 = require("./ponyHelpers");
var ponyDraw_1 = require("./ponyDraw");
var color_1 = require("../common/color");
var rect_1 = require("../common/rect");
var spriteFont_1 = require("../graphics/spriteFont");
var fonts_1 = require("../client/fonts");
var entityUtils_1 = require("../common/entityUtils");
var pony_1 = require("../common/pony");
var entities_1 = require("../common/entities");
var mixins_1 = require("../common/mixins");
var spriteUtils_1 = require("./spriteUtils");
var model_1 = require("../components/services/model");
var positionUtils_1 = require("../common/positionUtils");
var CANVAS_SIZE = 29;
var ICON_SIZE = 16;
var headX = -26;
var headY = -30;
var headlessBoopFrame = __assign({}, utils_1.cloneDeep(ponyAnimations_1.boop.frames[7]), { head: 0 });
var headlessBoop = { name: '', loop: false, fps: 1, frames: [headlessBoopFrame] };
function createPony(coatColor, wings, horn) {
    if (wings === void 0) { wings = false; }
    if (horn === void 0) { horn = false; }
    var info = ponyInfo_1.createDefaultPony();
    info.coatFill = coatColor;
    info.mane.type = 0;
    info.backMane.type = 0;
    info.tail.type = 0;
    info.eyeColorRight = colors_1.ACTION_EXPRESSION_EYE_COLOR;
    if (wings) {
        info.wings.type = 1;
    }
    if (horn) {
        info.horn.type = 1;
    }
    ponyInfo_1.syncLockedPonyInfo(info);
    return ponyInfo_1.toPalette(info, ponyInfo_1.mockPaletteManager);
}
function createState() {
    var state = ponyHelpers_1.defaultPonyState();
    state.blushColor = colors_1.blushColor(color_1.parseColor(colors_1.ACTION_ACTION_COAT_COLOR));
    return state;
}
function colorToGrayscale(value) {
    return color_1.colorToHexRGB(color_1.toGrayscale(color_1.parseColor(value)));
}
var ACTION_ACTION_BG_DISABLED = color_1.toGrayscale(color_1.parseColor(colors_1.ACTION_ACTION_BG));
var expressionPony = createPony(colors_1.ACTION_EXPRESSION_BG);
var actionPony = createPony(colors_1.ACTION_ACTION_COAT_COLOR);
var actionPonyWithHorn = createPony(colors_1.ACTION_ACTION_COAT_COLOR, false, true);
var actionPonyWithWings = createPony(colors_1.ACTION_ACTION_COAT_COLOR, true);
var actionPonyDisabled = createPony(colorToGrayscale(colors_1.ACTION_ACTION_COAT_COLOR));
var actionPonyWithWingsDisabled = createPony(colorToGrayscale(colors_1.ACTION_ACTION_COAT_COLOR), true);
var defaultPalette = ponyInfo_1.mockPaletteManager.addArray(sprites.defaultPalette);
exports.actionExpressionDefaultPalette = ponyInfo_1.mockPaletteManager.add(Array.from(sprites.defaultPalette));
expressionPony.defaultPalette = exports.actionExpressionDefaultPalette;
expressionPony.defaultPalette.colors[4] = 0xe16200ff; // tongue color
function expressionButtonAction(expression) {
    return { type: 'expression', expression: expression, title: expression ? '' : 'Reset expression' };
}
exports.expressionButtonAction = expressionButtonAction;
function commandButtonAction(command, icon) {
    return { type: 'command', command: command, title: command, icon: icon };
}
exports.commandButtonAction = commandButtonAction;
function actionButtonAction(action, title, sendAction) {
    if (sendAction === void 0) { sendAction = 0 /* None */; }
    return { type: 'action', action: action, title: title, sendAction: sendAction };
}
exports.actionButtonAction = actionButtonAction;
function itemButtonAction(icon, count) {
    return { type: 'item', icon: icon, count: count };
}
exports.itemButtonAction = itemButtonAction;
function entityButtonAction(entity) {
    return { type: 'entity', entity: entity, title: entity };
}
exports.entityButtonAction = entityButtonAction;
var actionActions = [
    actionButtonAction('boop', 'Boop'),
    actionButtonAction('down', 'Sit down / Land'),
    actionButtonAction('up', 'Stand up / Fly up'),
    actionButtonAction('turn-head', 'Turn head'),
    actionButtonAction('sneeze', 'Sneeze', 5 /* Sneeze */),
    actionButtonAction('sleep', 'Sleep', 13 /* Sleep */),
    actionButtonAction('yawn', 'Yawn', 3 /* Yawn */),
    actionButtonAction('love', 'Love', 18 /* Love */),
    actionButtonAction('laugh', 'Laugh', 4 /* Laugh */),
    actionButtonAction('blush', 'Blush', 16 /* Blush */),
    actionButtonAction('drop', 'Drop item', 14 /* Drop */),
    actionButtonAction('drop-toy', 'Drop toy', 15 /* DropToy */),
    actionButtonAction('magic', 'Magic', 26 /* Magic */),
    actionButtonAction('switch-tool', 'Switch tool', 29 /* SwitchTool */),
    actionButtonAction('switch-entity', 'Switch item to place'),
    actionButtonAction('switch-entity-rev', 'Switch item to place (reverse)'),
    actionButtonAction('switch-tile', 'Switch tile to place'),
];
var commandActions = [
    commandButtonAction('/roll', '🎲'),
    commandButtonAction('/gifts', '🎁'),
    commandButtonAction('/candies', '🍬'),
    commandButtonAction('/clovers', '🍀'),
    commandButtonAction('/toys', '🎅'),
    commandButtonAction('/eggs', '🥚'),
];
var additionalActionsActions = [
    expressionButtonAction(undefined),
];
function getActionAction(action) {
    return actionActions.find(function (a) { return a.action === action; });
}
function getCommandAction(command) {
    return commandActions.find(function (a) { return a.command === command; });
}
function createButtionActionActions() {
    return actionActions.concat(additionalActionsActions);
}
exports.createButtionActionActions = createButtionActionActions;
function createButtonCommandActions() {
    return commandActions.slice();
}
exports.createButtonCommandActions = createButtonCommandActions;
function createDefaultButtonActions() {
    return DEVELOPMENT ? [
        { action: getActionAction('boop') },
        { action: getActionAction('down') },
        { action: getActionAction('up') },
        { action: getActionAction('turn-head') },
        { action: expressionButtonAction(clientUtils_1.createExpression(6 /* Closed */, 6 /* Closed */, 0 /* Smile */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 3 /* Neutral3 */, 0 /* Smile */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 3 /* Scrunch */, 0 /* Forward */, 1 /* Up */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(19 /* Angry */, 19 /* Angry */, 3 /* Scrunch */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(3 /* Neutral3 */, 3 /* Neutral3 */, 6 /* Flat */, 2 /* Left */, 2 /* Left */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(23 /* X */, 23 /* X */, 6 /* Flat */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(4 /* Neutral4 */, 4 /* Neutral4 */, 6 /* Flat */)) },
        { action: undefined },
        { action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 6 /* Flat */, 6 /* Shocked */, 6 /* Shocked */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(2 /* Neutral2 */, 2 /* Neutral2 */, 6 /* Flat */, 3 /* Right */, 2 /* Left */)) },
        { action: getCommandAction('/roll') },
        { action: itemButtonAction(sprites.flower_2, 14) },
        { action: itemButtonAction(sprites.apple_1, 5) },
        { action: itemButtonAction(sprites.pumpkin_default) },
        { action: itemButtonAction(sprites.tree_1, 2) },
        {
            action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 6 /* Flat */, 6 /* Shocked */, 6 /* Shocked */, 8 /* Tears */))
        },
        {
            action: expressionButtonAction(clientUtils_1.createExpression(2 /* Neutral2 */, 2 /* Neutral2 */, 6 /* Flat */, 3 /* Right */, 2 /* Left */, 4 /* Cry */))
        },
        {
            action: expressionButtonAction(clientUtils_1.createExpression(2 /* Neutral2 */, 2 /* Neutral2 */, 6 /* Flat */, 3 /* Right */, 2 /* Left */, 16 /* Hearts */))
        },
        {
            action: expressionButtonAction(clientUtils_1.createExpression(2 /* Neutral2 */, 2 /* Neutral2 */, 6 /* Flat */, 3 /* Right */, 2 /* Left */, 2 /* Zzz */))
        },
        {
            action: expressionButtonAction(clientUtils_1.createExpression(2 /* Neutral2 */, 2 /* Neutral2 */, 6 /* Flat */, 3 /* Right */, 2 /* Left */, 2 /* Zzz */ | 4 /* Cry */ | 16 /* Hearts */ | 1 /* Blush */))
        },
    ] : [
        { action: getActionAction('boop') },
        { action: getActionAction('down') },
        { action: getActionAction('up') },
        { action: getActionAction('turn-head') },
        { action: getActionAction('magic') },
        { action: expressionButtonAction(undefined) },
        { action: expressionButtonAction(clientUtils_1.createExpression(6 /* Closed */, 6 /* Closed */, 0 /* Smile */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 3 /* Neutral3 */, 0 /* Smile */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 3 /* Scrunch */, 0 /* Forward */, 1 /* Up */)) },
        { action: expressionButtonAction(clientUtils_1.createExpression(19 /* Angry */, 19 /* Angry */, 3 /* Scrunch */)) },
    ];
}
exports.createDefaultButtonActions = createDefaultButtonActions;
function serializeActions(slots) {
    var serialized = slots.slice(0, constants_1.ACTIONS_LIMIT).map(serializeAction);
    while (serialized.length && !serialized[serialized.length - 1]) {
        serialized.pop();
    }
    return JSON.stringify(serialized);
}
exports.serializeActions = serializeActions;
function deserializeActions(data) {
    try {
        var json = JSON.parse(data);
        return json.slice(0, constants_1.ACTIONS_LIMIT).map(deserializeAction);
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
        return [];
    }
}
exports.deserializeActions = deserializeActions;
function serializeAction(_a) {
    var action = _a.action;
    if (action) {
        switch (action.type) {
            case 'action':
                return { act: action.action };
            case 'command':
                return { cmd: action.command };
            case 'expression':
                return { exp: expressionEncoder_1.encodeExpression(action.expression) };
            case 'entity':
                return { ent: action.entity };
            default:
                DEVELOPMENT && console.warn("Missing serialization for " + JSON.stringify(action));
                return null;
        }
    }
    else {
        return null;
    }
}
function deserializeAction(data) {
    if (data) {
        if ('act' in data || 'action' in data) {
            return { action: getActionAction(data.act || data.action) };
        }
        else if ('cmd' in data || 'command' in data) {
            return { action: getCommandAction(data.cmd || data.command) };
        }
        else if ('exp' in data || 'expression' in data) {
            var expression = expressionEncoder_1.decodeExpression(data.exp || data.expression | 0);
            return { action: expressionButtonAction(expression) };
        }
        else if ('ent' in data || 'entity' in data) {
            return { action: entityButtonAction(data.ent || data.entity) };
        }
        else {
            DEVELOPMENT && console.warn("Missing deserialization for " + JSON.stringify(data));
        }
    }
    return { action: undefined };
}
var lastCommandCalls = {};
function useAction(game, action) {
    if (action) {
        switch (action.type) {
            case 'expression':
                game.send(function (server) { return server.expression(expressionEncoder_1.encodeExpression(action.expression)); });
                break;
            case 'action':
                if (action.sendAction) {
                    game.send(function (server) { return server.action(action.sendAction); });
                }
                else {
                    switch (action.action) {
                        case 'boop':
                            playerActions_1.boopAction(game);
                            break;
                        case 'up':
                            playerActions_1.upAction(game);
                            break;
                        case 'down':
                            playerActions_1.downAction(game);
                            break;
                        case 'turn-head':
                            playerActions_1.turnHeadAction(game);
                            break;
                        case 'switch-entity':
                            game.send(function (server) { return server.action(31 /* SwitchToPlaceTool */); });
                            game.changePlaceEntity(false);
                            break;
                        case 'switch-entity-rev':
                            game.send(function (server) { return server.action(31 /* SwitchToPlaceTool */); });
                            game.changePlaceEntity(true);
                            break;
                        case 'switch-tile':
                            game.send(function (server) { return server.action(32 /* SwitchToTileTool */); });
                            game.changePlaceTile(false);
                            break;
                        default:
                            console.log('Action not supported: ', action.action);
                    }
                }
                break;
            case 'command':
                var now = performance.now();
                var lastCall = lastCommandCalls[action.command] | 0;
                if ((now - lastCall) > constants_1.COMMAND_ACTION_TIME_DELAY) {
                    lastCommandCalls[action.command] = now;
                    var chatType_1 = interfaces_1.isPartyChat(game.lastChatMessageType) ? 1 /* Party */ : 0 /* Say */;
                    game.send(function (server) { return server.say(0, action.command, chatType_1); });
                }
                break;
            case 'entity':
                if (BETA) {
                    game.editor.type = action.entity;
                }
                break;
            default:
                console.log('Action type not supported: ', action.type);
        }
    }
}
exports.useAction = useAction;
function shouldRedrawAction(action, state, game) {
    if (action !== state.action) {
        return true;
    }
    else if (action) {
        switch (action.type) {
            case 'action': {
                switch (action.action) {
                    case 'up':
                        return state.draw !== getUpDrawFunc(game);
                    case 'down':
                        return state.draw !== getDownDrawFunc(game);
                    // case 'turn-head':
                    // 	return state.right !== (game.player && isHeadFacingRight(game.player));
                    default:
                        return false;
                }
            }
            default:
                return false;
        }
    }
    else {
        return false;
    }
}
var canvasCache = new Map();
var palette = ponyInfo_1.mockPaletteManager.addArray(sprites.fontPalette);
var emojiPalette = ponyInfo_1.mockPaletteManager.addArray(sprites.emojiPalette);
function drawCanvasCached(key, action) {
    var canvas = canvasCache.get(key) || contextSpriteBatch_1.drawCanvas(ICON_SIZE, ICON_SIZE, sprites.paletteSpriteSheet, undefined, action);
    canvasCache.set(key, canvas);
    return canvas;
}
function drawAction(canvas, action, state, game) {
    if (canvasUtils_1.resizeCanvasWithRatio(canvas, CANVAS_SIZE, CANVAS_SIZE)) {
        state.action = 0;
    }
    if (!spriteUtils_1.spriteSheetsLoaded || !shouldRedrawAction(action, state, game))
        return;
    var context = canvas.getContext('2d');
    if (!context)
        return;
    state.action = action;
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvasUtils_1.disableImageSmoothing(context);
    var scale = 2 * canvasUtils_1.getPixelRatio();
    var bufferSize = ICON_SIZE;
    if (action) {
        switch (action.type) {
            case 'expression': {
                var buffer = contextSpriteBatch_1.drawCanvas(bufferSize, bufferSize, sprites.paletteSpriteSheet, undefined, function (batch) {
                    var state = __assign({}, createState(), { expression: action.expression });
                    var options = __assign({}, ponyHelpers_1.defaultDrawPonyOptions(), { noEars: true });
                    ponyDraw_1.drawHead(batch, expressionPony, headX, headY, undefined, ponyAnimations_1.defaultHeadFrame, state, options, false, 0);
                    if (action.expression) {
                        var extra = action.expression.extra;
                        if (utils_1.hasFlag(extra, 2 /* Zzz */)) {
                            batch.drawSprite(sprites.emote_sleep1.frames[13], colors_1.WHITE, defaultPalette, headX + 15, headY + 3);
                        }
                        if (utils_1.hasFlag(extra, 16 /* Hearts */)) {
                            batch.drawSprite(sprites.emote_hearts.frames[41], colors_1.HEARTS_COLOR, defaultPalette, headX + 8, headY + 22);
                        }
                        if (utils_1.hasFlag(extra, 4 /* Cry */)) {
                            batch.drawSprite(sprites.emote_cry2.frames[4], colors_1.WHITE, defaultPalette, headX, headY);
                        }
                        else if (utils_1.hasFlag(extra, 8 /* Tears */)) {
                            batch.drawSprite(sprites.emote_tears.frames[0], colors_1.WHITE, defaultPalette, headX, headY);
                        }
                    }
                    else {
                        var color = color_1.parseColor(colors_1.ACTION_EXPRESSION_BG);
                        batch.drawRect(color, 0, 3, 15, 5);
                        batch.drawRect(color, 0, 8, 3, 1);
                        batch.drawRect(color, 8, 8, 4, 1);
                    }
                });
                context.fillStyle = colors_1.ACTION_EXPRESSION_BG;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.scale(scale, scale);
                context.drawImage(buffer, 0, 0);
                break;
            }
            case 'command': {
                var buffer = drawCanvasCached("command:" + action.icon, function (batch) {
                    var bounds = rect_1.rect(0, 0, 15, 15);
                    var options = { palette: palette, emojiPalette: emojiPalette };
                    spriteFont_1.drawTextAligned(batch, action.icon, fonts_1.fontPal, colors_1.BLACK, bounds, 2 /* Center */, 2 /* Middle */, options);
                });
                context.fillStyle = colors_1.ACTION_COMMAND_BG;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.scale(scale, scale);
                context.drawImage(buffer, -0.5, 0.5);
                break;
            }
            case 'action': {
                var buffer = void 0;
                if (action.action === 'up' || action.action === 'down') {
                    state.draw = action.action === 'up' ? getUpDrawFunc(game) : getDownDrawFunc(game);
                    buffer = drawCanvasCached("action:" + action.action + ":" + state.draw, function (batch) {
                        state.draw && getDrawFuncByName(state.draw)(batch);
                    });
                }
                else {
                    buffer = drawCanvasCached("action:" + action.action, function (batch) {
                        switch (action.action) {
                            case 'boop': {
                                var state_1 = __assign({}, createState(), { animation: headlessBoop, animationFrame: 0 });
                                ponyDraw_1.drawPony(batch, actionPony, state_1, 25, 32, ponyHelpers_1.defaultDrawPonyOptions());
                                break;
                            }
                            case 'turn-head': {
                                // state.right = game.player && isHeadFacingRight(game.player);
                                var ponyState = __assign({}, createState(), { animation: ponyAnimations_1.stand });
                                ponyDraw_1.drawPony(batch, actionPony, ponyState, 15, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                // if (!state.right) {
                                // 	context.translate(context.canvas.width, 0);
                                // 	context.scale(-1, 1);
                                // }
                                break;
                            }
                            case 'sneeze': {
                                var state_2 = __assign({}, createState(), { headAnimation: ponyAnimations_1.sneeze, headAnimationFrame: 3 });
                                ponyDraw_1.drawPony(batch, actionPony, state_2, 17, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                break;
                            }
                            case 'sleep': {
                                var state_3 = __assign({}, createState(), { expression: clientUtils_1.createExpression(6 /* Closed */, 6 /* Closed */, 2 /* Neutral */) });
                                ponyDraw_1.drawPony(batch, actionPony, state_3, 18, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                batch.drawSprite(sprites.emote_sleep1.frames[13], colors_1.WHITE, defaultPalette, headX + 15, headY + 3);
                                break;
                            }
                            case 'drop': {
                                var state_4 = __assign({}, createState(), { holding: mixins_1.fakePaletteManager(function () { return entities_1.apple2(0, 0); }) });
                                ponyDraw_1.drawPony(batch, actionPony, state_4, 20, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                batch.drawSprite(sprites.arrow_down, colors_1.BLACK, defaultPalette, 1, 3);
                                break;
                            }
                            case 'drop-toy': {
                                var state_5 = __assign({}, createState());
                                var options = __assign({}, ponyHelpers_1.defaultDrawPonyOptions(), { toy: 17 });
                                ponyDraw_1.drawPony(batch, actionPony, state_5, 18, 52, options);
                                batch.drawSprite(sprites.arrow_down, colors_1.BLACK, defaultPalette, 1, 3);
                                break;
                            }
                            case 'yawn': {
                                var state_6 = __assign({}, createState(), { headAnimation: ponyAnimations_1.yawn, headAnimationFrame: 3 });
                                ponyDraw_1.drawPony(batch, actionPony, state_6, 17, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                break;
                            }
                            case 'laugh': {
                                var state_7 = __assign({}, createState(), { headAnimation: ponyAnimations_1.laugh, headAnimationFrame: 3 });
                                ponyDraw_1.drawPony(batch, actionPony, state_7, 17, 38, ponyHelpers_1.defaultDrawPonyOptions());
                                break;
                            }
                            case 'blush': {
                                var state_8 = __assign({}, createState(), { expression: clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 0 /* Smile */, 0 /* Forward */, 0 /* Forward */, 1 /* Blush */) });
                                ponyDraw_1.drawPony(batch, actionPony, state_8, 17, 40, ponyHelpers_1.defaultDrawPonyOptions());
                                break;
                            }
                            case 'love': {
                                batch.drawSprite(sprites.emote_hearts.frames[10], 0xbc414fff, defaultPalette, headX + 2, headY + 18);
                                break;
                            }
                            case 'magic': {
                                var state_9 = __assign({}, createState(), { headAnimation: ponyAnimations_1.laugh, headAnimationFrame: 3 });
                                ponyDraw_1.drawPony(batch, actionPonyWithHorn, state_9, 17, 48, ponyHelpers_1.defaultDrawPonyOptions());
                                batch.drawSprite(sprites.magic_icon, colors_1.WHITE, defaultPalette, 4, 2);
                                break;
                            }
                            case 'switch-tool': {
                                var palette_1 = ponyInfo_1.mockPaletteManager.addArray(sprites.tools_icon.palettes[0]);
                                batch.drawSprite(sprites.tools_icon.color, colors_1.WHITE, palette_1, 0, 2);
                                break;
                            }
                            case 'switch-entity': {
                                var palette_2 = ponyInfo_1.mockPaletteManager.addArray(sprites.hammer.palettes[0]);
                                batch.drawSprite(sprites.hammer.color, colors_1.WHITE, palette_2, 2, 2);
                                break;
                            }
                            case 'switch-entity-rev': {
                                var palette_3 = ponyInfo_1.mockPaletteManager.addArray(sprites.hammer.palettes[0]);
                                batch.drawSprite(sprites.hammer.color, colors_1.WHITE, palette_3, 2, 3);
                                batch.drawSprite(sprites.arrow_left, colors_1.BLACK, defaultPalette, 1, 1);
                                break;
                            }
                            case 'switch-tile': {
                                var palette_4 = ponyInfo_1.mockPaletteManager.addArray(sprites.hammer.palettes[0]);
                                batch.drawSprite(sprites.hammer.color, colors_1.WHITE, palette_4, 2, 2);
                                break;
                            }
                            default:
                                throw new Error("Invalid action: " + action.action);
                        }
                    });
                }
                context.fillStyle = colors_1.ACTION_ACTION_BG;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.scale(scale, scale);
                context.drawImage(buffer, 0, 0);
                break;
            }
            case 'item': {
                var buffer = contextSpriteBatch_1.drawCanvas(bufferSize, bufferSize, sprites.paletteSpriteSheet, undefined, function (batch) {
                    var palette = ponyInfo_1.mockPaletteManager.addArray(action.icon.palettes[0]);
                    var sprite = action.icon.color;
                    batch.drawSprite(sprite, colors_1.WHITE, palette, Math.round((15 - sprite.w) / 2), Math.round((15 - sprite.h) / 2) + 1);
                });
                context.fillStyle = colors_1.ACTION_ITEM_BG;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.scale(scale, scale);
                context.drawImage(buffer, -0.5, -0.5);
                break;
            }
            case 'entity': {
                if (BETA) {
                    var types = model_1.getEntityTypesFromName(action.entity) || [];
                    var size_1 = bufferSize * scale;
                    var entities_2 = types.map(function (type) { return entities_1.createAnEntity(type, 0, 0, 0, {}, ponyInfo_1.mockPaletteManager, game); });
                    // createAnEntity(type, 0, toWorldX(size / 2 - 2), toWorldY(size * 0.75), {}, mockPaletteManager));
                    var bounds = lodash_1.compact(entities_2.map(function (e) { return e.bounds; })).reduce(rect_1.addRects, rect_1.rect(0, 0, 0, 0));
                    var center_1 = rect_1.centerPoint(bounds);
                    var buffer = contextSpriteBatch_1.drawCanvas(size_1, size_1, sprites.paletteSpriteSheet, undefined, function (batch) {
                        for (var _i = 0, entities_3 = entities_2; _i < entities_3.length; _i++) {
                            var entity = entities_3[_i];
                            if (entity.draw) {
                                entity.x += positionUtils_1.toWorldX(size_1 / 2 - 2 - center_1.x);
                                entity.y += positionUtils_1.toWorldY(size_1 / 2 - center_1.y);
                                entity.draw(batch, __assign({}, interfaces_1.defaultDrawOptions, { shadowColor: colors_1.TRANSPARENT }));
                            }
                        }
                    });
                    context.fillStyle = colors_1.ENTITY_ITEM_BG;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(buffer, 0, 0);
                }
                break;
            }
        }
    }
    context.restore();
}
exports.drawAction = drawAction;
function drawLie(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.lie });
    ponyDraw_1.drawPony(batch, actionPony, state, -6, 15, ponyHelpers_1.defaultDrawPonyOptions());
}
function drawLieDisabled(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.lie });
    batch.drawRect(ACTION_ACTION_BG_DISABLED, 0, 0, 50, 50);
    ponyDraw_1.drawPony(batch, actionPonyDisabled, state, -6, 15, ponyHelpers_1.defaultDrawPonyOptions());
}
function drawSit(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.sit });
    ponyDraw_1.drawPony(batch, actionPony, state, -6, 15, ponyHelpers_1.defaultDrawPonyOptions());
}
function drawStand(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.stand });
    ponyDraw_1.drawPony(batch, actionPony, state, -1, 15, ponyHelpers_1.defaultDrawPonyOptions());
}
function drawFly(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.fly });
    ponyDraw_1.drawPony(batch, actionPonyWithWings, state, 0, 30, ponyHelpers_1.defaultDrawPonyOptions());
}
function drawFlyDisabled(batch) {
    var state = __assign({}, createState(), { animation: ponyAnimations_1.fly });
    batch.drawRect(ACTION_ACTION_BG_DISABLED, 0, 0, 50, 50);
    ponyDraw_1.drawPony(batch, actionPonyWithWingsDisabled, state, 0, 30, ponyHelpers_1.defaultDrawPonyOptions());
}
function getDrawFuncByName(name) {
    switch (name) {
        case 'lie': return drawLie;
        case 'sit': return drawSit;
        case 'stand': return drawStand;
        case 'fly': return drawFly;
        case 'flyDisabled': return drawFlyDisabled;
        case 'lieDisabled': return drawLieDisabled;
        default:
            throw new Error("Invalid name: " + name);
    }
}
function getUpDrawFunc(game) {
    var player = game.player;
    if (player) {
        if (entityUtils_1.isPonyLying(player)) {
            return 'sit';
        }
        else if (entityUtils_1.isPonySitting(player)) {
            return 'stand';
        }
        else if (entityUtils_1.isPonyStanding(player) && pony_1.canPonyFly(player)) {
            return 'fly';
        }
    }
    return 'flyDisabled';
}
function getDownDrawFunc(game) {
    var player = game.player;
    if (player) {
        if (entityUtils_1.isPonySitting(player)) {
            return 'lie';
        }
        else if (entityUtils_1.isPonyStanding(player)) {
            return 'sit';
        }
        else if (entityUtils_1.isPonyFlying(player)) {
            return 'stand';
        }
    }
    return 'lieDisabled';
}
