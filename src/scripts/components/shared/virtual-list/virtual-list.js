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
var VirtualList = /** @class */ (function () {
    function VirtualList(element) {
        this.element = element;
        this.itemSize = 50;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], VirtualList.prototype, "itemSize", void 0);
    __decorate([
        core_1.ViewChild('padStart', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], VirtualList.prototype, "padStart", void 0);
    __decorate([
        core_1.ViewChild('padEnd', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], VirtualList.prototype, "padEnd", void 0);
    VirtualList = __decorate([
        core_1.Component({
            selector: 'virtual-list',
            template: '<div #padStart></div><ng-content></ng-content><div #padEnd></div>',
            styleUrls: ['virtual-list.scss'],
            host: {
                'tabindex': '0',
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], VirtualList);
    return VirtualList;
}());
exports.VirtualList = VirtualList;
var VirtualFor = /** @class */ (function () {
    function VirtualFor(viewContainer, template, differs, list, changeDetector, zone) {
        var _this = this;
        this.viewContainer = viewContainer;
        this.template = template;
        this.differs = differs;
        this.list = list;
        this.changeDetector = changeDetector;
        this.forOfDirty = true;
        this.differ = null;
        this.first = 0;
        this.last = 0;
        this.detect = function () { return _this.changeDetector.detectChanges(); };
        zone.runOutsideAngular(function () {
            list.element.nativeElement.addEventListener('scroll', _this.detect);
            window.addEventListener('resize', _this.detect);
        });
    }
    Object.defineProperty(VirtualFor.prototype, "virtualForOf", {
        set: function (forOf) {
            this.forOf = forOf;
            this.forOfDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualFor.prototype, "virtualForTemplate", {
        set: function (value) {
            if (value) {
                this.template = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    VirtualFor.prototype.ngOnDestroy = function () {
        this.list.element.nativeElement.removeEventListener('scroll', this.detect);
        window.removeEventListener('resize', this.detect);
    };
    VirtualFor.prototype.ngAfterViewInit = function () {
        setTimeout(this.detect, 0);
    };
    VirtualFor.prototype.ngDoCheck = function () {
        if (this.forOfDirty) {
            this.forOfDirty = false;
            var value = this.forOf;
            if (!this.differ && value) {
                try {
                    this.differ = this.differs.find(value).create();
                }
                catch (_a) {
                    throw new Error("Cannot find a differ");
                }
            }
        }
        var changes = this.differ && this.differ.diff(this.forOf);
        var element = this.list.element.nativeElement;
        var itemSize = this.list.itemSize;
        var height = element.getBoundingClientRect().height;
        var scroll = element.scrollTop;
        var first = Math.floor(scroll / itemSize);
        var last = first + Math.ceil(height / itemSize);
        var scrollChanged = false;
        if (this.first !== first || this.last !== last) {
            this.first = first;
            this.last = last;
            scrollChanged = true;
        }
        if (changes || scrollChanged) {
            this.applyChanges();
        }
    };
    VirtualFor.prototype.applyChanges = function () {
        var viewContainer = this.viewContainer;
        var first = this.first;
        var last = this.last;
        var forOf = this.forOf;
        var actualLast = Math.min(last, forOf.length - 1);
        var insertTuples = [];
        var views = [];
        for (var i = viewContainer.length - 1; i >= 0; i--) {
            var ref = viewContainer.get(i);
            if (ref.context._currentIndex < first || ref.context._currentIndex > actualLast) {
                viewContainer.detach(i);
                views.push(ref);
            }
        }
        for (var index = first, i = 0; index <= actualLast; index++, i++) {
            if (viewContainer.length <= i || viewContainer.get(i).context._currentIndex !== index) {
                var view = views.pop();
                if (view) {
                    view.context.$implicit = null;
                    view.context._currentIndex = index;
                    viewContainer.insert(view, i);
                }
                else {
                    var context_1 = { $implicit: null, index: -1, count: -1, _currentIndex: index };
                    view = viewContainer.createEmbeddedView(this.template, context_1, i);
                }
                insertTuples.push({ item: forOf[index], view: view });
            }
        }
        if (DEVELOPMENT && viewContainer.length !== (actualLast - first + 1)) {
            console.error('virtual-list: Invalid length', viewContainer.length, first, actualLast);
        }
        for (var _i = 0, views_1 = views; _i < views_1.length; _i++) {
            var view = views_1[_i];
            view.destroy();
        }
        for (var i = 0; i < insertTuples.length; i++) {
            insertTuples[i].view.context.$implicit = insertTuples[i].item;
        }
        var count = forOf.length;
        for (var i = 0, ilen = viewContainer.length; i < ilen; i++) {
            var viewRef = viewContainer.get(i);
            viewRef.context.$implicit = forOf[first + i];
            viewRef.context.index = first + i;
            viewRef.context.count = count;
        }
        var itemSize = this.list.itemSize;
        this.list.padStart.nativeElement.style.height = first * itemSize + "px";
        this.list.padEnd.nativeElement.style.height = (forOf.length - actualLast - 1) * itemSize + "px";
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], VirtualFor.prototype, "virtualForOf", null);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef),
        __metadata("design:paramtypes", [core_1.TemplateRef])
    ], VirtualFor.prototype, "virtualForTemplate", null);
    VirtualFor = __decorate([
        core_1.Directive({
            selector: '[virtualFor][virtualForOf]',
        }),
        __metadata("design:paramtypes", [core_1.ViewContainerRef,
            core_1.TemplateRef,
            core_1.IterableDiffers,
            VirtualList,
            core_1.ChangeDetectorRef,
            core_1.NgZone])
    ], VirtualFor);
    return VirtualFor;
}());
exports.VirtualFor = VirtualFor;
exports.virtualListDirectives = [VirtualFor];
