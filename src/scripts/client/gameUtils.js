"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
function addNotification(_a, notification) {
    var notifications = _a.notifications;
    var open = notifications.length === 0;
    notifications.push(notification);
    setTimeout(function () {
        notification.open = open;
        notification.fresh = false;
    }, 500);
}
exports.addNotification = addNotification;
function removeNotification(_a, id) {
    var notifications = _a.notifications;
    var notification = utils_1.removeById(notifications, id);
    if (notification && notification.open && notifications.length) {
        notifications[0].open = true;
    }
}
exports.removeNotification = removeNotification;
function resetGameFields(game) {
    game.loaded = false;
    game.placeInQueue = 0;
    game.playerId = undefined;
    game.playerName = undefined;
    game.playerInfo = undefined;
    game.playerCRC = undefined;
    game.party = undefined;
    game.whisperTo = undefined;
    game.messageQueue = [];
    game.lastWhisperFrom = undefined;
    game.onPartyUpdate.next();
    game.fallbackPonies.clear();
}
exports.resetGameFields = resetGameFields;
function markGameAsLoaded(game) {
    if (!game.loaded) {
        game.loaded = true;
        game.fullyLoaded = false;
        setTimeout(function () { return game.fullyLoaded = true; }, 300);
    }
}
exports.markGameAsLoaded = markGameAsLoaded;
function isSelected(game, id) {
    return game.selected && game.selected.id === id;
}
exports.isSelected = isSelected;
