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
var lodash_1 = require("lodash");
var TabTitle = /** @class */ (function () {
    function TabTitle(templateRef) {
        this.templateRef = templateRef;
    }
    TabTitle = __decorate([
        core_1.Directive({
            selector: '[tabTitle]'
        }),
        __metadata("design:paramtypes", [core_1.TemplateRef])
    ], TabTitle);
    return TabTitle;
}());
exports.TabTitle = TabTitle;
var TabContent = /** @class */ (function () {
    function TabContent(templateRef) {
        this.templateRef = templateRef;
    }
    TabContent = __decorate([
        core_1.Directive({
            selector: '[tabContent]',
        }),
        __metadata("design:paramtypes", [core_1.TemplateRef])
    ], TabContent);
    return TabContent;
}());
exports.TabContent = TabContent;
var Tab = /** @class */ (function () {
    function Tab() {
        this.id = lodash_1.uniqueId("tabset-tab");
        this.disabled = false;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tab.prototype, "id", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Tab.prototype, "title", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tab.prototype, "icon", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tab.prototype, "disabled", void 0);
    __decorate([
        core_1.ContentChild(TabContent, { static: false }),
        __metadata("design:type", TabContent)
    ], Tab.prototype, "contentTpl", void 0);
    __decorate([
        core_1.ContentChild(TabTitle, { static: false }),
        __metadata("design:type", TabTitle)
    ], Tab.prototype, "titleTpl", void 0);
    Tab = __decorate([
        core_1.Directive({
            selector: 'tab',
        })
    ], Tab);
    return Tab;
}());
exports.Tab = Tab;
var Tabset = /** @class */ (function () {
    function Tabset() {
        this.label = '';
        this.destroyOnHide = true;
        this.orientation = 'horizontal';
        this.type = 'tabs';
        this.activeIndex = 0;
        this.activeIndexChange = new core_1.EventEmitter();
        this.justify = 'start';
    }
    Object.defineProperty(Tabset.prototype, "justify", {
        set: function (className) {
            if (className === 'fill' || className === 'justified') {
                this.justifyClass = "nav-" + className;
            }
            else {
                this.justifyClass = "justify-content-" + className;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tabset.prototype, "navClass", {
        get: function () {
            return "nav-" + this.type + (this.orientation === 'horizontal' ? " " + this.justifyClass : ' flex-column');
        },
        enumerable: true,
        configurable: true
    });
    Tabset.prototype.select = function (index) {
        if (this.activeIndex !== index) {
            this.activeIndex = index;
            this.activeIndexChange.emit(index);
        }
    };
    Tabset.prototype.keydown = function (e) {
        var index = this.handleKey(e.keyCode);
        if (index !== undefined) {
            e.preventDefault();
            var element = document.getElementById(this.tabs.toArray()[index].id);
            element && element.focus();
            this.select(index);
        }
    };
    Tabset.prototype.handleKey = function (keyCode) {
        if (keyCode === 37 /* LEFT */) {
            return this.activeIndex === 0 ? this.tabs.length - 1 : this.activeIndex - 1;
        }
        else if (keyCode === 39 /* RIGHT */) {
            return this.activeIndex === this.tabs.length - 1 ? 0 : this.activeIndex + 1;
        }
        else if (keyCode === 36 /* HOME */) {
            return 0;
        }
        else if (keyCode === 35 /* END */) {
            return this.tabs.length - 1;
        }
        else {
            return undefined;
        }
    };
    __decorate([
        core_1.ContentChildren(Tab),
        __metadata("design:type", core_1.QueryList)
    ], Tabset.prototype, "tabs", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tabset.prototype, "label", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tabset.prototype, "destroyOnHide", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Tabset.prototype, "justify", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Tabset.prototype, "orientation", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Tabset.prototype, "type", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Tabset.prototype, "activeIndex", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], Tabset.prototype, "activeIndexChange", void 0);
    Tabset = __decorate([
        core_1.Component({
            selector: 'tabset',
            templateUrl: 'tabset.pug',
        }),
        __metadata("design:paramtypes", [])
    ], Tabset);
    return Tabset;
}());
exports.Tabset = Tabset;
exports.tabsetComponents = [TabContent, TabTitle, Tabset, Tab];
