"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../common/utils");
var firefox = !SERVER && /firefox/i.test(navigator.userAgent);
function isKeyEventInvalid(e) {
    return e.target && /^(input|textarea|select)$/i.test(e.target.tagName);
}
function allowKey(key) {
    return key === 27 /* ESCAPE */ || key === 116 /* F5 */ || key === 123 /* F12 */ || key === 122 /* F11 */ || key === 9 /* TAB */;
}
function fixKeyCode(key) {
    if (firefox) {
        if (key === 173)
            return 189 /* DASH */;
        if (key === 61)
            return 187 /* EQUALS */;
    }
    return key;
}
var iosKeyToKeyCode = {
    UIKeyInputEscape: 27 /* ESCAPE */,
    UIKeyInputUpArrow: 38 /* UP */,
    UIKeyInputLeftArrow: 37 /* LEFT */,
    UIKeyInputRightArrow: 39 /* RIGHT */,
    UIKeyInputDownArrow: 40 /* DOWN */,
};
var iosHandledKeyCodes = [27 /* ESCAPE */, 38 /* UP */, 37 /* LEFT */, 39 /* RIGHT */, 40 /* DOWN */];
var KeyboardController = /** @class */ (function () {
    function KeyboardController(manager) {
        var _this = this;
        this.manager = manager;
        this.initialized = false;
        this.stack = [];
        this.keydown = function (e) {
            if (!_this.manager.disabledKeyboard && !isKeyEventInvalid(e)) {
                var code = fixKeyCode(e.keyCode);
                _this.manager.setValue(code, 1);
                if (!allowKey(code)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                if (!utils_1.includes(_this.stack, code) && !utils_1.includes(iosHandledKeyCodes, code)) {
                    _this.stack.push(code);
                }
            }
        };
        this.keyup = function (e) {
            var code = fixKeyCode(e.keyCode);
            // fix keyCode on iOS bluetooth keyboard
            if (code === 0) {
                code = iosKeyToKeyCode[e.key] || 0;
                if (code === 0) {
                    code = _this.stack.pop() || 0;
                }
            }
            if (_this.manager.setValue(code, 0)) {
                e.preventDefault();
                e.stopPropagation();
            }
            utils_1.removeItem(_this.stack, code);
        };
        this.blur = function () {
            _this.manager.clear();
        };
    }
    KeyboardController.prototype.initialize = function () {
        if (!this.initialized) {
            this.initialized = true;
            window.addEventListener('keydown', this.keydown);
            window.addEventListener('keyup', this.keyup);
            window.addEventListener('blur', this.blur);
        }
    };
    KeyboardController.prototype.release = function () {
        this.initialized = false;
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.removeEventListener('blur', this.blur);
        this.clear();
    };
    KeyboardController.prototype.update = function () {
    };
    KeyboardController.prototype.clear = function () {
        this.stack.length = 0;
    };
    return KeyboardController;
}());
exports.KeyboardController = KeyboardController;
