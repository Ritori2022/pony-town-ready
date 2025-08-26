"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gamepad_mappings_1 = require("../../generated/gamepad-mappings");
var clientUtils_1 = require("../clientUtils");
var JOYSTICK_THRESHHOLD = 0.2;
function createGamepad(gamepad) {
    var mapping = detectMapping(gamepad.id, navigator.userAgent);
    return { gamepad: gamepad, mapping: mapping };
}
function isCompatible(mapping, id, browser) {
    for (var i = 0; i < mapping.supported.length; i++) {
        var supported = mapping.supported[i];
        if (id.indexOf(supported.id) !== -1 && browser.indexOf(supported.os) !== -1 && browser.indexOf(browser) !== -1) {
            return true;
        }
    }
    return false;
}
function detectMapping(id, browser) {
    for (var i = 0; i < gamepad_mappings_1.GAMEPAD_MAPPINGS.length; i++) {
        if (isCompatible(gamepad_mappings_1.GAMEPAD_MAPPINGS[i], id, browser)) {
            return gamepad_mappings_1.GAMEPAD_MAPPINGS[i];
        }
    }
    return gamepad_mappings_1.GAMEPAD_MAPPINGS[0];
}
function axis(_a, name) {
    var mapping = _a.mapping, gamepad = _a.gamepad;
    var axe = mapping.axes[name];
    return axe ? gamepad.axes[axe.index] : 0;
}
function button(_a, name) {
    var mapping = _a.mapping, gamepad = _a.gamepad;
    var button = mapping.buttons[name];
    if (!button) {
        return false;
    }
    if (button.index !== undefined) {
        return gamepad.buttons[button.index] && gamepad.buttons[button.index].pressed;
    }
    if (button.axis !== undefined) {
        if (button.direction < 0) {
            return gamepad.axes[button.axis] < -0.75;
        }
        else {
            return gamepad.axes[button.axis] > 0.75;
        }
    }
    return false;
}
var GamePadController = /** @class */ (function () {
    function GamePadController(manager) {
        var _this = this;
        this.manager = manager;
        this.initialized = false;
        this.gamepadIndex = -1;
        this.zeroed1 = false;
        this.zeroed2 = false;
        this.gamepadconnected = function (e) {
            _this.gamepadIndex = e.gamepad.index;
        };
        this.gamepaddisconnected = function (e) {
            if (_this.gamepadIndex === e.gamepad.index) {
                _this.scanGamepads();
            }
        };
    }
    GamePadController.prototype.initialize = function () {
        if (!this.initialized) {
            this.initialized = true;
            window.addEventListener('gamepadconnected', this.gamepadconnected);
            window.addEventListener('gamepaddisconnected', this.gamepaddisconnected);
            this.scanGamepads();
        }
    };
    GamePadController.prototype.release = function () {
        this.initialized = false;
        window.removeEventListener('gamepadconnected', this.gamepadconnected);
        window.removeEventListener('gamepaddisconnected', this.gamepaddisconnected);
    };
    GamePadController.prototype.update = function () {
        if (this.manager.disabledGamepad || !clientUtils_1.isFocused() || this.gamepadIndex === -1)
            return;
        var gamepads = navigator.getGamepads();
        var gamepad = gamepads[this.gamepadIndex];
        if (!gamepad) {
            this.scanGamepads();
            return;
        }
        var pad = createGamepad(gamepad);
        this.zeroed1 = readAxis(this.manager, 307 /* GAMEPAD_AXIS1_X */, 308 /* GAMEPAD_AXIS1_Y */, axis(pad, 0 /* LeftStickX */), axis(pad, 1 /* LeftStickY */), this.zeroed1);
        this.zeroed2 = readAxis(this.manager, 309 /* GAMEPAD_AXIS2_X */, 310 /* GAMEPAD_AXIS2_Y */, axis(pad, 2 /* RightStickX */), axis(pad, 3 /* RightStickY */), this.zeroed2);
        this.manager.setValue(313 /* GAMEPAD_BUTTON_X */, button(pad, 2 /* X */) ? 1 : 0);
        this.manager.setValue(314 /* GAMEPAD_BUTTON_Y */, button(pad, 3 /* Y */) ? 1 : 0);
        this.manager.setValue(311 /* GAMEPAD_BUTTON_A */, button(pad, 0 /* A */) ? 1 : 0);
        this.manager.setValue(312 /* GAMEPAD_BUTTON_B */, button(pad, 1 /* B */) ? 1 : 0);
        this.manager.setValue(324 /* GAMEPAD_BUTTON_DOWN */, button(pad, 6 /* DpadDown */) ? 1 : 0);
        this.manager.setValue(325 /* GAMEPAD_BUTTON_LEFT */, button(pad, 7 /* DpadLeft */) ? 1 : 0);
        this.manager.setValue(326 /* GAMEPAD_BUTTON_RIGHT */, button(pad, 8 /* DpadRight */) ? 1 : 0);
        this.manager.setValue(323 /* GAMEPAD_BUTTON_UP */, button(pad, 9 /* DpadUp */) ? 1 : 0);
    };
    GamePadController.prototype.clear = function () {
    };
    GamePadController.prototype.scanGamepads = function () {
        var gamepads = navigator.getGamepads();
        // Using regular loop because of issues with iterating over gamepads
        for (var i = 0; i < gamepads.length; i++) {
            var gamepad = gamepads[i];
            if (gamepad) {
                this.gamepadIndex = gamepad.index;
                return;
            }
        }
        this.gamepadIndex = -1;
    };
    return GamePadController;
}());
exports.GamePadController = GamePadController;
function readAxis(manager, keyX, keyY, axisX, axisY, zeroed) {
    var dist = Math.sqrt(axisX * axisX + axisY * axisY);
    if (dist > JOYSTICK_THRESHHOLD) {
        var scaledDist = Math.min((dist - JOYSTICK_THRESHHOLD) / (1 - JOYSTICK_THRESHHOLD), 1);
        var theta = Math.atan2(axisY, axisX);
        manager.setValue(keyX, Math.cos(theta) * scaledDist);
        manager.setValue(keyY, Math.sin(theta) * scaledDist);
        return false;
    }
    else if (!zeroed) {
        manager.setValue(keyX, 0);
        manager.setValue(keyY, 0);
        return true;
    }
    return zeroed;
}
