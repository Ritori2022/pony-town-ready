"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createShader(gl, source) {
    if (typeof source === 'string') {
        var index = source.indexOf('// FRAGMENT');
        if (index === -1) {
            throw new Error("Missing fragment shader separator");
        }
        source = {
            vertex: source.substring(0, index),
            fragment: source.substring(index),
        };
    }
    var vertexShader = createWebGLShader(gl, gl.VERTEX_SHADER, source.vertex);
    var fragmentShader = createWebGLShader(gl, gl.FRAGMENT_SHADER, source.fragment);
    var program = gl.createProgram();
    if (!program) {
        throw new Error('Failed to create shader program');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    var attribs = source.vertex.match(/^attribute [a-zA-Z0-9_]+ ([a-zA-Z0-9_]+)/mg);
    for (var i = 0; i < attribs.length; ++i) {
        var _a = /attribute [a-zA-Z0-9_]+ ([a-zA-Z0-9_]+)/.exec(attribs[i]), name_1 = _a[1];
        gl.bindAttribLocation(program, i, name_1);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Failed to link shader program');
    }
    gl.useProgram(program);
    var uniforms = {};
    var samplers = [];
    for (var i_1 = 0; i_1 < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i_1++) {
        var info = gl.getActiveUniform(program, i_1);
        uniforms[info.name] = gl.getUniformLocation(program, info.name);
        if (!uniforms[info.name]) {
            throw new Error("Failed to get uniform location (" + info.name + ")");
        }
        if (info.type === gl.SAMPLER_2D) {
            samplers.push(info.name);
        }
    }
    samplers.sort().forEach(function (name, i) { return gl.uniform1i(uniforms[name], i); });
    gl.useProgram(null);
    return { program: program, vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms };
}
exports.createShader = createShader;
function disposeShader(gl, shader) {
    try {
        if (gl && shader) {
            gl.deleteProgram(shader.program);
            gl.deleteShader(shader.vertexShader);
            gl.deleteShader(shader.fragmentShader);
        }
    }
    catch (e) {
        DEVELOPMENT && console.error(e);
    }
    return undefined;
}
exports.disposeShader = disposeShader;
function createWebGLShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) {
        throw new Error('Failed to create shader');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader error');
    }
    return shader;
}
