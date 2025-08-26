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
var utils_1 = require("../../../common/utils");
function handleDrag(element, emit, options) {
    if (options === void 0) { options = {}; }
    // typeof PointerEvent !== 'undefined'
    var eventSets = window.navigator.pointerEnabled ? [
        { down: 'pointerdown', move: 'pointermove', up: 'pointerup' },
    ] : [
        { down: 'mousedown', move: 'mousemove', up: 'mouseup' },
        { down: 'touchstart', move: 'touchmove', up: 'touchend', up2: 'touchcancel' },
    ];
    var emptyRect = { left: 0, top: 0 };
    var rect = emptyRect;
    var scrollLeft = 0;
    var scrollTop = 0;
    var startX = 0;
    var startY = 0;
    var button = 0;
    var dragging = false;
    var lastEvent;
    function setupScrollAndRect() {
        // TODO: fix issue with scroll
        switch (options.relative) {
            case 'self':
                rect = element.getBoundingClientRect();
                scrollLeft = -(window.scrollX || window.pageXOffset || 0);
                scrollTop = -(window.scrollY || window.pageYOffset || 0);
                break;
            case 'parent':
                rect = element.parentElement.getBoundingClientRect();
                scrollLeft = element.parentElement.scrollLeft;
                scrollTop = element.parentElement.scrollTop;
                break;
            default:
                rect = emptyRect;
                scrollLeft = 0;
                scrollTop = 0;
        }
    }
    function send(event, type) {
        var x = utils_1.getX(event);
        var y = utils_1.getY(event);
        emit({
            event: event,
            type: type,
            x: x - rect.left + scrollLeft,
            y: y - rect.top + scrollTop,
            dx: x - startX,
            dy: y - startY,
        });
    }
    var handlers = eventSets.map(function (events) {
        function move(e) {
            lastEvent = e;
            e.preventDefault();
            send(e, 'drag');
        }
        function up(e) {
            if (utils_1.getButton(e) === button) {
                // touchend event does not have x, y coordinates, use last touchmove event instead
                if (e.type !== 'touchend' && e.type !== 'touchcancel') {
                    lastEvent = e;
                }
                end();
            }
        }
        function end() {
            send(lastEvent, 'end');
            window.removeEventListener(events.move, move);
            window.removeEventListener(events.up, up);
            events.up2 && window.removeEventListener(events.up2, up);
            window.removeEventListener('blur', end);
            dragging = false;
        }
        function handler(e) {
            if (!dragging) {
                setupScrollAndRect();
                dragging = true;
                button = utils_1.getButton(e);
                startX = utils_1.getX(e);
                startY = utils_1.getY(e);
                send(e, 'start');
                lastEvent = e;
                window.addEventListener(events.move, move);
                window.addEventListener(events.up, up);
                events.up2 && window.addEventListener(events.up2, up);
                window.addEventListener('blur', end);
                e.stopPropagation();
                if (options.prevent) {
                    e.preventDefault();
                }
            }
        }
        element.addEventListener(events.down, handler);
        return function () { return element.removeEventListener(events.down, handler); };
    });
    return function () { return handlers.forEach(function (f) { return f(); }); };
}
exports.handleDrag = handleDrag;
var AgDrag = /** @class */ (function () {
    function AgDrag(element) {
        this.element = element;
        this.relative = undefined;
        this.prevent = false;
        this.drag = new core_1.EventEmitter();
        this.unsubscribe = lodash_1.noop;
    }
    AgDrag.prototype.ngOnInit = function () {
        var _this = this;
        this.unsubscribe = handleDrag(this.element.nativeElement, function (e) { return _this.drag.emit(e); }, this);
    };
    AgDrag.prototype.ngOnDestroy = function () {
        this.unsubscribe();
    };
    __decorate([
        core_1.Input('agDragRelative'),
        __metadata("design:type", String)
    ], AgDrag.prototype, "relative", void 0);
    __decorate([
        core_1.Input('agDragPrevent'),
        __metadata("design:type", Object)
    ], AgDrag.prototype, "prevent", void 0);
    __decorate([
        core_1.Output('agDrag'),
        __metadata("design:type", Object)
    ], AgDrag.prototype, "drag", void 0);
    AgDrag = __decorate([
        core_1.Directive({ selector: '[agDrag]' }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AgDrag);
    return AgDrag;
}());
exports.AgDrag = AgDrag;
