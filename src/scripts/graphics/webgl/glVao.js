"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timing_1 = require("../../client/timing");
function extensionShim(gl) {
    return {
        bindVertexArrayOES: gl.bindVertexArray.bind(gl),
        createVertexArrayOES: gl.createVertexArray.bind(gl),
        deleteVertexArrayOES: gl.deleteVertexArray.bind(gl),
    };
}
function createVAO(gl, attributes, elements, elementsType) {
    var ext = gl.createVertexArray ? extensionShim(gl) : gl.getExtension('OES_vertex_array_object');
    var handle = ext && ext.createVertexArrayOES();
    var vao = (ext && handle) ? new VAONative(gl, ext, handle) : new VAOEmulated(gl);
    vao.update(attributes, elements, elementsType);
    return vao;
}
exports.createVAO = createVAO;
var VAONative = /** @class */ (function () {
    function VAONative(gl, ext, handle) {
        this.gl = gl;
        this.ext = ext;
        this.handle = handle;
        this.useElements = false;
        this.elementsType = gl.UNSIGNED_SHORT;
        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    }
    VAONative.prototype.bind = function () {
        this.ext.bindVertexArrayOES(this.handle);
    };
    VAONative.prototype.unbind = function () {
        this.ext.bindVertexArrayOES(null);
    };
    VAONative.prototype.dispose = function () {
        this.ext.deleteVertexArrayOES(this.handle);
    };
    VAONative.prototype.update = function (attributes, elements, elementsType) {
        this.bind();
        bindAttribs(this.gl, elements, attributes, this.maxAttribs);
        this.unbind();
        this.useElements = !!elements;
        this.elementsType = elementsType || this.gl.UNSIGNED_SHORT;
    };
    VAONative.prototype.draw = function (mode, count, offset) {
        if (offset === void 0) { offset = 0; }
        TIMING && timing_1.timeStart('VAONative.draw');
        if (this.useElements) {
            this.gl.drawElements(mode, count, this.elementsType, offset);
        }
        else {
            this.gl.drawArrays(mode, offset, count);
        }
        TIMING && timing_1.timeEnd();
    };
    return VAONative;
}());
var VAOEmulated = /** @class */ (function () {
    function VAOEmulated(gl) {
        this.gl = gl;
        this.elements = null;
        this.attributes = null;
        this.elementsType = gl.UNSIGNED_SHORT;
        this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    }
    VAOEmulated.prototype.bind = function () {
        bindAttribs(this.gl, this.elements, this.attributes, this.maxAttribs);
    };
    VAOEmulated.prototype.update = function (attributes, elements, elementsType) {
        this.elements = elements;
        this.attributes = attributes;
        this.elementsType = elementsType || this.gl.UNSIGNED_SHORT;
    };
    VAOEmulated.prototype.dispose = function () {
    };
    VAOEmulated.prototype.unbind = function () {
    };
    VAOEmulated.prototype.draw = function (mode, count, offset) {
        if (offset === void 0) { offset = 0; }
        TIMING && timing_1.timeStart('VAOEmulated.draw');
        if (this.elements) {
            this.gl.drawElements(mode, count, this.elementsType, offset);
        }
        else {
            this.gl.drawArrays(mode, offset, count);
        }
        TIMING && timing_1.timeEnd();
    };
    return VAOEmulated;
}());
function bindAttribs(gl, elements, attributes, maxAttribs) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
    if (attributes) {
        if (maxAttribs != null && attributes.length > maxAttribs) {
            throw new Error("Too many vertex attributes " + attributes.length + "/" + maxAttribs);
        }
        var i = 0;
        for (; i < attributes.length; ++i) {
            var attrib = attributes[i];
            var buffer = attrib.buffer;
            var size = attrib.size || 4;
            var type = attrib.type || gl.FLOAT;
            var normalized = !!attrib.normalized;
            var stride = attrib.stride || 0;
            var offset = attrib.offset || 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(i);
            gl.vertexAttribPointer(i, size, type, normalized, stride, offset);
            if (attrib.divisor !== undefined) {
                gl.vertexAttribDivisor(i, attrib.divisor);
            }
        }
        for (; i < maxAttribs; ++i) {
            gl.disableVertexAttribArray(i);
        }
    }
    else {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (var i = 0; i < maxAttribs; ++i) {
            gl.disableVertexAttribArray(i);
        }
    }
}
