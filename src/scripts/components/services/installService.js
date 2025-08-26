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
var storageService_1 = require("./storageService");
var InstallService = /** @class */ (function () {
    function InstallService(storage) {
        var _this = this;
        this.storage = storage;
        if (!this.storage.getBoolean('install-dismissed')) {
            window.addEventListener('beforeinstallprompt', function (event) {
                event.preventDefault();
                _this.installEvent = event;
            });
        }
    }
    Object.defineProperty(InstallService.prototype, "canInstall", {
        get: function () {
            return !!this.installEvent || (DEVELOPMENT && localStorage.getItem('install'));
        },
        enumerable: true,
        configurable: true
    });
    InstallService.prototype.install = function () {
        var _this = this;
        if (!this.installEvent) {
            return Promise.reject(new Error('Cannot install'));
        }
        this.installEvent.prompt();
        return this.installEvent.userChoice
            .finally(function () {
            _this.installEvent = undefined;
        });
    };
    InstallService.prototype.dismiss = function () {
        this.installEvent = undefined;
        this.storage.setBoolean('install-dismissed', true);
    };
    InstallService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [storageService_1.StorageService])
    ], InstallService);
    return InstallService;
}());
exports.InstallService = InstallService;
