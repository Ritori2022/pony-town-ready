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
var htmlUtils_1 = require("../../../client/htmlUtils");
var LabelledBy = /** @class */ (function () {
    function LabelledBy(element) {
        this.element = element;
    }
    LabelledBy.prototype.ngOnInit = function () {
        var element = this.element.nativeElement;
        var target = htmlUtils_1.findParentElement(element, this.selector);
        var id = element.id = element.id || lodash_1.uniqueId('labelled-by-');
        if (target) {
            target.setAttribute('aria-labelledby', id);
        }
    };
    __decorate([
        core_1.Input('labelledBy'),
        __metadata("design:type", String)
    ], LabelledBy.prototype, "selector", void 0);
    LabelledBy = __decorate([
        core_1.Directive({
            selector: '[labelledBy]',
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], LabelledBy);
    return LabelledBy;
}());
exports.LabelledBy = LabelledBy;
