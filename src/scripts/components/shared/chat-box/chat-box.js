"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var interfaces_1 = require("../../../common/interfaces");
var constants_1 = require("../../../common/constants");
var game_1 = require("../../../client/game");
var clientUtils_1 = require("../../../client/clientUtils");
var icons_1 = require("../../../client/icons");
var partyUtils_1 = require("../../../client/partyUtils");
var playerActions_1 = require("../../../client/playerActions");
var pony_1 = require("../../../common/pony");
var emoji_1 = require("../../../client/emoji");
var htmlUtils_1 = require("../../../client/htmlUtils");
var utils_1 = require("../../../common/utils");
var handlers_1 = require("../../../client/handlers");
var chatTypeNames = [];
var chatTypeClasses = [];
function setupChatType(type, name) {
    chatTypeNames[type] = name;
    chatTypeClasses[type] = "chat-" + name.replace(/ /, '-');
}
setupChatType(0 /* Say */, 'say');
setupChatType(1 /* Party */, 'party');
setupChatType(4 /* Supporter */, 'sup');
setupChatType(5 /* Supporter1 */, 'sup1');
setupChatType(6 /* Supporter2 */, 'sup2');
setupChatType(7 /* Supporter3 */, 'sup3');
setupChatType(9 /* Whisper */, 'whisper');
setupChatType(2 /* Think */, 'think');
setupChatType(3 /* PartyThink */, 'party think');
function isActionCommand(message) {
    return /^\/(yawn|sneeze|achoo|laugh|lol|haha|хаха|jaja)/i.test(message);
}
var ChatBox = /** @class */ (function () {
    function ChatBox(game, zone) {
        var _this = this;
        this.game = game;
        this.maxSayLength = constants_1.SAY_MAX_LENGTH;
        this.commentIcon = icons_1.faComment;
        this.sendIcon = icons_1.faAngleDoubleRight;
        this.isOpen = false;
        this.message = '';
        this.chatType = 0 /* Say */;
        this.pasted = false;
        this.lastMessages = [];
        this.state = {};
        this._disabled = false;
        this.currentTypeClass = '';
        this.currentTypePrefix = '';
        this.currentTypeName = '';
        this.subscriptions = [
            this.game.onChat.subscribe(function () { return zone.run(function () { return _this.chat(undefined); }); }),
            this.game.onToggleChat.subscribe(function () { return zone.run(function () { return _this.toggle(); }); }),
            this.game.onCommand.subscribe(function () { return zone.run(function () { return _this.command(); }); }),
            this.game.onLeft.subscribe(function () {
                _this.chatType = 0 /* Say */;
                _this.close();
            }),
        ];
        this.game.onCancel = function () { return _this.isOpen ? (zone.run(function () { return _this.close(); }), true) : false; };
    }
    Object.defineProperty(ChatBox.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = value;
            if (value) {
                this.close();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatBox.prototype, "input", {
        get: function () {
            return this.inputElement.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    ChatBox.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.chatBox && this.chatBox.nativeElement) {
            this.chatBox.nativeElement.hidden = true;
        }
        if (this.input) {
            this.input.addEventListener('paste', function () { return _this.pasted = true; });
        }
    };
    ChatBox.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    ChatBox.prototype.send = function (_event) {
        var chatType = this.chatType;
        var message = emoji_1.replaceEmojis(clientUtils_1.cleanMessage(this.message || '')).substr(0, constants_1.SAY_MAX_LENGTH);
        var handled = playerActions_1.handleActionCommand(message, this.game);
        var spam = this.pasted && chatType !== 1 /* Party */ && clientUtils_1.isSpamMessage(message, this.lastMessages);
        var empty = !this.game.player || !message;
        var ignoreAction = isActionCommand(message) && this.game.player && pony_1.hasHeadAnimation(this.game.player);
        var whisperTo = this.game.whisperTo;
        var entityId = whisperTo && whisperTo.id || 0;
        if (/^\/(w|whisper) .+$/i.test(message)) {
            chatType = 9 /* Whisper */;
            message = message.substr(/^\/w /i.test(message) ? 3 : 9);
            var offset = 0;
            var entity = undefined;
            do {
                offset = message.indexOf(' ', offset);
                if (offset === -1)
                    break;
                var name_1 = message.substr(0, offset);
                entity = handlers_1.findBestEntityByName(this.game, name_1);
                offset++;
            } while (!entity);
            if (entity) {
                message = message.substr(offset);
                entityId = entity.id;
            }
            else {
                entityId = 0;
            }
        }
        if (handled || spam || empty || ignoreAction || this.say(message, chatType, entityId)) {
            if (message) {
                this.lastMessages.push(message);
                while (this.lastMessages.length > 5) {
                    this.lastMessages.shift();
                }
            }
            this.close();
        }
    };
    ChatBox.prototype.keydown = function (e) {
        if (e.keyCode !== 9 /* TAB */ && e.keyCode !== 16 /* SHIFT */) {
            this.state.lastEmoji = undefined;
        }
        if (e.keyCode === 9 /* TAB */) {
            if (this.message) {
                if (/^\/(w|whisper) .+$/i.test(this.message)) {
                    var space = this.message.indexOf(' ');
                    var names = handlers_1.findMatchingEntityNames(this.game, this.message.substr(space + 1));
                    if (names.length === 1) {
                        this.message = this.message.substring(0, space) + " " + names[0];
                    }
                }
                else {
                    this.message = emoji_1.autocompleteMesssage(this.message, e.shiftKey, this.state);
                }
            }
            e.preventDefault();
        }
        else if (e.keyCode === 13 /* ENTER */ && this.isOpen) {
            this.send(e);
        }
        else if (e.keyCode === 27 /* ESCAPE */) {
            this.close();
            e.preventDefault();
        }
        else if (e.keyCode === 32 /* SPACE */) {
            if (!this.message)
                return;
            var isParty = /^\/(p|party)$/i.test(this.message);
            var isSay = /^\/(s|say)$/i.test(this.message);
            var isSup = /^\/(ss)$/i.test(this.message);
            var isSup1 = /^\/(s1)$/i.test(this.message);
            var isSup2 = /^\/(s2)$/i.test(this.message);
            var isSup3 = /^\/(s3)$/i.test(this.message);
            var supporter = this.game.model.supporter;
            var isSayOrInvalid = isSay
                || (isParty && !partyUtils_1.isInParty(this.game))
                || (isSup && supporter === 0)
                || (isSup1 && supporter < 1)
                || (isSup2 && supporter < 2)
                || (isSup3 && supporter < 3);
            if (isSayOrInvalid) {
                this.changeChatType(e, 0 /* Say */);
            }
            else if (isParty) {
                this.changeChatType(e, 1 /* Party */);
            }
            else if (isSup) {
                this.changeChatType(e, 4 /* Supporter */);
            }
            else if (isSup1) {
                this.changeChatType(e, 5 /* Supporter1 */);
            }
            else if (isSup2) {
                this.changeChatType(e, 6 /* Supporter2 */);
            }
            else if (isSup3) {
                this.changeChatType(e, 7 /* Supporter3 */);
            }
            else if (/^\/(t|think)$/i.test(this.message)) {
                if (interfaces_1.isPartyChat(this.chatType)) {
                    this.changeChatType(e, 3 /* PartyThink */);
                }
                else {
                    this.changeChatType(e, 2 /* Think */);
                }
            }
            else if (/^\/(r|reply)$/i.test(this.message)) {
                var lastWhisperFrom = this.game.lastWhisperFrom;
                var entity = lastWhisperFrom && handlers_1.findEntityOrMockByAnyMeans(this.game, lastWhisperFrom.entityId);
                if (entity) {
                    this.game.whisperTo = entity;
                    this.changeChatType(e, 9 /* Whisper */);
                }
                else {
                    this.changeChatType(e, 0 /* Say */);
                }
            }
            else if (/^\/(w|whisper) .+$/i.test(this.message) && !e.shiftKey) {
                var name_2 = this.message.substr(/^\/w /i.test(this.message) ? 3 : 9);
                var entity = handlers_1.findBestEntityByName(this.game, name_2);
                if (entity) {
                    this.game.whisperTo = entity;
                    this.changeChatType(e, 9 /* Whisper */);
                }
            }
        }
    };
    ChatBox.prototype.say = function (message, chatType, entityId) {
        this.game.lastChatMessageType = chatType;
        return !!this.game.send(function (server) { return server.say(entityId, message, chatType); });
    };
    ChatBox.prototype.changeChatType = function (e, chatType) {
        this.chatType = chatType;
        this.message = '';
        this.updateChatType();
        e.preventDefault();
    };
    ChatBox.prototype.chat = function (event) {
        if (this.isOpen) {
            this.send(event);
        }
        else {
            this.open();
        }
    };
    ChatBox.prototype.command = function () {
        if (!this.isOpen) {
            this.chat(undefined);
            this.message = '/';
            this.input.selectionStart = this.input.selectionEnd = 10000;
        }
    };
    ChatBox.prototype.open = function () {
        if (!this.isOpen) {
            this.isOpen = true;
            this.chatBox.nativeElement.hidden = false;
        }
        this.chatType = isValidChatType(this.chatType, this.game) ? this.chatType : 0 /* Say */;
        this.updateChatType();
        this.input.focus();
    };
    ChatBox.prototype.close = function () {
        if (this.isOpen) {
            this.input.blur();
            this.isOpen = false;
            this.chatBox.nativeElement.hidden = true;
            this.message = '';
            this.pasted = false;
        }
    };
    ChatBox.prototype.toggle = function () {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    };
    ChatBox.prototype.toggleChatType = function () {
        var chatTypes = getChatTypes(this.game);
        this.chatType = chatTypes[(chatTypes.indexOf(this.chatType) + 1) % chatTypes.length];
        this.updateChatType();
        this.input.focus();
    };
    ChatBox.prototype.setChatType = function (type) {
        if (type === 'say') {
            this.chatType = 0 /* Say */;
            this.open();
        }
        else if (type === 'party' && partyUtils_1.isInParty(this.game)) {
            this.chatType = 1 /* Party */;
            this.open();
        }
        else if (type === 'whisper') {
            this.chatType = 9 /* Whisper */;
            this.open();
        }
    };
    ChatBox.prototype.updateChatType = function () {
        var typeName;
        var typePrefix;
        var changed = false;
        var typeClass = chatTypeClass(this.chatType, this.game.model.supporter);
        if (this.currentTypeClass !== typeClass) {
            this.currentTypeClass = typeClass;
            this.chatBoxInput.nativeElement.className = typeClass;
        }
        if (this.chatType === 9 /* Whisper */) {
            typePrefix = 'To ';
            typeName = this.game.whisperTo && this.game.whisperTo.name || 'unknown';
        }
        else {
            typePrefix = '';
            typeName = chatTypeNames[this.chatType];
        }
        if (this.currentTypePrefix !== typePrefix) {
            changed = true;
            this.currentTypePrefix = typePrefix;
            this.typePrefix.nativeElement.textContent = typePrefix;
        }
        if (this.currentTypeName !== typeName) {
            changed = true;
            this.currentTypeName = typeName;
            htmlUtils_1.replaceNodes(this.typeName.nativeElement, typeName);
        }
        if (changed) {
            var width = this.typeBox.nativeElement.getBoundingClientRect().width;
            var padding = 35 + 13 + Math.ceil(width);
            this.inputElement.nativeElement.style.paddingLeft = padding + "px";
        }
    };
    __decorate([
        core_1.ViewChild('inputElement', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "inputElement", void 0);
    __decorate([
        core_1.ViewChild('typeBox', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "typeBox", void 0);
    __decorate([
        core_1.ViewChild('typePrefix', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "typePrefix", void 0);
    __decorate([
        core_1.ViewChild('typeName', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "typeName", void 0);
    __decorate([
        core_1.ViewChild('chatBox', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "chatBox", void 0);
    __decorate([
        core_1.ViewChild('chatBoxInput', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatBox.prototype, "chatBoxInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ChatBox.prototype, "disabled", null);
    ChatBox = __decorate([
        core_1.Component({
            selector: 'chat-box',
            templateUrl: 'chat-box.pug',
            styleUrls: ['chat-box.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame, core_1.NgZone])
    ], ChatBox);
    return ChatBox;
}());
exports.ChatBox = ChatBox;
function chatTypeClass(chatType, supporter) {
    if (chatType === 4 /* Supporter */) {
        switch (supporter) {
            case 1: return 'chat-sup chat-sup1';
            case 2: return 'chat-sup chat-sup2';
            case 3: return 'chat-sup chat-sup3';
        }
    }
    return chatTypeClasses[chatType];
}
function isValidChatType(type, game) {
    var supporter = game.model.supporter;
    switch (type) {
        case 0 /* Say */:
        case 2 /* Think */:
        case 9 /* Whisper */:
            return true;
        case 1 /* Party */:
        case 3 /* PartyThink */:
            return partyUtils_1.isInParty(game);
        case 4 /* Supporter */:
            return supporter > 0;
        case 5 /* Supporter1 */:
            return supporter >= 1;
        case 6 /* Supporter2 */:
            return supporter >= 2;
        case 7 /* Supporter3 */:
            return supporter >= 3;
        case 8 /* Dismiss */:
            return false;
        default:
            return utils_1.invalidEnumReturn(type, false);
    }
}
function getChatTypes(game) {
    var chatTypes = [0 /* Say */];
    var supporter = game.model.supporter;
    if (partyUtils_1.isInParty(game)) {
        chatTypes.push(1 /* Party */);
    }
    if (supporter) {
        chatTypes.push(4 /* Supporter */);
    }
    return chatTypes;
}
