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
var icons_1 = require("../../../client/icons");
var CheckBox = /** @class */ (function () {
    function CheckBox() {
        this.icon = icons_1.faCheck;
        this.disabled = false;
        this.checked = false;
        this.checkedChange = new core_1.EventEmitter();
    }
    CheckBox.prototype.toggle = function () {
        if (!this.disabled) {
            this.checked = !this.checked;
            this.checkedChange.emit(this.checked);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckBox.prototype, "icon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CheckBox.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckBox.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CheckBox.prototype, "checked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CheckBox.prototype, "checkedChange", void 0);
    CheckBox = __decorate([
        core_1.Component({
            selector: 'check-box',
            templateUrl: 'check-box.pug',
            styleUrls: ['check-box.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        })
    ], CheckBox);
    return CheckBox;
}());
exports.CheckBox = CheckBox;
