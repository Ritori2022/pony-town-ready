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
var lodash_1 = require("lodash");
var game_1 = require("../../../client/game");
var interfaces_1 = require("../../../common/interfaces");
var settingsService_1 = require("../../services/settingsService");
var htmlUtils_1 = require("../../../client/htmlUtils");
var constants_1 = require("../../../common/constants");
var icons_1 = require("../../../client/icons");
var debugData_1 = require("../../../common/debugData");
var GENERAL_CHAT_LIMIT = 100;
var PARTY_CHAT_LIMIT = 100;
var WHISPER_CHAT_LIMIT = 100;
var FORGET_INDEX_AFTER = 1000;
var SCROLL_END_THRESHOLD = 60;
var LABELS = [];
LABELS[1 /* System */] = 'system';
LABELS[2 /* Admin */] = 'admin';
LABELS[3 /* Mod */] = 'mod';
LABELS[4 /* Party */] = 'party';
LABELS[6 /* PartyThinking */] = 'party';
LABELS[8 /* PartyAnnouncement */] = 'party';
var PREFIXES = [];
PREFIXES[14 /* WhisperTo */] = 'To ';
PREFIXES[16 /* WhisperToAnnouncement */] = 'To ';
var SUFFIXES = [];
SUFFIXES[5 /* Thinking */] = 'thinks';
SUFFIXES[6 /* PartyThinking */] = 'thinks';
SUFFIXES[13 /* Whisper */] = 'whispers';
SUFFIXES[15 /* WhisperAnnouncement */] = 'whispers';
var CLASSES = [];
CLASSES[1 /* System */] = 'chat-line-system';
CLASSES[2 /* Admin */] = 'chat-line-admin';
CLASSES[3 /* Mod */] = 'chat-line-mod';
CLASSES[4 /* Party */] = 'chat-line-party';
CLASSES[5 /* Thinking */] = 'chat-line-thinking';
CLASSES[6 /* PartyThinking */] = 'chat-line-party-thinking';
CLASSES[7 /* Announcement */] = 'chat-line-announcement';
CLASSES[8 /* PartyAnnouncement */] = 'chat-line-party-announcement';
CLASSES[9 /* Supporter1 */] = 'chat-line-supporter-1';
CLASSES[10 /* Supporter2 */] = 'chat-line-supporter-2';
CLASSES[11 /* Supporter3 */] = 'chat-line-supporter-3';
CLASSES[13 /* Whisper */] = 'chat-line-whisper';
CLASSES[14 /* WhisperTo */] = 'chat-line-whisper';
CLASSES[15 /* WhisperAnnouncement */] = 'chat-line-whisper-announcement';
CLASSES[16 /* WhisperToAnnouncement */] = 'chat-line-whisper-announcement';
function createChatLogLineDOM(clickLabel, clickName) {
    var line = {};
    line.root = htmlUtils_1.element('div', 'chat-line', [
        htmlUtils_1.element('span', 'chat-line-lead'),
        line.label = htmlUtils_1.element('span', 'chat-line-label mr-1', [line.labelText = htmlUtils_1.textNode('')], undefined, { click: function () { return clickLabel(line.entry); } }),
        line.prefixText = htmlUtils_1.textNode(''),
        line.name = htmlUtils_1.element('span', 'chat-line-name', [
            htmlUtils_1.textNode('['),
            line.nameContent = htmlUtils_1.element('span', 'chat-line-name-content', [htmlUtils_1.textNode('')], undefined, { click: function () { return clickName(line.entry); } }),
            line.index = htmlUtils_1.element('span', 'chat-line-name-index', [line.indexText = htmlUtils_1.textNode('')], { title: 'duplicate name' }),
            htmlUtils_1.textNode(']'),
        ]),
        line.suffixText = htmlUtils_1.textNode(''),
        line.message = htmlUtils_1.element('span', 'chat-line-message', [htmlUtils_1.textNode('')]),
    ]);
    return line;
}
exports.createChatLogLineDOM = createChatLogLineDOM;
function updateChatLogLine(line, entry) {
    var classes = entry.classes, label = entry.label, message = entry.message, prefix = entry.prefix, suffix = entry.suffix;
    var hasSpace = message.indexOf(' ') !== -1;
    line.entry = entry;
    line.root.className = ("chat-line " + (hasSpace ? '' : 'chat-line-break ') + classes).trim();
    line.label.style.display = label ? 'inline' : 'none';
    line.labelText.nodeValue = label ? "[" + label + "]" : '';
    updateChatLogName(line, entry);
    line.prefixText.nodeValue = prefix || '';
    line.suffixText.nodeValue = suffix ? " " + suffix + ": " : ': ';
    htmlUtils_1.replaceNodes(line.message, message);
}
exports.updateChatLogLine = updateChatLogLine;
function updateChatLogName(line, _a) {
    var name = _a.name, index = _a.index;
    if (name) {
        line.name.style.display = 'inline';
        htmlUtils_1.replaceNodes(line.nameContent, name);
        line.index.style.display = (index > 0) ? 'inline' : 'none';
        line.indexText.nodeValue = (index > 0) ? " #" + (index + 1) : '';
    }
    else {
        line.name.style.display = 'none';
    }
}
function isMatch(e, id, name, crc) {
    return e.name === name && (e.entityId === id || (e.crc === crc && crc !== undefined));
}
function addOrUpdatePony(pony, list) {
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var e = list_1[_i];
        if (isMatch(e, pony.id, pony.name, pony.crc)) {
            e.entityId = pony.id;
        }
    }
}
function updateEntityId(list, oldId, newId) {
    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
        var e = list_2[_i];
        if (e.entityId === oldId) {
            e.entityId = newId;
        }
    }
}
function findUserIndex(users, id, crc) {
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.id === id || (crc !== undefined && user.crc === crc)) {
            user.id = id;
            return i;
        }
    }
    return -1;
}
var ChatLog = /** @class */ (function () {
    function ChatLog(game, settingsService, element, zone) {
        var _this = this;
        this.game = game;
        this.settingsService = settingsService;
        this.element = element;
        this.zone = zone;
        this.toBottomIcon = icons_1.faArrowDown;
        this.resizeIcon = icons_1.faCaretUp;
        this.toggleType = new core_1.EventEmitter();
        this.nameClick = new core_1.EventEmitter();
        this.innerWidth = 0;
        // TODO: move to game ?
        this.local = [];
        this.party = [];
        this.whisper = [];
        this.unread = 0;
        this.subscriptions = [];
        this.startX = 0;
        this.startY = 0;
        this.shouldScrollToEnd = false;
        this.scrolledToEnd = true;
        this.scrollingToEnd = false;
        this.scrollToEndAtFrame = false;
        this.indexes = new Map();
        this.messageCounter = 0;
        this.lastOpacity = 0;
        this.scrollHandler = function () {
            _this.scrollingToEnd = true;
            _this.scroll.nativeElement.scrollTop = 99999;
        };
        this.clickNameHandler = function (message) {
            _this.zone.run(function () { return _this.nameClick.emit(message); });
        };
        this.clickLabel = function (message) {
            _this.zone.run(function () {
                if (message.label) {
                    _this.toggleType.emit(message.label);
                }
            });
        };
        this.findEntityFromMessages = function (id) {
            return findEntityFromMessages(id, _this.whisper) ||
                findEntityFromMessages(id, _this.party) ||
                findEntityFromMessages(id, _this.local);
        };
        this.findEntityFromMessagesByName = function (name) {
            return findEntityFromMessagesByName(name, _this.game.playerId, _this.whisper) ||
                findEntityFromMessagesByName(name, _this.game.playerId, _this.party) ||
                findEntityFromMessagesByName(name, _this.game.playerId, _this.local);
        };
        // TODO: just put reference to chatlog on game ???
        this.subscriptions.push(game.onFrame.subscribe(function () {
            if (_this.scrollToEndAtFrame) {
                _this.scrollToEndAtFrame = false;
                _this.scrollHandler();
            }
        }), game.onMessage.subscribe(function (message) {
            _this.addMessage(message);
        }), 
        // TODO: move to game ?
        game.onPonyAddOrUpdate.subscribe(function (pony) {
            addOrUpdatePony(pony, _this.local);
            addOrUpdatePony(pony, _this.party);
            addOrUpdatePony(pony, _this.whisper);
        }), game.onJoined.subscribe(function () {
            if (!DEVELOPMENT) {
                // TODO: move to game ?
                _this.local = [];
                _this.party = [];
                _this.whisper = [];
                _this.messageCounter = 0;
                _this.indexes = new Map();
                _this.clearList();
            }
        }), game.onEntityIdUpdate.subscribe(function (update) {
            updateEntityId(_this.local, update.old, update.new);
            updateEntityId(_this.party, update.old, update.new);
            updateEntityId(_this.whisper, update.old, update.new);
        }));
    }
    Object.defineProperty(ChatLog.prototype, "linesElement", {
        get: function () {
            return this.lines.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    ChatLog.prototype.updateOpen = function () {
        this.updateChatlog();
        if (this.open) {
            this.setUnread(0);
            this.regenerateList();
            this.scrollToEnd();
        }
        else {
            this.clearList();
        }
        this.updateInnerWidth();
    };
    ChatLog.prototype.updateChatlog = function () {
        var element = this.chatLog.nativeElement;
        element.style.display = this.open ? 'flex' : 'none';
        if (this.open) {
            element.style.width = this.width + "px";
            element.style.height = this.height + "px";
        }
    };
    ChatLog.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.game.findEntityFromChatLog = this.findEntityFromMessages;
        this.game.findEntityFromChatLogByName = this.findEntityFromMessagesByName;
        this.updateTabs();
        this.updateOpen();
        this.zone.runOutsideAngular(function () {
            var scroll = _this.scroll.nativeElement;
            scroll.addEventListener('scroll', function () {
                if (_this.scrollingToEnd) {
                    _this.scrolledToEnd = true;
                    _this.scrollingToEnd = false;
                }
                else {
                    var clientHeight = scroll.getBoundingClientRect().height;
                    _this.scrolledToEnd = scroll.scrollTop >= (scroll.scrollHeight - clientHeight - SCROLL_END_THRESHOLD);
                }
            });
        });
        setTimeout(function () {
            _this.scrollToEnd();
            _this.updateInnerWidth();
        });
        if (DEVELOPMENT) {
            debugData_1.sampleMessages.forEach(function (_a) {
                var name = _a.name, id = _a.id, message = _a.message, type = _a.type;
                return _this.addMessage({ id: id || 999999, crc: undefined, name: name, message: message, type: type || 0 /* Chat */ });
            });
        }
    };
    ChatLog.prototype.ngOnDestroy = function () {
        if (this.game.findEntityFromChatLog === this.findEntityFromMessages) {
            this.game.findEntityFromChatLog = function () { return undefined; };
        }
        if (this.game.findEntityFromChatLogByName === this.findEntityFromMessagesByName) {
            this.game.findEntityFromChatLogByName = function () { return undefined; };
        }
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
        this.subscriptions = [];
    };
    ChatLog.prototype.ngDoCheck = function () {
        if (this.lastOpacity !== this.opacity) {
            this.lastOpacity = this.opacity;
            this.contentElement.nativeElement.style.backgroundColor = this.bg;
            this.updateTabs();
        }
    };
    ChatLog.prototype.updateInnerWidth = function () {
        var _this = this;
        var maxWidth = this.element.nativeElement.getBoundingClientRect().width;
        var innerWidth = Math.min(maxWidth || this.width, this.width) - 40;
        if (this.innerWidth !== innerWidth) {
            this.innerWidth = innerWidth;
            this.linesElement.style.width = innerWidth + "px";
        }
        if (!maxWidth) {
            setTimeout(function () { return _this.updateInnerWidth(); }, 10);
        }
    };
    Object.defineProperty(ChatLog.prototype, "messages", {
        get: function () {
            return this[this.activeTab];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "settings", {
        get: function () {
            return this.settingsService.browser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "settings2", {
        get: function () {
            return this.settingsService.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "activeTab", {
        get: function () {
            var tab = this.settings.chatlogTab;
            return (tab === 'local' || tab === 'party' || tab === 'whisper') ? tab : 'local';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "open", {
        get: function () {
            return !this.settings.chatlogClosed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "width", {
        get: function () {
            return this.settings.chatlogWidth || 500;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "height", {
        get: function () {
            return this.settings.chatlogHeight || 310;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "opacity", {
        get: function () {
            return this.settings2.chatlogOpacity === undefined ? constants_1.DEFAULT_CHATLOG_OPACITY : this.settings2.chatlogOpacity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "bg", {
        get: function () {
            return "rgba(0, 0, 0, " + this.opacity / 100 + ")";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLog.prototype, "inactiveBg", {
        get: function () {
            return "rgba(0, 0, 0, " + (this.opacity / 200) * 0.5 + ")";
        },
        enumerable: true,
        configurable: true
    });
    ChatLog.prototype.createEntry = function (_a) {
        var id = _a.id, crc = _a.crc, name = _a.name, message = _a.message, type = _a.type;
        var system = type === 1 /* System */;
        var entry = {
            entityId: system ? 0 : id,
            name: system ? '' : name,
            index: 0,
            crc: crc,
            message: message,
            label: LABELS[type] || '',
            prefix: PREFIXES[type] || '',
            suffix: SUFFIXES[type] || '',
            classes: CLASSES[type] || '',
        };
        if (!system) {
            entry.index = this.findOrCreateIndex(name, id, crc);
        }
        return entry;
    };
    ChatLog.prototype.findOrCreateIndex = function (name, id, crc) {
        var found = this.indexes.get(name);
        if (!found || (this.messageCounter - found.counter) > FORGET_INDEX_AFTER) {
            found = {
                users: [{ id: id, crc: crc }],
                counter: 0,
            };
            this.indexes.set(name, found);
        }
        found.counter = this.messageCounter;
        var index = findUserIndex(found.users, id, crc);
        if (index === -1) {
            index = found.users.length;
            found.users.push({ id: id, crc: crc });
        }
        return index;
    };
    ChatLog.prototype.addMessage = function (message) {
        if (message.name && message.message) {
            var entry = this.createEntry(message);
            var party = interfaces_1.isPartyMessage(message.type);
            var whisper = interfaces_1.isWhisper(message.type) || interfaces_1.isWhisperTo(message.type);
            var open_1 = this.open;
            var scrolledToEnd = open_1 ? this.scrolledToEnd : false;
            var tab = this.activeTab;
            this.addEntryToList(this.local, GENERAL_CHAT_LIMIT, open_1 && tab === 'local', entry);
            if (party || whisper) {
                var partyEntry = __assign({}, entry);
                partyEntry.dom = undefined;
                partyEntry.label = whisper ? partyEntry.label : undefined;
                this.addEntryToList(this.party, PARTY_CHAT_LIMIT, open_1 && tab === 'party', partyEntry);
            }
            if (whisper) {
                var whisperEntry = __assign({}, entry);
                whisperEntry.dom = undefined;
                whisperEntry.label = undefined;
                this.addEntryToList(this.whisper, WHISPER_CHAT_LIMIT, open_1 && tab === 'whisper', whisperEntry);
            }
            if (message.type === 13 /* Whisper */ && !this.open) {
                this.setUnread(this.unread + 1);
            }
            if (scrolledToEnd) {
                this.scrollToEnd();
            }
            this.messageCounter++;
        }
    };
    ChatLog.prototype.addEntryToList = function (list, limit, isOpen, entry) {
        var removedDom;
        while (list.length >= limit) {
            var removed = list.shift();
            if (isOpen && removed && removed.dom) {
                if (removed.dom.root.parentElement) {
                    removed.dom.root.parentElement.removeChild(removed.dom.root);
                }
                removedDom = removed.dom;
                removed.dom = undefined;
            }
        }
        list.push(entry);
        if (isOpen) {
            entry.dom = removedDom || createChatLogLineDOM(this.clickLabel, this.clickNameHandler);
            updateChatLogLine(entry.dom, entry);
            this.linesElement.appendChild(entry.dom.root);
        }
    };
    ChatLog.prototype.toggle = function () {
        this.settings.chatlogClosed = !this.settings.chatlogClosed;
        this.settingsService.saveBrowserSettings();
        this.updateOpen();
    };
    ChatLog.prototype.switchTab = function (tab) {
        if (this.activeTab !== tab) {
            this.settings.chatlogTab = tab;
            this.settingsService.saveBrowserSettings();
            this.regenerateList();
            this.scrollToEnd();
            this.updateTabs();
        }
    };
    ChatLog.prototype.updateTabs = function () {
        this.setActiveTab(this.localTab.nativeElement, this.activeTab === 'local');
        this.setActiveTab(this.partyTab.nativeElement, this.activeTab === 'party');
        this.setActiveTab(this.whisperTab.nativeElement, this.activeTab === 'whisper');
    };
    ChatLog.prototype.setActiveTab = function (tab, active) {
        if (active) {
            tab.classList.add('active');
            tab.style.backgroundColor = this.bg;
        }
        else {
            tab.classList.remove('active');
            tab.style.backgroundColor = this.inactiveBg;
        }
    };
    ChatLog.prototype.scrollToEnd = function () {
        // requestAnimationFrame(this.scrollHandler);
        this.scrollToEndAtFrame = true;
    };
    ChatLog.prototype.clearList = function () {
        htmlUtils_1.removeAllNodes(this.linesElement);
    };
    ChatLog.prototype.regenerateList = function () {
        var _this = this;
        this.clearList();
        var lines = this.linesElement;
        this.messages.forEach(function (entry) {
            if (!entry.dom) {
                entry.dom = createChatLogLineDOM(_this.clickLabel, _this.clickNameHandler);
                updateChatLogLine(entry.dom, entry);
            }
            lines.appendChild(entry.dom.root);
        });
    };
    ChatLog.prototype.drag = function (_a, resizeY, resizeX) {
        var x = _a.x, y = _a.y, type = _a.type, event = _a.event;
        event.preventDefault();
        if (type === 'start') {
            var _b = this.element.nativeElement.getBoundingClientRect(), left = _b.left, top_1 = _b.top;
            this.startX = left;
            this.startY = top_1;
            this.shouldScrollToEnd = this.scrolledToEnd;
        }
        if (resizeX) {
            this.settings.chatlogWidth = lodash_1.clamp(x - this.startX, 200, 2000);
        }
        if (resizeY) {
            this.settings.chatlogHeight = lodash_1.clamp(this.startY - y, 120, 2000);
        }
        this.updateChatlog();
        this.updateInnerWidth();
        if (type === 'end') {
            this.settingsService.saveBrowserSettings();
        }
        if (this.shouldScrollToEnd) {
            this.scrollToEnd();
        }
    };
    ChatLog.prototype.setUnread = function (value) {
        if (this.unread !== value) {
            this.unread = value;
            var count = this.countElement.nativeElement;
            var toggle = this.toggleButton.nativeElement;
            if (value) {
                count.textContent = value > 99 ? '99+' : "" + value;
                toggle.classList.add('has-unread');
            }
            else {
                count.textContent = '';
                toggle.classList.remove('has-unread');
            }
        }
    };
    __decorate([
        core_1.ViewChild('chatLog', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "chatLog", void 0);
    __decorate([
        core_1.ViewChild('scroll', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "scroll", void 0);
    __decorate([
        core_1.ViewChild('lines', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "lines", void 0);
    __decorate([
        core_1.ViewChild('localTab', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "localTab", void 0);
    __decorate([
        core_1.ViewChild('partyTab', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "partyTab", void 0);
    __decorate([
        core_1.ViewChild('whisperTab', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "whisperTab", void 0);
    __decorate([
        core_1.ViewChild('toggleButton', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "toggleButton", void 0);
    __decorate([
        core_1.ViewChild('count', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "countElement", void 0);
    __decorate([
        core_1.ViewChild('content', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], ChatLog.prototype, "contentElement", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ChatLog.prototype, "toggleType", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ChatLog.prototype, "nameClick", void 0);
    __decorate([
        core_1.HostListener('window:resize'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ChatLog.prototype, "updateInnerWidth", null);
    ChatLog = __decorate([
        core_1.Component({
            selector: 'chat-log',
            templateUrl: 'chat-log.pug',
            styleUrls: ['chat-log.scss'],
        }),
        __metadata("design:paramtypes", [game_1.PonyTownGame,
            settingsService_1.SettingsService,
            core_1.ElementRef,
            core_1.NgZone])
    ], ChatLog);
    return ChatLog;
}());
exports.ChatLog = ChatLog;
function findEntityFromMessages(id, messages) {
    for (var i = messages.length - 1; i >= 0; i--) {
        if (messages[i].entityId === id) {
            return { fake: true, id: id, type: constants_1.PONY_TYPE, name: messages[i].name, crc: messages[i].crc };
        }
    }
    return undefined;
}
function findEntityFromMessagesByName(name, playerId, messages) {
    var regex = new RegExp("^" + lodash_1.escapeRegExp(name) + "$", 'i');
    for (var i = messages.length - 1; i >= 0; i--) {
        var message = messages[i];
        if (message.name && message.entityId && message.entityId !== playerId && regex.test(message.name)) {
            return { fake: true, id: message.entityId, type: constants_1.PONY_TYPE, name: message.name, crc: message.crc };
        }
    }
    return undefined;
}
