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
var ponyUtils_1 = require("../../../client/ponyUtils");
var ponyHelpers_1 = require("../../../client/ponyHelpers");
var constants_1 = require("../../../common/constants");
var ponyAnimations_1 = require("../../../client/ponyAnimations");
var frameService_1 = require("../../services/frameService");
var character_preview_1 = require("../character-preview/character-preview");
var compressPony_1 = require("../../../common/compressPony");
var BLEP = __assign({}, ponyUtils_1.defaultExpression, { muzzle: 4 /* Blep */ });
var EXCITED = __assign({}, ponyUtils_1.defaultExpression, { muzzle: 5 /* SmileOpen */ });
var DERP = __assign({}, ponyUtils_1.defaultExpression, { muzzle: 5 /* SmileOpen */, leftIris: 1 /* Up */ });
var SupporterPony = /** @class */ (function () {
    function SupporterPony(frameService) {
        var _this = this;
        this.scale = 3;
        this.pony = compressPony_1.decompressPonyString(constants_1.SUPPORTER_PONY);
        this.state = ponyHelpers_1.defaultPonyState();
        this.headTime = 0;
        this.loop = frameService.create(function (delta) { return _this.tick(delta); });
    }
    SupporterPony.prototype.ngOnInit = function () {
        this.loop.init();
    };
    SupporterPony.prototype.ngOnDestroy = function () {
        this.loop.destroy();
    };
    SupporterPony.prototype.excite = function () {
        this.headTime = 0;
        this.headAnimation = ponyAnimations_1.excite;
        this.expression = Math.random() < 0.2 ? DERP : EXCITED;
    };
    SupporterPony.prototype.reset = function () {
        this.expression = undefined;
    };
    SupporterPony.prototype.tick = function (delta) {
        this.headTime += delta;
        if (this.headAnimation) {
            var frame = Math.floor(this.headTime * this.headAnimation.fps);
            if (frame >= this.headAnimation.frames.length && !this.headAnimation.loop) {
                this.headAnimation = undefined;
                this.state.headAnimation = undefined;
                this.state.headAnimationFrame = 0;
                this.characterPreview.blink();
            }
            else {
                this.state.headAnimation = this.headAnimation;
                this.state.headAnimationFrame = frame % this.headAnimation.frames.length;
            }
        }
        else {
            this.state.headAnimation = undefined;
            if (this.expression) {
                if (Math.random() < 0.01) {
                    this.expression = undefined;
                }
            }
            else {
                if (Math.random() < 0.005) {
                    this.expression = BLEP;
                }
            }
        }
        this.state.expression = this.expression;
    };
    __decorate([
        core_1.ViewChild('characterPreview', { static: true }),
        __metadata("design:type", character_preview_1.CharacterPreview)
    ], SupporterPony.prototype, "characterPreview", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SupporterPony.prototype, "scale", void 0);
    SupporterPony = __decorate([
        core_1.Component({
            selector: 'supporter-pony',
            templateUrl: 'supporter-pony.pug',
        }),
        __metadata("design:paramtypes", [frameService_1.FrameService])
    ], SupporterPony);
    return SupporterPony;
}());
exports.SupporterPony = SupporterPony;
