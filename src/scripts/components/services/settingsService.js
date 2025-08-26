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
var model_1 = require("./model");
var SettingsService = /** @class */ (function () {
    function SettingsService(storage, model) {
        this.storage = storage;
        this.model = model;
        this.save = function () { return false; };
        this.browser = this.storage.getJSON('browser-settings', {});
    }
    Object.defineProperty(SettingsService.prototype, "account", {
        get: function () {
            return this.model.account ? this.model.account.settings : {};
        },
        set: function (value) {
            if (this.model.account) {
                this.model.account.settings = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    SettingsService.prototype.saving = function (save) {
        this.save = save;
    };
    SettingsService.prototype.saveAccountSettings = function (settings) {
        if (this.model.account) {
            this.model.account.settings = settings;
        }
        if (settings.filterWords) {
            settings.filterWords = settings.filterWords.trim();
        }
        if (this.save(settings)) {
            return Promise.resolve();
        }
        else {
            return this.model.saveSettings(settings);
        }
    };
    SettingsService.prototype.saveBrowserSettings = function (settings) {
        this.browser = settings || this.browser;
        this.storage.setJSON('browser-settings', this.browser);
    };
    SettingsService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [storageService_1.StorageService, model_1.Model])
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
