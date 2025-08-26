"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rollbar = require("rollbar");
var rollbar_1 = require("../../common/rollbar");
var rollbarErrorHandler_1 = require("./rollbarErrorHandler");
var errorReporter_1 = require("./errorReporter");
var RollbarErrorReporter = /** @class */ (function (_super) {
    __extends(RollbarErrorReporter, _super);
    function RollbarErrorReporter(rollbar) {
        var _this = _super.call(this) || this;
        _this.rollbar = rollbar;
        return _this;
    }
    RollbarErrorReporter.prototype.configureUser = function (person) {
        if (this.rollbar) {
            this.rollbar.configure({ payload: { person: person }, checkIgnore: rollbar_1.rollbarCheckIgnore });
        }
    };
    RollbarErrorReporter.prototype.configureData = function (data) {
        if (this.rollbar) {
            this.rollbar.configure({ payload: data, checkIgnore: rollbar_1.rollbarCheckIgnore });
        }
    };
    RollbarErrorReporter.prototype.captureEvent = function (data) {
        if (this.rollbar) {
            this.rollbar.captureEvent(data, 'info');
        }
    };
    RollbarErrorReporter.prototype.reportError = function (error, data) {
        DEVELOPMENT && console.error(error, data);
        if (this.rollbar && !rollbar_1.isIgnoredError(error)) {
            this.rollbar.error(error, data);
        }
    };
    RollbarErrorReporter.prototype.disable = function () {
        if (this.rollbar) {
            this.rollbar.configure({ enabled: false });
        }
    };
    RollbarErrorReporter = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(rollbarErrorHandler_1.RollbarService)),
        __metadata("design:paramtypes", [Rollbar])
    ], RollbarErrorReporter);
    return RollbarErrorReporter;
}(errorReporter_1.ErrorReporter));
exports.RollbarErrorReporter = RollbarErrorReporter;
