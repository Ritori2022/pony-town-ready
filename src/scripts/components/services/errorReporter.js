"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ErrorReporter = /** @class */ (function () {
    function ErrorReporter() {
    }
    ErrorReporter.prototype.disable = function () {
    };
    ErrorReporter.prototype.configureUser = function (_person) {
    };
    ErrorReporter.prototype.configureData = function (_data) {
    };
    ErrorReporter.prototype.captureEvent = function (_data) {
    };
    ErrorReporter.prototype.reportError = function (error, data) {
        console.error(error, data);
    };
    ErrorReporter.prototype.createClientErrorHandler = function (socketOptions) {
        var _this = this;
        var handleRecvError = function (error, data) {
            if (error.message) {
                var method = void 0;
                if (data instanceof Uint8Array) {
                    var bytes = [];
                    var length_1 = Math.min(data.length, 200);
                    for (var i = 0; i < length_1; i++) {
                        bytes.push(data[i]);
                    }
                    var trail = length_1 < data.length ? '...' : '';
                    if (data.length > 0) {
                        var item = socketOptions.client[data[0]];
                        method = typeof item === 'string' ? item : item[0];
                    }
                    data = "<" + bytes.toString() + trail + ">";
                }
                _this.reportError(error, { data: data, method: method });
            }
        };
        return { handleRecvError: handleRecvError };
    };
    ErrorReporter = __decorate([
        core_1.Injectable()
    ], ErrorReporter);
    return ErrorReporter;
}());
exports.ErrorReporter = ErrorReporter;
