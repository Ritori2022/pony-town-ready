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
var browser_1 = require("ag-sockets/dist/browser");
var utils_1 = require("../../common/utils");
var errors_1 = require("../../common/errors");
var gameLoop_1 = require("../../client/gameLoop");
var clientActions_1 = require("../../client/clientActions");
var data_1 = require("../../client/data");
var game_1 = require("../../client/game");
var model_1 = require("./model");
var errorReporter_1 = require("./errorReporter");
var accountUtils_1 = require("../../common/accountUtils");
var clientUtils_1 = require("../../client/clientUtils");
var storageService_1 = require("./storageService");
function createSocket(gameService, game, model, zone, options, token, errorHandler) {
    var socket = browser_1.createClientSocket(options, token, errorHandler);
    socket.client = new clientActions_1.ClientActions(gameService, game, model, zone);
    if (!socket.supportsBinary) {
        throw new Error(errors_1.BROWSER_NOT_SUPPORTED_ERROR);
    }
    return socket;
}
var GameService = /** @class */ (function () {
    function GameService(model, game, zone, errorHandler, errorReporter, storage) {
        this.model = model;
        this.game = game;
        this.zone = zone;
        this.errorHandler = errorHandler;
        this.errorReporter = errorReporter;
        this.storage = storage;
        this.playing = false;
        this.joining = false;
        this.offline = false;
        this.protectionError = false;
        this.rateLimitError = false;
        this.versionError = false;
        this.servers = [];
        this.safelyLeft = false;
        this.initialized = false;
        this.locked = false;
        this.pollStatus();
    }
    Object.defineProperty(GameService.prototype, "selected", {
        get: function () {
            return this.game.selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "account", {
        get: function () {
            return this.model.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "canPlay", {
        get: function () {
            return !!this.model.pony &&
                !!this.model.pony.name &&
                !this.model.pending &&
                !this.joining &&
                !!this.server &&
                !this.server.offline &&
                !this.rateLimitError &&
                !this.versionError &&
                !this.locked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "updateWarning", {
        get: function () {
            return !!this.update;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "filterSwearWords", {
        get: function () {
            return !!(this.server && this.server.filter)
                || !!(this.account && this.account.settings && this.account.settings.filterSwearWords);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameService.prototype, "wasPlaying", {
        get: function () {
            return this.storage.getBoolean('playing');
        },
        enumerable: true,
        configurable: true
    });
    GameService.prototype.join = function (ponyId) {
        var _this = this;
        this.errorReporter.captureEvent({ name: 'Join' });
        var server = this.server;
        if (this.playing || this.joining || !server) {
            return Promise.resolve();
        }
        if (typeof WebSocket === 'undefined' || typeof Float32Array === 'undefined') {
            return Promise.reject(new Error(errors_1.BROWSER_NOT_SUPPORTED_ERROR));
        }
        this.joining = true;
        this.leftMessage = undefined;
        this.safelyLeft = false;
        return this.model.join(server.id, ponyId)
            .then(function (_a) {
            var token = _a.token, alert = _a.alert;
            if (!_this.joining) {
                return false;
            }
            if (!token) {
                _this.model.accountAlert = alert;
                _this.joining = false;
                return false;
            }
            return _this.zone.runOutsideAngular(function () {
                var options = __assign({}, data_1.socketOptions(), { path: server.path, host: server.host });
                var errorHandler = _this.errorReporter.createClientErrorHandler(options);
                var socket = createSocket(_this, _this.game, _this.model, _this.zone, options, token, errorHandler);
                if (_this.gameLoop) {
                    _this.gameLoop.cancel();
                }
                _this.game.startup(socket, _this.model.isMod);
                _this.gameLoop = gameLoop_1.startGameLoop(_this.game, function (e) { return _this.handleGameError(e); });
                return _this.gameLoop.started
                    .then(function () {
                    _this.errorReporter.captureEvent({ name: 'gameLoop.started' });
                    var socketConnected = _this.pollUntilConnected(socket);
                    socket.connect();
                    return socketConnected;
                })
                    .then(function () {
                    _this.errorReporter.captureEvent({ name: 'socketConnected' });
                    return true;
                })
                    .catch(function (e) {
                    _this.errorReporter.captureEvent({ name: 'socket.disconnect()', error: e.message });
                    socket.disconnect();
                    throw e;
                });
            });
        })
            .then(function (joined) {
            _this.errorReporter.captureEvent({ name: joined ? 'Joined game' : 'Not joined game' });
        })
            .catch(function (e) {
            _this.errorReporter.captureEvent({ name: 'Failed to join game', error: e.message });
            // if (e.status && e.status > 500 && e.status < 500) {
            // 	this.rateLimitError = true;
            // 	setTimeout(() => this.rateLimitError = false, 5000);
            // }
            _this.zone.run(function () { return _this.left('join.catch'); });
            throw e;
        });
    };
    GameService.prototype.leave = function (reason) {
        this.errorReporter.captureEvent({ name: 'Leave', reason: reason });
        this.game.leave();
        this.left('leave');
    };
    GameService.prototype.joined = function () {
        var _this = this;
        this.errorReporter.captureEvent({ name: 'Joined' });
        this.storage.setBoolean('playing', true);
        clearTimeout(this.disconnectedTimeout);
        setTimeout(function () {
            _this.joining = false;
            _this.playing = true;
        });
    };
    GameService.prototype.left = function (from, reason) {
        var _this = this;
        if (reason === void 0) { reason = 0 /* None */; }
        this.errorReporter.captureEvent({ name: 'Left', from: from, reason: reason });
        this.storage.setBoolean('playing', false);
        this.safelyLeft = true;
        if (reason === 1 /* Swearing */) {
            this.leftMessage = 'Kicked for swearing or inappropriate language';
            this.locked = true;
        }
        else {
            this.leftMessage = undefined;
        }
        if (this.gameLoop) {
            this.errorReporter.captureEvent({ name: 'gameLoop.cancel()' });
            this.gameLoop.cancel();
            this.gameLoop = undefined;
        }
        clearTimeout(this.disconnectedTimeout);
        setTimeout(function () {
            _this.joining = false;
            _this.playing = false;
        });
        if (this.locked) {
            setTimeout(function () {
                _this.locked = false;
            }, 7000);
        }
        if (this.model.friends) {
            for (var _i = 0, _a = this.model.friends; _i < _a.length; _i++) {
                var friend = _a[_i];
                friend.online = false;
                friend.entityId = 0;
            }
        }
        this.game.release();
        this.game.onLeft.next();
    };
    GameService.prototype.disconnected = function () {
        var _this = this;
        this.errorReporter.captureEvent({ name: 'Disconnected' });
        clearTimeout(this.disconnectedTimeout);
        if (!this.safelyLeft) {
            this.disconnectedTimeout = setTimeout(function () { return _this.left('disconnected.timeout'); }, 10000);
        }
    };
    GameService.prototype.pollStatus = function () {
        var _this = this;
        return this.getAndUpdateStatus(this.account)
            .finally(function () {
            setTimeout(function () { return _this.pollStatus(); }, _this.initialized ? 10000 : 500);
        });
    };
    GameService.prototype.getAndUpdateStatus = function (account) {
        var _this = this;
        if (this.joining || this.playing || !account || !clientUtils_1.isFocused()) {
            return Promise.resolve();
        }
        else {
            return this.model.status(this.initialized)
                .then(function (status) { return _this.updateStatus(account, status); })
                .catch(function (e) {
                DEVELOPMENT && console.error(e);
                _this.offline = e.message === errors_1.OFFLINE_ERROR;
                _this.versionError = e.message === errors_1.VERSION_ERROR;
                _this.protectionError = e.message === errors_1.PROTECTION_ERROR;
            });
        }
    };
    GameService.prototype.updateStatus = function (account, status) {
        var _this = this;
        this.initialized = true;
        this.offline = false;
        this.version = status.version;
        this.update = status.update;
        for (var _i = 0, _a = status.servers; _i < _a.length; _i++) {
            var server = _a[_i];
            var existing = utils_1.findById(this.servers, server.id);
            if (existing) {
                lodash_1.merge(existing, server);
            }
            else if ('name' in server) {
                var info = server;
                info.countryFlags = info.flag && /^[a-z]{2}( [a-z]{2})*$/.test(info.flag) ? info.flag.split(/ /g) : [];
                if (info.name && account && accountUtils_1.meetsRequirement(account, info.require)) {
                    this.servers.push(info);
                }
            }
            else {
                // got new server on the list
                this.initialized = false;
            }
        }
        for (var i = this.servers.length - 1; i >= 0; i--) {
            if (!utils_1.findById(status.servers, this.servers[i].id)) {
                this.servers.splice(i, 1);
            }
        }
        if (clientUtils_1.isLanguage('ru')) {
            this.servers.sort(clientUtils_1.sortServersForRussian);
        }
        if (!this.server && account.settings.defaultServer) {
            this.server = utils_1.findById(this.servers, account.settings.defaultServer);
            if (DEVELOPMENT && /join/.test(this.model.pony.name)) {
                setTimeout(function () { return _this.join(_this.model.pony.id); });
            }
        }
        if (!utils_1.includes(this.servers, this.server)) {
            this.server = undefined;
        }
    };
    GameService.prototype.handleGameError = function (error) {
        this.errorReporter.captureEvent({ name: 'handleGameError', error: error.message });
        this.error = error.message;
        this.errorHandler.handleError(error);
        this.leave('handleGameError');
    };
    GameService.prototype.pollUntilConnected = function (socket) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                if (socket.isConnected) {
                    clearInterval(interval);
                    _this.zone.run(resolve);
                }
                else if (!_this.joining) {
                    clearInterval(interval);
                    _this.zone.run(function () { return reject(new Error('Cancelled (poll)')); });
                }
            }, 10);
        });
    };
    GameService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [model_1.Model,
            game_1.PonyTownGame,
            core_1.NgZone,
            core_1.ErrorHandler,
            errorReporter_1.ErrorReporter,
            storageService_1.StorageService])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
