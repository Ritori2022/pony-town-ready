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
var accountUtils_1 = require("./accountUtils");
var colors_1 = require("./colors");
var placeholder = { id: '', tagClass: '', label: '' };
var tags = {
    'mod': __assign({}, placeholder, { name: 'moderator', className: 'mod', color: colors_1.MOD_COLOR }),
    'dev': __assign({}, placeholder, { name: 'developer', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'dev:art': __assign({}, placeholder, { name: 'dev artist', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'dev:music': __assign({}, placeholder, { name: 'dev musician', className: 'dev', color: colors_1.ADMIN_COLOR }),
    'sup1': __assign({}, placeholder, { name: 'supporter', className: 'sup1', color: colors_1.PATREON_COLOR }),
    'sup2': __assign({}, placeholder, { name: 'supporter', className: 'sup2', color: colors_1.WHITE }),
    'sup3': __assign({}, placeholder, { name: 'supporter', className: 'sup3', color: colors_1.WHITE }),
    'hidden': __assign({}, placeholder, { name: 'hidden', className: 'hidden', color: colors_1.ANNOUNCEMENT_COLOR }),
};
Object.keys(tags).forEach(function (id) {
    var tag = tags[id];
    tag.id = id;
    tag.label = "<" + tag.name.toUpperCase() + ">";
    tag.tagClass = "tag-" + tag.className;
});
exports.emptyTag = { id: '', name: 'no tag', label: '', className: '', tagClass: '', color: 0 };
function getAllTags() {
    return Object.keys(tags).map(function (key) { return tags[key]; });
}
exports.getAllTags = getAllTags;
function getTag(id) {
    return id ? tags[id] : undefined;
}
exports.getTag = getTag;
function getTagPalette(tag, palettes) {
    switch (tag.id) {
        case 'sup2': return palettes.supporter2;
        case 'sup3': return palettes.supporter3;
        default: return palettes.white;
    }
}
exports.getTagPalette = getTagPalette;
function canUseTag(account, tag) {
    if (tag === 'mod') {
        return accountUtils_1.hasRole(account, 'mod');
    }
    else if (tag === 'dev' || /^dev:/.test(tag)) {
        return accountUtils_1.hasRole(account, 'dev');
    }
    else {
        return false;
    }
}
exports.canUseTag = canUseTag;
function getAvailableTags(account) {
    return getAllTags().filter(function (tag) { return canUseTag(account, tag.id); });
}
exports.getAvailableTags = getAvailableTags;
