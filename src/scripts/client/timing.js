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
var ENABLED = false;
var ENTRIES_LIMIT = 8000;
var entries = [];
var entriesCount = 0;
if (TIMING && ENABLED) {
    for (var i = 0; i < ENTRIES_LIMIT; i++) {
        entries.push({ time: 0, name: undefined });
    }
}
function timeStart(name) {
    if (TIMING && ENABLED) {
        if (entriesCount < ENTRIES_LIMIT) {
            var entry = entries[entriesCount];
            entry.time = performance.now();
            entry.name = name;
            entriesCount++;
        }
        else {
            console.warn("exceeded timing entry limit");
        }
    }
}
exports.timeStart = timeStart;
function timeEnd() {
    if (TIMING && ENABLED) {
        if (entriesCount < ENTRIES_LIMIT) {
            var entry = entries[entriesCount];
            entry.time = performance.now();
            entry.name = undefined;
            entriesCount++;
        }
        else {
            console.warn("exceeded timing entry limit");
        }
    }
}
exports.timeEnd = timeEnd;
function timeReset() {
    if (TIMING && ENABLED) {
        entriesCount = 0;
    }
}
exports.timeReset = timeReset;
function timingCollate() {
    if (TIMING && ENABLED && entriesCount > 0) {
        var listings = [];
        var startStack = [];
        var _loop_1 = function (i) {
            var entry = entries[i];
            if (entry.name !== undefined) {
                startStack.push(__assign({}, entry, { excludedTime: 0 }));
            }
            else {
                var start = startStack.pop();
                var name_1 = start.name;
                var time = entry.time - start.time;
                var listing = listings.find(function (l) { return l.name === name_1; });
                if (!listing) {
                    listing = { name: name_1, selfTime: 0, totalTime: 0, selfPercent: 0, totalPercent: 0, count: 0 };
                    listings.push(listing);
                }
                listing.count++;
                listing.selfTime += (time - start.excludedTime);
                listing.totalTime += time;
                if (startStack.length) {
                    startStack[startStack.length - 1].excludedTime += time;
                }
            }
        };
        for (var i = 0; i < entriesCount; i++) {
            _loop_1(i);
        }
        var firstTime = entries[0].time;
        var lastTime = entries[entriesCount - 1].time;
        var totalTime = lastTime - firstTime;
        for (var _i = 0, listings_1 = listings; _i < listings_1.length; _i++) {
            var listing = listings_1[_i];
            listing.selfPercent = 100 * listing.selfTime / totalTime;
            listing.totalPercent = 100 * listing.totalTime / totalTime;
        }
        return listings.sort(function (a, b) { return b.selfTime - a.selfTime; });
    }
    return [];
}
exports.timingCollate = timingCollate;
