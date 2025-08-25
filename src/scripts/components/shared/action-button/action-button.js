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
var game_1 = require("../../../client/game");
var buttonActions_1 = require("../../../client/buttonActions");
var utils_1 = require("../../../common/utils");
var ActionButton = /** @class */ (function () {
    function ActionButton(game) {
        this.game = game;
        this.editable = false;
        this.active = false;
        this.shadow = true;
        this.shortcut = '';
        this.use = new core_1.EventEmitter();
        this.dirty = true;
        this.state = {};
    }
    ActionButton.prototype.ngOnInit = function () {
        game_1.actionButtons.push(this);
    };
    ActionButton.prototype.ngOnDestroy = function () {
        utils_1.removeItem(game_1.actionButtons, this);
    };
    ActionButton.prototype.ngOnChanges = function () {
        this.dirty = true;
    };
    ActionButton.prototype.click = function () {
        if (this.action) {
            this.use.emit(this.action);
        }
    };
    ActionButton.prototype.draw = function () {
        buttonActions_1.drawAction(this.canvas.nativeElement, this.action, this.state, this.game);
        this.dirty = false;
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "action", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "editable", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "active", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "shadow", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "shortcut", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ActionButton.prototype, "use", void 0);
    __decorate([
        core_1.ViewChild('canvas', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ActionButton.prototype, "canvas", void 0);
    ActionButton = __decorate([
        core_1.Component({
            selector: 'action-button',
            template: '<button class="action-button" (click)="click()" [class.active]="active" [class.no-shadow]="!shadow" [title]="action && action.title || \'\'"><canvas #canvas width="29" height="29"></canvas><div class="shortcut">{{shortcut}}</div><div class="count" *ngIf="action && action.type === \'item\'">{{action.count}}</div><div class="cover"></div></button>',
            styles: [],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            host: {
                '[class.empty]': '!editable && !action',
            },
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame])
    ], ActionButton);
    return ActionButton;
}());
exports.ActionButton = ActionButton;
