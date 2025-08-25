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
var clientUtils_1 = require("../../../client/clientUtils");
var model_1 = require("../../services/model");
var HasFeature = /** @class */ (function () {
    function HasFeature(templateRef, viewContainer, model) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.model = model;
        this.subscriptions = [];
        this.showing = false;
        this._flag = undefined;
        this._orMod = false;
        this._alsoIf = true;
    }
    HasFeature.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.subscriptions.push(clientUtils_1.featureFlagsChanged.subscribe(function () { return _this.update(); }));
        this.subscriptions.push(this.model.accountChanged.subscribe(function () { return _this.update(); }));
    };
    HasFeature.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    Object.defineProperty(HasFeature.prototype, "hasFeature", {
        set: function (value) {
            if (this._flag !== value) {
                this._flag = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HasFeature.prototype, "hasFeatureOrMod", {
        set: function (value) {
            if (this._orMod !== value) {
                this._orMod = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HasFeature.prototype, "hasFeatureAlso", {
        set: function (value) {
            if (this._alsoIf !== value) {
                this._alsoIf = value;
                this.update();
            }
        },
        enumerable: true,
        configurable: true
    });
    HasFeature.prototype.update = function () {
        var show = this._alsoIf && (clientUtils_1.hasFeatureFlag(this._flag) || (this._orMod && this.model.isMod));
        if (this.showing !== show) {
            this.showing = show;
            if (show) {
                this.ref = this.ref || this.viewContainer.createEmbeddedView(this.templateRef);
            }
            else {
                this.viewContainer.clear();
                this.ref = undefined;
            }
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HasFeature.prototype, "hasFeature", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], HasFeature.prototype, "hasFeatureOrMod", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], HasFeature.prototype, "hasFeatureAlso", null);
    HasFeature = __decorate([
        core_1.Directive({
            selector: '[hasFeature]',
        }),
        __metadata("design:paramtypes", [core_1.TemplateRef, core_1.ViewContainerRef, model_1.Model])
    ], HasFeature);
    return HasFeature;
}());
exports.HasFeature = HasFeature;
