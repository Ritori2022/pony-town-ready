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
/* istanbul ignore next */
var StorageService = /** @class */ (function () {
    function StorageService() {
        this.data = undefined;
        try {
            if (typeof localStorage === 'undefined') {
                this.data = new Map();
            }
        }
        catch (_a) {
            this.data = new Map();
        }
    }
    StorageService.prototype.getItem = function (key) {
        if (this.data) {
            return this.data.get(key);
        }
        else {
            try {
                var value = localStorage.getItem(key);
                return value == null ? undefined : value;
            }
            catch (_a) {
                return undefined;
            }
        }
    };
    StorageService.prototype.setItem = function (key, data) {
        try {
            localStorage.setItem(key, data);
            this.data = undefined;
        }
        catch (_a) {
            if (!this.data) {
                this.data = new Map();
            }
            this.data.set(key, data);
        }
    };
    StorageService.prototype.removeItem = function (key) {
        if (this.data) {
            this.data.delete(key);
        }
        else {
            try {
                localStorage.removeItem(key);
            }
            catch (_a) { }
        }
    };
    StorageService.prototype.clear = function () {
        if (this.data) {
            this.data.clear();
        }
        else {
            try {
                localStorage.clear();
            }
            catch (_a) { }
        }
    };
    StorageService.prototype.getJSON = function (key, defaultValue) {
        try {
            return JSON.parse(this.getItem(key) || '');
        }
        catch (_a) {
            return defaultValue;
        }
    };
    StorageService.prototype.setJSON = function (key, value) {
        this.setItem(key, JSON.stringify(value));
    };
    StorageService.prototype.getInt = function (key) {
        return parseInt(this.getItem(key) || '0', 10) | 0;
    };
    StorageService.prototype.setInt = function (key, value) {
        this.setItem(key, value.toString(10));
    };
    StorageService.prototype.getBoolean = function (key) {
        return this.getItem(key) === 'true';
    };
    StorageService.prototype.setBoolean = function (key, value) {
        if (value) {
            this.setItem(key, 'true');
        }
        else {
            this.removeItem(key);
        }
    };
    StorageService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [])
    ], StorageService);
    return StorageService;
}());
exports.StorageService = StorageService;
