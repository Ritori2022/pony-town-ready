"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var collision_1 = require("../common/collision");
var constants_1 = require("../common/constants");
var currentPlayer;
var setX = 0;
var setY = 0;
function setupPlayer(game, player) {
    var pony = player;
    pony.flags = utils_1.setFlag(pony.flags, 256 /* Interactive */, false);
    if (collision_1.isStaticCollision(player, game.map, false)) {
        collision_1.fixCollision(player, game.map);
    }
    game.setPlayer(pony);
    currentPlayer = player;
    savePlayerPosition();
}
exports.setupPlayer = setupPlayer;
function savePlayerPosition() {
    if (currentPlayer) {
        setX = currentPlayer.x;
        setY = currentPlayer.y;
    }
}
exports.savePlayerPosition = savePlayerPosition;
function restorePlayerPosition() {
    if (currentPlayer) {
        if (currentPlayer.x !== setX || currentPlayer.y !== setY) {
            currentPlayer.x = setX;
            currentPlayer.y = setY;
            DEVELOPMENT && console.warn('Restoring player position');
        }
    }
}
exports.restorePlayerPosition = restorePlayerPosition;
// Account creation lock
exports.setAclCookie = function (acl) {
    document.cookie = "acl=" + acl + "; expires=" + utils_1.fromNow(constants_1.WEEK).toUTCString() + "; path=/";
};
