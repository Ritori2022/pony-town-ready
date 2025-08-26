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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var lodash_1 = require("lodash");
var interfaces_1 = require("../common/interfaces");
var utils_1 = require("../common/utils");
var constants_1 = require("../common/constants");
var worldMap_1 = require("../common/worldMap");
var camera_1 = require("../common/camera");
var colors_1 = require("../common/colors");
var timeUtils_1 = require("../common/timeUtils");
var mixins_1 = require("../common/mixins");
var entities_1 = require("../common/entities");
var pony_1 = require("../common/pony");
var paletteManager_1 = require("../graphics/paletteManager");
var webglUtils_1 = require("../graphics/webgl/webglUtils");
var graphicsUtils_1 = require("../graphics/graphicsUtils");
var spriteUtils_1 = require("./spriteUtils");
var data_1 = require("./data");
var audio_1 = require("../components/services/audio");
var canvasUtils_1 = require("./canvasUtils");
var color_1 = require("../common/color");
var ponyAnimations_1 = require("./ponyAnimations");
var inputManager_1 = require("./input/inputManager");
var positionUtils_1 = require("../common/positionUtils");
var storageService_1 = require("../components/services/storageService");
var settingsService_1 = require("../components/services/settingsService");
var entityUtils_1 = require("../common/entityUtils");
var movementUtils_1 = require("../common/movementUtils");
var buttonActions_1 = require("./buttonActions");
var clientUtils_1 = require("./clientUtils");
var sec_1 = require("./sec");
var draw_1 = require("./draw");
var tileUtils_1 = require("./tileUtils");
var playerActions_1 = require("./playerActions");
var fonts_1 = require("./fonts");
var spriteFont_1 = require("../graphics/spriteFont");
var ponyDraw_1 = require("./ponyDraw");
var errorReporter_1 = require("../components/services/errorReporter");
var ponyInfo_1 = require("../common/ponyInfo");
var timing_1 = require("./timing");
var frameBuffer_1 = require("../graphics/webgl/frameBuffer");
var webgl_1 = require("./webgl");
var texture2d_1 = require("../graphics/webgl/texture2d");
var sprites_1 = require("../generated/sprites");
var mat4_1 = require("../common/mat4");
var model_1 = require("../components/services/model");
var handlers_1 = require("./handlers");
var collision_1 = require("../common/collision");
var LOG_POSITION = false;
var CONNECTION_ISSUE_TIMEOUT = 10 * constants_1.SECOND;
var white = color_1.colorToFloatArray(colors_1.WHITE);
var light = color_1.colorToFloatArray(colors_1.WHITE);
var highlightColor = new Float32Array([2, 2, 2, 0.5]);
var toggleWallsTool = entities_1.saw;
var removeEntitiesTool = entities_1.broom;
var placeEntitiesTool = entities_1.hammer;
var changeTileTool = entities_1.shovel;
var numpad = [
    96 /* NUMPAD_0 */,
    97 /* NUMPAD_1 */,
    98 /* NUMPAD_2 */,
    99 /* NUMPAD_3 */,
    100 /* NUMPAD_4 */,
    101 /* NUMPAD_5 */,
    102 /* NUMPAD_6 */,
    103 /* NUMPAD_7 */,
    104 /* NUMPAD_8 */,
    105 /* NUMPAD_9 */,
];
exports.engines = [
    { name: 'Default', engine: interfaces_1.Engine.Default },
    { name: 'LayeredTiles', engine: interfaces_1.Engine.LayeredTiles },
    { name: 'Whiteness', engine: interfaces_1.Engine.Whiteness },
];
var pixelRatioEnabled = true;
var pixelRatioCache = 1;
function pixelRatio() {
    return pixelRatioEnabled ? pixelRatioCache : 1;
}
function integerPixelRatio() {
    return Math.max(1, Math.floor(pixelRatio()));
}
function getMovementFlag(x, y, walkKey) {
    var len = utils_1.lengthOfXY(x, y);
    var walk = len < 0.5 || walkKey;
    return (x || y) ? (walk ? 16 /* PonyWalking */ : 32 /* PonyTrotting */) : 0 /* None */;
}
exports.actionButtons = [];
function redrawActionButtons(force) {
    for (var _i = 0, actionButtons_1 = exports.actionButtons; _i < actionButtons_1.length; _i++) {
        var button = actionButtons_1[_i];
        if (force || button.dirty) {
            button.draw();
        }
    }
}
exports.redrawActionButtons = redrawActionButtons;
var PonyTownGame = /** @class */ (function () {
    function PonyTownGame(audio, storage, settings, model, errorReporter, zone) {
        var _this = this;
        this.audio = audio;
        this.storage = storage;
        this.settings = settings;
        this.model = model;
        this.errorReporter = errorReporter;
        this.zone = zone;
        this.fallbackPonies = new Map();
        this.positions = [];
        this.lastChatMessageType = 0 /* Say */;
        this.nextFriendsCRC = 0;
        this.editingActions = false;
        this.placeInQueue = 0;
        this.time = performance.now();
        this.lightData = timeUtils_1.createLightData(1 /* Summer */);
        this.season = 1 /* Summer */;
        this.holiday = 0 /* None */;
        this.worldFlags = 0 /* None */;
        this.showMinimap = false;
        this.minimap = undefined;
        this.editor = {
            type: 'stoneWall',
            brushSize: 1,
            tile: -1,
            elevation: '',
            special: '',
            draggingEntities: false,
            draggingStart: utils_1.point(0, 0),
            selectingEntities: false,
            selectedEntities: [],
            customLight: false,
            lightColor: 'ffffff',
        };
        this.incompleteSays = [];
        this.shadowColor = colors_1.SHADOW_COLOR;
        this.onChat = new rxjs_1.Subject();
        this.onToggleChat = new rxjs_1.Subject();
        this.onCommand = new rxjs_1.Subject();
        this.onCancel = function () { return false; };
        this.onClock = new rxjs_1.BehaviorSubject('');
        this.onJoined = new rxjs_1.Subject();
        this.onLeft = new rxjs_1.Subject();
        this.onFrame = new rxjs_1.Subject();
        this.onMessage = new rxjs_1.Subject();
        this.messageQueue = [];
        this.lastWhisperFrom = undefined;
        this.onPonyAddOrUpdate = new rxjs_1.Subject();
        this.onActionsUpdate = new rxjs_1.Subject();
        this.onPartyUpdate = new rxjs_1.Subject();
        this.announcements = new rxjs_1.Subject();
        this.onEntityIdUpdate = new rxjs_1.Subject();
        this.loaded = false;
        this.fullyLoaded = false;
        this.fps = 0;
        this.player = undefined;
        this.playerId = undefined;
        this.playerName = undefined;
        this.playerInfo = undefined;
        this.playerCRC = undefined;
        this.selected = undefined;
        this.party = undefined;
        this.notifications = [];
        this.map = worldMap_1.createWorldMap();
        this.camera = camera_1.createCamera();
        this.paletteManager = new paletteManager_1.PaletteManager();
        this.offlinePony = pony_1.createPony(0, 0, constants_1.OFFLINE_PONY, ponyInfo_1.mockPaletteManager.addArray(sprites_1.defaultPalette), ponyInfo_1.mockPaletteManager);
        this.supporterPony = pony_1.createPony(0, 0, constants_1.SUPPORTER_PONY, ponyInfo_1.mockPaletteManager.addArray(sprites_1.defaultPalette), ponyInfo_1.mockPaletteManager);
        this.failedFBO = false;
        this.actions = buttonActions_1.createDefaultButtonActions();
        this.mod = false;
        this.actionsChanged = true;
        this.debug = {};
        this.whisperTo = undefined;
        this.findEntityFromChatLog = function () { return undefined; };
        this.findEntityFromChatLogByName = function () { return undefined; };
        this.drawOptions = __assign({}, interfaces_1.defaultDrawOptions);
        this.input = new inputManager_1.InputManager();
        this.timeSize = 0;
        this.lastStats = 0;
        this.sent = 0;
        this.recv = 0;
        this.hideText = false;
        this.hidePublicChat = false;
        this.hover = utils_1.point(0, 0);
        this.viewMatrix = mat4_1.createMat4();
        this.fboMatrix = mat4_1.createMat4();
        this.initialized = false;
        this.changedScale = false;
        this.baseTime = 0;
        this.targetBaseTime = 0;
        this.connectedTime = 0;
        this.lastPixelRatio = pixelRatio();
        this.resized = true;
        this.resizedCamera = true;
        this.bg = color_1.colorToFloatArray(colors_1.BLACK);
        this.deltaMultiplier = 1;
        this.lastDraw = 0;
        this.entitiesDrawn = 0;
        this.lastFps = performance.now();
        this.frames = 0;
        this.drawFps = 0;
        this.lastCanvasRatio = 0;
        this.extraStats = '';
        this.timingsText = '';
        this.statsTextValue = '';
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.debugShortcuts = [];
        this.cameraShiftOn = false;
        this.cameraShiftTarget = 0;
        this.lastIsKeyboardOpen = false;
        this.showWallPlaceholder = false;
        this.placeEntity = 0;
        this.placeTile = 0;
        this.apply = function (func) {
            return _this.zone.run(func);
        };
        this.applyChanges = function () { return _this.zone.run(function () { }); };
        this.sendSelected = lodash_1.debounce(function () {
            var pony = _this.selected;
            var id = pony ? pony.id : 0;
            var fetchEx = !!pony && !pony_1.hasExtendedInfo(pony);
            _this.send(function (server) { return server.select(id, fetchEx ? 1 /* FetchEx */ : 0 /* None */); });
        }, 300);
        this.scale = this.getScale();
        this.audio.initTracks(this.season, this.holiday, this.map.type);
        this.audio.setVolume(this.volume);
        this.debug = storage.getJSON('debug', {});
        this.drawOptions.error = function (message) { return errorReporter.reportError(message); };
        this.onActionsUpdate.subscribe(function () { return _this.actionsChanged = true; });
        if (DEVELOPMENT) {
            clientUtils_1.attachDebugMethod('setScale', function (x) { return _this.setScale(x); });
            clientUtils_1.attachDebugMethod('game', this);
        }
    }
    Object.defineProperty(PonyTownGame.prototype, "volume", {
        get: function () {
            return this.settings.browser.volume || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyTownGame.prototype, "disableLighting", {
        get: function () {
            return !!this.settings.browser.lowGraphicsMode || this.failedFBO;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyTownGame.prototype, "frameDelay", {
        get: function () {
            return (this.settings.browser.powerSaving || this.editingActions) ? (1000 / 45) : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PonyTownGame.prototype, "engine", {
        get: function () {
            return BETA ? (this.debug.engine || interfaces_1.Engine.Default) : interfaces_1.Engine.Default;
        },
        set: function (value) {
            if (BETA) {
                this.debug.engine = value;
                this.saveDebug();
            }
        },
        enumerable: true,
        configurable: true
    });
    PonyTownGame.prototype.applied = function (func) {
        var _this = this;
        return function () { return _this.apply(func); };
    };
    PonyTownGame.prototype.getScale = function () {
        var defaultScale = pixelRatio() > 1 ? 3 : 2;
        var scale = utils_1.toInt(this.settings.browser.scale) || defaultScale;
        return utils_1.clamp(scale, constants_1.MIN_SCALE, constants_1.MAX_SCALE);
    };
    PonyTownGame.prototype.setScale = function (scale) {
        if (this.scale !== scale) {
            this.scale = scale;
            this.settings.browser.scale = this.scale;
            this.settings.saveBrowserSettings();
            this.changedScale = true;
        }
    };
    PonyTownGame.prototype.toggleDisableLighting = function () {
        if (!this.failedFBO) {
            this.settings.browser.lowGraphicsMode = !this.settings.browser.lowGraphicsMode;
            this.settings.saveBrowserSettings();
        }
    };
    PonyTownGame.prototype.send = function (action) {
        if (this.socket && this.socket.isConnected) {
            return action(this.socket.server);
        }
        else {
            return undefined;
        }
    };
    PonyTownGame.prototype.changeScale = function () {
        this.setScale((this.scale % constants_1.MAX_SCALE) + 1);
        this.changedScale = true;
    };
    PonyTownGame.prototype.zoomIn = function () {
        this.setScale(Math.min(constants_1.MAX_SCALE, this.scale + 1));
    };
    PonyTownGame.prototype.zoomOut = function () {
        this.setScale(Math.max(1, this.scale - 1));
    };
    PonyTownGame.prototype.select = function (pony) {
        var _this = this;
        if (this.selected === pony)
            return;
        if (pony && entityUtils_1.isHidden(pony) && !this.mod)
            return;
        this.zone.run(function () {
            if (_this.selected) {
                _this.selected.selected = false;
            }
            _this.selected = pony;
            if (pony && !pony.info && !pony.palettePonyInfo) {
                _this.send(function (server) { return server.select(pony.id, 1 /* FetchEx */ | 2 /* FetchInfo */); });
            }
            else {
                _this.sendSelected();
            }
            if (_this.selected) {
                _this.selected.selected = true;
            }
        });
    };
    PonyTownGame.prototype.load = function () {
        return spriteUtils_1.loadAndInitSpriteSheets()
            .then(tileUtils_1.initializeTileHeightmaps);
    };
    PonyTownGame.prototype.init = function () {
        var _this = this;
        this.canvas = document.getElementById('canvas');
        this.updateTileSets();
        this.input.initialize(this.canvas);
        if (!this.initialized) {
            this.canvas.addEventListener('webglcontextlost', function (e) {
                e.preventDefault();
                DEVELOPMENT && console.warn('Context lost');
                _this.errorReporter.captureEvent({ name: 'Context lost' });
            });
            this.canvas.addEventListener('webglcontextrestored', function () {
                DEVELOPMENT && console.warn('Context restored');
                _this.errorReporter.captureEvent({ name: 'Context restored' });
                if (_this.webgl) {
                    _this.webgl = webgl_1.initWebGLResources(_this.webgl.gl, _this.paletteManager, _this.camera);
                }
            });
            this.initialized = true;
            var stats = document.getElementById('stats');
            this.statsText = document.createTextNode('');
            stats.appendChild(this.statsText);
            this.input.onReleased(79 /* KEY_O */, function () { return _this.zoomOut(); });
            this.input.onReleased(80 /* KEY_P */, function () { return _this.zoomIn(); });
            this.input.onReleased(314 /* GAMEPAD_BUTTON_Y */, function () { return _this.changeScale(); });
            this.input.onPressed(13 /* ENTER */, function () { return _this.onChat.next(); });
            this.input.onPressed(27 /* ESCAPE */, function () { return _this.escape(); });
            this.input.onPressed(313 /* GAMEPAD_BUTTON_X */, function () { return _this.onToggleChat.next(); });
            // this.input.onPressed(Key.BACKSPACE, () => this.backspace());
            this.input.onPressed(72 /* KEY_H */, function () { return playerActions_1.turnHeadAction(_this); });
            this.input.onPressed(191 /* FORWARD_SLASH */, function () { return _this.onCommand.next(); });
            this.input.onPressed([66 /* KEY_B */, 312 /* GAMEPAD_BUTTON_B */, 329 /* TOUCH_SECOND_CLICK */], function () { return playerActions_1.boopAction(_this); });
            this.input.onPressed([69 /* KEY_E */, 311 /* GAMEPAD_BUTTON_A */], function () {
                playerActions_1.interact(_this, _this.input.isPressed(16 /* SHIFT */));
            });
            this.input.onPressed([88 /* KEY_X */, 324 /* GAMEPAD_BUTTON_DOWN */], function () { return playerActions_1.downAction(_this); });
            this.input.onPressed([67 /* KEY_C */, 323 /* GAMEPAD_BUTTON_UP */], function () { return playerActions_1.upAction(_this); });
            this.input.onPressed(113 /* F2 */, function () {
                if (!_this.settings.browser.disableFKeys) {
                    _this.hideText = !_this.hideText;
                    _this.hidePublicChat = false;
                }
            });
            this.input.onPressed(114 /* F3 */, function () {
                if (!_this.settings.browser.disableFKeys) {
                    _this.hideText = false;
                    _this.hidePublicChat = !_this.hidePublicChat;
                }
            });
            this.input.onPressed(115 /* F4 */, function () {
                if (!_this.settings.browser.disableFKeys) {
                    _this.settings.account.seeThroughObjects = !_this.settings.account.seeThroughObjects;
                    _this.settings.saveAccountSettings(_this.settings.account);
                }
            });
            [
                49 /* KEY_1 */, 50 /* KEY_2 */, 51 /* KEY_3 */, 52 /* KEY_4 */, 53 /* KEY_5 */, 54 /* KEY_6 */,
                55 /* KEY_7 */, 56 /* KEY_8 */, 57 /* KEY_9 */, 48 /* KEY_0 */, 189 /* DASH */, 187 /* EQUALS */,
            ].forEach(function (key, index) { return _this.input.onPressed(key, function () {
                if (_this.actions[index]) {
                    _this.zone.run(function () { return buttonActions_1.useAction(_this, _this.actions[index].action); });
                }
            }); });
            var addDebugShortcut = function (num, name, action) {
                _this.input.onPressed(numpad[num], function () {
                    if (!_this.input.isPressed(16 /* SHIFT */)) {
                        _this.apply(action);
                    }
                });
                _this.debugShortcuts.push(num + " - " + name);
                _this.debugShortcuts.sort();
            };
            // const addDebugShortcutShift = (num: number, name: string, action: () => void) => {
            // 	this.input.onPressed(numpad[num], () => {
            // 		if (this.input.isPressed(Key.SHIFT)) {
            // 			this.apply(action);
            // 		}
            // 	});
            // 	this.debugShortcuts.push(`${num} (shift) - ${name}`);
            // 	this.debugShortcuts.sort();
            // };
            if (BETA) {
                // editor
                this.input.onPressed(8 /* BACKSPACE */, function () {
                    if (_this.mod) {
                        _this.send(function (server) { return server.editorAction({ type: 'undo' }); });
                    }
                });
                this.input.onPressed(46 /* DELETE */, this.applied(function () {
                    var entities = _this.editor.selectedEntities.map(function (e) { return e.id; });
                    _this.send(function (server) { return server.editorAction({ type: 'remove', entities: entities }); });
                    _this.editor.selectedEntities.length = 0;
                }));
                [
                    { key: 37 /* LEFT */, dx: -1 / constants_1.tileWidth, dy: 0 },
                    { key: 39 /* RIGHT */, dx: 1 / constants_1.tileWidth, dy: 0 },
                    { key: 38 /* UP */, dx: 0, dy: -1 / constants_1.tileHeight },
                    { key: 40 /* DOWN */, dx: 0, dy: 1 / constants_1.tileHeight },
                ].forEach(function (_a) {
                    var key = _a.key, dx = _a.dx, dy = _a.dy;
                    return _this.input.onPressed(key, function () {
                        _this.editor.selectedEntities.forEach(function (_a) {
                            var id = _a.id, x = _a.x, y = _a.y;
                            _this.send(function (server) { return server.editorAction({
                                type: 'move',
                                entities: [{ id: id, x: x + dx, y: y + dy }],
                            }); });
                        });
                    });
                });
                // debug
                this.input.onReleased(77 /* KEY_M */, function () { return _this.showMinimap = !_this.showMinimap; });
                this.input.onPressed(71 /* KEY_G */, function () {
                    if (_this.input.isPressed(16 /* SHIFT */)) {
                        var faceDir_1 = 0;
                        var dir_1 = 1;
                        _this.player.doAction = 2 /* Swing */;
                        var state_1 = _this.player.ponyState;
                        var interval_1 = setInterval(function () {
                            faceDir_1 += dir_1;
                            if (faceDir_1 < 0) {
                                clearInterval(interval_1);
                                return;
                            }
                            state_1.headTurn = faceDir_1;
                            if (faceDir_1 === 3) {
                                playerActions_1.turnHeadAction(_this);
                            }
                            if (faceDir_1 >= 6) {
                                dir_1 = -1;
                            }
                        }, 1000 / 24);
                    }
                    else {
                        var faceDir_2 = 0;
                        var state_2 = _this.player.ponyState;
                        var interval_2 = setInterval(function () {
                            faceDir_2++;
                            state_2.headTurn = faceDir_2;
                            if (faceDir_2 === 3) {
                                playerActions_1.turnHeadAction(_this);
                            }
                            if (faceDir_2 >= 7) {
                                clearInterval(interval_2);
                            }
                        }, 1000 / 24);
                    }
                });
                addDebugShortcut(1, 'show info at cursor', function () {
                    _this.debug.showInfo = !_this.debug.showInfo;
                    _this.saveDebug();
                });
                addDebugShortcut(2, 'show water bounds', function () {
                    _this.drawOptions.showHeightmap = !_this.drawOptions.showHeightmap;
                });
                addDebugShortcut(3, 'show collision map', function () {
                    _this.drawOptions.showColliderMap = !_this.drawOptions.showColliderMap;
                });
                addDebugShortcut(4, 'show helpers', function () {
                    _this.debug.showHelpers = !_this.debug.showHelpers;
                    _this.saveDebug();
                });
                addDebugShortcut(5, 'show tile indices', function () {
                    _this.drawOptions.tileIndices = !_this.drawOptions.tileIndices;
                });
                addDebugShortcut(6, 'show tile grid', function () {
                    _this.drawOptions.tileGrid = !_this.drawOptions.tileGrid;
                });
                addDebugShortcut(7, 'grayscale', function () {
                    document.documentElement.style.filter = document.documentElement.style.filter ? null : 'grayscale(100%)';
                });
                addDebugShortcut(8, 'show regions', function () {
                    _this.debug.showRegions = !_this.debug.showRegions;
                    _this.saveDebug();
                });
            }
            if (DEVELOPMENT) {
                var showingRange_1 = false;
                addDebugShortcut(9, 'show chatlog range', function () {
                    showingRange_1 = !showingRange_1;
                    clientUtils_1.updateRangeIndicator(showingRange_1 ? _this.settings.account.chatlogRange : undefined, _this);
                });
                this.input.onPressed(117 /* F6 */, function () {
                    _this.cameraShiftOn = !_this.cameraShiftOn;
                    _this.cameraShiftTarget = 400;
                });
                this.input.onPressed(118 /* F7 */, function () {
                    _this.debug.showPalette = !_this.debug.showPalette;
                    _this.saveDebug();
                });
                this.input.onPressed(119 /* F8 */, function () {
                });
                var loseContext_1 = null;
                this.input.onPressed(120 /* F9 */, function () {
                    if (loseContext_1) {
                        loseContext_1.restoreContext();
                        loseContext_1 = null;
                    }
                    else {
                        loseContext_1 = _this.webgl.gl.getExtension('WEBGL_lose_context');
                        loseContext_1.loseContext();
                    }
                });
                this.input.onPressed(121 /* F10 */, function () {
                    _this.settings.browser.brightNight = !_this.settings.browser.brightNight;
                });
                this.input.onPressed(82 /* KEY_R */, this.applied(function () {
                    if (!Date.now() && _this.player) {
                        var bounds_1 = entityUtils_1.getInteractBounds(_this.player);
                        var entities = _this.map.entities.filter(function (e) {
                            return e !== _this.player && utils_1.boundsIntersect(e.x, e.y, e.bounds, 0, 0, bounds_1);
                        });
                        if (entities.length) {
                            var entity = entities[0];
                            var typeName = entities_1.getEntityTypeName(entity.type);
                            _this.announce("" + typeName + (entities.length > 1 ? " (1 of " + entities.length + ")" : ''));
                        }
                        else {
                            _this.announce('nothing');
                        }
                    }
                    // if (this.player) this.player.swimming = !this.player.swimming;
                    // this.editorElevation = '';
                    // this.editorSpecial = this.editorSpecial ? '' : 'ramp-e';
                }));
                this.input.onPressed(74 /* KEY_J */, function () {
                    if (_this.player) {
                        _this.player.ponyState.headTilt = (_this.player.ponyState.headTilt || 0) + 0.5;
                    }
                });
                this.input.onPressed(75 /* KEY_K */, function () {
                    if (_this.player) {
                        _this.player.ponyState.headTilt = (_this.player.ponyState.headTilt || 0) - 0.5;
                    }
                });
                this.input.onPressed(76 /* KEY_L */, function () { return _this.player && pony_1.setHeadAnimation(_this.player, ponyAnimations_1.nom); });
                this.input.onReleased(81 /* KEY_Q */, function () { return _this.send(function (server) { return server.leave(); }); });
                this.input.onReleased(84 /* KEY_T */, function () { return _this.toggleDisableLighting(); });
                this.input.onReleased(85 /* KEY_U */, function () {
                    if (_this.player) {
                        console.log("position: " + _this.player.x.toFixed(2) + ", " + _this.player.y.toFixed(2) + " " +
                            ("region: " + Math.floor(_this.player.x / constants_1.REGION_SIZE) + ", " + Math.floor(_this.player.y / constants_1.REGION_SIZE)));
                    }
                });
                this.input.onReleased(73 /* KEY_I */, function () {
                    var state = _this.player.ponyState;
                    state.flags = utils_1.setFlag(state.flags, 1 /* CurlTail */, !utils_1.hasFlag(state.flags, 1 /* CurlTail */));
                });
                // this.input.onReleased(Key.KEY_N, () => this.engine = (this.engine + 1) % Engine.Total);
                this.input.onPressed(78 /* KEY_N */, function () { return _this.audio.playRandomTrack(); });
                // this.input.onPressed(Key.KEY_G, () => this.wind = Math.max(0, this.wind - 1));
                // this.input.onReleased(Key.KEY_M, () => this.send(server => server.editorAction({ type: 'party' })));
                this.input.onPressed(119 /* F8 */, function () { return mixins_1.toggleWalls(); });
                this.input.onPressed(188 /* COMMA */, function () { return _this.deltaMultiplier = 0.5; });
                this.input.onPressed(190 /* PERIOD */, function () { return _this.deltaMultiplier = 2; });
            }
            window.addEventListener('resize', function () {
                _this.resized = true;
                DEVELOPMENT && clientUtils_1.log("resized " + window.innerHeight + " (" + window.scrollY + ")");
            });
            this.canvas.addEventListener('touchstart', function () { return _this.audio.touch(); });
        }
        this.resized = true;
        if (!this.webgl) {
            this.initWebGL();
        }
    };
    PonyTownGame.prototype.leave = function () {
        if (this.socket) {
            if (this.socket.isConnected) {
                this.socket.server.leave();
            }
            else {
                this.socket.disconnect();
            }
        }
    };
    PonyTownGame.prototype.joined = function () {
        this.connectedTime = Math.round(performance.now());
        this.onJoined.next();
    };
    PonyTownGame.prototype.togglePixelRatio = function () {
        pixelRatioEnabled = !pixelRatioEnabled;
    };
    PonyTownGame.prototype.escape = function () {
        if (this.socket && !this.onCancel()) {
            this.select(undefined);
        }
    };
    PonyTownGame.prototype.backspace = function () {
        if (this.player && this.player.says !== undefined) {
            this.send(function (server) { return server.say(0, '.', 8 /* Dismiss */); });
        }
    };
    PonyTownGame.prototype.initWebGL = function () {
        this.errorReporter.captureEvent({ name: 'game.initWebGL' });
        if (!this.canvas) {
            throw new Error('Missing canvas');
        }
        try {
            this.resizeCamera();
            this.webgl = webgl_1.initWebGL(this.canvas, this.paletteManager, this.camera);
            var _a = this.webgl, failedFBO = _a.failedFBO, palettes = _a.palettes, renderer = _a.renderer;
            if (renderer) {
                this.errorReporter.configureData({ renderer: renderer });
            }
            if (failedFBO) {
                this.errorReporter.captureEvent({ name: 'game.initWebGL failed FBO' });
            }
            this.offlinePony = pony_1.createPony(0, 0, constants_1.OFFLINE_PONY, palettes.defaultPalette, this.paletteManager);
            this.supporterPony = pony_1.createPony(0, 0, constants_1.SUPPORTER_PONY, palettes.defaultPalette, this.paletteManager);
            ponyDraw_1.initializeToys(this.paletteManager);
        }
        catch (e) {
            this.errorReporter.captureEvent({ name: 'failed game.initWebGL', error: e.message, stack: e.stack });
            this.releaseWebGL();
            DEVELOPMENT && console.error(e);
            throw new Error("Failed to initialize graphics device (" + e.message + ")");
        }
    };
    PonyTownGame.prototype.releaseWebGL = function () {
        this.errorReporter.captureEvent({ name: 'game.releaseWebGL' });
        if (this.webgl) {
            try {
                this.paletteManager.dispose(this.webgl.gl);
                webgl_1.disposeWebGL(this.webgl);
            }
            catch (e) {
                DEVELOPMENT && console.error(e);
            }
            this.webgl = undefined;
        }
    };
    PonyTownGame.prototype.resizeCamera = function () {
        if (this.canvas) {
            var actualScale = this.scale * integerPixelRatio();
            var w = utils_1.clamp(Math.ceil(this.canvas.width / actualScale), constants_1.CAMERA_WIDTH_MIN, constants_1.CAMERA_WIDTH_MAX);
            var h = utils_1.clamp(Math.ceil(this.canvas.height / actualScale), constants_1.CAMERA_HEIGHT_MIN, constants_1.CAMERA_HEIGHT_MAX);
            if (this.camera.w !== w || this.camera.h !== h) {
                this.camera.w = w;
                this.camera.h = h;
                this.resizedCamera = true;
            }
        }
    };
    PonyTownGame.prototype.release = function () {
        this.settings.saving(function () { return false; });
        this.loaded = false;
        this.fullyLoaded = false;
        this.player = undefined;
        this.selected = undefined;
        this.party = undefined;
        this.rightOverride = undefined;
        this.headTurnedOverride = undefined;
        this.stateOverride = undefined;
        this.notifications = [];
        this.map = worldMap_1.createWorldMap();
        this.camera = camera_1.createCamera();
        if (this.socket) {
            this.socket.disconnect();
            this.socket = undefined;
        }
        this.audio.stop();
        this.input.release();
        this.releaseWebGL();
    };
    PonyTownGame.prototype.startup = function (socket, mod) {
        var _this = this;
        if (this.settings.account.actions) {
            this.actions = buttonActions_1.deserializeActions(this.settings.account.actions);
        }
        else {
            this.actions = buttonActions_1.createDefaultButtonActions();
        }
        var saveSettings = function (settings) { return _this.send(function (server) { return server.saveSettings(settings); }); };
        var saveSettingsDebounced = lodash_1.debounce(saveSettings, 1500);
        this.element = document.getElementById('app-game');
        this.settings.saving(function (settings) { return (saveSettingsDebounced(settings), true); });
        this.lastChatMessageType = 0 /* Say */;
        this.selected = undefined;
        this.party = undefined;
        this.socket = socket;
        this.audio.setVolume(this.volume);
        // this.audio.play();
        this.mod = mod;
        this.nextFriendsCRC = performance.now() + 5 * constants_1.SECOND;
        if (DEVELOPMENT) {
            clientUtils_1.initLogger(function (message) { return _this.onMessage.next({
                id: 1, crc: 1, name: 'log', type: 1 /* System */,
                message: "[" + ((performance.now() | 0) % 10000) + "] " + message
            }); });
        }
        if (DEVELOPMENT && LOG_POSITION) {
            this.positions.length = 0;
        }
    };
    PonyTownGame.prototype.getPixelScale = function () {
        return this.scale * (integerPixelRatio() / pixelRatio());
    };
    PonyTownGame.prototype.update = function (delta, now, last) {
        var _this = this;
        TIMING && timing_1.timeStart('update');
        delta *= this.deltaMultiplier;
        var shiftSpeed = delta * 10;
        if (this.cameraShiftOn && this.camera.shiftRatio !== 1) {
            this.camera.shiftRatio = Math.min(1, this.camera.shiftRatio + shiftSpeed);
        }
        else if (!this.cameraShiftOn && this.camera.shiftRatio !== 0) {
            this.camera.shiftRatio = Math.max(0, this.camera.shiftRatio - shiftSpeed);
        }
        worldMap_1.updateMap(this.map, delta);
        if (!this.socket || !this.socket.isConnected || !this.element)
            return;
        this.updateGameTime(delta);
        if (this.lastPixelRatio !== pixelRatio()) {
            this.lastPixelRatio = pixelRatio();
            this.resized = true;
        }
        if (this.resized) {
            this.resizeCanvas();
        }
        var player = this.player;
        var camera = this.camera;
        var input = this.input;
        var server = this.socket.server;
        sec_1.restorePlayerPosition();
        input.disabledGamepad = !!this.settings.browser.disableGamepad;
        input.update();
        this.resizeCamera();
        this.updateCameraShift();
        var actualScale = this.scale * integerPixelRatio();
        this.camera.offset = this.cameraShiftTarget / actualScale;
        var moved = false;
        if (player && this.loaded) {
            if (BETA && this.editor.selectedEntities.length) {
                input.disableArrows = true;
            }
            this.showWallPlaceholder = player.hold === toggleWallsTool.type && utils_1.hasFlag(this.map.flags, 1 /* EditableWalls */);
            if (this.highlightEntity) {
                if (this.highlightEntity.id === 0) {
                    entityUtils_1.releaseEntity(this.highlightEntity);
                }
                this.highlightEntity = undefined;
            }
            var shift = input.isPressed(16 /* SHIFT */);
            var x = this.fullyLoaded ? input.axisX : 0;
            var y = this.fullyLoaded ? input.axisY : 0;
            var dir = movementUtils_1.vectorToDir(x, y);
            var vec = (x || y) ? movementUtils_1.dirToVector(dir) : { x: 0, y: 0 };
            var walk = input.isMovementFromButtons ? (this.settings.browser.walkByDefault ? !shift : shift) : false;
            var flags = getMovementFlag(x, y, walk);
            var speed = movementUtils_1.flagsToSpeed(flags);
            var vx = vec.x * speed;
            var vy = vec.y * speed;
            if (BETA) {
                input.disableArrows = false;
            }
            if (player.vx !== vx || player.vy !== vy) {
                if (vx === 0) {
                    player.x = positionUtils_1.roundPositionX(player.x) + 0.5 / constants_1.tileWidth;
                }
                if (vy === 0) {
                    player.y = positionUtils_1.roundPositionY(player.y) + 0.5 / constants_1.tileHeight;
                }
                var time = (last - this.connectedTime) >>> 0;
                var _a = movementUtils_1.encodeMovement(player.x, player.y, dir, flags, time, camera), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
                server.move(a, b, c, d, e);
                moved = true;
                this.resizedCamera = false;
            }
            if ((vx || vy) && (entityUtils_1.isPonySitting(player) || entityUtils_1.isPonyLying(player))) {
                player.state = entityUtils_1.setPonyState(player.state, 0 /* PonyStanding */);
            }
            entityUtils_1.updateEntityVelocity(this.map, player, vx, vy);
            var facingRight = entityUtils_1.isFacingRight(player);
            var right = movementUtils_1.isMovingRight(vx, facingRight);
            if (facingRight !== right) {
                player.state = utils_1.setFlag(player.state, 2 /* FacingRight */, right);
                player.state = utils_1.setFlag(player.state, 4 /* HeadTurned */, false);
                this.rightOverride = right;
            }
            camera_1.updateCamera(camera, player, this.map);
            var scale = this.getPixelScale();
            var hover = camera_1.screenToWorld(camera, utils_1.point(input.pointerX / scale, input.pointerY / scale));
            if (input.usingTouch && !input.wasPressed(328 /* TOUCH_CLICK */) && !input.isPressed(327 /* TOUCH */)) {
                hover.x = -1;
                hover.y = -1;
            }
            this.hover = hover;
            if (this.fullyLoaded) {
                if (BETA && this.editor.draggingEntities) {
                    playerActions_1.editorDragEntities(this, hover, input.isPressed(303 /* MOUSE_BUTTON2 */));
                }
                if (utils_1.hasFlag(this.map.flags, 2 /* EditableEntities */)) {
                    if (player.hold === removeEntitiesTool.type) {
                        this.highlightEntity = worldMap_1.pickEntities(this.map, hover, true, false, true)[0];
                    }
                    else if (player.hold === placeEntitiesTool.type) {
                        if (!collision_1.isOutsideMap(hover.x, hover.y, this.map)) {
                            var type = entities_1.placeableEntities[this.placeEntity].type;
                            var x_1 = hover.x, y_1 = hover.y;
                            if (this.map.editableArea) {
                                x_1 = utils_1.clamp(x_1, this.map.editableArea.x, this.map.editableArea.x + this.map.editableArea.w);
                                y_1 = utils_1.clamp(y_1, this.map.editableArea.y, this.map.editableArea.y + this.map.editableArea.h);
                            }
                            this.highlightEntity = entities_1.createAnEntity(type, 0, x_1, y_1, {}, this.paletteManager, this);
                        }
                    }
                }
                if (input.wasPressed(302 /* MOUSE_BUTTON1 */) || input.wasPressed(328 /* TOUCH_CLICK */)) {
                    var pickedEntities = worldMap_1.pickEntities(this.map, hover, shift, this.mod);
                    var pickedEntity = pickedEntities[(pickedEntities.indexOf(this.selected) + 1) % pickedEntities.length];
                    var holdingRemoveTool = player.hold === removeEntitiesTool.type;
                    var holdingPlaceTool = player.hold === placeEntitiesTool.type;
                    var editableMap = utils_1.hasFlag(this.map.flags, 2 /* EditableEntities */);
                    var holdingTool = holdingRemoveTool || holdingPlaceTool;
                    if (BETA && this.editor.selectingEntities) {
                        playerActions_1.editorSelectEntities(this, hover, shift);
                    }
                    else if (pickedEntity && (!holdingTool || !editableMap || utils_1.hasFlag(pickedEntity.flags, 4096 /* IgnoreTool */))) {
                        if (pickedEntity.type === constants_1.PONY_TYPE) {
                            this.select(pickedEntity);
                        }
                        else if (entityUtils_1.entityInRange(pickedEntity, player)) {
                            server.interact(pickedEntity.id);
                        }
                    }
                    else if (BETA && this.editor.tile !== -1) {
                        if (this.editor.brushSize > 1) {
                            var x_2 = Math.floor((hover.x - (this.editor.brushSize / 2)));
                            var y_2 = Math.floor((hover.y - (this.editor.brushSize / 2)));
                            server.editorAction({ type: 'tile', x: x_2, y: y_2, tile: this.editor.tile, size: this.editor.brushSize });
                        }
                        else {
                            var x_3 = hover.x | 0;
                            var y_3 = hover.y | 0;
                            var type = this.editor.tile === worldMap_1.getTile(this.map, hover.x, hover.y) ? 1 /* Dirt */ : this.editor.tile;
                            server.changeTile(x_3, y_3, type);
                        }
                    }
                    else if (player.hold === changeTileTool.type && utils_1.hasFlag(this.map.flags, 4 /* EditableTiles */)) {
                        var x_4 = hover.x | 0;
                        var y_4 = hover.y | 0;
                        server.changeTile(x_4, y_4, interfaces_1.houseTiles[this.placeTile].type);
                    }
                    else if (player.hold === toggleWallsTool.type && utils_1.hasFlag(this.map.flags, 1 /* EditableWalls */)) {
                        playerActions_1.toggleWall(this, hover);
                    }
                    else if (holdingRemoveTool && this.highlightEntity && editableMap) {
                        var id_1 = this.highlightEntity.id;
                        this.send(function (server) { return server.actionParam(27 /* RemoveEntity */, id_1); });
                    }
                    else if (holdingPlaceTool && this.highlightEntity && editableMap) {
                        var _b = this.highlightEntity, x_5 = _b.x, y_5 = _b.y, type_1 = _b.type;
                        this.send(function (server) { return server.actionParam(28 /* PlaceEntity */, { x: x_5, y: y_5, type: type_1 }); });
                    }
                    else if (this.selected) {
                        this.select(undefined);
                    }
                    else if (utils_1.hasFlag(this.map.flags, 8 /* EdibleGrass */)) {
                        var tile = worldMap_1.getTile(this.map, hover.x, hover.y);
                        if (interfaces_1.isValidTile(tile) && utils_1.distanceXY(player.x, player.y, hover.x, hover.y) < constants_1.TILE_CHANGE_RANGE) {
                            var x_6 = hover.x | 0;
                            var y_6 = hover.y | 0;
                            var type = tile === 2 /* Grass */ ? 1 /* Dirt */ : 2 /* Grass */;
                            server.changeTile(x_6, y_6, type);
                        }
                    }
                    else if (DEVELOPMENT && this.engine === interfaces_1.Engine.LayeredTiles && this.editor.elevation) {
                        var value = worldMap_1.getElevation(this.map, hover.x, hover.y);
                        worldMap_1.setElevation(this.map, hover.x, hover.y, utils_1.clamp(this.editor.elevation === 'up' ? value + 1 : value - 1, 0, 10));
                    }
                }
                if (BETA && input.wasPressed(303 /* MOUSE_BUTTON2 */)) {
                    if (this.editor.selectingEntities) {
                        playerActions_1.editorMoveEntities(this, hover);
                    }
                    else if (this.mod) {
                        playerActions_1.toggleWall(this, hover);
                    }
                }
                if (BETA && input.wasPressed(304 /* MOUSE_BUTTON3 */)) {
                    if (this.mod) {
                        server.editorAction({ type: 'place', entity: this.editor.type, x: hover.x, y: hover.y });
                        console.log(this.editor.type + "(" + hover.x.toFixed(2) + ", " + hover.y.toFixed(2) + ")");
                    }
                }
                if (this.player && input.wheelY) {
                    if (input.isPressed(16 /* SHIFT */)) {
                        if (utils_1.hasFlag(this.map.flags, 2 /* EditableEntities */)) {
                            var action_1 = input.wheelY < 0 ? 29 /* SwitchTool */ : 30 /* SwitchToolRev */;
                            this.send(function (server) { return server.action(action_1); });
                        }
                    }
                    else {
                        if (this.player.hold === placeEntitiesTool.type) {
                            this.changePlaceEntity(input.wheelY < 0);
                        }
                        else if (this.player.hold === changeTileTool.type) {
                            this.changePlaceTile(input.wheelY < 0);
                        }
                    }
                }
                var isHeadTurned = utils_1.hasFlag(player.state, 4 /* HeadTurned */);
                var isHeadFacingRight = right ? !isHeadTurned : isHeadTurned;
                if (((input.axis2X < 0 && isHeadFacingRight) || (input.axis2X > 0 && !isHeadFacingRight))) {
                    if (server.action(2 /* TurnHead */)) {
                        player.state = (player.state) ^ 4 /* HeadTurned */;
                    }
                }
            }
        }
        if (player) {
            var safe = utils_1.hasFlag(this.worldFlags, 1 /* Safe */);
            worldMap_1.updateEntities(this, this.time, delta, safe);
            sec_1.savePlayerPosition();
        }
        if (this.changedScale) {
            this.changedScale = false;
            this.resizedCamera = true;
            if (player) {
                camera_1.centerCameraOn(camera, player);
            }
        }
        if (player) {
            camera_1.updateCamera(camera, player, this.map);
        }
        if (this.resizedCamera) {
            server.updateCamera(camera.x, camera.y, camera.w, camera.h);
            this.resizedCamera = false;
        }
        if (player) {
            worldMap_1.updateEntitiesCoverLifted(this.map, player, !!this.settings.account.seeThroughObjects, delta);
            worldMap_1.updateEntitiesWithNames(this.map, this.hover, player);
            worldMap_1.updateEntitiesTriggers(this.map, player, this);
        }
        input.end();
        if (this.nextFriendsCRC < now) {
            this.send(function (server) { return server.actionParam(23 /* FriendsCRC */, _this.model.computeFriendsCRC()); });
            this.nextFriendsCRC = now + 15 * constants_1.MINUTE;
        }
        var threshold = Date.now() - 10 * constants_1.SECOND;
        for (var i = this.incompleteSays.length - 1; i >= 0; i--) {
            if (this.incompleteSays[i].time < threshold) {
                this.incompleteSays.splice(i, 1);
            }
        }
        this.updateSocketStats(delta);
        TIMING && timing_1.timeEnd();
        if (DEVELOPMENT && LOG_POSITION) {
            if (this.player) {
                this.positions.push({ x: this.player.x, y: this.player.y, moved: moved });
            }
        }
    };
    PonyTownGame.prototype.updateGameTime = function (delta) {
        if (this.baseTime !== this.targetBaseTime) {
            var timeDelta = Math.floor(delta * 0.2 * constants_1.HOUR);
            var baseTime = this.baseTime + timeDelta * (this.baseTime > this.targetBaseTime ? -1 : 1);
            if (Math.abs(this.targetBaseTime - baseTime) < timeDelta) {
                this.baseTime = this.targetBaseTime;
            }
            else {
                this.baseTime = baseTime;
            }
        }
        this.time = this.baseTime + performance.now();
    };
    PonyTownGame.prototype.updateSocketStats = function (delta) {
        this.timeSize += delta;
        if (this.timeSize > 1) {
            this.sent = 8 * this.socket.sentSize / this.timeSize / 1024;
            this.recv = 8 * this.socket.receivedSize / this.timeSize / 1024;
            this.socket.sentSize = 0;
            this.socket.receivedSize = 0;
            this.timeSize = 0;
        }
    };
    PonyTownGame.prototype.setWorldState = function (state, initial) {
        this.season = state.season;
        this.holiday = state.holiday;
        this.worldFlags = state.flags;
        this.lightData = timeUtils_1.createLightData(this.season);
        clientUtils_1.initFeatureFlags(state.featureFlags);
        var baseTime = state.time - performance.now();
        if (initial) {
            this.baseTime = this.targetBaseTime = baseTime;
        }
        else {
            this.targetBaseTime = baseTime;
        }
        this.updateTileSets();
        if (this.model.friends) {
            for (var _i = 0, _a = this.model.friends; _i < _a.length; _i++) {
                var friend = _a[_i];
                friend.actualName = handlers_1.filterEntityName(this, friend.name, friend.nameBad) || '';
            }
        }
    };
    PonyTownGame.prototype.setPlayer = function (player) {
        this.player = player;
        camera_1.centerCameraOn(this.camera, player);
        this.send(function (server) { return server.loaded(); });
    };
    PonyTownGame.prototype.setupMap = function () {
        this.bg = color_1.colorToFloatArray(colors_1.getTileColor(this.map.defaultTile, this.season));
        this.audio.initTracks(this.season, this.holiday, this.map.type);
        this.audio.playOrSwitchToRandomTrack();
        this.updateTileSets();
    };
    PonyTownGame.prototype.updateTileSets = function () {
        this.tileSets = tileUtils_1.updateTileSets(this.paletteManager, this.tileSets, this.season, this.map.type);
    };
    PonyTownGame.prototype.draw = function () {
        redrawActionButtons(this.actionsChanged);
        this.actionsChanged = false;
        if (!this.webgl)
            return;
        if (this.webgl.gl.isContextLost()) {
            DEVELOPMENT && console.warn('Context is lost');
            return;
        }
        // start frame
        var now = performance.now();
        if ((now - this.lastDraw) < this.frameDelay) {
            return;
        }
        this.frames++;
        if ((now - this.lastFps) > 1000) {
            this.drawFps = this.frames * 1000 / (now - this.lastFps);
            this.frames = 0;
            this.lastFps = now;
        }
        this.lastDraw = now;
        // draw
        var _a = this.webgl, gl = _a.gl, frameBuffer = _a.frameBuffer, frameBufferSheet = _a.frameBufferSheet, spriteShader = _a.spriteShader, spriteBatch = _a.spriteBatch, lightShader = _a.lightShader, paletteBatch = _a.paletteBatch, paletteShader = _a.paletteShader, palettes = _a.palettes;
        TIMING && timing_1.timeStart('draw');
        TIMING && timing_1.timeStart('draw init');
        var lightColor = colors_1.WHITE;
        var shadowColor = 0;
        if (this.map.type === 3 /* Cave */) {
            lightColor = colors_1.CAVE_LIGHT;
            shadowColor = colors_1.CAVE_SHADOW;
        }
        else {
            lightColor = timeUtils_1.getLightColor(this.lightData, this.time);
            shadowColor = timeUtils_1.getShadowColor(this.lightData, this.time);
        }
        if (BETA && this.editor.customLight) {
            lightColor = color_1.parseColor(this.editor.lightColor);
            shadowColor = this.shadowColor;
        }
        var camera = this.camera;
        var width = camera.w;
        var height = camera.h;
        var ratio = integerPixelRatio();
        var actualScale = this.scale * ratio;
        var bg = this.bg;
        color_1.colorToExistingFloatArray(light, lightColor);
        var drawOptions = this.drawOptions;
        drawOptions.gameTime = this.time;
        drawOptions.lightColor = lightColor;
        drawOptions.shadowColor = shadowColor;
        drawOptions.drawHidden = this.mod;
        drawOptions.season = this.season;
        if (DEVELOPMENT) {
            drawOptions.debug = this.debug;
        }
        if (DEVELOPMENT || BETA) {
            drawOptions.engine = this.engine;
        }
        mat4_1.ortho(this.fboMatrix, 0, gl.drawingBufferWidth / actualScale, gl.drawingBufferHeight / actualScale, 0, 0, 1000);
        TIMING && timing_1.timeEnd();
        TIMING && timing_1.timeStart('ensureAllVisiblePon...');
        worldMap_1.ensureAllVisiblePoniesAreDecoded(this.map, camera, this.paletteManager);
        TIMING && timing_1.timeEnd();
        TIMING && timing_1.timeStart('commit+invalidatePalettes');
        if (this.paletteManager.commit(gl)) {
            worldMap_1.invalidatePalettes(this.map.entitiesDrawable);
        }
        TIMING && timing_1.timeEnd();
        if (this.settings.browser.brightNight) {
            utils_1.lerpColor(light, white, 0.3);
        }
        if (this.engine === interfaces_1.Engine.NewLighting) {
            // ...
        }
        else if (this.disableLighting) {
            mat4_1.ortho(this.viewMatrix, camera.x, camera.x + camera.w, camera.actualY + camera.h, camera.actualY, 0, 1000);
            utils_1.lerpColor(light, white, 0.1); // adjust lighting for missing lights
            // color -> screen
            gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.disable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            this.drawMap(this.webgl, this.map, this.viewMatrix, light, drawOptions);
        }
        else {
            mat4_1.ortho(this.viewMatrix, camera.x, camera.x + camera.w, camera.actualY, camera.actualY + camera.h, 0, 1000);
            TIMING && timing_1.timeStart('initializeFrameBuffer');
            this.initializeFrameBuffer(this.webgl, width, height);
            TIMING && timing_1.timeEnd();
            if (!frameBuffer) {
                DEVELOPMENT && console.warn('No frame buffer');
                return;
            }
            // color -> fbo
            TIMING && timing_1.timeStart('color -> fbo');
            // gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer.handle);
            frameBuffer_1.bindFrameBuffer(gl, frameBuffer);
            gl.viewport(0, 0, frameBuffer.width, frameBuffer.height);
            gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
            gl.clear(gl.COLOR_BUFFER_BIT); // | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, width, height);
            gl.disable(gl.DEPTH_TEST);
            //gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            this.drawMap(this.webgl, this.map, this.viewMatrix, white, drawOptions);
            TIMING && timing_1.timeEnd();
            // color -> screen
            TIMING && timing_1.timeStart('color -> screen');
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            frameBuffer_1.unbindFrameBuffer(gl);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            gl.useProgram(spriteShader.program);
            gl.uniformMatrix4fv(spriteShader.uniforms.transform, false, this.fboMatrix);
            gl.uniform4fv(spriteShader.uniforms.lighting, white);
            gl.uniform1f(spriteShader.uniforms.textureSize, frameBufferSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, frameBufferSheet.texture);
            spriteBatch.begin();
            spriteBatch.drawImage(colors_1.WHITE, 0, 0, width, height, 0, 0, width, height);
            spriteBatch.end();
            TIMING && timing_1.timeEnd();
            // light -> fbo
            TIMING && timing_1.timeStart('light -> fbo');
            // gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer.handle);
            frameBuffer_1.bindFrameBuffer(gl, frameBuffer);
            gl.viewport(0, 0, frameBuffer.width, frameBuffer.height);
            gl.clearColor(light[0], light[1], light[2], light[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, width, height);
            //gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE);
            TIMING && timing_1.timeEnd();
            // shadows
            //for (const e of map.entities) {
            //	if (e.drawShadow && camera.isBoundVisible(e.shadowBounds || e.bounds, e.x, e.y)) {
            //		this.spriteBatch.depth = camera.mapDepth(e.y);
            //		e.drawShadow(this.spriteBatch);
            //	}
            //}
            // soft lights
            TIMING && timing_1.timeStart('drawEntityLights');
            gl.useProgram(lightShader.program);
            gl.uniformMatrix4fv(lightShader.uniforms.transform, false, this.viewMatrix);
            gl.uniform4fv(lightShader.uniforms.lighting, white);
            spriteBatch.begin();
            draw_1.drawEntityLights(spriteBatch, this.map.entitiesLight, this.camera, drawOptions);
            spriteBatch.end();
            TIMING && timing_1.timeEnd();
            // light sprites
            TIMING && timing_1.timeStart('drawEntityLightSprites');
            gl.useProgram(spriteShader.program);
            gl.uniformMatrix4fv(spriteShader.uniforms.transform, false, this.viewMatrix);
            gl.uniform4fv(spriteShader.uniforms.lighting, white);
            gl.uniform1f(spriteShader.uniforms.textureSize, sprites_1.normalSpriteSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, sprites_1.normalSpriteSheet.texture);
            spriteBatch.begin();
            draw_1.drawEntityLightSprites(spriteBatch, this.map.entitiesLightSprite, this.camera, drawOptions);
            spriteBatch.end();
            TIMING && timing_1.timeEnd();
            // light -> screen
            TIMING && timing_1.timeStart('light -> screen');
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            frameBuffer_1.unbindFrameBuffer(gl);
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.enable(gl.BLEND);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.DST_COLOR, gl.ZERO);
            gl.useProgram(spriteShader.program);
            gl.uniformMatrix4fv(spriteShader.uniforms.transform, false, this.fboMatrix);
            gl.uniform4fv(spriteShader.uniforms.lighting, white);
            gl.uniform1f(spriteShader.uniforms.textureSize, frameBufferSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, frameBufferSheet.texture);
            spriteBatch.begin();
            spriteBatch.drawImage(colors_1.WHITE, 0, 0, width, height, 0, 0, width, height);
            spriteBatch.end();
            TIMING && timing_1.timeEnd();
        }
        // ui -> screen
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        TIMING && timing_1.timeStart('drawNames+drawChat');
        gl.useProgram(paletteShader.program);
        gl.uniformMatrix4fv(paletteShader.uniforms.transform, false, this.fboMatrix);
        gl.uniform4fv(paletteShader.uniforms.lighting, white);
        gl.uniform1f(paletteShader.uniforms.pixelSize, this.paletteManager.pixelSize);
        gl.uniform1f(paletteShader.uniforms.textureSize, sprites_1.paletteSpriteSheet.texture.width);
        texture2d_1.bindTexture(gl, 0, sprites_1.paletteSpriteSheet.texture);
        texture2d_1.bindTexture(gl, 1, this.paletteManager.texture);
        paletteBatch.begin();
        if (!this.hideText) {
            graphicsUtils_1.drawNames(paletteBatch, this.map.entitiesWithNames, this.player, this.party, this.camera, this.hover, this.mod, palettes);
            graphicsUtils_1.drawChat(paletteBatch, this.map.entitiesWithChat, this.camera, this.mod, palettes, this.hidePublicChat);
        }
        if (!this.socket || !this.socket.isConnected) {
            this.drawMessage(this.webgl, 'Connecting...');
        }
        else if (!this.loaded) {
            if (this.placeInQueue) {
                this.drawMessage(this.webgl, "Waiting in queue (" + this.placeInQueue + ")");
            }
            else {
                this.drawMessage(this.webgl, 'Loading...');
            }
        }
        else if ((performance.now() - this.socket.lastPacket) > CONNECTION_ISSUE_TIMEOUT) {
            // this.drawMessage('Connection issues...');
        }
        if (BETA && this.debug.showInfo) {
            try {
                var scale = this.getPixelScale();
                var x = this.input.pointerX / scale + 5;
                var y = this.input.pointerY / scale;
                var height_1 = worldMap_1.getMapHeightAt(this.map, this.hover.x, this.hover.y, this.time);
                spriteFont_1.drawText(paletteBatch, "" + height_1.toFixed(2), fonts_1.fontSmallPal, colors_1.BLACK, x, y);
            }
            catch (e) {
                console.warn(e.message);
            }
        }
        if (this.showWallPlaceholder) {
            var x = this.hover.x | 0;
            var y = this.hover.y | 0;
            var dx = this.hover.x - x;
            var dy = this.hover.y - y;
            var palette = this.webgl.palettes.defaultPalette;
            var color = color_1.makeTransparent(colors_1.WHITE, 0.6);
            var screenX_1 = positionUtils_1.toScreenX(x) - this.camera.x;
            var screenY_1 = positionUtils_1.toScreenY(y) - this.camera.actualY;
            if (x >= 0 && y >= 0 && x < this.map.width && y < this.map.height) {
                if (dx > dy) {
                    if ((dx + dy) < 1) {
                        paletteBatch.drawSprite(sprites_1.wall_h_placeholder.color, color, palette, screenX_1, screenY_1 - 15);
                    }
                    else {
                        paletteBatch.drawSprite(sprites_1.wall_v_placeholder.color, color, palette, screenX_1 + constants_1.tileWidth - 4, screenY_1 - 12);
                    }
                }
                else {
                    if ((dx + dy) < 1) {
                        paletteBatch.drawSprite(sprites_1.wall_v_placeholder.color, color, palette, screenX_1 - 4, screenY_1 - 12);
                    }
                    else {
                        paletteBatch.drawSprite(sprites_1.wall_h_placeholder.color, color, palette, screenX_1, screenY_1 + constants_1.tileHeight - 15);
                    }
                }
            }
        }
        paletteBatch.end();
        TIMING && timing_1.timeEnd();
        gl.useProgram(spriteShader.program);
        gl.uniformMatrix4fv(spriteShader.uniforms.transform, false, this.fboMatrix);
        gl.uniform4fv(spriteShader.uniforms.lighting, white);
        if (BETA && this.showMinimap && this.minimap) {
            gl.uniform1f(spriteShader.uniforms.textureSize, sprites_1.normalSpriteSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, sprites_1.normalSpriteSheet.texture);
            spriteBatch.begin();
            spriteBatch.save();
            var _b = this.minimap, width_1 = _b.width, height_2 = _b.height, data = _b.data;
            var scale = 4 / this.scale;
            spriteBatch.translate(100, 100);
            spriteBatch.scale(scale, scale);
            spriteBatch.drawRect(colors_1.BLACK, -1, -1, width_1 + 2, height_2 + 2);
            for (var y = 0; y < height_2; y++) {
                for (var x = 0; x < width_1; x++) {
                    spriteBatch.drawRect(data[x + y * width_1], x, y, 1, 1);
                }
            }
            if (this.player) {
                spriteBatch.drawRect(colors_1.RED, Math.floor(this.player.x), Math.floor(this.player.y), 1, 1);
            }
            spriteBatch.restore();
            spriteBatch.end();
        }
        if (BETA && this.debug.showRegions && this.player) {
            gl.uniform1f(spriteShader.uniforms.textureSize, sprites_1.normalSpriteSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, sprites_1.normalSpriteSheet.texture);
            spriteBatch.begin();
            draw_1.drawDebugRegions(spriteBatch, this.map, this.player, this.camera);
            spriteBatch.end();
        }
        var showFPS = !!this.settings.browser.showFps;
        var showHelp = BETA && this.input.isPressed(112 /* F1 */);
        var showPalette = DEVELOPMENT && this.debug.showPalette;
        if (showFPS || showHelp || showPalette) {
            // 1 to 1 pixel scale drawing
            TIMING && timing_1.timeStart('showFps');
            var scale = 2;
            // const height = gl.drawingBufferHeight / (ratio * scale);
            mat4_1.ortho(this.fboMatrix, 0, gl.drawingBufferWidth / ratio, gl.drawingBufferHeight / ratio, 0, 0, 1000);
            gl.uniformMatrix4fv(spriteShader.uniforms.transform, false, this.fboMatrix);
            gl.uniform1f(spriteShader.uniforms.textureSize, sprites_1.normalSpriteSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, sprites_1.normalSpriteSheet.texture);
            spriteBatch.begin();
            spriteBatch.save();
            spriteBatch.scale(scale, scale);
            if (showFPS) {
                spriteFont_1.drawText(spriteBatch, this.drawFps.toFixed(), fonts_1.fontSmall, colors_1.BLACK, 2, 2);
                if (this.timingsText) {
                    var size = spriteFont_1.measureText(this.timingsText, fonts_1.fontMono);
                    spriteBatch.drawRect(0x000000aa, 2, 26, 220, size.h + 8);
                    spriteFont_1.drawText(spriteBatch, this.timingsText, fonts_1.fontMono, colors_1.WHITE, 2, 30);
                }
            }
            if (BETA && showHelp) {
                var y = 25;
                for (var _i = 0, _c = this.debugShortcuts; _i < _c.length; _i++) {
                    var shortcut = _c[_i];
                    spriteFont_1.drawOutlinedText(spriteBatch, shortcut, fonts_1.font, colors_1.WHITE, colors_1.BLACK, 5, y);
                    y += 10;
                }
            }
            // if (DEVELOPMENT) {
            // 	const width = gl.drawingBufferWidth / (ratio * scale);
            // 	const { isCollidingCount, isCollidingObjectCount } = getCollisionStats();
            // 	const text =
            // 		`${isCollidingCount.toString().padStart(7)} calls\n` +
            // 		`${isCollidingObjectCount.toString().padStart(7)} total checks\n` +
            // 		`${this.markedColliding.toString().padStart(7)} player checks`;
            // 	const size = measureText(text, fontMono);
            // 	const x = width - 160;
            // 	const y = 26;
            // 	spriteBatch.drawRect(0x000000aa, x, y, 150, size.h + 10);
            // 	drawText(spriteBatch, text, fontMono, WHITE, x + 5, y + 5);
            // }
            spriteBatch.restore();
            spriteBatch.end();
            if (DEVELOPMENT && showPalette) {
                var paletteTexture = this.paletteManager.texture;
                var width_2 = paletteTexture.width, height_3 = paletteTexture.height;
                gl.uniform1f(spriteShader.uniforms.textureSize, sprites_1.normalSpriteSheet.texture.width);
                texture2d_1.bindTexture(gl, 0, sprites_1.normalSpriteSheet.texture);
                spriteBatch.begin();
                spriteBatch.drawRect(0x00000066, 20, 20, width_2, height_3);
                spriteBatch.end();
                gl.uniform1f(spriteShader.uniforms.textureSize, width_2);
                texture2d_1.bindTexture(gl, 0, paletteTexture);
                spriteBatch.begin();
                spriteBatch.drawImage(colors_1.WHITE, 0, 0, width_2, height_3, 20, 20, width_2, height_3);
                spriteBatch.end();
            }
            TIMING && timing_1.timeEnd();
        }
        texture2d_1.bindTexture(gl, 0, undefined);
        texture2d_1.bindTexture(gl, 1, undefined);
        gl.useProgram(null);
        TIMING && timing_1.timeEnd();
        this.updateStatsText();
        TIMING && timing_1.timeStart('messageQueue');
        while (this.messageQueue.length) {
            this.onMessage.next(this.messageQueue.shift());
        }
        TIMING && timing_1.timeEnd();
        TIMING && timing_1.timeStart('onFrame');
        this.onFrame.next();
        TIMING && timing_1.timeEnd();
    };
    PonyTownGame.prototype.drawMessage = function (_a, message) {
        var paletteBatch = _a.paletteBatch, palettes = _a.palettes;
        graphicsUtils_1.drawFullScreenMessage(paletteBatch, this.camera, message, palettes.mainFont.white);
    };
    PonyTownGame.prototype.drawMap = function (webgl, map, viewMatrix, lighting, options) {
        var gl = webgl.gl, paletteBatch = webgl.paletteBatch, paletteShader = webgl.paletteShader;
        TIMING && timing_1.timeStart('drawMap');
        if (this.tileSets && this.player) {
            gl.useProgram(paletteShader.program);
            gl.uniformMatrix4fv(paletteShader.uniforms.transform, false, viewMatrix);
            gl.uniform4fv(paletteShader.uniforms.lighting, lighting);
            gl.uniform1f(paletteShader.uniforms.pixelSize, this.paletteManager.pixelSize);
            gl.uniform1f(paletteShader.uniforms.textureSize, sprites_1.paletteSpriteSheet.texture.width);
            texture2d_1.bindTexture(gl, 0, sprites_1.paletteSpriteSheet.texture);
            texture2d_1.bindTexture(gl, 1, this.paletteManager.texture);
            paletteBatch.begin();
            this.entitiesDrawn = draw_1.drawMap(paletteBatch, map, this.camera, this.player, options, this.tileSets, this.editor.selectedEntities);
            paletteBatch.end();
            if (this.highlightEntity && this.highlightEntity.draw) {
                gl.uniform4fv(paletteShader.uniforms.lighting, highlightColor);
                paletteBatch.begin();
                this.highlightEntity.draw(paletteBatch, this.drawOptions);
                paletteBatch.end();
            }
        }
        TIMING && timing_1.timeEnd();
    };
    PonyTownGame.prototype.updateCameraShift = function () {
        if (data_1.isMobile) {
            var isKeyboardOpen = !!document.activeElement && /input/i.test(document.activeElement.tagName);
            if (this.lastIsKeyboardOpen !== isKeyboardOpen) {
                DEVELOPMENT && clientUtils_1.log("keyboard open " + isKeyboardOpen);
                this.lastIsKeyboardOpen = isKeyboardOpen;
            }
            if (isKeyboardOpen) {
                if (!this.cameraShiftOn && window.scrollY > 100) {
                    this.cameraShiftOn = true;
                    this.cameraShiftTarget = window.scrollY;
                    if (DEVELOPMENT) {
                        clientUtils_1.log("shift camera " + this.cameraShiftTarget + " (" + this.windowHeight + " - " + window.innerHeight + ", " + window.scrollY + ")");
                    }
                }
            }
            else {
                if (this.cameraShiftOn && window.scrollY < 100) {
                    this.cameraShiftOn = false;
                    DEVELOPMENT && clientUtils_1.log("unshift camera");
                }
            }
        }
    };
    PonyTownGame.prototype.resizeCanvas = function () {
        pixelRatioCache = canvasUtils_1.getPixelRatio();
        var canvas = this.canvas;
        var ratio = pixelRatio();
        var rect = this.element.getBoundingClientRect();
        this.windowWidth = rect.width;
        this.windowHeight = rect.height;
        var w = Math.ceil(this.windowWidth * ratio);
        var h = Math.ceil(this.windowHeight * ratio);
        while ((w % 12) !== 0) {
            w++;
        }
        while ((h % 12) !== 0) {
            h++;
        }
        if (canvas && w && h && (canvas.width !== w || canvas.height !== h || this.lastCanvasRatio !== ratio)) {
            canvas.width = w;
            canvas.height = h;
            canvas.style.width = w / ratio + "px";
            canvas.style.height = h / ratio + "px";
            this.lastCanvasRatio = ratio;
            this.resized = false;
            DEVELOPMENT && clientUtils_1.log("scrollY: " + window.scrollY);
        }
    };
    PonyTownGame.prototype.initializeFrameBuffer = function (_a, width, height) {
        var gl = _a.gl, frameBuffer = _a.frameBuffer;
        var targetSize = webglUtils_1.getRenderTargetSize(width, height);
        if (frameBuffer && targetSize !== frameBuffer.width) {
            var maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
            if (maxSize != null && targetSize > maxSize) {
                this.setScale(this.scale + 1);
            }
            else {
                frameBuffer_1.resizeFrameBuffer(gl, frameBuffer, targetSize, targetSize);
            }
        }
    };
    PonyTownGame.prototype.announce = function (announcement) {
        this.announcements.next(announcement);
    };
    PonyTownGame.prototype.changePlaceEntity = function (reverse) {
        if (reverse) {
            this.placeEntity = this.placeEntity === 0 ? (entities_1.placeableEntities.length - 1) : (this.placeEntity - 1);
        }
        else {
            this.placeEntity = (this.placeEntity + 1) % entities_1.placeableEntities.length;
        }
        var name = entities_1.placeableEntities[this.placeEntity].name;
        var total = clientUtils_1.getSaysTime(name);
        entityUtils_1.addChatBubble(this.map, this.player, { message: name, type: 1 /* System */, total: total, timer: total, created: Date.now() });
    };
    PonyTownGame.prototype.changePlaceTile = function (reverse) {
        if (reverse) {
            this.placeTile = this.placeTile === 0 ? (interfaces_1.houseTiles.length - 1) : (this.placeTile - 1);
        }
        else {
            this.placeTile = (this.placeTile + 1) % interfaces_1.houseTiles.length;
        }
        var name = interfaces_1.houseTiles[this.placeTile].name;
        var total = clientUtils_1.getSaysTime(name);
        entityUtils_1.addChatBubble(this.map, this.player, { message: name, type: 1 /* System */, total: total, timer: total, created: Date.now() });
    };
    PonyTownGame.prototype.saveDebug = function () {
        this.storage.setJSON('debug', this.debug);
    };
    PonyTownGame.prototype.updateStatsText = function () {
        var _a = this.webgl, gl = _a.gl, spriteBatch = _a.spriteBatch, paletteBatch = _a.paletteBatch;
        if ((performance.now() - this.lastStats) > constants_1.SECOND) {
            TIMING && timing_1.timingCollate();
            if (TIMING) {
                var timings = timing_1.timingCollate();
                this.timingsText = timings
                    .map(function (_a) {
                    var selfTime = _a.selfTime, selfPercent = _a.selfPercent, totalPercent = _a.totalPercent, count = _a.count, name = _a.name;
                    return selfTime.toFixed(2).padStart(6) + "ms" +
                        (selfPercent.toFixed(2).padStart(6) + "%") +
                        (totalPercent.toFixed(2).padStart(6) + "%") +
                        (count.toString().padStart(6) + " " + name);
                })
                    .join('\n');
            }
            if (this.statsText) {
                var value = '';
                if (this.settings.browser.showStats) {
                    var tris = spriteBatch.tris + paletteBatch.tris;
                    var flush = paletteBatch.flushes;
                    var sent = this.sent.toFixed();
                    var recv = this.recv.toFixed();
                    var drawn = this.entitiesDrawn;
                    var total = this.map.entities.length;
                    var ponies = this.map.entities.reduce(function (sum, e) { return sum + (e.type === constants_1.PONY_TYPE ? 1 : 0); }, 0);
                    var extra = DEVELOPMENT ? "(" + drawn + "/" + total + ") " + tris + " tris, " + flush + " flush, " + this.audio.trackName : data_1.version;
                    var gl2 = webglUtils_1.isWebGL2(gl) ? ' WebGL2' : '';
                    var engine = this.engine === interfaces_1.Engine.Default ? '' : interfaces_1.Engine[this.engine].toUpperCase();
                    var fps = this.drawFps.toFixed(0);
                    var low = this.disableLighting ? ' LOW' : '';
                    var extraStats = this.extraStats;
                    var palSize = " pal " + this.paletteManager.textureSize;
                    value = "" + extraStats + engine + " " + fps + " fps " + sent + "/" + recv + " kb/s " + ponies + " " +
                        ("ponies " + extra + gl2 + low + palSize).trim();
                }
                if (value !== this.statsTextValue) {
                    this.statsText.nodeValue = value;
                    this.statsTextValue = value;
                }
            }
            this.lastStats = performance.now();
            this.onClock.next(timeUtils_1.formatHourMinutes(this.time));
        }
        TIMING && timing_1.timeReset();
        spriteBatch.tris = 0;
        spriteBatch.flushes = 0;
        paletteBatch.tris = 0;
        paletteBatch.flushes = 0;
    };
    PonyTownGame = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [audio_1.Audio,
            storageService_1.StorageService,
            settingsService_1.SettingsService,
            model_1.Model,
            errorReporter_1.ErrorReporter,
            core_1.NgZone])
    ], PonyTownGame);
    return PonyTownGame;
}());
exports.PonyTownGame = PonyTownGame;
