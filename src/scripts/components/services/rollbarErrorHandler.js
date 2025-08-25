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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rollbar = require("rollbar");
var data_1 = require("../../client/data");
var hash_1 = require("../../generated/hash");
var rollbarConfig_1 = require("../../generated/rollbarConfig");
var rollbar_1 = require("../../common/rollbar");
var host = typeof location === 'undefined' ? '' : location.host;
var rollbarConfig = {
    environment: rollbarConfig_1.ROLLBAR_ENV,
    accessToken: rollbarConfig_1.ROLLBAR_TOKEN,
    ignoredMessages: ['disconnected'],
    hostWhiteList: [host],
    captureUncaught: true,
    captureUnhandleRejections: true,
    // checkIgnore,
    enabled: true,
    payload: {
        environment: rollbarConfig_1.ROLLBAR_ENV,
        version: data_1.version,
        client: {
            javascript: {
                source_map_enabled: true,
                guess_uncaught_frames: true,
                code_version: hash_1.HASH,
            },
        },
    },
};
exports.RollbarService = new core_1.InjectionToken('rollbar');
function rollbarFactory() {
    if (DEVELOPMENT) {
        return undefined;
    }
    else {
        var rollbar = Rollbar.init(rollbarConfig);
        rollbar.configure({ checkIgnore: rollbar_1.rollbarCheckIgnore });
        return rollbar;
    }
}
exports.rollbarFactory = rollbarFactory;
var RollbarErrorHandler = /** @class */ (function (_super) {
    __extends(RollbarErrorHandler, _super);
    function RollbarErrorHandler(injector) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        return _this;
    }
    RollbarErrorHandler.prototype.handleError = function (error) {
        _super.prototype.handleError.call(this, error);
        if (!DEVELOPMENT && rollbarConfig.accessToken) {
            var rollbar = this.injector.get(exports.RollbarService);
            var err = error.originalError || error || {};
            if (!rollbar_1.isIgnoredError(err)) {
                rollbar.error(err);
            }
        }
    };
    RollbarErrorHandler = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_1.Injector])
    ], RollbarErrorHandler);
    return RollbarErrorHandler;
}(core_1.ErrorHandler));
exports.RollbarErrorHandler = RollbarErrorHandler;
