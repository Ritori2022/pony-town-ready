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
var utils_1 = require("../../../common/utils");
var data_1 = require("../../../client/data");
var model_1 = require("../../services/model");
var constants_1 = require("../../../common/constants");
var icons_1 = require("../../../client/icons");
function getSortTag(pony) {
    var match = pony.desc && /(?:^| )@(top|end|\d+)(?:$| )/.exec(pony.desc);
    return match && match[1];
}
function sortTagToNumber(tag) {
    if (tag === 'top') {
        return -1;
    }
    else if (tag === 'end') {
        return 999999999;
    }
    else {
        return +tag;
    }
}
function fallbackComparePonies(a, b) {
    return a.name.localeCompare(b.name) || (a.desc || '').localeCompare(b.desc || '');
}
function comparePonies(a, b) {
    var aTag = getSortTag(a);
    var bTag = getSortTag(b);
    if (aTag && bTag) {
        return (sortTagToNumber(aTag) - sortTagToNumber(bTag)) || fallbackComparePonies(a, b);
    }
    else if (aTag) {
        return aTag === 'end' ? 1 : -1;
    }
    else if (bTag) {
        return bTag === 'end' ? -1 : 1;
    }
    else {
        return fallbackComparePonies(a, b);
    }
}
var CharacterList = /** @class */ (function () {
    function CharacterList(model, zone) {
        this.model = model;
        this.zone = zone;
        this.hashIcon = icons_1.faHashtag;
        this.inGame = false;
        this.canNew = false;
        this.close = new core_1.EventEmitter();
        this.newCharacter = new core_1.EventEmitter();
        this.selectCharacter = new core_1.EventEmitter();
        this.previewCharacter = new core_1.EventEmitter();
        this.selectedIndex = -1;
        this.ponies = [];
        this.tags = [];
        this.previewPony = undefined;
    }
    Object.defineProperty(CharacterList.prototype, "selectedPony", {
        get: function () {
            return this.model.pony;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterList.prototype, "searchable", {
        get: function () {
            return this.model.ponies.length > constants_1.LATEST_CHARACTER_LIMIT;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterList.prototype, "placeholder", {
        get: function () {
            return "search (" + this.model.ponies.length + " / " + this.model.characterLimit + " ponies)";
        },
        enumerable: true,
        configurable: true
    });
    CharacterList.prototype.ngOnInit = function () {
        var _this = this;
        this.updatePonies();
        this.tags = lodash_1.uniq(utils_1.flatten(this.ponies.map(function (p) { return (p.desc || '').split(/ /g).map(function (x) { return x.trim(); }); }))
            .filter(function (x) { return /^#/.test(x); }))
            .sort();
        if (!data_1.isMobile) {
            setTimeout(function () { return _this.searchInput.nativeElement.focus(); });
        }
    };
    CharacterList.prototype.keydown = function (e) {
        if (e.keyCode === 27 /* ESCAPE */) {
            if (this.search) {
                e.preventDefault();
                e.stopPropagation();
                this.search = '';
                this.updatePonies();
            }
            else {
                this.closed();
            }
        }
        else if (e.keyCode === 13 /* ENTER */) {
            var pony = this.ponies[this.selectedIndex];
            if (pony) {
                this.select(pony);
            }
            else {
                this.closed();
            }
        }
        else if (e.keyCode === 38 /* UP */) {
            this.setSelectedIndex(this.selectedIndex <= 0 ? (this.ponies.length - 1) : (this.selectedIndex - 1));
        }
        else if (e.keyCode === 40 /* DOWN */) {
            this.setSelectedIndex(this.selectedIndex === (this.ponies.length - 1) ? 0 : (this.selectedIndex + 1));
        }
    };
    CharacterList.prototype.setPreview = function (pony) {
        this.previewPony = pony;
        this.previewCharacter.emit(this.model.parsePonyObject(pony));
    };
    CharacterList.prototype.unsetPreview = function (pony) {
        if (this.previewPony && pony && this.previewPony.id === pony.id) {
            this.previewPony = undefined;
            this.previewCharacter.emit(undefined);
        }
    };
    CharacterList.prototype.updatePonies = function () {
        var _this = this;
        this.zone.run(function () {
            var query = _this.search && _this.search.toLowerCase().trim();
            function matchesWords(text, words) {
                for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                    var word = words_1[_i];
                    if (text.indexOf(word) === -1) {
                        return false;
                    }
                }
                return true;
            }
            if (query) {
                var words_2 = query.split(/ /g).map(function (x) { return x.trim(); });
                _this.ponies = _this.model.ponies.filter(function (pony) {
                    var text = (pony.name + " " + (pony.desc || '')).toLowerCase();
                    return matchesWords(text, words_2);
                }).sort(comparePonies);
            }
            else {
                _this.ponies = _this.model.ponies.slice().sort(comparePonies);
            }
            _this.setSelectedIndex(_this.selectedIndex);
            _this.previewCharacter.emit(undefined);
        });
    };
    CharacterList.prototype.select = function (pony) {
        this.selectCharacter.emit(pony);
    };
    CharacterList.prototype.createNew = function () {
        this.newCharacter.emit();
    };
    CharacterList.prototype.closed = function () {
        var _this = this;
        this.zone.run(function () { return _this.close.emit(); });
    };
    CharacterList.prototype.setSelectedIndex = function (index) {
        var _this = this;
        this.zone.run(function () {
            _this.selectedIndex = utils_1.clamp(index, -1, _this.ponies.length - 1);
            var pony = _this.ponies[index];
            _this.ariaAnnounce.nativeElement.textContent = pony ? pony.name : '';
            if (pony) {
                _this.setPreview(pony);
            }
            else if (_this.previewPony) {
                _this.unsetPreview(_this.previewPony);
            }
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "inGame", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "canNew", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "close", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "newCharacter", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "selectCharacter", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterList.prototype, "previewCharacter", void 0);
    __decorate([
        core_1.ViewChild('ariaAnnounce', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], CharacterList.prototype, "ariaAnnounce", void 0);
    __decorate([
        core_1.ViewChild('searchInput', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], CharacterList.prototype, "searchInput", void 0);
    CharacterList = __decorate([
        core_1.Component({
            selector: 'character-list',
            templateUrl: 'character-list.pug',
            styleUrls: ['character-list.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model, core_1.NgZone])
    ], CharacterList);
    return CharacterList;
}());
exports.CharacterList = CharacterList;
