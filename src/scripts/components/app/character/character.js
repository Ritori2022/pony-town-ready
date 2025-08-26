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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lodash_1 = require("lodash");
var constants_1 = require("../../../common/constants");
var utils_1 = require("../../../common/utils");
var ponyUtils_1 = require("../../../client/ponyUtils");
var ponyHelpers_1 = require("../../../client/ponyHelpers");
var ponyInfo_1 = require("../../../common/ponyInfo");
var sprites = require("../../../generated/sprites");
var ponyAnimations_1 = require("../../../client/ponyAnimations");
var contextSpriteBatch_1 = require("../../../graphics/contextSpriteBatch");
var model_1 = require("../../services/model");
var spriteUtils_1 = require("../../../client/spriteUtils");
var gameService_1 = require("../../services/gameService");
var colors_1 = require("../../../common/colors");
var compressPony_1 = require("../../../common/compressPony");
var canvasUtils_1 = require("../../../client/canvasUtils");
var ponyDraw_1 = require("../../../client/ponyDraw");
var sign_in_box_1 = require("../../shared/sign-in-box/sign-in-box");
var icons_1 = require("../../../client/icons");
var clientUtils_1 = require("../../../client/clientUtils");
var tags_1 = require("../../../common/tags");
var color_1 = require("../../../common/color");
var frontHoofTitles = ['', 'Fetlocks', 'Paws', 'Claws', ''];
var backHoofTitles = ['', 'Fetlocks', 'Paws', '', ''];
var horns = spriteUtils_1.addLabels(sprites.horns, [
    'None', 'Unicorn horn', 'Short unicorn horn', 'Curved unicorn horn', 'Tiny deer antlers',
    'Short deer antlers', 'Medium deer antlers', 'Large deer antlers', 'Raindeer antlers', 'Goat horns',
    'Ram horns', 'Buffalo horns', 'Moose horns', 'Bug antenna', 'Long unicorn horn',
]);
var wings = spriteUtils_1.addLabels(sprites.wings[0], [
    'None', 'Pegasus wings', 'Bat wings', 'Gryphon wings', 'Bug wings'
]);
var ears = spriteUtils_1.addLabels(sprites.ears, [
    'Regular ears', 'Fluffy ears', 'Long feathered ears', 'Bug ears', 'Short feathered ears', 'Deer ears',
]);
var noses = spriteUtils_1.addTitles(sprites.noses[0], ['Pony muzzle', 'Gryphon beak', 'Deer nose']);
var flyAnimations = [__assign({}, ponyAnimations_1.stand, { name: 'fly' }), ponyAnimations_1.fly, ponyAnimations_1.fly, ponyAnimations_1.fly, __assign({}, ponyAnimations_1.flyBug, { name: 'fly' })];
function eyeSprite(e) {
    return spriteUtils_1.createEyeSprite(e, 0, sprites.defaultPalette);
}
var Character = /** @class */ (function () {
    function Character(gameService, model) {
        var _this = this;
        this.gameService = gameService;
        this.model = model;
        this.debug = DEVELOPMENT || BETA;
        this.playIcon = icons_1.faPlay;
        this.lockIcon = icons_1.faLock;
        this.saveIcon = icons_1.faSave;
        this.codeIcon = icons_1.faCode;
        this.infoIcon = icons_1.faInfoCircle;
        this.maxNameLength = constants_1.PLAYER_NAME_MAX_LENGTH;
        this.maxDescLength = constants_1.PLAYER_DESC_MAX_LENGTH;
        this.horns = horns;
        this.manes = ponyUtils_1.mergedManes;
        this.backManes = ponyUtils_1.mergedBackManes;
        this.tails = sprites.tails[0];
        this.wings = wings;
        this.ears = ears;
        this.facialHair = ponyUtils_1.mergedFacialHair;
        this.headAccessories = ponyUtils_1.mergedHeadAccessories;
        this.earAccessories = ponyUtils_1.mergedEarAccessories;
        this.faceAccessories = ponyUtils_1.mergedFaceAccessories;
        this.neckAccessories = sprites.neckAccessories[1];
        this.frontLegAccessories = sprites.frontLegAccessories[1];
        this.backLegAccessories = sprites.backLegAccessories[1];
        this.backAccessories = ponyUtils_1.mergedBackAccessories;
        this.chestAccessories = ponyUtils_1.mergedChestAccessories;
        this.sleeveAccessories = sprites.frontLegSleeves[1];
        this.waistAccessories = sprites.waistAccessories[1];
        this.extraAccessories = ponyUtils_1.mergedExtraAccessories;
        this.frontHooves = spriteUtils_1.addTitles(ponyUtils_1.frontHooves[1], frontHoofTitles);
        this.backHooves = spriteUtils_1.addTitles(sprites.backLegHooves[1], backHoofTitles);
        this.animations = [
            function () { return ponyAnimations_1.stand; },
            function () { return ponyAnimations_1.trot; },
            function () { return ponyAnimations_1.boop; },
            function () { return ponyAnimations_1.sitDownUp; },
            function () { return ponyAnimations_1.lieDownUp; },
            function () { return flyAnimations[_this.previewInfo.wings.type || 0]; },
        ];
        this.eyelashes = sprites.eyeLeft[1].map(eyeSprite);
        this.eyesLeft = sprites.eyeLeft.map(function (e) { return e && e[0]; }).map(eyeSprite);
        this.eyesRight = sprites.eyeRight.map(function (e) { return e && e[0]; }).map(eyeSprite);
        this.noses = noses;
        this.heads = sprites.head1[1];
        this.buttMarkState = {
            brushType: 'brush',
            brush: 'orange',
        };
        this.tags = [
            tags_1.emptyTag,
        ];
        this.state = ponyHelpers_1.defaultPonyState();
        this.saved = [];
        this.activeAnimation = 0;
        this.loaded = false;
        this.playAnimation = true;
        this.deleting = false;
        this.fixed = false;
        this.previewExtra = false;
        this.previewPony = undefined;
        this.sites = [];
        this.canSaveFiles = clientUtils_1.isFileSaverSupported();
        this.savingLocked = false;
        this.animationTime = 0;
        this.createMuzzles();
        this.updateMuzzles();
    }
    Character.prototype.getMuzzleType = function () {
        return lodash_1.clamp(utils_1.toInt(this.info && this.info.nose && this.info.nose.type), 0, sprites.noses[0].length);
    };
    Character.prototype.createMuzzles = function () {
        var type = this.getMuzzleType();
        var happy = sprites.noses[0][type][0];
        this.muzzles = sprites.noses
            .slice()
            .map(function (n) { return n[type][0]; })
            .map(function (_a) {
            var color = _a.color, colors = _a.colors, mouth = _a.mouth;
            return ({ color: color, colors: colors, extra: mouth, palettes: [sprites.defaultPalette] });
        });
        this.fangs = [undefined, { color: happy.color, colors: 3, extra: happy.fangs, palettes: [sprites.defaultPalette] }];
    };
    Character.prototype.updateMuzzles = function () {
        var type = this.getMuzzleType();
        var happy = sprites.noses[0][type][0];
        this.muzzles.forEach(function (m, i) {
            if (m) {
                var _a = sprites.noses[i][type][0], color = _a.color, colors = _a.colors, mouth = _a.mouth;
                m.color = color;
                m.colors = colors;
                m.extra = mouth;
                m.timestamp = Date.now();
            }
        });
        var fangs = this.fangs[1];
        fangs.color = happy.color;
        fangs.extra = happy.fangs;
        fangs.timestamp = Date.now();
    };
    Object.defineProperty(Character.prototype, "account", {
        get: function () {
            return this.model.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "loading", {
        get: function () {
            return this.model.loading || this.model.updating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "updateWarning", {
        get: function () {
            return this.gameService.updateWarning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "playing", {
        get: function () {
            return this.gameService.playing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "previewInfo", {
        get: function () {
            return this.previewPony ? this.previewPony.ponyInfo : this.pony.ponyInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "previewName", {
        get: function () {
            return this.previewPony ? this.previewPony.name : this.pony.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "previewTag", {
        get: function () {
            return model_1.getPonyTag(this.previewPony || this.pony, this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "customOutlines", {
        get: function () {
            return this.info.customOutlines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "ponies", {
        get: function () {
            return this.model.ponies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "pony", {
        get: function () {
            return this.model.pony;
        },
        set: function (value) {
            this.model.selectPony(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "info", {
        get: function () {
            return this.pony.ponyInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "maneFill", {
        get: function () {
            return ponyInfo_1.getBaseFill(this.info.mane);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "coatFill", {
        get: function () {
            return this.info.coatFill;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "hoovesFill", {
        get: function () {
            return ponyInfo_1.getBaseFill(this.info.frontHooves);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "canExport", {
        get: function () {
            return DEVELOPMENT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "site", {
        get: function () {
            return utils_1.findById(this.sites, this.pony.site) || this.sites[0];
        },
        set: function (value) {
            this.pony.site = value.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "tag", {
        get: function () {
            return utils_1.findById(this.tags, this.pony.tag) || this.tags[0];
        },
        set: function (value) {
            this.pony.tag = value.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "lockEyeWhites", {
        get: function () {
            return !this.info.unlockEyeWhites;
        },
        set: function (value) {
            this.info.unlockEyeWhites = !value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "darken", {
        get: function () {
            return !this.info.freeOutlines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "lockFrontLegAccessory", {
        get: function () {
            return !this.info.unlockFrontLegAccessory;
        },
        set: function (value) {
            this.info.unlockFrontLegAccessory = !value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "lockBackLegAccessory", {
        get: function () {
            return !this.info.unlockBackLegAccessory;
        },
        set: function (value) {
            this.info.unlockBackLegAccessory = !value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Character.prototype, "lockEyelashColor", {
        get: function () {
            return !this.info.unlockEyelashColor;
        },
        set: function (value) {
            this.info.unlockEyelashColor = !value;
        },
        enumerable: true,
        configurable: true
    });
    Character.prototype.icon = function (id) {
        return sign_in_box_1.getProviderIcon(id);
    };
    Character.prototype.hasSleeves = function (type) {
        return ponyUtils_1.SLEEVED_ACCESSORIES.indexOf(type) !== -1;
    };
    Character.prototype.ngOnInit = function () {
        var _a;
        var _this = this;
        if (this.model.account) {
            (_a = this.tags).push.apply(_a, tags_1.getAvailableTags(this.model.account));
        }
        this.sites = this.model.sites.filter(function (s) { return !!s.name; });
        this.updateMuzzles();
        var last = Date.now();
        return spriteUtils_1.loadAndInitSpriteSheets().then(function () {
            _this.loaded = true;
            _this.interval = setInterval(function () {
                var now = Date.now();
                _this.update((now - last) / 1000);
                last = now;
            }, 1000 / 24);
        });
    };
    Character.prototype.ngOnDestroy = function () {
        clearInterval(this.interval);
    };
    Character.prototype.changed = function () {
        var _this = this;
        if (!this.syncTimeout) {
            this.syncTimeout = requestAnimationFrame(function () {
                _this.syncTimeout = undefined;
                ponyInfo_1.syncLockedPonyInfo(_this.info);
            });
        }
        if (DEVELOPMENT || BETA) {
            this.state.blushColor = colors_1.blushColor(color_1.parseColorWithAlpha(this.coatFill || '', 1));
        }
    };
    Character.prototype.update = function (delta) {
        this.animationTime += delta;
        var animation = this.animations[this.activeAnimation]();
        this.state.animation = animation;
        if (this.playAnimation) {
            this.state.animationFrame = Math.floor(this.animationTime * animation.fps) % animation.frames.length;
        }
    };
    Character.prototype.copyCoatColorToTail = function () {
        if (this.info.tail && this.info.tail.fills) {
            this.info.tail.fills[0] = this.info.coatFill;
            this.changed();
        }
    };
    Character.prototype.eyeColorLockChanged = function (locked) {
        if (locked) {
            this.info.eyeColorLeft = this.info.eyeColorRight;
        }
    };
    Character.prototype.eyeWhiteLockChanged = function (locked) {
        if (locked) {
            this.info.eyeWhitesLeft = this.info.eyeWhites;
        }
    };
    Character.prototype.eyeOpennessChanged = function (locked) {
        if (locked) {
            this.info.eyeOpennessLeft = this.info.eyeOpennessRight;
        }
    };
    Character.prototype.eyelashLockChanged = function (locked) {
        if (locked) {
            this.info.eyelashColorLeft = this.info.eyelashColor;
        }
    };
    Character.prototype.select = function (pony) {
        if (pony) {
            this.deleting = false;
            this.pony = pony;
        }
    };
    Character.prototype.setActiveAnimation = function (index) {
        this.activeAnimation = index;
        this.animationTime = 0;
    };
    Character.prototype.freeOutlinesChanged = function (_free) {
        this.changed();
    };
    Character.prototype.darkenLockedOutlinesChanged = function (_darken) {
        this.changed();
    };
    Object.defineProperty(Character.prototype, "canSave", {
        get: function () {
            return !this.model.pending && !!this.pony && !!this.pony.name && !this.savingLocked;
        },
        enumerable: true,
        configurable: true
    });
    Character.prototype.save = function () {
        var _this = this;
        if (this.canSave) {
            this.error = undefined;
            this.deleting = false;
            this.savingLocked = true;
            this.model.savePony(this.pony)
                .catch(function (e) { return _this.error = e.message; })
                .then(function () { return utils_1.delay(2000); })
                .then(function () { return _this.savingLocked = false; });
        }
    };
    Object.defineProperty(Character.prototype, "canRevert", {
        get: function () {
            return !!utils_1.findById(this.ponies, this.pony.id);
        },
        enumerable: true,
        configurable: true
    });
    Character.prototype.revert = function () {
        if (this.canRevert) {
            this.select(utils_1.findById(this.ponies, this.pony.id));
        }
    };
    Object.defineProperty(Character.prototype, "canDuplicate", {
        get: function () {
            return this.ponies.length < this.model.characterLimit;
        },
        enumerable: true,
        configurable: true
    });
    Character.prototype.duplicate = function () {
        if (this.canDuplicate) {
            this.deleting = false;
            this.pony = utils_1.cloneDeep(this.pony);
            this.pony.name = '';
            this.pony.id = '';
        }
    };
    Character.prototype.export = function (index) {
        var frameWidth = 80;
        var frameHeight = 90;
        var animations = index === undefined ? this.animations.map(function (a) { return a(); }) : [this.animations[index]()];
        var frames = animations.reduce(function (sum, a) { return sum + a.frames.length; }, 0);
        var info = ponyInfo_1.toPalette(this.info);
        var options = ponyHelpers_1.defaultDrawPonyOptions();
        var canvas = contextSpriteBatch_1.drawCanvas(frameWidth * frames, frameHeight, sprites.paletteSpriteSheet, colors_1.TRANSPARENT, function (batch) {
            var i = 0;
            animations.forEach(function (a) {
                for (var f = 0; f < a.frames.length; f++, i++) {
                    var state = __assign({}, ponyHelpers_1.defaultPonyState(), { animation: a, animationFrame: f, blinkFrame: 1 });
                    ponyDraw_1.drawPony(batch, info, state, i * frameWidth + frameWidth / 2, frameHeight - 10, options);
                }
            });
        });
        var name = animations.length === 1 ? animations[0].name : 'all';
        canvasUtils_1.saveCanvas(canvas, this.pony.name + "-" + name + ".png");
    };
    Character.prototype.import = function () {
        if (DEVELOPMENT) {
            var data = prompt('enter data');
            if (data) {
                this.importPony(data);
            }
        }
    };
    Character.prototype.importPony = function (data) {
        if (DEVELOPMENT) {
            this.pony.ponyInfo = compressPony_1.decompressPonyString(data, true);
            var t = compressPony_1.decompressPonyString(data, false);
            console.log(JSON.stringify(t, undefined, 2));
        }
    };
    Character.prototype.addBlush = function () {
        if (DEVELOPMENT || BETA) {
            this.state = __assign({}, this.state, { expression: clientUtils_1.createExpression(1 /* Neutral */, 1 /* Neutral */, 0 /* Smile */, 0 /* Forward */, 0 /* Forward */, 1 /* Blush */) });
            this.changed();
        }
    };
    Character.prototype.testSize = function () {
        function stringifyValues(values) {
            return values.map(function (x) { return JSON.stringify(x); }).join(typeof values[0] === 'object' ? ',\n\t' : ', ');
        }
        if (DEVELOPMENT) {
            var compressed = compressPony_1.compressPonyString(this.info);
            var regularSize = JSON.stringify(this.info).length;
            var ponyInfoNumber = compressPony_1.decompressPony(compressed);
            var precomp_1 = compressPony_1.precompressPony(ponyInfoNumber, colors_1.BLACK, function (x) { return x; });
            var details = Object.keys(precomp_1)
                .filter(function (key) { return key !== 'version'; })
                .map(function (key) { return ({ key: key, values: precomp_1[key] || [] }); })
                .map(function (_a) {
                var key = _a.key, values = _a.values;
                return key + ": [\n\t" + stringifyValues(values) + "\n]";
            })
                .join(',\n');
            var serialized = compressPony_1.compressPonyString(this.info);
            console.log(serialized);
            console.log(details);
            console.log(serialized.length + " / " + regularSize);
        }
    };
    Character.prototype.testJSON = function () {
        if (DEVELOPMENT) {
            console.log(JSON.stringify(this.info, undefined, 2));
        }
    };
    Character.prototype.exportPony = function () {
        var data = ponyToExport(this.pony) + '\r\n';
        saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), this.pony.name + ".txt");
    };
    Character.prototype.exportPonies = function () {
        var data = this.ponies.map(ponyToExport).join('\r\n') + '\r\n';
        saveAs(new Blob([data], { type: 'text/plain;charset=utf-8' }), 'ponies.txt');
    };
    Character.prototype.importPonies = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var text, lines, imported, _i, lines_1, line, _a, name_1, info, _b, desc, pony, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!file) return [3 /*break*/, 9];
                        return [4 /*yield*/, clientUtils_1.readFileAsText(file)];
                    case 1:
                        text = _c.sent();
                        lines = text.split(/\r?\n/g);
                        imported = 0;
                        _i = 0, lines_1 = lines;
                        _c.label = 2;
                    case 2:
                        if (!(_i < lines_1.length)) return [3 /*break*/, 8];
                        line = lines_1[_i];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 6, , 7]);
                        _a = line.split(/\t/g), name_1 = _a[0], info = _a[1], _b = _a[2], desc = _b === void 0 ? '' : _b;
                        if (!(name_1 && info)) return [3 /*break*/, 5];
                        pony = {
                            name: name_1,
                            id: '',
                            info: info,
                            desc: desc,
                            ponyInfo: compressPony_1.decompressPonyString(info, true),
                        };
                        return [4 /*yield*/, this.model.savePony(pony, true)];
                    case 4:
                        _c.sent();
                        imported++;
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _c.sent();
                        DEVELOPMENT && console.error(e_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8:
                        alert("Imported " + imported + " ponies");
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Character = __decorate([
        core_1.Component({
            selector: 'character',
            templateUrl: 'character.pug',
            styleUrls: ['character.scss'],
        }),
        __metadata("design:paramtypes", [gameService_1.GameService, model_1.Model])
    ], Character);
    return Character;
}());
exports.Character = Character;
function ponyToExport(pony) {
    return (pony.name + "\t" + pony.info + "\t" + (pony.desc || '')).trim();
}
