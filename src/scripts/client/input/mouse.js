"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../common/utils");
var MOUSE_BUTTONS = [302 /* MOUSE_BUTTON1 */, 304 /* MOUSE_BUTTON3 */, 303 /* MOUSE_BUTTON2 */];
var MouseController = /** @class */ (function () {
    function MouseController(manager) {
        var _this = this;
        this.manager = manager;
        this.initialized = false;
        this.mousemove = function (e) {
            if (_this.element) {
                var rect = _this.element.getBoundingClientRect();
                _this.manager.setValue(300 /* MOUSE_X */, Math.floor(e.clientX - rect.left));
                _this.manager.setValue(301 /* MOUSE_Y */, Math.floor(e.clientY - rect.top));
            }
        };
        this.mousedown = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.manager.usingTouch = false;
            var button = MOUSE_BUTTONS[e.button];
            if (button) {
                _this.manager.setValue(button, 1);
            }
        };
        this.mouseup = function (e) {
            var button = MOUSE_BUTTONS[e.button];
            if (button) {
                _this.manager.setValue(button, 0);
            }
        };
        this.mousewheel = function (e) {
            _this.manager.addValue(305 /* MOUSE_WHEEL_X */, utils_1.clamp(e.deltaX, -1, 1));
            _this.manager.addValue(306 /* MOUSE_WHEEL_Y */, utils_1.clamp(e.deltaY, -1, 1));
        };
        this.contextmenu = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        this.click = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        this.blur = function () {
            for (var _i = 0, MOUSE_BUTTONS_1 = MOUSE_BUTTONS; _i < MOUSE_BUTTONS_1.length; _i++) {
                var button = MOUSE_BUTTONS_1[_i];
                _this.manager.setValue(button, 0);
            }
        };
    }
    MouseController.prototype.initialize = function (element) {
        if (!this.initialized) {
            this.initialized = true;
            this.element = element;
            element.addEventListener('mousemove', this.mousemove);
            element.addEventListener('mousedown', this.mousedown);
            element.addEventListener('mouseup', this.mouseup);
            element.addEventListener('mousewheel', this.mousewheel);
            element.addEventListener('wheel', this.mousewheel);
            element.addEventListener('contextmenu', this.contextmenu);
            element.addEventListener('click', this.click);
            window.addEventListener('blur', this.blur);
        }
    };
    MouseController.prototype.release = function () {
        this.initialized = false;
        if (this.element) {
            this.element.removeEventListener('mousemove', this.mousemove);
            this.element.removeEventListener('mousedown', this.mousedown);
            this.element.removeEventListener('mouseup', this.mouseup);
            this.element.removeEventListener('mousewheel', this.mousewheel);
            this.element.removeEventListener('wheel', this.mousewheel);
            this.element.removeEventListener('contextmenu', this.contextmenu);
            this.element.removeEventListener('click', this.click);
            this.element = undefined;
        }
        window.removeEventListener('blur', this.blur);
    };
    MouseController.prototype.update = function () {
    };
    MouseController.prototype.clear = function () {
    };
    return MouseController;
}());
exports.MouseController = MouseController;
