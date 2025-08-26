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
var emoji_1 = require("../../../client/emoji");
var spriteUtils_1 = require("../../../client/spriteUtils");
var fonts_1 = require("../../../client/fonts");
var spriteFont_1 = require("../../../graphics/spriteFont");
var EmoteBox = /** @class */ (function () {
    function EmoteBox(zone) {
        this.zone = zone;
        this.emoteValue = '';
        this.scaleValue = 2;
        this.initialized = false;
    }
    EmoteBox.prototype.ngAfterViewInit = function () {
        var _this = this;
        spriteUtils_1.loadAndInitSpriteSheets()
            .then(function () {
            _this.initialized = true;
            _this.zone.runOutsideAngular(function () { return _this.redraw(); });
        });
    };
    Object.defineProperty(EmoteBox.prototype, "emote", {
        get: function () {
            return this.emoteValue;
        },
        set: function (value) {
            var _this = this;
            if (this.emoteValue !== value) {
                this.emoteValue = value;
                this.zone.runOutsideAngular(function () { return _this.redraw(); });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmoteBox.prototype, "scale", {
        get: function () {
            return this.scaleValue;
        },
        set: function (value) {
            var _this = this;
            if (this.scaleValue !== value) {
                this.scaleValue = value;
                this.zone.runOutsideAngular(function () { return _this.redraw(); });
            }
        },
        enumerable: true,
        configurable: true
    });
    EmoteBox.prototype.redraw = function () {
        if (this.initialized) {
            var emote_1 = emoji_1.findEmoji(this.emote);
            var sprite = fonts_1.font && emote_1 && spriteFont_1.getCharacterSprite(emote_1.symbol, fonts_1.font);
            var image_1 = this.image.nativeElement;
            if (sprite) {
                var width = sprite.w + sprite.ox;
                var height = 10; // sprite.h + sprite.oy;
                image_1.style.width = width * this.scale + "px";
                image_1.style.height = height * this.scale + "px";
                image_1.style.marginTop = -this.scale + "px";
                image_1.style.display = 'inline-block';
                image_1.style.visibility = 'hidden';
                if (emote_1) {
                    image_1.setAttribute('aria-label', emote_1.names[0]);
                }
                emoji_1.getEmojiImageAsync(sprite, function (src) {
                    image_1.src = src;
                    image_1.alt = emote_1 ? emote_1.symbol : '';
                    image_1.style.visibility = 'visible';
                });
            }
            else {
                image_1.style.width = "0px";
                image_1.style.height = "0px";
                image_1.src = '';
                image_1.alt = '';
            }
        }
    };
    __decorate([
        core_1.ViewChild('image', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], EmoteBox.prototype, "image", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], EmoteBox.prototype, "emote", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], EmoteBox.prototype, "scale", null);
    EmoteBox = __decorate([
        core_1.Component({
            selector: 'emote-box',
            template: '<img #image class="emote-box pixelart" />',
            styles: ['.emote-box { pointer-events: none; }'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], EmoteBox);
    return EmoteBox;
}());
exports.EmoteBox = EmoteBox;
