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
var router_1 = require("@angular/router");
var model_1 = require("./model");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, model) {
        this.router = router;
        this.model = model;
    }
    AuthGuard.prototype.canActivate = function () {
        var _this = this;
        return this.model.accountPromise
            .then(function (account) {
            if (account) {
                return true;
            }
            else {
                _this.router.navigate(['/']);
                return false;
            }
        });
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [router_1.Router, model_1.Model])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
