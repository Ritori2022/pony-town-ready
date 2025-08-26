"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var browser_1 = require("ag-sockets/dist/browser");
var utf8_1 = require("ag-sockets/dist/utf8");
var interfaces_1 = require("../common/interfaces");
var utils_1 = require("../common/utils");
var camera_1 = require("../common/camera");
var region_1 = require("../common/region");
var entities_1 = require("../common/entities");
var entityUtils_1 = require("../common/entityUtils");
var pony_1 = require("../common/pony");
var sec_1 = require("./sec");
var constants_1 = require("../common/constants");
var clientUtils_1 = require("./clientUtils");
var graphicsUtils_1 = require("../graphics/graphicsUtils");
var updateDecoder_1 = require("../common/encoders/updateDecoder");
var entityUtils_2 = require("../common/entityUtils");
var compressPony_1 = require("../common/compressPony");
var ponyInfo_1 = require("../common/ponyInfo");
var ponyAnimations_1 = require("./ponyAnimations");
var worldMap_1 = require("../common/worldMap");
var gameUtils_1 = require("./gameUtils");
var model_1 = require("../components/services/model");
var collision_1 = require("../common/collision");
var draw_1 = require("./draw");
function log(message) {
    if (DEVELOPMENT && !TESTS) {
        console.error(message);
    }
}
function handleAddEntity(game, region, update, initial) {
    var id = update.id, _a = update.type, type = _a === void 0 ? 0 : _a, _b = update.x, x = _b === void 0 ? 0 : _b, _c = update.y, y = _c === void 0 ? 0 : _c, _d = update.vx, vx = _d === void 0 ? 0 : _d, _e = update.vy, vy = _e === void 0 ? 0 : _e, _f = update.state, state = _f === void 0 ? 0 : _f, _g = update.playerState, playerState = _g === void 0 ? 0 : _g, _h = update.options, options = _h === void 0 ? {} : _h, name = update.name, filterName = update.filterName, info = update.info, _j = update.crc, crc = _j === void 0 ? 0 : _j, action = update.action // , expression
    ;
    var filteredName = filterEntityName(game, name, filterName);
    var entity = createEntityOrPony(game, type, id, x, y, options, crc, filteredName, info, state);
    entity.id = id;
    entity.x = x;
    entity.y = y;
    entity.vx = vx;
    entity.vy = vy;
    entity.playerState = playerState || 0 /* None */;
    worldMap_1.addEntityToMapRegion(game.map, region, entity);
    if (pony_1.isPony(entity)) {
        if (id === game.playerId) {
            game.apply(function () { return sec_1.setupPlayer(game, entity); });
        }
        if (gameUtils_1.isSelected(game, id)) {
            game.select(entity);
        }
        if (game.whisperTo && game.whisperTo.id === id) {
            game.whisperTo = entity;
        }
        if (!initial) {
            game.onPonyAddOrUpdate.next(entity);
        }
    }
    if (action !== undefined) {
        handleAction(game, id, action);
    }
}
function handleUpdateEntity(game, update) {
    var id = update.id, x = update.x, y = update.y, vx = update.vx, vy = update.vy, state = update.state, playerState = update.playerState, expression = update.expression, options = update.options, switchRegion = update.switchRegion, name = update.name, filterName = update.filterName, info = update.info, _a = update.crc, crc = _a === void 0 ? 0 : _a, action = update.action;
    var filteredName = filterEntityName(game, name, filterName);
    var entity = findEntityByIdInGame(game, id);
    if (entity) {
        var isPlayer = id === game.playerId;
        if (x !== undefined && y !== undefined) {
            if (switchRegion) {
                if (DEVELOPMENT && isPlayer && !worldMap_1.getRegionGlobal(game.map, x, y)) {
                    console.error("Switching player to unsubscribed region");
                }
                worldMap_1.switchEntityRegion(game.map, entity, x, y);
            }
            if (!isPlayer) {
                // if (DEVELOPMENT && isPony(entity)) {
                // 	const dx = entity.x - x;
                // 	const dy = entity.y - y;
                // 	console.log(`adjust x: [${num(dx)}] (${ms(dx)}) y: [${num(dy)}] (${ms(dy)})`);
                // }
                entity.x = x;
                entity.y = y;
                entityUtils_2.updateEntityVelocity(game.map, entity, vx, vy);
                if (collision_1.canCollideWith(entity)) {
                    var rx = region_1.worldToRegionX(entity.x, game.map);
                    var ry = region_1.worldToRegionY(entity.y, game.map);
                    for (var y_1 = -1; y_1 <= 1; y_1++) {
                        for (var x_1 = -1; x_1 <= 1; x_1++) {
                            var region = worldMap_1.getRegionUnsafe(game.map, rx + x_1, ry + y_1);
                            if (region) {
                                region.colliderDirty = true;
                            }
                        }
                    }
                }
            }
            else if (utils_1.distanceXY(entity.x, entity.y, x, y) > 8) {
                log("Fixing player position (" + entity.x + ", " + entity.y + ") => (" + x + ", " + y + ")");
                entity.x = x;
                entity.y = y;
                sec_1.savePlayerPosition();
            }
        }
        if (state !== undefined) {
            updateEntityStateInternal(game, entity, state);
        }
        if (playerState !== undefined) {
            updateEntityPlayerStateInternal(game, entity, playerState);
        }
        if (expression !== undefined && pony_1.isPony(entity)) {
            pony_1.setPonyExpression(entity, expression);
        }
        if (options != null) {
            updateEntityOptionsInternal(entity, options, game);
        }
        if (filteredName !== undefined && !isPlayer) {
            entity.name = filteredName;
        }
        if (info !== undefined && !isPlayer) {
            var ponyInfo = utils_1.bitmask(info, constants_1.PONY_INFO_KEY);
            if (entity.fake) {
                entity.palettePonyInfo = compressPony_1.decodePonyInfo(ponyInfo, ponyInfo_1.mockPaletteManager);
            }
            else {
                updatePonyInfoWithPoof(game, entity, ponyInfo, crc);
            }
        }
        if (action !== undefined) {
            handleAction(game, id, action);
        }
        applyIfSelected(game, id);
    }
    else {
        log("handleUpdateEntity: missing entity: " + id);
    }
}
exports.handleUpdateEntity = handleUpdateEntity;
function handleUpdatePonies(game, ponies) {
    for (var _i = 0, ponies_1 = ponies; _i < ponies_1.length; _i++) {
        var _a = ponies_1[_i], id = _a[0], _b = _a[1], options = _b === void 0 ? {} : _b, name_1 = _a[2], info = _a[3], playerState = _a[4], nameBad = _a[5];
        var decodedName = name_1 && utf8_1.decodeString(name_1) || undefined;
        var filteredName = filterEntityName(game, decodedName, nameBad);
        var decodedInfo = info ? utils_1.bitmask(info, constants_1.PONY_INFO_KEY) : '';
        var pony = createPonyEntity(game, id, options, filteredName, decodedInfo, 0 /* None */);
        pony.playerState = playerState;
        game.fallbackPonies.set(pony.id, pony);
    }
    var missing = game.party && game.party.members.filter(function (p) { return !p.pony; });
    if (missing && missing.length) {
        game.apply(function () { return missing.forEach(function (p) { return p.pony = game.fallbackPonies.get(p.id); }); });
    }
}
exports.handleUpdatePonies = handleUpdatePonies;
function createPonyEntity(game, id, options, name, info, state) {
    if (!game.webgl) {
        throw new Error('WebGL not initialized');
    }
    var pony = pony_1.createPony(id, state, info, game.webgl.palettes.defaultPalette, game.paletteManager);
    if (name) {
        pony.name = name;
    }
    updateEntityOptionsInternal(pony, options, game);
    // bypass name/info filtering for player pony
    if (id === game.playerId) {
        if (game.playerName) {
            pony.name = game.playerName;
        }
        if (game.playerInfo) {
            pony.crc = game.playerCRC;
            pony_1.updatePonyInfo(pony, game.playerInfo, game.applyChanges);
        }
    }
    return pony;
}
function updateEntityStateInternal(game, entity, state) {
    if (entity === game.player) {
        var right = game.rightOverride;
        var headTurned = game.headTurnedOverride;
        var stateOverride = game.stateOverride;
        if (right !== undefined) {
            state = utils_1.setFlag(state, 2 /* FacingRight */, right);
            game.rightOverride = undefined;
        }
        if (headTurned !== undefined) {
            state = utils_1.setFlag(state, 4 /* HeadTurned */, headTurned);
            game.headTurnedOverride = undefined;
        }
        if (stateOverride !== undefined) {
            if (stateOverride !== entityUtils_1.getPonyState(state)) {
                state = entityUtils_1.setPonyState(state, stateOverride);
            }
            game.stateOverride = undefined;
        }
        game.onActionsUpdate.next();
    }
    var wasPonyFlying = entityUtils_1.isPonyFlying(entity);
    var hadLight = draw_1.hasDrawLight(entity);
    var hadLightSprite = draw_1.hasLightSprite(entity);
    entity.state = state;
    if (!wasPonyFlying && entityUtils_1.isPonyFlying(entity) && pony_1.isPony(entity)) {
        entity.inTheAirDelay = constants_1.FLY_DELAY;
    }
    var hasLight = draw_1.hasDrawLight(entity);
    var hasLightSprite1 = draw_1.hasLightSprite(entity);
    worldMap_1.addOrRemoveFromEntityList(game.map.entitiesLight, entity, hadLight, hasLight);
    worldMap_1.addOrRemoveFromEntityList(game.map.entitiesLightSprite, entity, hadLightSprite, hasLightSprite1);
}
function updateEntityPlayerStateInternal(game, entity, playerState) {
    if (!entity.fake && !entityUtils_1.isHidden(entity) && utils_1.hasFlag(playerState, 2 /* Hidden */)) {
        playEffect(game, entity, entities_1.poof.type);
        if (gameUtils_1.isSelected(game, entity.id)) {
            game.select(undefined);
        }
    }
    entity.playerState = playerState;
}
function findEntityByIdInGame(game, id) {
    var entity = worldMap_1.findEntityById(game.map, id);
    if (!entity && gameUtils_1.isSelected(game, id)) {
        entity = game.selected;
    }
    return entity;
}
function applyIfSelected(game, id) {
    if (gameUtils_1.isSelected(game, id)) {
        game.applyChanges();
    }
}
function handleUpdates(game, updates) {
    var reader = browser_1.createBinaryReader(updates);
    while (reader.offset < reader.view.byteLength) {
        var type = browser_1.readUint8(reader);
        switch (type) {
            case 0 /* None */:
                log("handleUpdates (none)");
                break;
            case 1 /* AddEntity */: {
                var update = updateDecoder_1.readOneUpdate(reader);
                var _a = update.x, x = _a === void 0 ? 0 : _a, _b = update.y, y = _b === void 0 ? 0 : _b;
                var region = worldMap_1.getRegionGlobal(game.map, x, y);
                if (region) {
                    handleAddEntity(game, region, update, false);
                }
                else {
                    log("handleUpdates (add): missing region at " + x + " " + y);
                }
                break;
            }
            case 2 /* UpdateEntity */: {
                var update = updateDecoder_1.readOneUpdate(reader);
                handleUpdateEntity(game, update);
                break;
            }
            case 3 /* RemoveEntity */: {
                var id = browser_1.readUint32(reader);
                handleRemoveEntity(game, id);
                break;
            }
            case 4 /* UpdateTile */: {
                var x = browser_1.readUint16(reader);
                var y = browser_1.readUint16(reader);
                var type_1 = browser_1.readUint8(reader);
                worldMap_1.setTile(game.map, x, y, type_1);
                break;
            }
            default:
                utils_1.invalidEnum(type);
        }
    }
}
exports.handleUpdates = handleUpdates;
function updatePonyInfoWithPoof(game, entity, info, crc) {
    var update = function (pony) {
        pony.crc = crc;
        pony_1.updatePonyInfo(pony, info, game.applyChanges);
        game.onPonyAddOrUpdate.next(pony);
    };
    if (entity && pony_1.isPony(entity)) {
        if (entityUtils_1.isHidden(entity)) {
            update(entity);
        }
        else {
            playEffect(game, entity, entities_1.poof2.type);
            setTimeout(function () { return update(entity); }, 100);
        }
    }
}
exports.updatePonyInfoWithPoof = updatePonyInfoWithPoof;
function handleRemoveEntity(game, id) {
    var entity = worldMap_1.findEntityById(game.map, id);
    if (entity) {
        worldMap_1.removeEntity(game.map, entity);
    }
    else {
        log("handleRemoveEntity: Missing entity: " + id);
    }
    if (id === game.playerId) {
        log("handleRemoveEntity: Removing player");
    }
    if (entity && entity.type === constants_1.PONY_TYPE) {
        playEffect(game, entity, entities_1.poof.type);
    }
    if (gameUtils_1.isSelected(game, id)) {
        setTimeout(function () {
            if (gameUtils_1.isSelected(game, id)) {
                game.select(undefined);
            }
        }, 15 * constants_1.SECOND);
    }
}
exports.handleRemoveEntity = handleRemoveEntity;
function findPonyById(map, id) {
    var entity = worldMap_1.findEntityById(map, id);
    return entity && pony_1.isPony(entity) ? entity : undefined;
}
function handleAction(game, id, action) {
    var pony = findPonyById(game.map, id);
    if (pony) {
        switch (action) {
            case 1 /* Boop */:
                pony_1.doBoopPonyAction(game, pony);
                break;
            case 12 /* HoldPoof */:
                pony_1.doPonyAction(pony, 3 /* HoldPoof */);
                break;
            case 3 /* Yawn */:
                if (!pony_1.hasHeadAnimation(pony)) {
                    pony_1.setHeadAnimation(pony, ponyAnimations_1.yawn);
                }
                break;
            case 4 /* Laugh */:
                if (!pony_1.hasHeadAnimation(pony)) {
                    pony_1.setHeadAnimation(pony, ponyAnimations_1.laugh);
                }
                break;
            case 5 /* Sneeze */:
                if (!pony_1.hasHeadAnimation(pony)) {
                    pony_1.setHeadAnimation(pony, ponyAnimations_1.sneeze);
                }
                break;
            default:
                log("handleAction: Invalid action: " + action);
        }
    }
    else {
        log("handleAction: Missing entity: " + id);
    }
}
exports.handleAction = handleAction;
function playEffect(game, target, type) {
    if (entityUtils_1.isHidden(target))
        return;
    try {
        var entity_1 = entities_1.createAnEntity(type, 0, target.x, target.y, {}, game.paletteManager, game);
        worldMap_1.addEntity(game.map, entity_1);
        setTimeout(function () { return worldMap_1.removeEntityDirectly(game.map, entity_1); }, 1000);
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
}
exports.playEffect = playEffect;
function findEntityOrMockByAnyMeans(game, id) {
    if (!id) {
        return undefined;
    }
    var entity = worldMap_1.findEntityById(game.map, id);
    if (!entity && game.party) {
        var member = utils_1.findById(game.party.members, id);
        entity = member && member.pony;
    }
    if (!entity) {
        var friend = game.model.friends && game.model.friends.find(function (f) { return f.entityId === id; });
        if (friend) {
            entity = { fake: true, type: constants_1.PONY_TYPE, id: friend.entityId, name: friend.actualName, crc: friend.crc };
        }
    }
    if (!entity) {
        entity = game.findEntityFromChatLog(id);
    }
    return entity;
}
exports.findEntityOrMockByAnyMeans = findEntityOrMockByAnyMeans;
function findBestEntityByName(game, name) {
    var regex = new RegExp("^" + lodash_1.escapeRegExp(name) + "$", 'i');
    if (game.model.friends) {
        for (var _i = 0, _a = game.model.friends; _i < _a.length; _i++) {
            var friend = _a[_i];
            if (friend.online && friend.entityId && regex.test(friend.actualName)) {
                return { fake: true, type: constants_1.PONY_TYPE, id: friend.entityId, name: friend.actualName, crc: friend.crc };
            }
        }
    }
    var result = undefined;
    if (game.player) {
        for (var _b = 0, _c = game.map.entities; _b < _c.length; _b++) {
            var entity = _c[_b];
            if (entity.type === constants_1.PONY_TYPE && entity.id !== game.playerId && !entityUtils_1.isHidden(entity) && entity.name && regex.test(entity.name)) {
                if (!result || (utils_1.distance(game.player, entity) < utils_1.distance(game.player, result))) {
                    result = entity;
                }
            }
        }
    }
    if (!result) {
        result = game.findEntityFromChatLogByName(name);
    }
    return result;
}
exports.findBestEntityByName = findBestEntityByName;
function findMatchingEntityNames(game, match) {
    var result = [];
    var ids = new Set();
    var regex = new RegExp("^" + lodash_1.escapeRegExp(match), 'i');
    if (game.model.friends) {
        for (var _i = 0, _a = game.model.friends; _i < _a.length; _i++) {
            var friend = _a[_i];
            if (friend.online && friend.entityId && friend.actualName && regex.test(friend.actualName)) {
                ids.add(friend.entityId);
                result.push(friend.actualName);
            }
        }
    }
    for (var _b = 0, _c = game.map.entities; _b < _c.length; _b++) {
        var entity = _c[_b];
        if (entity.type === constants_1.PONY_TYPE &&
            entity.id !== game.playerId &&
            entity.name &&
            !entityUtils_1.isHidden(entity) &&
            regex.test(entity.name) &&
            !ids.has(entity.id)) {
            result.push(entity.name);
        }
    }
    return result;
}
exports.findMatchingEntityNames = findMatchingEntityNames;
var cachedFilter = undefined;
var cachedRegex = undefined;
function containsFilteredWords(message, filter) {
    if (cachedFilter !== filter) {
        if (filter) {
            var words = lodash_1.compact(filter.replace(/[,]/g, ' ').split(/[\r\n\t ]+/g).map(function (x) { return x.trim(); }));
            cachedRegex = new RegExp("(^| )(" + words.map(lodash_1.escapeRegExp).join('|') + ")($| )", 'i');
        }
        else {
            cachedRegex = undefined;
        }
        cachedFilter = filter;
    }
    return cachedRegex && cachedRegex.test(message);
}
exports.containsFilteredWords = containsFilteredWords;
function handleSays(game, id, message, type) {
    var entity = findEntityOrMockByAnyMeans(game, id);
    if (entity) {
        handleSay(game, entity, message, type);
    }
    else {
        DEVELOPMENT && console.warn('incomplete say');
        game.incompleteSays.push({ id: id, message: message, type: type, time: Date.now() });
        game.send(function (server) { return server.actionParam2(24 /* RequestEntityInfo */, id); });
    }
}
exports.handleSays = handleSays;
function isFriendEntityId(game, id) {
    if (game.model.friends) {
        for (var _i = 0, _a = game.model.friends; _i < _a.length; _i++) {
            var friend = _a[_i];
            if (friend.entityId === id) {
                return true;
            }
        }
    }
    return false;
}
function shouldShowChatMessage(game, entity, message, type) {
    if (entity === game.player)
        return true;
    if (interfaces_1.isWhisperTo(type))
        return true;
    if (interfaces_1.isWhisper(type) && isFriendEntityId(game, entity.id))
        return true;
    if (interfaces_1.isPublicMessage(type) && !entity.fake && !camera_1.isChatVisible(game.camera, entity))
        return false;
    if (interfaces_1.isNonIgnorableMessage(type))
        return true;
    if (game.settings.account.filterCyrillic && clientUtils_1.containsCyrillic(message))
        return false;
    if (game.settings.account.ignorePublicChat && interfaces_1.isPublicMessage(type))
        return false;
    if (interfaces_1.isWhisper(type) && game.settings.account.ignoreNonFriendWhispers)
        return false;
    if (containsFilteredWords(message, game.settings.account.filterWords))
        return false;
    return true;
}
function isChatInRange(entity, player, range) {
    return player === undefined || constants_1.isChatlogRangeUnlimited(range) || utils_1.distance(entity, player) < range;
}
function shouldShowChatMessageInChatlog(game, entity, type) {
    if (entity.type !== constants_1.PONY_TYPE)
        return false;
    if (entity.fake)
        return true;
    if (!interfaces_1.isPublicMessage(type))
        return true;
    if (!isChatInRange(entity, game.player, game.settings.account.chatlogRange))
        return false;
    return true;
}
function handleSay(game, entity, message, type) {
    if (!shouldShowChatMessage(game, entity, message, type))
        return;
    if (type === 12 /* Dismiss */ || message === '.') {
        if (!entity.fake && entity.says) {
            graphicsUtils_1.dismissSays(entity.says);
        }
    }
    else {
        var bubbleEntity = interfaces_1.isWhisperTo(type) ? game.player : entity;
        if (bubbleEntity && !bubbleEntity.fake && game.map.entitiesById.has(bubbleEntity.id)) {
            var total = clientUtils_1.getSaysTime(message);
            entityUtils_1.addChatBubble(game.map, bubbleEntity, { message: message, type: type, total: total, timer: total, created: Date.now() });
        }
        if (interfaces_1.isWhisper(type)) {
            var friend = game.model.friends && game.model.friends.find(function (f) { return f.entityId === entity.id; });
            game.lastWhisperFrom = { entityId: entity.id, accountId: friend && friend.accountId };
        }
        if (shouldShowChatMessageInChatlog(game, entity, type)) {
            var id = entity.id, _a = entity.name, name_2 = _a === void 0 ? '' : _a, crc = entity.crc;
            game.messageQueue.push({ id: id, crc: crc, name: name_2, message: message, type: type });
        }
    }
}
exports.handleSay = handleSay;
function handleEntityInfo(game, id, name, crc, nameBad) {
    name = filterEntityName(game, name, nameBad);
    for (var i = 0; i < game.incompleteSays.length;) {
        var say = game.incompleteSays[i];
        if (say.id === id) {
            game.incompleteSays.splice(i, 1);
            var entity = { fake: true, type: constants_1.PONY_TYPE, id: id, name: name, crc: crc };
            handleSay(game, entity, say.message, say.type);
        }
        else {
            i++;
        }
    }
}
exports.handleEntityInfo = handleEntityInfo;
function subscribeRegion(game, data) {
    var _a = updateDecoder_1.decodeUpdate(data), x = _a.x, y = _a.y, updates = _a.updates, tileData = _a.tileData;
    var region = region_1.createRegion(x, y, tileData);
    var initial = !game.loaded;
    worldMap_1.setRegion(game.map, x, y, region);
    for (var _i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
        var update = updates_1[_i];
        handleAddEntity(game, region, update, initial);
    }
}
exports.subscribeRegion = subscribeRegion;
function filterEntityName(_a, name, nameBad) {
    var settings = _a.settings, worldFlags = _a.worldFlags;
    if (name && nameBad && (settings.account.filterSwearWords || utils_1.hasFlag(worldFlags, 1 /* Safe */))) {
        return lodash_1.repeat('*', name.length);
    }
    else if (name && containsFilteredWords(name, settings.account.filterWords)) {
        return lodash_1.repeat('?', name.length);
    }
    else {
        return name;
    }
}
exports.filterEntityName = filterEntityName;
function createEntityOrPony(game, type, id, x, y, options, crc, name, info, state) {
    if (type === constants_1.PONY_TYPE) {
        var entity_2 = createPonyEntity(game, id, options, name, info ? utils_1.bitmask(info, constants_1.PONY_INFO_KEY) : '', state);
        var member_1 = game.party && game.party.members.find(function (p) { return p.id === id; });
        entity_2.crc = crc;
        if (member_1) {
            game.apply(function () { return member_1.pony = entity_2; });
        }
        if (gameUtils_1.isSelected(game, id)) {
            game.select(entity_2);
        }
        return entity_2;
    }
    else {
        var entity = entities_1.createAnEntity(type, id, x, y, options, game.paletteManager, game);
        entity.state = state;
        if (name) {
            entity.name = name;
        }
        return entity;
    }
}
function updateEntityOptionsInternal(entity, options, game) {
    Object.assign(entity, options);
    if (pony_1.isPony(entity) && 'hold' in options) {
        pony_1.updatePonyHold(entity, game);
    }
}
function handleUpdateFriends(game, friends, removeMissing) {
    if (!game.model.friends)
        return;
    var _loop_1 = function (accountId, accountName, status_1, entityId, name_3, info, crc, nameBad) {
        var friend = game.model.friends.find(function (f) { return f.accountId === accountId; });
        if (utils_1.hasFlag(status_1, 2 /* Remove */)) {
            if (friend) {
                utils_1.removeItem(game.model.friends, friend);
            }
        }
        else {
            if (!friend) {
                friend = {
                    accountId: accountId,
                    accountName: '',
                    online: false,
                    name: undefined,
                    nameBad: false,
                    pony: undefined,
                    entityId: 0,
                    crc: 0,
                    ponyInfo: undefined,
                    actualName: '',
                };
                game.model.friends.push(friend);
            }
            friend.online = utils_1.hasFlag(status_1, 1 /* Online */);
            if (accountName !== undefined) {
                friend.accountName = accountName;
            }
            if (entityId !== undefined) {
                if (game.lastWhisperFrom && game.lastWhisperFrom.accountId === friend.accountId) {
                    game.lastWhisperFrom.entityId = entityId;
                }
                game.onEntityIdUpdate.next({ old: friend.entityId, new: entityId });
                friend.entityId = entityId;
            }
            if (name_3 !== undefined) {
                friend.name = name_3;
                friend.nameBad = nameBad;
                friend.actualName = filterEntityName(game, name_3, nameBad) || '';
            }
            if (crc !== undefined) {
                friend.crc = crc;
            }
            if (info !== undefined) {
                friend.pony = info;
                friend.ponyInfo = compressPony_1.decodePonyInfo(info, ponyInfo_1.mockPaletteManager);
            }
            if (friend.entityId && game.whisperTo && game.whisperTo.id === friend.entityId) {
                game.whisperTo.name = friend.actualName;
                game.whisperTo.crc = friend.crc;
            }
        }
    };
    for (var _i = 0, friends_1 = friends; _i < friends_1.length; _i++) {
        var _a = friends_1[_i], accountId = _a.accountId, accountName = _a.accountName, status_1 = _a.status, entityId = _a.entityId, name_3 = _a.name, info = _a.info, crc = _a.crc, _b = _a.nameBad, nameBad = _b === void 0 ? false : _b;
        _loop_1(accountId, accountName, status_1, entityId, name_3, info, crc, nameBad);
    }
    if (removeMissing) {
        var _loop_2 = function (i) {
            if (!friends.find(function (f) { return f.accountId === game.model.friends[i].accountId; })) {
                game.model.friends.splice(i, 1);
            }
        };
        for (var i = game.model.friends.length - 1; i >= 0; i--) {
            _loop_2(i);
        }
        DEVELOPMENT && console.log('Refreshing friend list');
    }
    game.model.friends.sort(model_1.compareFriends);
    game.apply(function () { });
}
exports.handleUpdateFriends = handleUpdateFriends;
