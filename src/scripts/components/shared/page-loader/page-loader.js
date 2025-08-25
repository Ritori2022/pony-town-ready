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
var model_1 = require("../../services/model");
var clientUtils_1 = require("../../../client/clientUtils");
var PageLoader = /** @class */ (function () {
    function PageLoader(model) {
        this.model = model;
        this.spinnerIcon = icons_1.faSpinner;
    }
    Object.defineProperty(PageLoader.prototype, "loading", {
        get: function () {
            return this.model.loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageLoader.prototype, "updating", {
        get: function () {
            return this.model.updating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageLoader.prototype, "updatingTakesLongTime", {
        get: function () {
            return this.model.updatingTakesLongTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageLoader.prototype, "loadingError", {
        get: function () {
            return this.model.loadingError;
        },
        enumerable: true,
        configurable: true
    });
    PageLoader.prototype.reload = function () {
        clientUtils_1.hardReload();
    };
    PageLoader = __decorate([
        core_1.Component({
            selector: 'page-loader',
            templateUrl: 'page-loader.pug',
            styleUrls: ['page-loader.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model])
    ], PageLoader);
    return PageLoader;
}());
exports.PageLoader = PageLoader;
