"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
function updateParty(current, info) {
    if (!info || !info.length) {
        return undefined;
    }
    else {
        var party_1 = current || {
            leaderId: 0,
            members: [],
        };
        lodash_1.remove(party_1.members, function (p) { return !info.some(function (m) { return p.id === m.id; }); });
        info.forEach(function (m) {
            var existing = party_1.members.find(function (x) { return m.id === x.id; });
            if (existing) {
                Object.assign(existing, m);
            }
            else {
                party_1.members.push(m);
            }
            if (m.leader) {
                party_1.leaderId = m.id;
            }
        });
        return party_1;
    }
}
exports.updateParty = updateParty;
function isPonyInParty(party, pony, pending) {
    return !!party && party.members.some(function (m) { return m.pony === pony && (pending || !m.pending); });
}
exports.isPonyInParty = isPonyInParty;
function isPartyLeader(game) {
    return game.party !== undefined && game.player !== undefined && game.player.id === game.party.leaderId;
}
exports.isPartyLeader = isPartyLeader;
function isInParty(game) {
    return game.party !== undefined && game.party.members.length > 0;
}
exports.isInParty = isInParty;
