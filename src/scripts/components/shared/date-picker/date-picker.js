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
var utils_1 = require("../../../common/utils");
var constants_1 = require("../../../common/constants");
var clientUtils_1 = require("../../../client/clientUtils");
var DatePicker = /** @class */ (function () {
    function DatePicker() {
        this.days = utils_1.times(31, function (i) { return i + 1; });
        this.years = [];
        this.months = getMonthNames();
        this.day = 0;
        this.month = 0;
        this.year = 0;
        this.dateChange = new core_1.EventEmitter();
        var minYear = 1914;
        var maxYear = (new Date()).getFullYear() - 6;
        for (var year = maxYear; year >= minYear; year--) {
            this.years.push(year);
        }
    }
    Object.defineProperty(DatePicker.prototype, "date", {
        get: function () {
            var date = utils_1.createValidBirthDate(this.day, this.month, this.year);
            return date && utils_1.formatISODate(date);
        },
        set: function (value) {
            if (value) {
                var _a = utils_1.parseISODate(value), day = _a.day, month = _a.month, year = _a.year;
                this.day = day;
                this.month = month;
                this.year = year;
            }
        },
        enumerable: true,
        configurable: true
    });
    DatePicker.prototype.change = function () {
        this.dateChange.emit(this.date);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DatePicker.prototype, "dateChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DatePicker.prototype, "date", null);
    DatePicker = __decorate([
        core_1.Component({
            selector: 'date-picker',
            templateUrl: 'date-picker.pug',
        }),
        __metadata("design:paramtypes", [])
    ], DatePicker);
    return DatePicker;
}());
exports.DatePicker = DatePicker;
function getMonthNames() {
    try {
        var format_1 = new Intl.DateTimeFormat(clientUtils_1.getLocale(), { month: 'long' });
        return utils_1.times(12, function (i) {
            var date = new Date(523456789);
            date.setMonth(i);
            return format_1.format(date);
        });
    }
    catch (_a) {
        return constants_1.MONTH_NAMES_EN;
    }
}
