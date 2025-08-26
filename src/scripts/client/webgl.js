"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shaders_1 = require("../generated/shaders");
var frameBuffer_1 = require("../graphics/webgl/frameBuffer");
var shader_1 = require("../graphics/webgl/shader");
var paletteSpriteBatch_1 = require("../graphics/paletteSpriteBatch");
var webglUtils_1 = require("../graphics/webgl/webglUtils");
var graphicsUtils_1 = require("../graphics/graphicsUtils");
var spriteSheetUtils_1 = require("../graphics/spriteSheetUtils");
var sprites = require("../generated/sprites");
var spriteBatch_1 = require("../graphics/spriteBatch");
var constants_1 = require("../common/constants");
var spriteShaderSource = shaders_1.spriteShader;
var paletteShaderSource = shaders_1.paletteLayersShader;
var lightShaderSource = shaders_1.lightShader;
function createIndices(capacity) {
    var numIndices = (capacity * 6) | 0;
    var indices = new Uint16Array(numIndices);
    for (var i = 0, j = 0; i < numIndices; j = (j + 4) | 0) {
        indices[i++] = (j + 0) | 0;
        indices[i++] = (j + 1) | 0;
        indices[i++] = (j + 2) | 0;
        indices[i++] = (j + 0) | 0;
        indices[i++] = (j + 2) | 0;
        indices[i++] = (j + 3) | 0;
    }
    return indices;
}
function initWebGL(canvas, paletteManager, camera) {
    var gl = webglUtils_1.getWebGLContext(canvas);
    return initWebGLResources(gl, paletteManager, camera);
}
exports.initWebGL = initWebGL;
function initWebGLResources(gl, paletteManager, camera) {
    var renderer = '';
    var failedFBO = false;
    var frameBuffer;
    var frameBufferSheet = { texture: undefined, sprites: [], palette: false };
    try {
        var size = webglUtils_1.getRenderTargetSize(camera.w, camera.h);
        frameBuffer = frameBuffer_1.createFrameBuffer(gl, size, size);
        frameBufferSheet.texture = frameBuffer.texture;
    }
    catch (e) {
        DEVELOPMENT && console.warn(e);
        failedFBO = true;
    }
    spriteSheetUtils_1.createTexturesForSpriteSheets(gl, sprites.spriteSheets);
    var palettes = graphicsUtils_1.createCommonPalettes(paletteManager);
    var paletteShader = shader_1.createShader(gl, paletteShaderSource);
    var spriteShader = shader_1.createShader(gl, spriteShaderSource);
    var lightShader = shader_1.createShader(gl, lightShaderSource);
    var VERTICES_PER_SPRITE = 4;
    var buffer = new ArrayBuffer(constants_1.BATCH_SIZE_MAX * VERTICES_PER_SPRITE * paletteSpriteBatch_1.PALETTE_BATCH_BYTES_PER_VERTEX);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        throw new Error("Failed to allocate vertex buffer");
    }
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        throw new Error("Failed to allocate index buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, createIndices(constants_1.BATCH_SIZE_MAX), gl.STATIC_DRAW);
    var vertexBuffer2 = gl.createBuffer();
    if (!vertexBuffer2) {
        throw new Error("Failed to allocate vertex buffer (2)");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
    var spriteBatch = new spriteBatch_1.SpriteBatch(gl, constants_1.BATCH_SIZE_MAX, buffer, vertexBuffer2, indexBuffer);
    var paletteBatch = new paletteSpriteBatch_1.PaletteSpriteBatch(gl, constants_1.BATCH_SIZE_MAX, buffer, vertexBuffer, indexBuffer);
    spriteBatch.rectSprite = sprites.pixel;
    paletteBatch.rectSprite = sprites.pixel2;
    paletteBatch.defaultPalette = palettes.defaultPalette;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    paletteManager.init(gl);
    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    return {
        gl: gl, paletteShader: paletteShader, spriteShader: spriteShader, lightShader: lightShader, spriteBatch: spriteBatch, paletteBatch: paletteBatch,
        frameBuffer: frameBuffer, frameBufferSheet: frameBufferSheet, palettes: palettes, failedFBO: failedFBO, renderer: renderer,
    };
}
exports.initWebGLResources = initWebGLResources;
function disposeWebGL(webgl) {
    var gl = webgl.gl;
    webglUtils_1.unbindAllTexturesAndBuffers(gl);
    spriteSheetUtils_1.disposeTexturesForSpriteSheets(gl, sprites.spriteSheets);
    frameBuffer_1.disposeFrameBuffer(gl, webgl.frameBuffer);
    shader_1.disposeShader(gl, webgl.lightShader);
    shader_1.disposeShader(gl, webgl.spriteShader);
    shader_1.disposeShader(gl, webgl.paletteShader);
    webgl.spriteBatch.dispose();
    webgl.paletteBatch.dispose();
}
exports.disposeWebGL = disposeWebGL;
