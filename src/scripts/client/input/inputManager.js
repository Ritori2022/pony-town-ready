"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var keyboard_1 = require("./keyboard");
var mouse_1 = require("./mouse");
var touch_1 = require("./touch");
var gamepad_1 = require("./gamepad");
var utils_1 = require("../../common/utils");
var KEYS = 330 /* MAX_VALUE */;
var InputManager = /** @class */ (function () {
    function InputManager() {
        this.disabledGamepad = false;
        this.disabledKeyboard = false;
        this.disableArrows = false;
        this.usingTouch = false;
        this.controllers = [];
        this.state = utils_1.array(KEYS, 0);
        this.prevState = utils_1.array(KEYS, 0);
        this.actions = utils_1.times(KEYS, function () { return []; });
    }
    Object.defineProperty(InputManager.prototype, "axisX", {
        get: function () {
            var axisX = this.getRange(307 /* GAMEPAD_AXIS1_X */);
            var left = this.disableArrows ? this.getState(65 /* KEY_A */) : this.getState(37 /* LEFT */, 65 /* KEY_A */);
            var right = this.disableArrows ? this.getState(68 /* KEY_D */) : this.getState(39 /* RIGHT */, 68 /* KEY_D */);
            var x = axisX + (left ? -1 : (right ? 1 : 0));
            return lodash_1.clamp(x, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "axisY", {
        get: function () {
            var axisY = this.getRange(308 /* GAMEPAD_AXIS1_Y */);
            var up = this.disableArrows ? this.getState(87 /* KEY_W */) : this.getState(38 /* UP */, 87 /* KEY_W */);
            var down = this.disableArrows ? this.getState(83 /* KEY_S */) : this.getState(40 /* DOWN */, 83 /* KEY_S */);
            var y = axisY + (up ? -1 : (down ? 1 : 0));
            return lodash_1.clamp(y, -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "isMovementFromButtons", {
        get: function () {
            var up = this.getState(38 /* UP */, 87 /* KEY_W */);
            var down = this.getState(40 /* DOWN */, 83 /* KEY_S */);
            var left = this.getState(37 /* LEFT */, 65 /* KEY_A */);
            var right = this.getState(39 /* RIGHT */, 68 /* KEY_D */);
            return up || down || left || right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "axis2X", {
        get: function () {
            return lodash_1.clamp(this.getRange(309 /* GAMEPAD_AXIS2_X */), -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "axis2Y", {
        get: function () {
            return lodash_1.clamp(this.getRange(310 /* GAMEPAD_AXIS2_Y */), -1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "pointerX", {
        get: function () {
            return this.getRange(300 /* MOUSE_X */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "pointerY", {
        get: function () {
            return this.getRange(301 /* MOUSE_Y */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "wheelX", {
        get: function () {
            return this.getRange(305 /* MOUSE_WHEEL_X */);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputManager.prototype, "wheelY", {
        get: function () {
            return this.getRange(306 /* MOUSE_WHEEL_Y */);
        },
        enumerable: true,
        configurable: true
    });
    InputManager.prototype.initialize = function (element) {
        this.controllers = [
            new keyboard_1.KeyboardController(this),
            new mouse_1.MouseController(this),
            new touch_1.TouchController(this),
            new gamepad_1.GamePadController(this),
        ];
        this.controllers.forEach(function (c) { return c.initialize(element); });
        this.clear();
    };
    InputManager.prototype.release = function () {
        this.controllers.forEach(function (c) { return c.release(); });
        this.controllers = [];
        this.clear();
    };
    InputManager.prototype.update = function () {
        for (var _i = 0, _a = this.controllers; _i < _a.length; _i++) {
            var controller = _a[_i];
            controller.update();
        }
    };
    InputManager.prototype.end = function () {
        for (var i = 0; i < KEYS; i++) {
            this.prevState[i] = this.state[i];
        }
        this.setValue(328 /* TOUCH_CLICK */, 0);
        this.setValue(329 /* TOUCH_SECOND_CLICK */, 0);
        this.setValue(305 /* MOUSE_WHEEL_X */, 0);
        this.setValue(306 /* MOUSE_WHEEL_Y */, 0);
    };
    InputManager.prototype.clear = function () {
        for (var i = 0; i < KEYS; i++) {
            this.state[i] = 0;
            this.prevState[i] = 0;
        }
        for (var _i = 0, _a = this.controllers; _i < _a.length; _i++) {
            var controller = _a[_i];
            controller.clear();
        }
    };
    InputManager.prototype.onPressed = function (inputs, handler) {
        this.onAction(inputs, function (_, v) {
            if (v === 1) {
                handler();
            }
        });
    };
    InputManager.prototype.onReleased = function (inputs, handler) {
        this.onAction(inputs, function (_, v) {
            if (v === 0) {
                handler();
            }
        });
    };
    InputManager.prototype.isPressed = function (key) {
        return this.state[key] !== 0;
    };
    InputManager.prototype.wasPressed = function (key) {
        return this.state[key] === 1 && this.prevState[key] === 0;
    };
    InputManager.prototype.onAction = function (inputs, handler) {
        var inputsArray = Array.isArray(inputs) ? inputs : [inputs];
        for (var _i = 0, inputsArray_1 = inputsArray; _i < inputsArray_1.length; _i++) {
            var i = inputsArray_1[_i];
            this.actions[i].push(handler);
        }
    };
    InputManager.prototype.getState = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        for (var _a = 0, inputs_1 = inputs; _a < inputs_1.length; _a++) {
            var i = inputs_1[_a];
            if (this.state[i] !== 0) {
                return true;
            }
        }
        return false;
    };
    InputManager.prototype.getRange = function (input) {
        return this.state[input];
    };
    InputManager.prototype.setValue = function (input, value) {
        if (input < 0 || input >= KEYS) {
            console.warn("Input out of range: " + input);
        }
        else if (this.state[input] !== value) {
            this.state[input] = value;
            if (this.actions[input] && this.actions[input].length) {
                for (var _i = 0, _a = this.actions[input]; _i < _a.length; _i++) {
                    var action = _a[_i];
                    action(input, value);
                }
                return true;
            }
        }
        return false;
    };
    InputManager.prototype.addValue = function (input, value) {
        if (input < 0 || input >= KEYS) {
            console.warn("Input out of range: " + input);
        }
        else {
            this.state[input] += value;
        }
    };
    return InputManager;
}());
exports.InputManager = InputManager;
