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
Object.defineProperty(exports, "__esModule", { value: true });
var base64_js_1 = require("base64-js");
var browser_1 = require("ag-sockets/dist/browser");
/* istanbul ignore next */
function attr(name) {
    return typeof document !== 'undefined' ? (document.body.getAttribute(name) || undefined) : undefined;
}
/* istanbul ignore next */
function data(id) {
    var element = typeof document !== 'undefined' ? document.getElementById(id) : undefined;
    return element ? element.innerHTML : undefined;
}
function json(id, def) {
    return JSON.parse(data(id) || def);
}
exports.isMobile = false;
exports.sw = attr('data-sw') === 'true';
exports.host = attr('data-host');
exports.local = attr('data-local') === 'true';
exports.token = attr('data-token');
exports.version = attr('data-version');
exports.isPublic = attr('data-public') === 'true';
exports.supporterLink = attr('data-supporter-link');
exports.twitterLink = attr('data-twitter-link');
exports.contactEmail = attr('data-email');
exports.copyrightName = attr('data-copyright');
/* istanbul ignore next */
exports.oauthProviders = json('oauth-providers', '[]')
    .map(function (a) { return (__assign({}, a, { url: "/auth/" + a.id })); });
/* istanbul ignore next */
exports.signUpProviders = exports.oauthProviders.filter(function (i) { return !i.connectOnly; });
/* istanbul ignore next */
exports.signInProviders = exports.oauthProviders.filter(function (i) { return i.connectOnly; });
/* istanbul ignore next */
function socketOptions() {
    var options = data('socket-options');
    if (options) {
        var buffer = base64_js_1.toByteArray(options);
        var reader = browser_1.createBinaryReader(buffer);
        return browser_1.readObject(reader);
    }
    else {
        throw new Error('Missing socket options');
    }
}
exports.socketOptions = socketOptions;
/* istanbul ignore next */
function setMobile() {
    exports.isMobile = true;
    window.removeEventListener('touchstart', setMobile);
    document.body.classList.add('is-mobile');
}
/* istanbul ignore next */
if (typeof window !== 'undefined') {
    if (!/windows/i.test(navigator.userAgent)) {
        window.addEventListener('touchstart', setMobile);
    }
    if (/Trident/.test(navigator.userAgent)) {
        document.body.classList.add('is-msie');
    }
    if (/YaBrowser/.test(navigator.userAgent)) {
        document.body.classList.add('is-yandex');
    }
}
