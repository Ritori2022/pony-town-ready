"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_saver_1 = require("file-saver");
/* istanbul ignore next */
exports.createCanvas = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width | 0;
    canvas.height = height | 0;
    return canvas;
};
/* istanbul ignore next */
exports.loadImage = function (src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function () { return resolve(img); });
        img.addEventListener('error', function () { return reject(new Error("Error loading image (" + src + ")")); });
        img.src = src;
    });
};
/* istanbul ignore next */
function canUseImageBitmap() {
    return typeof fetch === 'function' &&
        typeof createImageBitmap === 'function' &&
        !/yabrowser/i.test(navigator.userAgent); // disabled due to yandex browser bug
}
/* istanbul ignore next */
if (canUseImageBitmap()) {
    exports.loadImage = function (src) { return fetch(src)
        .then(function (response) { return response.blob(); })
        .then(createImageBitmap); };
}
function setup(methods) {
    exports.createCanvas = methods.createCanvas;
    exports.loadImage = methods.loadImage;
}
exports.setup = setup;
/* istanbul ignore next */
exports.getPixelRatio = SERVER ? function () { return 1; } : function () { return window.devicePixelRatio; };
function resizeCanvas(canvas, width, height) {
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}
exports.resizeCanvas = resizeCanvas;
function resizeCanvasWithRatio(canvas, width, height, updateStyle) {
    if (updateStyle === void 0) { updateStyle = true; }
    var ratio = exports.getPixelRatio();
    var w = Math.round(width * ratio);
    var h = Math.round(height * ratio);
    var resized = false;
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        resized = true;
    }
    if (updateStyle && (canvas.style.width !== width + 'px' || canvas.style.height !== height + 'px')) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        resized = true;
    }
    return resized;
}
exports.resizeCanvasWithRatio = resizeCanvasWithRatio;
/* istanbul ignore next */
function canvasToSource(canvas) {
    return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
            if (blob) {
                resolve(URL.createObjectURL(blob));
            }
            else {
                reject(new Error('Failed to convert canvas'));
            }
        });
    });
}
exports.canvasToSource = canvasToSource;
/* istanbul ignore next */
function saveCanvas(canvas, name) {
    canvas.toBlob(function (blob) { return blob && file_saver_1.saveAs(blob, name); });
}
exports.saveCanvas = saveCanvas;
/* istanbul ignore next */
function disableImageSmoothing(context) {
    if ('imageSmoothingEnabled' in context) {
        context.imageSmoothingEnabled = false;
    }
    else {
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
    }
}
exports.disableImageSmoothing = disableImageSmoothing;
