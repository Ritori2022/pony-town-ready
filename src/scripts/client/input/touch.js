"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../common/utils");
function getTouch(e, id) {
    if (id !== -1) {
        for (var i = 0; i < e.changedTouches.length; ++i) {
            var touch = e.changedTouches.item(i);
            if (touch && touch.identifier === id) {
                return touch;
            }
        }
    }
    return undefined;
}
var TOUCH_DEADZONE = 15;
var TOUCH_MAX = 100;
var TouchController = /** @class */ (function () {
    function TouchController(manager) {
        var _this = this;
        this.manager = manager;
        this.initialized = false;
        this.touchId = -1;
        this.touch2Id = -1;
        this.touchStart = { x: 0, y: 0 };
        this.touchCurrent = { x: 0, y: 0 };
        this.touchIsDrag = false;
        this.tapInvalidated = false;
        this.originShown = false;
        this.positionShown = false;
        this.touchstart = function (e) {
            e.cancellable && e.preventDefault();
            e.stopPropagation();
            _this.manager.usingTouch = true;
            if (_this.touchId === -1) {
                var touch = e.changedTouches.item(0);
                if (touch) {
                    _this.tapInvalidated = false;
                    _this.touchId = touch.identifier;
                    _this.touchStart = _this.touchCurrent = _this.getTouchXY(touch);
                    _this.manager.setValue(300 /* MOUSE_X */, _this.touchStart.x);
                    _this.manager.setValue(301 /* MOUSE_Y */, _this.touchStart.y);
                    _this.manager.setValue(327 /* TOUCH */, 1);
                }
            }
            else if (_this.touch2Id === -1) {
                var touch = e.changedTouches.item(0);
                if (touch) {
                    _this.tapInvalidated = true;
                    _this.touch2Id = touch.identifier;
                }
            }
        };
        this.touchmove = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var touch = getTouch(e, _this.touchId);
            if (touch) {
                _this.touchCurrent = _this.getTouchXY(touch);
                _this.manager.setValue(300 /* MOUSE_X */, _this.touchCurrent.x);
                _this.manager.setValue(301 /* MOUSE_Y */, _this.touchCurrent.y);
                _this.updateInput();
            }
        };
        this.touchend = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var touch = getTouch(e, _this.touchId);
            if (touch) {
                if (!_this.touchIsDrag && !_this.tapInvalidated) {
                    _this.manager.setValue(300 /* MOUSE_X */, _this.touchStart.x);
                    _this.manager.setValue(301 /* MOUSE_Y */, _this.touchStart.y);
                    _this.manager.setValue(328 /* TOUCH_CLICK */, 1);
                }
                _this.resetTouch();
            }
            var touch2 = getTouch(e, _this.touch2Id);
            if (touch2) {
                _this.manager.setValue(329 /* TOUCH_SECOND_CLICK */, 1);
                _this.touch2Id = -1;
            }
        };
        this.blur = function () {
            _this.reset();
        };
    }
    TouchController.prototype.initialize = function (element) {
        if (!this.initialized) {
            this.initialized = true;
            this.element = element;
            this.origin = document.getElementById('touch-origin');
            this.position = document.getElementById('touch-position');
            element.addEventListener('touchstart', this.touchstart);
            element.addEventListener('touchmove', this.touchmove);
            element.addEventListener('touchend', this.touchend);
            window.addEventListener('touchend', this.blur);
            window.addEventListener('blur', this.blur);
        }
    };
    TouchController.prototype.release = function () {
        this.initialized = false;
        if (this.element) {
            this.element.removeEventListener('touchstart', this.touchstart);
            this.element.removeEventListener('touchmove', this.touchmove);
            this.element.removeEventListener('touchend', this.touchend);
            this.element = undefined;
        }
        window.removeEventListener('touchend', this.blur);
        window.removeEventListener('blur', this.blur);
    };
    TouchController.prototype.update = function () {
        var showOrigin = this.touchIsDrag && this.touchId !== -1;
        var showPosition = this.touchId !== -1;
        if (this.origin && this.position) {
            if (this.originShown !== showOrigin) {
                this.originShown = showOrigin;
                this.origin.style.display = showOrigin ? 'block' : 'none';
            }
            if (this.positionShown !== showPosition) {
                this.positionShown = showPosition;
                this.position.style.display = showPosition ? 'block' : 'none';
            }
            if (showOrigin) {
                var transform = "translate3d(" + (this.touchStart.x - 50) + "px, " + (this.touchStart.y - 50) + "px, 0px)";
                if (this.originTransform !== transform) {
                    this.originTransform = transform;
                    utils_1.setTransform(this.origin, transform);
                }
            }
            if (showPosition) {
                var transform = "translate3d(" + (this.touchCurrent.x - 25) + "px, " + (this.touchCurrent.y - 25) + "px, 0px)";
                if (this.positionTransform !== transform) {
                    this.positionTransform = transform;
                    utils_1.setTransform(this.position, transform);
                }
            }
        }
    };
    TouchController.prototype.clear = function () {
    };
    TouchController.prototype.reset = function () {
        this.touch2Id = -1;
        this.resetTouch();
    };
    TouchController.prototype.resetTouch = function () {
        this.touchId = -1;
        this.touchStart = this.touchCurrent = { x: 0, y: 0 };
        this.touchIsDrag = false;
        this.manager.setValue(327 /* TOUCH */, 0);
        this.updateInput();
    };
    TouchController.prototype.updateInput = function () {
        var dy = this.touchStart.y - this.touchCurrent.y;
        var dx = this.touchStart.x - this.touchCurrent.x;
        var theta = Math.atan2(dy, dx);
        var dist = Math.sqrt(dy * dy + dx * dx);
        if (dist > TOUCH_DEADZONE) {
            var scaledDist = Math.min((dist - TOUCH_DEADZONE) / (TOUCH_MAX - TOUCH_DEADZONE), 1);
            this.touchIsDrag = true;
            this.manager.setValue(307 /* GAMEPAD_AXIS1_X */, -Math.cos(theta) * scaledDist);
            this.manager.setValue(308 /* GAMEPAD_AXIS1_Y */, -Math.sin(theta) * scaledDist);
        }
        else {
            this.manager.setValue(307 /* GAMEPAD_AXIS1_X */, 0);
            this.manager.setValue(308 /* GAMEPAD_AXIS1_Y */, 0);
        }
    };
    TouchController.prototype.getTouchXY = function (touch) {
        var _a = this.element.getBoundingClientRect(), left = _a.left, top = _a.top;
        return {
            x: touch.clientX - left,
            y: touch.clientY - top,
        };
    };
    return TouchController;
}());
exports.TouchController = TouchController;
