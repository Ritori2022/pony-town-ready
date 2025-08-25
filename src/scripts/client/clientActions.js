"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("ag-sockets/dist/browser");
var interfaces_1 = require("../common/interfaces");
var utils_1 = require("../common/utils");
var pony_1 = require("../common/pony");
var worldMap_1 = require("../common/worldMap");
var clientUtils_1 = require("./clientUtils");
var sec_1 = require("./sec");
var partyUtils_1 = require("./partyUtils");
var gameUtils_1 = require("./gameUtils");
var updateDecoder_1 = require("../common/encoders/updateDecoder");
var handlers_1 = require("./handlers");
var emoji_1 = require("./emoji");
var BinEntityId = browser_1.Bin.U32;
var BinEntityPlayerState = browser_1.Bin.U8;
var BinNotificationId = browser_1.Bin.U16;
var BinSayDatas = [BinEntityId, browser_1.Bin.Str, browser_1.Bin.U8];
function findPonyById(map, id) {
    var entity = worldMap_1.findEntityById(map, id);
    return entity && pony_1.isPony(entity) ? entity : undefined;
}
var ClientActions = /** @class */ (function () {
    function ClientActions(gameService, game, model, zone) {
        var _this = this;
        this.gameService = gameService;
        this.game = game;
        this.model = model;
        this.zone = zone;
        this.apply = function (func) { return _this.zone.run(func); };
    }
    ClientActions.prototype.connected = function () {
        var _this = this;
        gameUtils_1.resetGameFields(this.game);
        this.game.map = worldMap_1.createWorldMap();
        this.game.player = undefined;
        this.game.joined();
        this.apply(function () { return _this.gameService.joined(); });
        var supportsWasm = typeof WebAssembly !== 'undefined';
        var info = 0 |
            (clientUtils_1.isInIncognitoMode ? 1 /* Incognito */ : 0) |
            (supportsWasm ? 2 /* SupportsWASM */ : 0) |
            (clientUtils_1.supportsLetAndConst() ? 4 /* SupportsLetAndConst */ : 0);
        this.game.send(function (server) { return server.actionParam2(20 /* Info */, info); });
    };
    ClientActions.prototype.disconnected = function () {
        var _this = this;
        gameUtils_1.resetGameFields(this.game);
        this.apply(function () { return _this.gameService.disconnected(); });
    };
    ClientActions.prototype.invalidVersion = function () {
        DEVELOPMENT && !TESTS && console.error('Invalid version');
    };
    ClientActions.prototype.queue = function (place) {
        this.game.placeInQueue = place;
    };
    ClientActions.prototype.worldState = function (state, initial) {
        this.game.placeInQueue = 0;
        this.game.setWorldState(state, initial);
    };
    ClientActions.prototype.mapState = function (info, state) {
        this.game.map = worldMap_1.createWorldMap(info, state);
        this.game.player = undefined;
        this.game.setupMap();
        worldMap_1.updateMapState(this.game.map, interfaces_1.defaultMapState, this.game.map.state);
    };
    ClientActions.prototype.mapUpdate = function (state) {
        var prevState = this.game.map.state;
        this.game.map.state = state;
        worldMap_1.updateMapState(this.game.map, prevState, this.game.map.state);
    };
    ClientActions.prototype.mapSwitching = function () {
        this.game.loaded = false;
        this.game.placeInQueue = 0;
        if (this.game.player) {
            this.game.player.vx = 0;
            this.game.player.vy = 0;
        }
    };
    ClientActions.prototype.mapTest = function (width, height, buffer) {
        var data = new Uint32Array(width * height);
        (new Uint8Array(data.buffer)).set(buffer);
        this.game.minimap = { width: width, height: height, data: data };
    };
    ClientActions.prototype.myEntity = function (id, name, info, characterId, crc) {
        this.game.playerId = id;
        this.game.playerName = name;
        this.game.playerInfo = info;
        this.game.playerCRC = crc;
        var pony = utils_1.findById(this.model.ponies, characterId);
        if (pony) {
            this.model.selectPony(pony);
        }
        if (this.game.party) {
            this.game.party.members.forEach(function (m) { return m.self = m.id === id; });
            this.game.onPartyUpdate.next();
        }
        var entity = worldMap_1.findEntityById(this.game.map, id);
        if (entity) {
            entity.name = name;
            handlers_1.updatePonyInfoWithPoof(this.game, entity, info, crc);
        }
        this.game.onActionsUpdate.next();
    };
    ClientActions.prototype.update = function (unsubscribes, subscribes, updates, regions, says) {
        worldMap_1.removeRegions(this.game.map, unsubscribes);
        for (var _i = 0, subscribes_1 = subscribes; _i < subscribes_1.length; _i++) {
            var subscribe = subscribes_1[_i];
            handlers_1.subscribeRegion(this.game, subscribe);
        }
        if (subscribes.length) {
            gameUtils_1.markGameAsLoaded(this.game);
        }
        if (updates) {
            handlers_1.handleUpdates(this.game, updates);
        }
        for (var _a = 0, regions_1 = regions; _a < regions_1.length; _a++) {
            var region = regions_1[_a];
            var _b = updateDecoder_1.decodeUpdate(region), x = _b.x, y = _b.y, updates_2 = _b.updates, removes = _b.removes, tiles = _b.tiles;
            for (var _c = 0, updates_1 = updates_2; _c < updates_1.length; _c++) {
                var update = updates_1[_c];
                handlers_1.handleUpdateEntity(this.game, update);
            }
            for (var _d = 0, removes_1 = removes; _d < removes_1.length; _d++) {
                var id = removes_1[_d];
                handlers_1.handleRemoveEntity(this.game, id);
            }
            for (var _e = 0, tiles_1 = tiles; _e < tiles_1.length; _e++) {
                var tile = tiles_1[_e];
                worldMap_1.setTileAtRegion(this.game.map, x, y, tile.x, tile.y, tile.type);
            }
        }
        for (var _f = 0, says_1 = says; _f < says_1.length; _f++) {
            var _g = says_1[_f], id = _g[0], message = _g[1], type = _g[2];
            handlers_1.handleSays(this.game, id, message, type);
        }
    };
    ClientActions.prototype.fixPosition = function (x, y, safe) {
        if (DEVELOPMENT && !TESTS && !safe) {
            console.error("fix position (" + x.toFixed(2) + ", " + y.toFixed(2) + ")");
        }
        var player = this.game.player;
        if (player) {
            player.x = x;
            player.y = y;
            sec_1.savePlayerPosition();
        }
        this.game.send(function (server) { return server.fixedPosition(); });
    };
    ClientActions.prototype.actionParam = function (id, action, param) {
        switch (action) {
            case 25 /* ACL */:
                if (id === this.game.playerId && param) {
                    sec_1.setAclCookie(param);
                }
                break;
            case 23 /* FriendsCRC */:
                this.game.nextFriendsCRC = 0;
                break;
            default:
                DEVELOPMENT && !TESTS && console.error("actionParam: Invalid action: " + action);
        }
    };
    ClientActions.prototype.left = function (reason) {
        var _this = this;
        this.game.player = undefined;
        this.game.map = worldMap_1.createWorldMap();
        this.apply(function () { return _this.gameService.left('clientActions.left', reason); });
    };
    ClientActions.prototype.addNotification = function (id, entityId, name, message, note, flags) {
        var _this = this;
        var defaultCharacter = utils_1.hasFlag(flags, 32 /* Supporter */) ? this.game.supporterPony : this.game.offlinePony;
        var pony = (entityId && findPonyById(this.game.map, entityId)) || defaultCharacter;
        var filteredName = handlers_1.filterEntityName(this.game, name, utils_1.hasFlag(flags, 128 /* NameBad */));
        message = message.replace(/#NAME#/g, emoji_1.nameToHTML(filteredName || ''));
        this.apply(function () { return gameUtils_1.addNotification(_this.game, { id: id, message: message, note: note, pony: pony, flags: flags, open: false, fresh: true }); });
    };
    ClientActions.prototype.removeNotification = function (id) {
        var _this = this;
        this.apply(function () { return gameUtils_1.removeNotification(_this.game, id); });
    };
    ClientActions.prototype.updateSelection = function (currentId, newId) {
        if (gameUtils_1.isSelected(this.game, currentId)) {
            this.game.select(newId ? findPonyById(this.game.map, newId) : undefined);
        }
    };
    ClientActions.prototype.updateParty = function (party) {
        var _this = this;
        var members = party && party.map(function (_a) {
            var id = _a[0], flags = _a[1];
            return ({
                id: id,
                pony: findPonyById(_this.game.map, id) || _this.game.fallbackPonies.get(id),
                self: id === _this.game.playerId,
                leader: utils_1.hasFlag(flags, 1 /* Leader */),
                pending: utils_1.hasFlag(flags, 2 /* Pending */),
                offline: utils_1.hasFlag(flags, 4 /* Offline */),
            });
        });
        if (members) {
            var missing_1 = members.filter(function (p) { return !p.pony; }).map(function (p) { return p.id; });
            if (missing_1.length) {
                this.game.send(function (server) { return server.getPonies(missing_1); });
            }
        }
        this.apply(function () {
            _this.game.party = partyUtils_1.updateParty(_this.game.party, members);
            _this.game.onPartyUpdate.next();
        });
    };
    ClientActions.prototype.updatePonies = function (ponies) {
        handlers_1.handleUpdatePonies(this.game, ponies);
    };
    ClientActions.prototype.updateFriends = function (friends, removeMissing) {
        handlers_1.handleUpdateFriends(this.game, friends, removeMissing);
    };
    ClientActions.prototype.entityInfo = function (id, name, crc, nameBad) {
        handlers_1.handleEntityInfo(this.game, id, name, crc, nameBad);
    };
    ClientActions.prototype.entityList = function (value) {
        if (DEVELOPMENT || BETA) {
            var list = value.map(function (_a) {
                var name = _a.name, x = _a.x, y = _a.y;
                return name + "(" + x.toFixed(2) + ", " + y.toFixed(2) + ")";
            }).join('\n');
            console.log("ENTITIES:\n" + list);
        }
    };
    ClientActions.prototype.testPositions = function (data) {
        var _this = this;
        if (DEVELOPMENT) {
            var round_1 = function (x) { return Math.round(x * 100); };
            var same_1 = function (ax, ay, bx, by) {
                if (ax === void 0) { ax = 0; }
                if (ay === void 0) { ay = 0; }
                if (bx === void 0) { bx = 0; }
                if (by === void 0) { by = 0; }
                return round_1(ax) === round_1(bx) && round_1(ay) === round_1(by);
            };
            var fmt_1 = function (x) { return (x === undefined ? '-' : x.toFixed(2)).padStart(5); };
            for (var i = 1; i < data.length; i++) {
                if (data[i - 1].frame !== (data[i].frame - 1)) {
                    data.splice(i, 0, { frame: data[i - 1].frame + 1, x: undefined, y: undefined, moved: false });
                }
            }
            var clientIndex = this.game.positions.findIndex(function (p) { return p.moved; });
            var serverIndex = data.findIndex(function (p) { return p.moved; });
            var offset_1 = serverIndex - clientIndex;
            var dat_1 = data.map(function (p, i) {
                var pt = _this.game.positions[i - offset_1] || { x: undefined, y: undefined };
                return { frame: p.frame, ax: p.x, ay: p.y, bx: pt.x, by: pt.y, serverMoved: p.moved, clientMoved: pt.moved };
            });
            var log = dat_1.map(function (_a, i) {
                var frame = _a.frame, ax = _a.ax, ay = _a.ay, bx = _a.bx, by = _a.by, serverMoved = _a.serverMoved, clientMoved = _a.clientMoved;
                return frame.toString().padStart(7) + " | " +
                    (fmt_1(ax) + ", " + fmt_1(ay) + " " + (serverMoved ? 'M' : ' ') + " | ") +
                    (fmt_1(bx) + ", " + fmt_1(by) + " " + (clientMoved ? 'M' : ' ') + " | ") +
                    ((same_1(ax, ay, bx, by) ? '= ' : '  ') + " ") +
                    ("" + (i > 0 && dat_1[i - 1].frame !== (frame - 1) ? 'I ' : '  '));
            })
                .join('\n');
            console.log("  frame |     server     |     client     |    \n" +
                "-----------------------------------------------\n" +
                ("" + log));
        }
    };
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.U32] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "queue", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj, browser_1.Bin.Bool] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "worldState", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj, browser_1.Bin.Obj] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "mapState", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "mapUpdate", null);
    __decorate([
        browser_1.Method({ binary: [] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "mapSwitching", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.I32, browser_1.Bin.I32, browser_1.Bin.U8Array] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, Uint8Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "mapTest", null);
    __decorate([
        browser_1.Method({ binary: [BinEntityId, browser_1.Bin.Str, browser_1.Bin.Str, browser_1.Bin.Str, browser_1.Bin.U16] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, String, String, String, Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "myEntity", null);
    __decorate([
        browser_1.Method({ binary: [[browser_1.Bin.U8], [browser_1.Bin.U8Array], browser_1.Bin.U8Array, [browser_1.Bin.U8Array], BinSayDatas] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Array, Uint8Array, Array, Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "update", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.F32, browser_1.Bin.F32, browser_1.Bin.Bool] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, Boolean]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "fixPosition", null);
    __decorate([
        browser_1.Method({ binary: [BinEntityId, browser_1.Bin.U8, browser_1.Bin.Obj] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, Object]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "actionParam", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.U8] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "left", null);
    __decorate([
        browser_1.Method({ binary: [BinNotificationId, BinEntityId, browser_1.Bin.Str, browser_1.Bin.Str, browser_1.Bin.Str, browser_1.Bin.U8] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number, String, String, String, Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "addNotification", null);
    __decorate([
        browser_1.Method({ binary: [BinNotificationId] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "removeNotification", null);
    __decorate([
        browser_1.Method({ binary: [BinEntityId, BinEntityId] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Number]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "updateSelection", null);
    __decorate([
        browser_1.Method({ binary: [[BinEntityId, browser_1.Bin.U8]] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "updateParty", null);
    __decorate([
        browser_1.Method({ binary: [[BinEntityId, browser_1.Bin.Obj, browser_1.Bin.U8Array, browser_1.Bin.U8Array, BinEntityPlayerState, browser_1.Bin.Bool]] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "updatePonies", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj, browser_1.Bin.Bool] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Boolean]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "updateFriends", null);
    __decorate([
        browser_1.Method({ binary: [BinEntityId, browser_1.Bin.Str, browser_1.Bin.U32, browser_1.Bin.Bool] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, String, Number, Boolean]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "entityInfo", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "entityList", null);
    __decorate([
        browser_1.Method({ binary: [browser_1.Bin.Obj] }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], ClientActions.prototype, "testPositions", null);
    return ClientActions;
}());
exports.ClientActions = ClientActions;
/* istanbul ignore next */
if (DEVELOPMENT) {
    browser_1.getMethods(ClientActions)
        .filter(function (m) { return !m.options.binary; })
        .forEach(function (m) { return console.error("Missing binary encoding for ClientActions." + m.name + "()"); });
}
