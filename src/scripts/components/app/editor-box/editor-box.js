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
var core_1 = require("@angular/core");
var lodash_1 = require("lodash");
var icons_1 = require("../../../client/icons");
var game_1 = require("../../../client/game");
var storageService_1 = require("../../services/storageService");
var model_1 = require("../../services/model");
var color_1 = require("../../../common/color");
var colors_1 = require("../../../common/colors");
var interfaces_1 = require("../../../common/interfaces");
var EditorBox = /** @class */ (function () {
    function EditorBox(model, game, storage, zone) {
        this.model = model;
        this.game = game;
        this.storage = storage;
        this.zone = zone;
        this.dev = DEVELOPMENT;
        this.cogIcon = icons_1.faCog;
        this.editIcon = icons_1.faEdit;
        this.selectIcon = icons_1.faDrawPolygon;
        this.deleteIcon = icons_1.faTrash;
        this.checkIcon = icons_1.faCheck;
        this.emptyIcon = icons_1.emptyIcon;
        this.tiles = ['---'].concat(interfaces_1.tileTypeNames);
        this.engines = game_1.engines;
        this.showFields = ['id', 'bounds', 'collider', 'cover', 'interact', 'trigger'];
        this.showEditor = false;
        this.game.editor.type = this.storage.getItem('editor-entity') || 'rock';
        this.showEditor = this.storage.getBoolean('show-editor');
        this.editorEntities = model_1.getEntityNames().slice().sort();
    }
    Object.defineProperty(EditorBox.prototype, "editor", {
        get: function () {
            return this.game.editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "hasElevation", {
        get: function () {
            return this.game.engine === interfaces_1.Engine.LayeredTiles;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "editorElevation", {
        get: function () {
            return this.game.editor.elevation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "editorSpecial", {
        get: function () {
            return this.game.editor.special;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "editorEntity", {
        get: function () {
            return this.game.editor.type;
        },
        set: function (value) {
            this.game.editor.type = value;
            this.storage.setItem('editor-entity', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "editorTile", {
        get: function () {
            return this.game.editor.tile;
        },
        set: function (value) {
            this.game.editor.tile = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "hasEditor", {
        get: function () {
            return this.model.isMod && this.showEditor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "oneEntity", {
        get: function () {
            return this.editor.selectedEntities[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "singleEntity", {
        get: function () {
            return this.editor.selectedEntities.length === 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "hasSelectedEntities", {
        get: function () {
            return this.editor.selectedEntities.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "isLightEntity", {
        get: function () {
            return this.editor.selectedEntities.some(function (e) { return !!e.drawLight; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "isLightSpriteEntity", {
        get: function () {
            return this.editor.selectedEntities.some(function (e) { return !!e.drawLightSprite; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "selectingEntities", {
        get: function () {
            return this.game.editor.selectingEntities;
        },
        set: function (value) {
            this.game.editor.selectingEntities = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "shadowOpacity", {
        get: function () {
            return color_1.getAlpha(this.game.shadowColor);
        },
        set: function (value) {
            this.game.shadowColor = color_1.withAlpha(this.game.shadowColor, value);
        },
        enumerable: true,
        configurable: true
    });
    EditorBox.prototype.getEntityName = function (type) {
        return model_1.getEntityNameFromType(type);
    };
    EditorBox.prototype.getEntityValue = function (map) {
        var entity = this.editor.selectedEntities[0];
        return map(entity);
    };
    Object.defineProperty(EditorBox.prototype, "entityName", {
        get: function () {
            var _this = this;
            var entities = this.editor.selectedEntities;
            var types = entities.map(function (e) { return e.type; });
            var names = lodash_1.uniq(types).map(function (type) { return _this.getEntityName(type); }).join(', ');
            return types.length === 1 ? names + " [" + entities[0].id + "]" : names;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityLightColor", {
        get: function () {
            return color_1.colorToHexRGB(this.getEntityValue(function (e) { return e && e.lightColor || colors_1.BLACK; }));
        },
        set: function (value) {
            this.editor.selectedEntities.forEach(function (e) { return e.lightColor = color_1.parseColor(value); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityLightSpriteColor", {
        get: function () {
            var entity = this.editor.selectedEntities[0];
            return color_1.colorToHexRGB(entity && entity.lightSpriteColor || colors_1.BLACK);
        },
        set: function (value) {
            this.editor.selectedEntities.forEach(function (e) { return e.lightSpriteColor = color_1.parseColor(value); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityLightSpriteX", {
        get: function () {
            var entity = this.editor.selectedEntities[0];
            return entity && entity.lightSpriteX || 0;
        },
        set: function (value) {
            console.log('set x', value, this.editor.selectedEntities);
            this.editor.selectedEntities.forEach(function (e) { return e.lightSpriteX = value; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityLightSpriteY", {
        get: function () {
            var entity = this.editor.selectedEntities[0];
            return entity && entity.lightSpriteY || 0;
        },
        set: function (value) {
            this.editor.selectedEntities.forEach(function (e) { return e.lightSpriteY = value; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityLightScale", {
        get: function () {
            return this.editor.selectedEntities.length ? this.editor.selectedEntities[0].lightScaleAdjust : 1;
        },
        set: function (value) {
            this.editor.selectedEntities.forEach(function (e) { return e.lightScaleAdjust = value; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityX", {
        get: function () {
            return this.oneEntity.x;
        },
        set: function (value) {
            this.oneEntity.x = value;
            var _a = this.oneEntity, id = _a.id, x = _a.x, y = _a.y;
            this.game.send(function (server) { return server.editorAction({
                type: 'move',
                entities: [{ id: id, x: x, y: y }],
            }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EditorBox.prototype, "entityY", {
        get: function () {
            return this.oneEntity.y;
        },
        set: function (value) {
            this.oneEntity.y = value;
            var _a = this.oneEntity, id = _a.id, x = _a.x, y = _a.y;
            this.game.send(function (server) { return server.editorAction({
                type: 'move',
                entities: [{ id: id, x: x, y: y }],
            }); });
        },
        enumerable: true,
        configurable: true
    });
    EditorBox.prototype.editorClear = function () {
        this.game.send(function (server) { return server.editorAction({ type: 'clear' }); });
    };
    EditorBox.prototype.clearLocalStorage = function () {
        this.storage.clear();
    };
    EditorBox.prototype.setEngine = function (engine) {
        this.game.engine = engine.engine;
    };
    EditorBox.prototype.isActiveEngine = function (engine) {
        return this.game.engine === engine.engine;
    };
    EditorBox.prototype.toggleEditor = function () {
        var _this = this;
        this.zone.run(function () {
            _this.showEditor = !_this.showEditor;
            _this.storage.setBoolean('show-editor', _this.showEditor);
        });
    };
    EditorBox.prototype.toggleSelecting = function () {
        this.selectingEntities = !this.selectingEntities;
        if (!this.selectingEntities) {
            this.editor.selectedEntities.length = 0;
        }
    };
    EditorBox.prototype.listEntities = function () {
        this.game.send(function (server) { return server.editorAction({ type: 'list' }); });
    };
    EditorBox.prototype.deleteEntities = function () {
        var entities = this.editor.selectedEntities.map(function (e) { return e.id; });
        this.game.send(function (server) { return server.editorAction({ type: 'remove', entities: entities }); });
        this.editor.selectedEntities.length = 0;
    };
    EditorBox.prototype.showEntitiesInfo = function () {
        console.log(this.editor.selectedEntities);
    };
    EditorBox.prototype.toggleShow = function (field) {
        this.game.debug[field] = !this.isShow(field);
        this.game.saveDebug();
    };
    EditorBox.prototype.isShow = function (field) {
        return !!this.game.debug[field];
    };
    EditorBox = __decorate([
        core_1.Component({
            selector: 'editor-box',
            templateUrl: 'editor-box.pug',
        }),
        __metadata("design:paramtypes", [model_1.Model,
            game_1.PonyTownGame,
            storageService_1.StorageService,
            core_1.NgZone])
    ], EditorBox);
    return EditorBox;
}());
exports.EditorBox = EditorBox;
