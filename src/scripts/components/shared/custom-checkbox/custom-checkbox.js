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
var CustomCheckbox = /** @class */ (function () {
    function CustomCheckbox() {
        this.disabled = false;
        this.help = '';
        this.checked = false;
        this.checkedChange = new core_1.EventEmitter();
        this.helpId = lodash_1.uniqueId('custom-checkbox-help-');
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CustomCheckbox.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CustomCheckbox.prototype, "help", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CustomCheckbox.prototype, "checked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CustomCheckbox.prototype, "checkedChange", void 0);
    CustomCheckbox = __decorate([
        core_1.Component({
            selector: 'custom-checkbox',
            templateUrl: 'custom-checkbox.pug',
            styleUrls: ['custom-checkbox.scss'],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        })
    ], CustomCheckbox);
    return CustomCheckbox;
}());
exports.CustomCheckbox = CustomCheckbox;
