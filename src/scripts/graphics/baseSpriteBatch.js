"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../common/colors");
var color_1 = require("../common/color");
var baseStateBatch_1 = require("./baseStateBatch");
var glVao_1 = require("./webgl/glVao");
var vaoAttributes_1 = require("./webgl/vaoAttributes");
var timing_1 = require("../client/timing");
var mat2d_1 = require("../common/mat2d");
// const BATCH_BUFFER_SIZE = 2048; // 8kb
// const BATCH_BUFFER_POOL_SIZE = 5;
// const pool: ArrayBuffer[] = [];
// function aquireBuffer(size: number): Float32Array | undefined {
// 	if (size <= BATCH_BUFFER_SIZE) {
// 		if (!pool.length) console.log('alloc');
// 		const buffer = pool.pop() || new ArrayBuffer(BATCH_BUFFER_SIZE);
// 		return new Float32Array(buffer, 0, size);
// 	} else {
// 		DEVELOPMENT && console.warn(`Failed to aquire buffer of size: ${size}`);
// 		return undefined;
// 	}
// }
// function releaseBuffer(buffer: Float32Array) {
// 	if (pool.length < BATCH_BUFFER_POOL_SIZE) {
// 		pool.push(buffer.buffer);
// 	} else {
// 		console.log('delete');
// 	}
// }
var WHITE_FLOAT = color_1.colorToFloat(colors_1.WHITE);
function getColorFloat(color, alpha) {
    return (color === colors_1.WHITE && alpha === 1) ? WHITE_FLOAT : color_1.colorToFloatAlpha(color, alpha);
}
exports.getColorFloat = getColorFloat;
var BaseSpriteBatch = /** @class */ (function (_super) {
    __extends(BaseSpriteBatch, _super);
    function BaseSpriteBatch(gl, capacity, buffer, vertexBuffer, indexBuffer, attributes) {
        var _this = _super.call(this) || this;
        _this.gl = gl;
        _this.capacity = capacity;
        _this.attributes = attributes;
        _this.tris = 0;
        _this.flushes = 0;
        _this.index = 0;
        _this.spritesCount = 0;
        _this.vao = undefined;
        _this.rectSprite = undefined;
        _this.vertexBuffer = undefined;
        _this.indexBuffer = undefined;
        _this.spriteSheet = undefined;
        _this.batching = false;
        _this.startBatchIndex = 0;
        _this.startBatchSprites = 0;
        _this.floatsPerSprite = vaoAttributes_1.getVAOAttributesSize(gl, attributes);
        _this.vertices = new Float32Array(buffer, 0, capacity * _this.floatsPerSprite);
        _this.verticesUint32 = new Uint32Array(buffer, 0, capacity * _this.floatsPerSprite);
        _this.vertexBuffer = vertexBuffer;
        _this.indexBuffer = indexBuffer;
        _this.vao = glVao_1.createVAO(gl, vaoAttributes_1.createVAOAttributes(gl, attributes, vertexBuffer), indexBuffer);
        return _this;
    }
    BaseSpriteBatch.prototype.dispose = function () {
        disposeBuffers(this.gl, this);
    };
    BaseSpriteBatch.prototype.begin = function () {
        if (!this.vao) {
            throw new Error('Disposed');
        }
        this.batching = false;
        this.vao.bind();
    };
    BaseSpriteBatch.prototype.end = function () {
        if (!this.vao) {
            throw new Error('Disposed');
        }
        this.flush();
        this.vao.unbind();
    };
    BaseSpriteBatch.prototype.drawBatch = function (batch) {
        if (DEVELOPMENT && !mat2d_1.isIdentity(this.transform)) {
            throw new Error('Cannot transform batch');
        }
        var batchSpriteCount = (batch.length / this.floatsPerSprite) | 0;
        if (this.capacity < (this.spritesCount + batchSpriteCount)) {
            this.flush();
        }
        this.vertices.set(batch, this.index);
        this.index += batch.length;
        this.spritesCount += batchSpriteCount;
        this.tris += batchSpriteCount * 2;
    };
    BaseSpriteBatch.prototype.startBatch = function () {
        if (this.batching) {
            throw new Error('Cannot start new batch');
        }
        this.startBatchIndex = this.index;
        this.startBatchSprites = this.spritesCount;
        this.batching = true;
    };
    BaseSpriteBatch.prototype.finishBatch = function () {
        if (!this.batching) {
            throw new Error('Cannot finish batch');
        }
        this.batching = false;
        try {
            // const batch = aquireBuffer(this.index - this.startBatchIndex);
            // if (batch) {
            // 	batch.set(this.vertices.subarray(this.startBatchIndex, this.index));
            // }
            // return batch;
            return this.vertices.slice(this.startBatchIndex, this.index);
        }
        catch (_a) {
            return undefined;
        }
    };
    BaseSpriteBatch.prototype.releaseBatch = function (_batch) {
        // releaseBuffer(batch);
    };
    BaseSpriteBatch.prototype.flush = function () {
        if (this.index === 0)
            return;
        if (!this.vao || !this.vertexBuffer) {
            throw new Error('Disposed');
        }
        var gl = this.gl;
        if (this.batching) {
            TIMING && timing_1.timeStart('bufferSubData');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.startBatchIndex));
            TIMING && timing_1.timeEnd();
            TIMING && timing_1.timeStart('vao.draw');
            this.vao.draw(this.gl.TRIANGLES, this.startBatchSprites * 6, 0);
            TIMING && timing_1.timeEnd();
            this.spritesCount -= this.startBatchSprites;
            this.index -= this.startBatchIndex;
            this.vertices.copyWithin(0, this.startBatchIndex, this.startBatchIndex + this.index);
            this.startBatchIndex = 0;
            this.startBatchSprites = 0;
        }
        else {
            TIMING && timing_1.timeStart('bufferSubData');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.index));
            TIMING && timing_1.timeEnd();
            TIMING && timing_1.timeStart('vao.draw');
            this.vao.draw(this.gl.TRIANGLES, this.spritesCount * 6, 0);
            TIMING && timing_1.timeEnd();
            this.spritesCount = 0;
            this.index = 0;
        }
        this.flushes++;
    };
    return BaseSpriteBatch;
}(baseStateBatch_1.BaseStateBatch));
exports.BaseSpriteBatch = BaseSpriteBatch;
function disposeBuffers(gl, batch) {
    try {
        if (batch.vao) {
            batch.vao.dispose();
        }
        if (batch.vertexBuffer) {
            gl.deleteBuffer(batch.vertexBuffer);
        }
        if (batch.indexBuffer) {
            gl.deleteBuffer(batch.indexBuffer);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    batch.vao = undefined;
    batch.vertexBuffer = undefined;
    batch.indexBuffer = undefined;
}
