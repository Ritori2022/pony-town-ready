"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const game_1 = require("../../../client/game");
const buttonActions_1 = require("../../../client/buttonActions");
const utils_1 = require("../../../common/utils");
let ActionButton = class ActionButton {
    constructor(game) {
        this.game = game;
        this.editable = false;
        this.active = false;
        this.shadow = true;
        this.shortcut = '';
        this.use = new core_1.EventEmitter();
        this.dirty = true;
        this.state = {};
    }
    ngOnInit() {
        game_1.actionButtons.push(this);
    }
    ngOnDestroy() {
        utils_1.removeItem(game_1.actionButtons, this);
    }
    ngOnChanges() {
        this.dirty = true;
    }
    click() {
        if (this.action) {
            this.use.emit(this.action);
        }
    }
    draw() {
        buttonActions_1.drawAction(this.canvas.nativeElement, this.action, this.state, this.game);
        this.dirty = false;
    }
};
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "action", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "editable", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "active", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "shadow", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "shortcut", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], ActionButton.prototype, "use", void 0);
tslib_1.__decorate([
    core_1.ViewChild('canvas', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], ActionButton.prototype, "canvas", void 0);
ActionButton = tslib_1.__decorate([
    core_1.Component({
        selector: 'action-button',
        template: '<button class="action-button" (click)="click()" [class.active]="active" [class.no-shadow]="!shadow" [title]="action && action.title || \'\'"><canvas #canvas width="29" height="29"></canvas><div class="shortcut">{{shortcut}}</div><div class="count" *ngIf="action && action.type === \'item\'">{{action.count}}</div><div class="cover"></div></button>',
        styles: [],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        host: {
            '[class.empty]': '!editable && !action',
        },
    }),
    tslib_1.__metadata("design:paramtypes", [game_1.PonyTownGame])
], ActionButton);
exports.ActionButton = ActionButton;
//# sourceMappingURL=action-button.js.map