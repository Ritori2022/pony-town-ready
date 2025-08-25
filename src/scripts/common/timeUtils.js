"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
var colors_1 = require("./colors");
var constants_1 = require("./constants");
var DAY_START = 4.75; // 04:45
var DAY_END = 20.25; // 20:15
var SUN_EASE = 1.5; // 01:30
var SUN_HALF = SUN_EASE / 2;
var SUN_GAP = SUN_EASE / 4;
exports.HOUR_LENGTH = 2 * constants_1.MINUTE; // 48 min -> 24 hours
exports.DAY_LENGTH = exports.HOUR_LENGTH * 24;
var getTimeOfDay = function (time) { return time % exports.DAY_LENGTH; };
var getHourOfDay = function (timeOfDay) { return timeOfDay * 24 / exports.DAY_LENGTH; };
function getHour(time) {
    var timeOfDay = getTimeOfDay(time);
    var hourOfDay = getHourOfDay(timeOfDay);
    return hourOfDay;
}
exports.getHour = getHour;
function formatHourMinutes(time) {
    var timeOfDay = getTimeOfDay(time);
    var minutesInDay = 60 * 24;
    var totalMinutes = Math.floor(timeOfDay * minutesInDay / exports.DAY_LENGTH);
    var minutes = totalMinutes % 60;
    var hours = Math.floor(totalMinutes / 60);
    return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');
}
exports.formatHourMinutes = formatHourMinutes;
var isHour = function (test) { return function (time) {
    return test(getHour(time));
}; };
exports.isDay = isHour(function (hour) { return hour > DAY_START && hour <= DAY_END; });
exports.isNight = function (time) { return !exports.isDay(time); };
exports.isFullDay = isHour(function (hour) { return hour > (DAY_START + SUN_HALF) && hour <= (DAY_END - SUN_HALF); });
exports.isFullNight = isHour(function (hour) { return hour < (DAY_START - SUN_HALF) || hour >= (DAY_END + SUN_HALF); });
exports.isSunRaising = isHour(function (hour) { return hour > (DAY_START - SUN_HALF) && hour <= (DAY_START + SUN_HALF); });
exports.isSunSetting = isHour(function (hour) { return hour > (DAY_END - SUN_HALF) && hour <= (DAY_END + SUN_HALF); });
exports.isDayTime = isHour(function (hour) { return hour > DAY_START && hour < (DAY_END - SUN_HALF); });
exports.isNightTime = isHour(function (hour) { return hour < (DAY_START - SUN_HALF) || hour > DAY_END; });
function createLightData(season) {
    var lightDay = colors_1.WHITE;
    var lightNight = season === 4 /* Winter */ ? 0x253f76ff : 0x2b3374ff;
    var sunrise1 = 0x853d7dff;
    var sunrise2 = 0xc96161ff;
    var sunrise3 = 0xeeb7a0ff;
    var sunset1 = sunrise3;
    var sunset2 = sunrise2;
    var sunset3 = sunrise1;
    var shadowAlphaMultiplier = season === 4 /* Winter */ ? 0.7 : 1;
    var shadowDay = color_1.withAlphaFloat(colors_1.BLACK, 0.3 * shadowAlphaMultiplier);
    var shadowNight = color_1.withAlphaFloat(colors_1.BLACK, 0.2 * shadowAlphaMultiplier);
    var shadowSunset = color_1.withAlphaFloat(colors_1.BLACK, 0.25 * shadowAlphaMultiplier);
    var shadowSunrise = color_1.withAlphaFloat(colors_1.BLACK, 0.25 * shadowAlphaMultiplier);
    var lightPoints = [
        // night
        { time: 0, light: lightNight, shadow: shadowNight },
        // transition to day
        { time: DAY_START - SUN_HALF, light: lightNight, shadow: shadowNight },
        { time: DAY_START - SUN_HALF + SUN_GAP, light: sunrise1, shadow: shadowSunrise },
        { time: DAY_START - SUN_HALF + SUN_GAP * 2, light: sunrise2, shadow: shadowSunrise },
        { time: DAY_START - SUN_HALF + SUN_GAP * 3, light: sunrise3, shadow: shadowSunrise },
        { time: DAY_START + SUN_HALF, light: lightDay, shadow: shadowDay },
        // transition to night
        { time: DAY_END - SUN_HALF, light: lightDay, shadow: shadowDay },
        { time: DAY_END - SUN_HALF + SUN_GAP, light: sunset1, shadow: shadowSunset },
        { time: DAY_END - SUN_HALF + SUN_GAP * 2, light: sunset2, shadow: shadowSunset },
        { time: DAY_END - SUN_HALF + SUN_GAP * 3, light: sunset3, shadow: shadowSunset },
        { time: DAY_END + SUN_HALF, light: lightNight, shadow: shadowNight },
        // night
        { time: 24, light: lightNight, shadow: shadowNight },
    ];
    var lightColors = lightPoints.map(function (l) { return l.light; });
    var shadowColors = lightPoints.map(function (l) { return l.shadow; });
    var lightStops = lightPoints.map(function (l) { return l.time; });
    return { lightColors: lightColors, shadowColors: shadowColors, lightStops: lightStops };
}
exports.createLightData = createLightData;
function getLightColor(data, time) {
    return getColorForTime(time, data.lightStops, data.lightColors, colors_1.WHITE);
}
exports.getLightColor = getLightColor;
function getShadowColor(data, time) {
    return getColorForTime(time, data.lightStops, data.shadowColors, colors_1.SHADOW_COLOR);
}
exports.getShadowColor = getShadowColor;
function getColorForTime(time, stops, colors, defaultColor) {
    var timeOfDay = getTimeOfDay(time);
    var hourOfDay = getHourOfDay(timeOfDay);
    for (var i = 1; i < stops.length; i++) {
        if (stops[i] >= hourOfDay) {
            var from = stops[i - 1];
            var to = stops[i];
            var fromLight = colors[i - 1];
            var toLight = colors[i];
            return color_1.lerpColors(fromLight, toLight, (hourOfDay - from) / (to - from));
        }
    }
    return defaultColor;
}
