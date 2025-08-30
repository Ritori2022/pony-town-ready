/// <reference path="../../typings/my.d.ts" />

import { readFileAsync, readFileSync } from 'fs';
import { setup } from '../client/canvasUtils';

// 🌍 跨平台Canvas支持
// 自动检测环境并选择最佳Canvas实现
let canvasImpl: any;
let ImageImpl: any;

try {
	// 尝试加载原生Canvas库 (适用于Linux/Windows)
	const nativeCanvas = require('canvas');
	canvasImpl = nativeCanvas.createCanvas;
	ImageImpl = nativeCanvas.Image;
	console.log('🎨 使用原生Canvas库 (最佳性能)');
} catch (error) {
	// 如果原生Canvas不可用，使用模拟实现 (兼容ARM64 Mac等)
	console.log('🎭 原生Canvas不可用，使用模拟实现');
	console.log('   原因:', error.message.split('\n')[0]);
	
	const mockCanvas = require('../../../canvas-mock');
	canvasImpl = mockCanvas.createCanvas;
	ImageImpl = mockCanvas.Image;
	console.log('✅ Canvas模拟已激活 (兼容性模式)');
}

export const createCanvas = canvasImpl;

export async function loadImage(src: string) {
	const buffer = await readFileAsync(src);
	const image = new ImageImpl();
	image.src = buffer;
	return image;
}

export function loadImageSync(src: string) {
	const image = new ImageImpl();
	image.src = readFileSync(src);
	return image;
}

// 初始化Canvas工具
setup({ createCanvas: canvasImpl, loadImage });
