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
var agDrag_1 = require("./agDrag");
var utils_1 = require("../../../common/utils");
var rect_1 = require("../../../common/rect");
var DraggableService = /** @class */ (function () {
    function DraggableService() {
        this.dropZones = [];
    }
    Object.defineProperty(DraggableService.prototype, "rootElement", {
        get: function () {
            return this.root ? this.root.nativeElement : document.body;
        },
        enumerable: true,
        configurable: true
    });
    DraggableService.prototype.setActiveDropZone = function (dropZone) {
        if (this.activeDropZone !== dropZone) {
            if (this.activeDropZone) {
                this.activeDropZone.setActive(false);
            }
            this.activeDropZone = dropZone;
            if (this.activeDropZone) {
                this.activeDropZone.setActive(true);
            }
        }
    };
    DraggableService.prototype.startMove = function (element, item) {
        this.setActiveDropZone(undefined);
        this.rootElement.appendChild(element);
        this.draggedItem = item;
        this.initRects();
    };
    DraggableService.prototype.endMove = function () {
        if (this.activeDropZone) {
            this.activeDropZone.drop.emit(this.draggedItem);
            this.setActiveDropZone(undefined);
        }
        this.draggedItem = undefined;
    };
    DraggableService.prototype.addDropZone = function (dropZone) {
        this.dropZones.push(dropZone);
        if (this.draggedItem) {
            this.initRects();
        }
    };
    DraggableService.prototype.removeDropZone = function (dropZone) {
        utils_1.removeItem(this.dropZones, dropZone);
        if (this.draggedItem) {
            this.initRects();
        }
        if (this.activeDropZone === dropZone) {
            this.setActiveDropZone(undefined);
        }
    };
    DraggableService.prototype.updateHover = function (x, y) {
        if (this.draggedItem) {
            for (var _i = 0, _a = this.dropZones; _i < _a.length; _i++) {
                var zone = _a[_i];
                if (utils_1.pointInRect(x, y, zone.rect)) {
                    this.setActiveDropZone(zone);
                    return;
                }
            }
            this.setActiveDropZone(undefined);
        }
    };
    DraggableService.prototype.initRects = function () {
        this.dropZones.forEach(function (i) { return i.initRect(); });
    };
    DraggableService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], DraggableService);
    return DraggableService;
}());
exports.DraggableService = DraggableService;
var DraggableOutlet = /** @class */ (function () {
    function DraggableOutlet(element, service) {
        service.root = element;
    }
    DraggableOutlet = __decorate([
        core_1.Component({
            selector: 'draggable-outlet',
            template: "<div></div>",
            styles: [":host { position: fixed; top: 0; left: 0; z-index: 10000; }"],
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, DraggableService])
    ], DraggableOutlet);
    return DraggableOutlet;
}());
exports.DraggableOutlet = DraggableOutlet;
var DraggableDrop = /** @class */ (function () {
    function DraggableDrop(element, service) {
        this.element = element;
        this.service = service;
        this.pad = 0;
        this.drop = new core_1.EventEmitter();
        this.rect = rect_1.rect(0, 0, 0, 0);
    }
    DraggableDrop.prototype.ngOnInit = function () {
        this.service.addDropZone(this);
    };
    DraggableDrop.prototype.ngOnDestroy = function () {
        this.service.removeDropZone(this);
    };
    DraggableDrop.prototype.setActive = function (active) {
        var element = this.element.nativeElement;
        if (active) {
            element.classList.add('draggable-hover');
        }
        else {
            element.classList.remove('draggable-hover');
        }
    };
    DraggableDrop.prototype.initRect = function () {
        var element = this.element.nativeElement;
        var clientBounds = element.getBoundingClientRect();
        this.rect.x = clientBounds.left - this.pad;
        this.rect.y = clientBounds.top - this.pad;
        this.rect.w = clientBounds.width + 2 * this.pad;
        this.rect.h = clientBounds.height + 2 * this.pad;
    };
    __decorate([
        core_1.Input('draggablePad'),
        __metadata("design:type", Object)
    ], DraggableDrop.prototype, "pad", void 0);
    __decorate([
        core_1.Output('draggableDrop'),
        __metadata("design:type", Object)
    ], DraggableDrop.prototype, "drop", void 0);
    DraggableDrop = __decorate([
        core_1.Directive({ selector: '[draggableDrop]' }),
        __metadata("design:paramtypes", [core_1.ElementRef, DraggableService])
    ], DraggableDrop);
    return DraggableDrop;
}());
exports.DraggableDrop = DraggableDrop;
var DraggableItem = /** @class */ (function () {
    function DraggableItem(element, service) {
        this.element = element;
        this.service = service;
        this.dragStarted = new core_1.EventEmitter();
        this.startX = 0;
        this.startY = 0;
        this.width = 0;
        this.height = 0;
        this.unsubscribeDrag = lodash_1.noop;
        this._disabled = false;
    }
    DraggableItem.prototype.ngOnInit = function () {
        this.setupDragEvents();
    };
    DraggableItem.prototype.ngOnDestroy = function () {
        this.unsubscribeDrag();
    };
    Object.defineProperty(DraggableItem.prototype, "touchAction", {
        get: function () {
            return this.disabled ? 'inherit' : 'none';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DraggableItem.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            if (this._disabled !== value) {
                this._disabled = value;
                this.setupDragEvents();
            }
        },
        enumerable: true,
        configurable: true
    });
    DraggableItem.prototype.setupDragEvents = function () {
        var _this = this;
        this.unsubscribeDrag();
        this.unsubscribeDrag = lodash_1.noop;
        if (!this.disabled) {
            this.unsubscribeDrag = agDrag_1.handleDrag(this.element.nativeElement, function (e) { return _this.drag(e); }, { prevent: true });
        }
    };
    DraggableItem.prototype.drag = function (e) {
        if (this.item && !this.disabled && !this.draggable && (Math.abs(e.dx) > 5 || Math.abs(e.dy) > 5)) {
            var element = this.element.nativeElement;
            var rect_2 = element.getBoundingClientRect();
            this.startX = rect_2.left;
            this.startY = rect_2.top;
            this.draggable = element.cloneNode(true);
            this.draggable.style.position = 'absolute';
            this.draggable.style.width = rect_2.width + "px";
            this.draggable.style.height = rect_2.height + "px";
            this.draggable.style.margin = '0';
            this.draggable.classList.add('draggable-dragging');
            this.width = rect_2.width;
            this.height = rect_2.height;
            var src = element.querySelectorAll('canvas');
            var dst = this.draggable.querySelectorAll('canvas');
            for (var i = 0; i < src.length; i++) {
                var context_1 = dst.item(i).getContext('2d');
                context_1 && context_1.drawImage(src.item(i), 0, 0);
            }
            this.service.startMove(this.draggable, this.item);
            this.dragStarted.emit();
        }
        if (this.draggable) {
            if (e.type === 'end') {
                this.draggable.parentNode.removeChild(this.draggable);
                this.draggable = undefined;
                this.service.endMove();
            }
            else {
                var x = utils_1.clamp(this.startX + e.dx, 0, window.innerWidth - this.width);
                var y = utils_1.clamp(this.startY + e.dy, 0, window.innerHeight - this.height);
                utils_1.setTransform(this.draggable, "translate3d(" + x + "px, " + y + "px, 0px)");
                this.service.updateHover(e.x, e.y);
            }
        }
    };
    __decorate([
        core_1.Input('draggableItem'),
        __metadata("design:type", Object)
    ], DraggableItem.prototype, "item", void 0);
    __decorate([
        core_1.Output('draggableDrag'),
        __metadata("design:type", Object)
    ], DraggableItem.prototype, "dragStarted", void 0);
    __decorate([
        core_1.Input('draggableDisabled'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], DraggableItem.prototype, "disabled", null);
    DraggableItem = __decorate([
        core_1.Directive({
            selector: '[draggableItem]',
            host: {
                '[style.touch-action]': "touchAction",
            }
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, DraggableService])
    ], DraggableItem);
    return DraggableItem;
}());
exports.DraggableItem = DraggableItem;
exports.draggableComponents = [DraggableOutlet, DraggableItem, DraggableDrop];
