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
var FrameService = /** @class */ (function () {
    function FrameService(zone) {
        this.zone = zone;
    }
    FrameService.prototype.create = function (frame) {
        var zone = this.zone;
        var ref = 0;
        var last = 0;
        function tick(now) {
            ref = requestAnimationFrame(tick);
            frame((now - last) / 1000);
            last = now;
        }
        return {
            init: function () {
                if (!ref) {
                    last = performance.now();
                    zone.runOutsideAngular(function () { return ref = requestAnimationFrame(tick); });
                }
            },
            destroy: function () {
                cancelAnimationFrame(ref);
                ref = 0;
            }
        };
    };
    FrameService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], FrameService);
    return FrameService;
}());
exports.FrameService = FrameService;
