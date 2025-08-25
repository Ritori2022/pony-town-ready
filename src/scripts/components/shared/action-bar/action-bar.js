"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var data_1 = require("../../../client/data");
var buttonActions_1 = require("../../../client/buttonActions");
var settingsService_1 = require("../../services/settingsService");
var constants_1 = require("../../../common/constants");
var utils_1 = require("../../../common/utils");
var ActionBar = /** @class */ (function () {
    function ActionBar(game, settings) {
        this.game = game;
        this.settings = settings;
        this.blurred = false;
        this.activeAction = undefined;
        this.shortcuts = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
        this._editable = false;
    }
    Object.defineProperty(ActionBar.prototype, "editable", {
        get: function () {
            return this._editable;
        },
        set: function (value) {
            if (this._editable !== value) {
                this._editable = value;
                this.updateFreeSlots();
                if (!value) {
                    this.save();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "actions", {
        get: function () {
            return this.game.actions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "mobile", {
        get: function () {
            return data_1.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "hasScroller", {
        get: function () {
            return this.editable && data_1.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionBar.prototype, "blurCount", {
        get: function () {
            var boxWidth = data_1.isMobile ? 50 : 40;
            var width = 450 + this.scroller.nativeElement.scrollLeft;
            return Math.floor(width / boxWidth);
        },
        enumerable: true,
        configurable: true
    });
    ActionBar.prototype.use = function (action) {
        buttonActions_1.useAction(this.game, action);
    };
    ActionBar.prototype.drag = function (index) {
        this.actions[index].action = undefined;
        this.updateFreeSlots();
    };
    ActionBar.prototype.drop = function (action, index) {
        this.actions[index].action = action;
        this.updateFreeSlots();
    };
    ActionBar.prototype.save = function () {
        var settings = __assign({}, this.settings.account, { actions: buttonActions_1.serializeActions(this.actions) });
        this.settings.saveAccountSettings(settings);
    };
    ActionBar.prototype.scroll = function (e) {
        if (e.deltaY) {
            var delta = e.deltaY > 0 ? 1 : -1;
            this.scroller.nativeElement.scrollLeft += delta * 20;
        }
    };
    ActionBar.prototype.updateFreeSlots = function () {
        var actions = this.actions;
        if (this.editable) {
            while (actions.length < 5 || (utils_1.last(actions).action !== undefined && actions.length < constants_1.ACTIONS_LIMIT)) {
                actions.push({ action: undefined });
            }
        }
        else {
            while (actions.length > 0 && utils_1.last(actions).action === undefined) {
                actions.pop();
            }
        }
    };
    __decorate([
        core_1.ViewChild('scroller', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ActionBar.prototype, "scroller", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ActionBar.prototype, "blurred", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ActionBar.prototype, "editable", null);
    ActionBar = __decorate([
        core_1.Component({
            selector: 'action-bar',
            template: '<div class="action-bar" [class.has-scroller]="hasScroller" [class.is-mobile]="mobile" [class.is-blurred]="blurred" #scroller (mousewheel)="scroll($event)" (wheel)="scroll($event)" (scroll)="true"><action-button *ngFor="let a of actions; let i = index" [class.blur-me]="i < blurCount" [action]="a.action" [active]="a.action && activeAction === a" [editable]="editable" [shortcut]="shortcuts[i] || \'\'" (use)="use(a.action)" [draggableItem]="a.action" [draggableDisabled]="!editable || !a.action" [draggablePad]="10" (draggableDrag)="drag(i)" (draggableDrop)="drop($event, i)"></action-button><div class="action-button-padding"></div></div><div class="scroller-label">scroll using this bar</div>',
            styles: [],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame, settingsService_1.SettingsService])
    ], ActionBar);
    return ActionBar;
}());
exports.ActionBar = ActionBar;
