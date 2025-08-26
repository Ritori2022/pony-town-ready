"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var errors_1 = require("./errors");
// enum
function invalidEnum(value) {
    if (DEVELOPMENT) {
        throw new Error("Invalid enum value: " + value);
    }
}
exports.invalidEnum = invalidEnum;
function invalidEnumReturn(value, ret) {
    if (DEVELOPMENT && !TESTS) {
        throw new Error("Invalid enum value: " + value);
    }
    return ret;
}
exports.invalidEnumReturn = invalidEnumReturn;
// date
function fromDate(date, duration) {
    date.setTime(date.getTime() + duration);
    return date;
}
exports.fromDate = fromDate;
function fromNow(duration) {
    return fromDate(new Date(), duration);
}
exports.fromNow = fromNow;
function compareDates(a, b) {
    return a ? (b ? a.getTime() - b.getTime() : 1) : (b ? -1 : 0);
}
exports.compareDates = compareDates;
function maxDate(a, b) {
    return (compareDates(a, b) > 0 ? a : b) || a || b;
}
exports.maxDate = maxDate;
function minDate(a, b) {
    return (compareDates(a, b) < 0 ? a : b) || a || b;
}
exports.minDate = minDate;
function formatDuration(duration) {
    var s = Math.floor(duration / constants_1.SECOND) % 60;
    var m = Math.floor(duration / constants_1.MINUTE) % 60;
    var h = Math.floor(duration / constants_1.HOUR) % 24;
    var d = Math.floor(duration / constants_1.DAY);
    if (d > 0) {
        return h ? d + "d " + h + "h" : d + "d";
    }
    else if (h > 0) {
        return m ? h + "h " + m + "m" : h + "h";
    }
    else if (m > 0) {
        return s ? m + "m " + s + "s" : m + "m";
    }
    else {
        return s + "s";
    }
}
exports.formatDuration = formatDuration;
function formatISODate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year.toString().padStart(4, '0') + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
}
exports.formatISODate = formatISODate;
function parseISODate(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    var day = 0;
    var month = 0;
    var year = 0;
    if (match) {
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
        day = parseInt(match[3], 10);
    }
    return { day: day, month: month, year: year };
}
exports.parseISODate = parseISODate;
function createValidBirthDate(day, month, year) {
    var date = new Date(0);
    var currentYear = (new Date()).getFullYear();
    date.setFullYear(year, month - 1, day);
    if (date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day &&
        year >= (currentYear - 120) && year < currentYear) {
        return date;
    }
    else {
        return undefined;
    }
}
exports.createValidBirthDate = createValidBirthDate;
// color
function parseSpriteColor(str) {
    return str === '0' ? 0 : (str.length === 6 ? (((parseInt(str, 16) << 8) | 0xff) >>> 0) : (parseInt(str, 16) >>> 0));
}
exports.parseSpriteColor = parseSpriteColor;
// numbers
function clamp(value, min, max) {
    return value > min ? (value < max ? value : max) : min;
}
exports.clamp = clamp;
function lerp(a, b, t) {
    return a + t * (b - a);
}
exports.lerp = lerp;
function normalize(x, y) {
    var d = Math.sqrt(x * x + y * y);
    return { x: x / d, y: y / d };
}
exports.normalize = normalize;
function computeCRC(colors) {
    var crc = 0;
    for (var i = 0; i < colors.length; i++) {
        crc ^= colors[i];
        for (var j = 0; j < 8; j++) {
            crc = (crc & 1) ? ((crc >>> 1) ^ 0x82f63b78) : (crc >>> 1);
        }
    }
    return crc >>> 0;
}
exports.computeCRC = computeCRC;
function computeFriendsCRC(friends) {
    if (!friends.length) {
        return 0;
    }
    friends.sort();
    var data = new Uint32Array(friends.length * 3);
    for (var i = 0; i < friends.length; i++) {
        var id = friends[i];
        data[i * 3] = parseInt(id.substr(0, 8), 16);
        data[i * 3 + 1] = parseInt(id.substr(8, 8), 16);
        data[i * 3 + 2] = parseInt(id.substr(16, 8), 16);
    }
    return computeCRC(data);
}
exports.computeFriendsCRC = computeFriendsCRC;
function lerpColor(a, b, t) {
    a[0] = t * b[0] + (1 - t) * a[0];
    a[1] = t * b[1] + (1 - t) * a[1];
    a[2] = t * b[2] + (1 - t) * a[2];
    a[3] = t * b[3] + (1 - t) * a[3];
}
exports.lerpColor = lerpColor;
// common
function toInt(value) {
    return value | 0;
}
exports.toInt = toInt;
function dispose(obj) {
    obj && obj.dispose();
    return undefined;
}
exports.dispose = dispose;
function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.cloneDeep = cloneDeep;
// enums
function hasFlag(value, flag) {
    return (value & flag) === flag;
}
exports.hasFlag = hasFlag;
function setFlag(value, flag, on) {
    return (value & ~flag) | (on ? flag : 0);
}
exports.setFlag = setFlag;
function flagsToString(value, flags, none) {
    if (none === void 0) { none = 'None'; }
    return flags
        .filter(function (flag) { return hasFlag(value, flag.value); })
        .map(function (flag) { return flag.name; }).join(' | ') || none;
}
exports.flagsToString = flagsToString;
// collections
function includes(array, item) {
    return array !== undefined && array.indexOf(item) !== -1;
}
exports.includes = includes;
function array(size, defaultValue) {
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(defaultValue);
    }
    return result;
}
exports.array = array;
function repeat(count) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push.apply(result, values);
    }
    return result;
}
exports.repeat = repeat;
function times(count, action) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push(action(i));
    }
    return result;
}
exports.times = times;
function last(array) {
    return array.length > 0 ? array[array.length - 1] : undefined;
}
exports.last = last;
function flatten(arrays) {
    var _a;
    return (_a = []).concat.apply(_a, arrays);
}
exports.flatten = flatten;
function at(items, index) {
    return items[clamp(index | 0, 0, items.length - 1)];
}
exports.at = at;
function att(items, index) {
    return items ? items[clamp(index | 0, 0, items.length - 1)] : undefined;
}
exports.att = att;
function findById(items, id) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return items[i];
        }
    }
    return undefined;
}
exports.findById = findById;
function findIndexById(items, id) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) {
            return i;
        }
    }
    return -1;
}
exports.findIndexById = findIndexById;
function removeItem(items, item) {
    var index = items.indexOf(item);
    if (index !== -1) {
        items.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}
exports.removeItem = removeItem;
function removeItemFast(items, item) {
    var index = items.indexOf(item);
    if (index !== -1) {
        items[index] = items[items.length - 1];
        items.pop();
        return true;
    }
    else {
        return false;
    }
}
exports.removeItemFast = removeItemFast;
function removeById(items, id) {
    var index = findIndexById(items, id);
    if (index !== -1) {
        var item = items[index];
        items.splice(index, 1);
        return item;
    }
    else {
        return undefined;
    }
}
exports.removeById = removeById;
function arraysEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.arraysEqual = arraysEqual;
function pushUniq(array, item) {
    var index = array.indexOf(item);
    if (index === -1) {
        array.push(item);
        return array.length;
    }
    else {
        return index + 1;
    }
}
exports.pushUniq = pushUniq;
function createPlainMap(values) {
    return Object.keys(values).reduce(function (obj, key) { return (obj[key] = values[key], obj); }, Object.create(null));
}
exports.createPlainMap = createPlainMap;
// rects / points
function point(x, y) {
    return { x: x, y: y };
}
exports.point = point;
function contains(x, y, bounds, point) {
    var bx = bounds.x / constants_1.tileWidth + x;
    var by = bounds.y / constants_1.tileHeight + y;
    var bw = bounds.w / constants_1.tileWidth;
    var bh = bounds.h / constants_1.tileHeight;
    return point.x > bx && point.x < bx + bw && point.y > by && point.y < by + bh;
}
exports.contains = contains;
function containsPoint(dx, dy, rect, px, py) {
    return pointInXYWH(px, py, rect.x + dx, rect.y + dy, rect.w, rect.h);
}
exports.containsPoint = containsPoint;
function containsPointWitBorder(dx, dy, rect, px, py, border) {
    return pointInXYWH(px, py, rect.x + dx - border, rect.y + dy - border, rect.w + border * 2, rect.h + border * 2);
}
exports.containsPointWitBorder = containsPointWitBorder;
function pointInRect(x, y, rect) {
    return x > rect.x && x < rect.x + rect.w && y > rect.y && y < rect.y + rect.h;
}
exports.pointInRect = pointInRect;
function pointInXYWH(px, py, rx, ry, rw, rh) {
    return px > rx && px < rx + rw && py > ry && py < ry + rh;
}
exports.pointInXYWH = pointInXYWH;
function randomPoint(_a) {
    var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
    return {
        x: x + w * Math.random(),
        y: y + h * Math.random(),
    };
}
exports.randomPoint = randomPoint;
function lengthOfXY(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}
exports.lengthOfXY = lengthOfXY;
function distanceXY(ax, ay, bx, by) {
    return lengthOfXY(ax - bx, ay - by);
}
exports.distanceXY = distanceXY;
function distanceSquaredXY(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}
exports.distanceSquaredXY = distanceSquaredXY;
function distance(a, b) {
    return distanceXY(a.x, a.y, b.x, b.y);
}
exports.distance = distance;
function entitiesIntersect(a, b) {
    var aBounds = a.bounds;
    var bBounds = b.bounds;
    if (!aBounds || !bBounds) {
        return false;
    }
    var ax = a.x * constants_1.tileWidth + aBounds.x;
    var ay = a.y * constants_1.tileHeight + aBounds.y;
    var bx = b.x * constants_1.tileWidth + bBounds.x;
    var by = b.y * constants_1.tileHeight + bBounds.y;
    return intersect(ax, ay, aBounds.w, aBounds.h, bx, by, bBounds.w, bBounds.h);
}
exports.entitiesIntersect = entitiesIntersect;
function collidersIntersect(ax, ay, a, bx, by, b) {
    var axmin = Math.floor((ax + a.x) * constants_1.tileWidth) | 0;
    var axmax = Math.ceil((ax + a.x + a.w) * constants_1.tileWidth) | 0;
    var aymin = Math.floor((ay + a.y) * constants_1.tileHeight) | 0;
    var aymax = Math.ceil((ay + a.y + a.h) * constants_1.tileHeight) | 0;
    var bxmin = Math.floor((bx + b.x) * constants_1.tileWidth) | 0;
    var bxmax = Math.ceil((bx + b.x + b.w) * constants_1.tileWidth) | 0;
    var bymin = Math.floor((by + b.y) * constants_1.tileHeight) | 0;
    var bymax = Math.ceil((by + b.y + b.h) * constants_1.tileHeight) | 0;
    return axmin < bxmax && axmax > bxmin && aymin < bymax && aymax > bymin;
}
exports.collidersIntersect = collidersIntersect;
function boundsIntersect(ax, ay, a, bx, by, b) {
    return !!(a && b && intersect(ax * constants_1.tileWidth + a.x, ay * constants_1.tileHeight + a.y, a.w, a.h, bx * constants_1.tileWidth + b.x, by * constants_1.tileHeight + b.y, b.w, b.h));
}
exports.boundsIntersect = boundsIntersect;
function intersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax <= (bx + bw) && (ax + aw) >= bx && ay <= (by + bh) && (ay + ah) >= by;
}
exports.intersect = intersect;
function createError(status, data) {
    if (status > 500 && status < 600) {
        return new Error(errors_1.PROTECTION_ERROR);
        // } else if (status === 400) {
        // 	return new Error('Bad Request');
    }
    else if (status === 403) {
        return new Error(errors_1.ACCESS_ERROR);
    }
    else if (status === 404) {
        return new Error(errors_1.NOT_FOUND_ERROR);
    }
    else if (typeof data === 'string') {
        return new Error(data || errors_1.OFFLINE_ERROR);
    }
    else {
        return new Error((data && data.error) || errors_1.OFFLINE_ERROR);
    }
}
exports.createError = createError;
function delay(timeout) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeout); });
}
exports.delay = delay;
function observableToPromise(observable) {
    return observable.toPromise()
        .catch(function (_a) {
        var status = _a.status, error = _a.error;
        var text = error && error.text;
        try {
            error = JSON.parse(error);
        }
        catch (_b) { }
        var e = createError(status || 0, error);
        e.status = status;
        e.text = text;
        throw e;
    });
}
exports.observableToPromise = observableToPromise;
// other
function setTransformDefault(element, transform) {
    if (element) {
        element.style.transform = transform;
    }
}
function setTransformSafari(element, transform) {
    if (element) {
        element.style.webkitTransform = transform;
    }
}
exports.setTransform = (typeof document !== 'undefined' && 'transform' in document.body.style) ?
    setTransformDefault : setTransformSafari;
var ObjectCache = /** @class */ (function () {
    function ObjectCache(limit, ctor) {
        this.limit = limit;
        this.ctor = ctor;
        this.cache = [];
    }
    ObjectCache.prototype.get = function () {
        return this.cache.pop() || this.ctor();
    };
    ObjectCache.prototype.put = function (item) {
        if (this.cache.length < this.limit) {
            this.cache.push(item);
        }
    };
    return ObjectCache;
}());
exports.ObjectCache = ObjectCache;
function bitmask(data, key) {
    if (key) {
        for (var i = 0; i < data.length; i++) {
            data[i] = data[i] ^ key;
        }
    }
    return data;
}
exports.bitmask = bitmask;
function isCommand(text) {
    return /^\//.test(text);
}
exports.isCommand = isCommand;
function processCommand(text) {
    text = text.substr(1);
    var space = text.indexOf(' ');
    var command = (space === -1 ? text : text.substr(0, space)).trim();
    var args = space === -1 ? '' : text.substr(space + 1).trim();
    return { command: command, args: args };
}
exports.processCommand = processCommand;
function isTouch(e) {
    return /^touch/i.test(e.type);
}
exports.isTouch = isTouch;
function getButton(e) {
    return ('button' in e) ? (e.button || 0) : 0;
}
exports.getButton = getButton;
function getX(e) {
    return ('touches' in e && e.touches.length > 0) ? e.touches[0].pageX : e.pageX;
}
exports.getX = getX;
function getY(e) {
    return ('touches' in e && e.touches.length > 0) ? e.touches[0].pageY : e.pageY;
}
exports.getY = getY;
function isKeyEventInvalid(e) {
    return e.target && /^(input|textarea|select)$/i.test(e.target.tagName);
}
exports.isKeyEventInvalid = isKeyEventInvalid;
