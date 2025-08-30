"use strict";
/// <reference path="../../typings/my.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const canvasUtils_1 = require("../client/canvasUtils");
// 🌍 跨平台Canvas支持
// 自动检测环境并选择最佳Canvas实现
let canvasImpl;
let ImageImpl;
try {
    // 尝试加载原生Canvas库 (适用于Linux/Windows)
    const nativeCanvas = require('canvas');
    canvasImpl = nativeCanvas.createCanvas;
    ImageImpl = nativeCanvas.Image;
    console.log('🎨 使用原生Canvas库 (最佳性能)');
}
catch (error) {
    // 如果原生Canvas不可用，使用模拟实现 (兼容ARM64 Mac等)
    console.log('🎭 原生Canvas不可用，使用模拟实现');
    console.log('   原因:', error.message.split('\n')[0]);
    const mockCanvas = require('../../../canvas-mock');
    canvasImpl = mockCanvas.createCanvas;
    ImageImpl = mockCanvas.Image;
    console.log('✅ Canvas模拟已激活 (兼容性模式)');
}
exports.createCanvas = canvasImpl;
async function loadImage(src) {
    const buffer = await fs_1.readFileAsync(src);
    const image = new ImageImpl();
    image.src = buffer;
    return image;
}
exports.loadImage = loadImage;
function loadImageSync(src) {
    const image = new ImageImpl();
    image.src = fs_1.readFileSync(src);
    return image;
}
exports.loadImageSync = loadImageSync;
// 初始化Canvas工具
canvasUtils_1.setup({ createCanvas: canvasImpl, loadImage });
//# sourceMappingURL=canvasUtilsNode.js.map