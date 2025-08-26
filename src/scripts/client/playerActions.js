"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var pony_1 = require("../common/pony");
var entityUtils_1 = require("../common/entityUtils");
var constants_1 = require("../common/constants");
var stringUtils_1 = require("../common/stringUtils");
var worldMap_1 = require("../common/worldMap");
var rect_1 = require("../common/rect");
var positionUtils_1 = require("../common/positionUtils");
var entities_1 = require("../common/entities");
function handleActionCommand(message, game) {
    if (utils_1.isCommand(message)) {
        var _a = utils_1.processCommand(message).command, command = _a === void 0 ? '' : _a;
        var player = game.player;
        if (DEVELOPMENT) {
            if (command === 'spammessages') {
                var i_1 = 0;
                setInterval(function () { return game.send(function (server) { return server.say(0, stringUtils_1.randomString(5) + (" #" + i_1++), 0 /* Say */); }); }, 100);
                return true;
            }
        }
        switch (command.toLowerCase()) {
            case 'testerrorreporting':
                throw new Error('test error');
            case 'disablepixelratio':
                game.togglePixelRatio();
                return true;
            case 'lie':
            case 'lay':
                if (player) {
                    if (entityUtils_1.isPonyLying(player)) {
                        sitAction(player, game);
                    }
                    else {
                        lieAction(player, game);
                    }
                }
                return true;
            case 'sit':
                if (player) {
                    if (entityUtils_1.isPonyFlying(player)) {
                        standAction(player, game);
                    }
                    else {
                        sitAction(player, game);
                    }
                }
                return true;
            case 'stand':
                if (player) {
                    standAction(player, game);
                }
                return true;
            case 'fly':
                if (player) {
                    if (entityUtils_1.isPonyFlying(player)) {
                        standAction(player, game);
                    }
                    else {
                        flyAction(player, game);
                    }
                }
                return true;
        }
    }
    return false;
}
exports.handleActionCommand = handleActionCommand;
function upAction(game) {
    var player = game.player;
    if (player) {
        if (entityUtils_1.isPonyLying(player)) {
            sitAction(player, game);
        }
        else if (entityUtils_1.isPonySitting(player)) {
            standAction(player, game);
        }
        else if (entityUtils_1.isPonyStanding(player)) {
            flyAction(player, game);
        }
    }
}
exports.upAction = upAction;
function downAction(game) {
    var player = game.player;
    if (player) {
        if (entityUtils_1.isPonySitting(player)) {
            lieAction(player, game);
        }
        else if (entityUtils_1.isPonyStanding(player)) {
            sitAction(player, game);
        }
        else if (entityUtils_1.isPonyFlying(player)) {
            standAction(player, game);
        }
    }
}
exports.downAction = downAction;
function sitAction(player, game) {
    if (pony_1.canPonySit(player, game.map) && game.send(function (server) { return server.action(6 /* Sit */); })) {
        player.state = entityUtils_1.setPonyState(player.state, 48 /* PonySitting */);
        game.stateOverride = 48 /* PonySitting */;
        game.onActionsUpdate.next();
    }
}
exports.sitAction = sitAction;
function standAction(player, game) {
    if (pony_1.canPonyStand(player, game.map) && game.send(function (server) { return server.action(10 /* Stand */); })) {
        player.state = entityUtils_1.setPonyState(player.state, 0 /* PonyStanding */);
        game.stateOverride = 0 /* PonyStanding */;
        game.onActionsUpdate.next();
    }
}
exports.standAction = standAction;
function lieAction(player, game) {
    if (pony_1.canPonyLie(player, game.map) && game.send(function (server) { return server.action(7 /* Lie */); })) {
        player.state = entityUtils_1.setPonyState(player.state, 64 /* PonyLying */);
        game.stateOverride = 64 /* PonyLying */;
        game.onActionsUpdate.next();
    }
}
exports.lieAction = lieAction;
function flyAction(player, game) {
    if (pony_1.canPonyFlyUp(player) && game.send(function (server) { return server.action(8 /* Fly */); })) {
        player.state = entityUtils_1.setPonyState(player.state, 80 /* PonyFlying */);
        player.inTheAirDelay = constants_1.FLY_DELAY;
        game.stateOverride = 80 /* PonyFlying */;
        game.onActionsUpdate.next();
    }
}
exports.flyAction = flyAction;
function boopAction(game) {
    if (game.player && entityUtils_1.canBoop(game.player) && game.send(function (server) { return server.action(1 /* Boop */); })) {
        pony_1.doBoopPonyAction(game, game.player);
    }
}
exports.boopAction = boopAction;
function turnHeadAction(game) {
    if (game.player && game.send(function (server) { return server.action(2 /* TurnHead */); })) {
        game.player.state = game.player.state ^ 4 /* HeadTurned */;
        game.headTurnedOverride = utils_1.hasFlag(game.player.state, 4 /* HeadTurned */);
        game.onActionsUpdate.next();
    }
}
exports.turnHeadAction = turnHeadAction;
function interact(game, shift) {
    var player = game.player;
    if (player) {
        var bounds = entityUtils_1.getInteractBounds(player);
        var entities = worldMap_1.pickEntitiesByRect(game.map, bounds, true, false);
        var center = rect_1.centerPoint(bounds);
        center.x += (bounds.w / 4) * (entityUtils_1.isFacingRight(player) ? -1 : 1);
        var entity_1 = entityUtils_1.closestEntity(positionUtils_1.pointToWorld(center), entities);
        if (entity_1 && entityUtils_1.entityInRange(entity_1, player)) {
            game.send(function (server) { return server.interact(entity_1.id); });
        }
        else if (player.hold === entities_1.hammer.type) {
            game.changePlaceEntity(shift);
        }
        else if (player.hold === entities_1.shovel.type) {
            game.changePlaceTile(shift);
        }
        else if (player.ponyState.holding && utils_1.hasFlag(player.ponyState.holding.flags, 8 /* Usable */)) {
            game.send(function (server) { return server.use(); });
        }
    }
}
exports.interact = interact;
function toggleWall(game, hover) {
    var x = hover.x | 0;
    var y = hover.y | 0;
    var dx = hover.x - x;
    var dy = hover.y - y;
    if (dx > dy) {
        if ((dx + dy) < 1) {
            game.send(function (server) { return server.changeTile(x, y, 100 /* WallH */); });
        }
        else {
            game.send(function (server) { return server.changeTile(x + 1, y, 101 /* WallV */); });
        }
    }
    else {
        if ((dx + dy) < 1) {
            game.send(function (server) { return server.changeTile(x, y, 101 /* WallV */); });
        }
        else {
            game.send(function (server) { return server.changeTile(x, y + 1, 100 /* WallH */); });
        }
    }
}
exports.toggleWall = toggleWall;
function editorSelectEntities(game, hover, shift) {
    game.apply(function () {
        var entities = worldMap_1.pickAnyEntities(game.map, hover);
        if (shift) {
            var entity = entities.filter(function (e) { return !utils_1.includes(game.editor.selectedEntities, e); })[0];
            entity && game.editor.selectedEntities.push(entity);
        }
        else {
            var index = entities.findIndex(function (e) { return utils_1.includes(game.editor.selectedEntities, e); });
            var entity = entities[(index + 1) % entities.length];
            game.editor.selectedEntities = entity ? [entity] : [];
        }
    });
}
exports.editorSelectEntities = editorSelectEntities;
function editorDragEntities(game, hover, buttonPressed) {
    if (buttonPressed) {
        var dx_1 = hover.x - game.editor.draggingStart.x;
        var dy_1 = hover.y - game.editor.draggingStart.y;
        game.editor.selectedEntities.forEach(function (e) {
            e.x = positionUtils_1.roundPositionX(e.draggingStart.x + dx_1);
            e.y = positionUtils_1.roundPositionY(e.draggingStart.y + dy_1);
        });
    }
    else {
        game.apply(function () { return game.editor.draggingEntities = false; });
        game.send(function (server) { return server.editorAction({
            type: 'move',
            entities: game.editor.selectedEntities.map(function (_a) {
                var id = _a.id, x = _a.x, y = _a.y;
                return ({ id: id, x: x, y: y });
            }),
        }); });
    }
}
exports.editorDragEntities = editorDragEntities;
function editorMoveEntities(game, hover) {
    game.editor.draggingEntities = true;
    game.editor.draggingStart = hover;
    game.editor.selectedEntities.forEach(function (e) { return e.draggingStart = utils_1.point(e.x, e.y); });
}
exports.editorMoveEntities = editorMoveEntities;
