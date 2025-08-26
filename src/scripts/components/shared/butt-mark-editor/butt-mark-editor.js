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
var constants_1 = require("../../../common/constants");
var icons_1 = require("../../../client/icons");
var ButtMarkEditor = /** @class */ (function () {
    function ButtMarkEditor() {
        this.trashIcon = icons_1.faTrash;
        this.eraserIcon = icons_1.faEraser;
        this.eyeDropperIcon = icons_1.faEyeDropper;
        this.paintBrushIcon = icons_1.faPaintBrush;
        this.cmSize = constants_1.CM_SIZE;
        this.state = {
            brushType: 'brush',
            brush: 'orange',
        };
    }
    ButtMarkEditor.prototype.clearCM = function () {
        lodash_1.fill(this.info.cm, '');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ButtMarkEditor.prototype, "info", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ButtMarkEditor.prototype, "state", void 0);
    ButtMarkEditor = __decorate([
        core_1.Component({
            selector: 'butt-mark-editor',
            templateUrl: 'butt-mark-editor.pug',
        })
    ], ButtMarkEditor);
    return ButtMarkEditor;
}());
exports.ButtMarkEditor = ButtMarkEditor;
