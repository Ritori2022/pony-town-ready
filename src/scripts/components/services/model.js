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
var router_1 = require("@angular/router");
var http_1 = require("@angular/common/http");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var hash_1 = require("../../generated/hash");
var ponyInfo_1 = require("../../common/ponyInfo");
var utils_1 = require("../../common/utils");
var accountUtils_1 = require("../../common/accountUtils");
var errors_1 = require("../../common/errors");
var data_1 = require("../../client/data");
var clientUtils_1 = require("../../client/clientUtils");
var errorReporter_1 = require("./errorReporter");
var stringUtils_1 = require("../../common/stringUtils");
var storageService_1 = require("./storageService");
var compressPony_1 = require("../../common/compressPony");
var constants_1 = require("../../common/constants");
var tags_1 = require("../../common/tags");
var LIMIT_ERROR = 'Request limit reached, please wait';
var noneSite = { id: '', name: 'none', url: '', icon: '', color: '#222' };
var modStatus = {
    mod: false,
    check: {},
    editor: {
        names: [],
        typeToName: [],
        nameToTypes: [],
    },
};
function compareStrings(a, b) {
    return (a || '').localeCompare(b || '');
}
function comparePonies(a, b) {
    return compareStrings(a.name, b.name) || compareStrings(a.id, b.id);
}
function getDefaultPony(ponies) {
    var result = ponies[0];
    for (var i = 1; i < ponies.length; i++) {
        if (compareStrings(result.lastUsed, ponies[i].lastUsed) < 0) {
            result = ponies[i];
        }
    }
    return result || createDefaultPonyObject();
}
function createDefaultPonyObject() {
    return {
        id: '',
        name: '',
        info: '',
        ponyInfo: ponyInfo_1.createDefaultPony(),
    };
}
exports.createDefaultPonyObject = createDefaultPonyObject;
function getPonyTag(pony, account) {
    if (account) {
        var tag = tags_1.canUseTag(account, pony.tag || '') ? pony.tag : undefined;
        return (!tag && account.supporter && !pony.hideSupport) ? "sup" + account.supporter : tag;
    }
    else {
        return undefined;
    }
}
exports.getPonyTag = getPonyTag;
var entityTypeToName = new Map();
var entityNameToTypes = new Map();
function getEntityNames() {
    return modStatus.editor.names;
}
exports.getEntityNames = getEntityNames;
function getEntityTypesFromName(name) {
    return entityNameToTypes.get(name);
}
exports.getEntityTypesFromName = getEntityTypesFromName;
function getEntityNameFromType(type) {
    return entityTypeToName.get(type);
}
exports.getEntityNameFromType = getEntityNameFromType;
function compareFriends(a, b) {
    return a.online !== b.online ? (a.online ? -1 : 1) : a.accountName.localeCompare(b.accountName);
}
exports.compareFriends = compareFriends;
var Model = /** @class */ (function () {
    function Model(http, router, storage, errorReporter) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.storage = storage;
        this.errorReporter = errorReporter;
        this.loading = true;
        this.ponies = [];
        this.pending = false;
        this.sites = [noneSite];
        this.accountChanged = new rxjs_1.Subject();
        this.protectionErrors = new rxjs_1.Subject();
        this.mergedAccount = false;
        this.updating = false;
        this.updatingTakesLongTime = false;
        this.suffix = '';
        this.friends = undefined;
        this._pony = createDefaultPonyObject();
        this.initialize();
        // handle completed sign-in
        if (typeof window !== 'undefined') {
            window.addEventListener('message', function (event) {
                if (event.data && event.data.type === 'loaded-page') {
                    var path_1 = event.data.path;
                    if (event.source && 'close' in event.source) {
                        event.source.close();
                    }
                    _this.initialize();
                    _this.accountPromise.then(function () { return router.navigateByUrl(path_1); });
                }
            });
        }
        if (DEVELOPMENT) {
            clientUtils_1.attachDebugMethod('ddos', function () { return _this.protectionErrors.next(); });
            clientUtils_1.attachDebugMethod('userModel', this);
        }
    }
    Model.prototype.initialize = function () {
        this.loading = true;
        this.account = undefined;
        this.loadingError = undefined;
        this.accountAlert = undefined;
        this.ponies = [];
        this.friends = undefined;
        this.sites = [noneSite];
        this._pony = createDefaultPonyObject();
        this.storage.setItem('bid', this.storage.getItem('bid') || stringUtils_1.randomString(20));
        this.accountPromise = this.initializeAccount();
    };
    Model.prototype.initializeAccount = function () {
        var _this = this;
        return this.getAccount()
            .then(function (account) {
            if (!account) {
                throw new Error(errors_1.ACCESS_ERROR);
            }
            if ('limit' in account) {
                throw new Error(LIMIT_ERROR);
            }
            _this.errorReporter.configureUser({ id: account.id, username: account.name });
            try {
                modStatus.mod = accountUtils_1.isMod(account);
                modStatus.check = account.check;
                modStatus.editor = account.editor || modStatus.editor;
            }
            catch (_a) { }
            if (modStatus.editor) {
                modStatus.editor.typeToName.forEach(function (_a) {
                    var type = _a.type, name = _a.name;
                    return entityTypeToName.set(type, name);
                });
                modStatus.editor.nameToTypes.forEach(function (_a) {
                    var types = _a.types, name = _a.name;
                    return entityNameToTypes.set(name, types);
                });
            }
            _this.account = account;
            _this.sites = [noneSite].concat((account.sites || []).map(clientUtils_1.toSocialSiteInfo));
            _this.ponies = account.ponies ? account.ponies.sort(comparePonies) : [];
            _this.friends = undefined;
            _this.selectPony(getDefaultPony(_this.ponies));
            _this.storage.setItem('vid', account.id);
            _this.loading = false;
            _this.accountAlert = account.alert;
            _this.accountChanged.next();
            _this.fetchFriends();
            return account;
        })
            .catch(function (e) {
            if (e.message === errors_1.ACCESS_ERROR) {
                _this.loading = false;
                _this.storage.setItem('vid', '---');
            }
            else if (e.message === LIMIT_ERROR) {
                _this.loadingError = 'request-limit';
                return utils_1.delay(5000).then(function () { return _this.initializeAccount(); });
            }
            else if (e.message === errors_1.OFFLINE_ERROR) {
                _this.loadingError = 'cannot-connect';
                return utils_1.delay(5000).then(function () { return _this.initializeAccount(); });
            }
            else if (e.message === errors_1.PROTECTION_ERROR) {
                _this.loadingError = 'cloudflare-error';
                _this.protectionErrors.next();
                // } else if (e.message === VERSION_ERROR) {
                // 	this.updating = true;
            }
            else {
                setTimeout(function () { return _this.loadingError = 'unexpected-error'; }, 5 * constants_1.SECOND);
                console.error(e);
            }
            return undefined;
        });
    };
    Model.prototype.fetchFriends = function () {
        var _this = this;
        this.getFriends()
            .then(function (friends) {
            _this.friends = friends.map(function (f) { return (__assign({}, f, { online: false, entityId: 0, crc: 0, ponyInfo: f.pony && compressPony_1.decodePonyInfo(f.pony, ponyInfo_1.mockPaletteManager) || undefined, actualName: '' })); }).sort(compareFriends);
        })
            .catch(function (e) {
            DEVELOPMENT && console.error(e);
            setTimeout(function () { return _this.fetchFriends(); }, 5000);
        });
    };
    Object.defineProperty(Model.prototype, "characterLimit", {
        get: function () {
            return this.account ? accountUtils_1.getCharacterLimit(this.account) : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "supporterInviteLimit", {
        get: function () {
            return this.account ? accountUtils_1.getSupporterInviteLimit(this.account) : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "isMod", {
        get: function () {
            return modStatus.mod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "modCheck", {
        get: function () {
            return modStatus.check;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "editorInfo", {
        get: function () {
            return modStatus.editor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "pony", {
        get: function () {
            return this._pony;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "supporter", {
        get: function () {
            return this.account && this.account.supporter || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "missingBirthdate", {
        get: function () {
            return !!this.account && !this.account.birthdate;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.computeFriendsCRC = function () {
        return this.friends ? utils_1.computeFriendsCRC(this.friends.map(function (f) { return f.accountId; })) : 0;
    };
    Model.prototype.parsePonyObject = function (pony) {
        try {
            var ponyInfo = compressPony_1.decompressPonyString(pony.info, true);
            return __assign({ ponyInfo: ponyInfo }, pony);
        }
        catch (e) {
            this.errorReporter.reportError(e, { ponyInfo: pony.info });
            this.errorReporter.reportError('Pony info reading error', { originalError: e.message, ponyInfo: pony.info });
            throw new Error('Error while reading pony info');
        }
    };
    Model.prototype.selectPony = function (pony) {
        var copy = this.parsePonyObject(pony);
        copy.ponyInfo && ponyInfo_1.syncLockedPonyInfo(copy.ponyInfo);
        this._pony = copy;
    };
    // account
    Model.prototype.signIn = function (provider) {
        this.authError = undefined;
        this.openAuth(provider.url);
    };
    Model.prototype.connectSite = function (provider) {
        this.authError = undefined;
        this.openAuth(provider.url + "/merge");
    };
    Model.prototype.signOut = function () {
        var _this = this;
        this.authError = undefined;
        return this.post('/auth/sign-out', {}, false)
            .catch(function (e) { return console.error(e); })
            .then(function () { return _this.initialize(); })
            .then(function () { return _this.router.navigate(['/']); });
    };
    Model.prototype.openAuth = function (url) {
        url = "" + data_1.host.replace(/\/$/, '') + url;
        if (clientUtils_1.isStandalone()) {
            window.open(url);
        }
        else {
            location.href = url;
        }
    };
    Model.prototype.getAccount = function () {
        return this.post('/api1/account', { version: data_1.version }, false);
    };
    Model.prototype.getAccountCharacters = function () {
        return this.post('/api/account-characters', {});
    };
    Model.prototype.updateAccount = function (account) {
        var _this = this;
        return this.post('/api/account-update', { account: account })
            .then(function (a) { return lodash_1.merge(_this.account, a); });
    };
    Model.prototype.saveSettings = function (settings) {
        var _this = this;
        return this.post('/api/account-settings', { settings: settings })
            .then(function (a) { return lodash_1.merge(_this.account, a); });
    };
    Model.prototype.removeSite = function (siteId) {
        var _this = this;
        return this.post('/api/remove-site', { siteId: siteId })
            .then(function () {
            if (_this.account && _this.account.sites) {
                utils_1.removeById(_this.account.sites, siteId);
            }
        });
    };
    Model.prototype.unhidePlayer = function (hideId) {
        return this.post('/api/remove-hide', { hideId: hideId });
    };
    Model.prototype.verifyAccount = function () {
        var verificationId = this.storage.getItem('vid');
        var accountId = this.account && this.account.id || '---';
        if (!this.loading && verificationId && accountId !== verificationId) {
            this.initialize();
        }
    };
    Model.prototype.getHides = function (page) {
        return this.post('/api/get-hides', { page: page });
    };
    Model.prototype.getFriends = function () {
        return this.post('/api/get-friends', {});
    };
    // ponies
    Model.prototype.savePony = function (pony, fast) {
        var _this = this;
        if (fast === void 0) { fast = false; }
        return Promise.resolve()
            .then(function () {
            if (_this.pending) {
                throw new Error('Saving in progress');
            }
            pony.name = clientUtils_1.cleanName(pony.name);
            pony.desc = pony.desc && pony.desc.substr(0, constants_1.PLAYER_DESC_MAX_LENGTH) || '';
            if (!clientUtils_1.validatePonyName(pony.name)) {
                throw new Error(errors_1.NAME_ERROR);
            }
            if (pony.ponyInfo) {
                pony.info = compressPony_1.compressPonyString(pony.ponyInfo);
            }
            var id = pony.id, name = pony.name, desc = pony.desc, site = pony.site, tag = pony.tag, info = pony.info, hideSupport = pony.hideSupport, respawnAtSpawn = pony.respawnAtSpawn;
            if (!fast) {
                _this.pending = true;
            }
            return _this.post('/api/pony/save', {
                pony: { id: id, name: name, desc: desc, site: site, tag: tag, info: info, hideSupport: hideSupport, respawnAtSpawn: respawnAtSpawn }
            });
        })
            .catch(function (e) {
            if (e.message === errors_1.CHARACTER_SAVING_ERROR) {
                _this.errorReporter.reportError(e, { pony: pony });
            }
            throw e;
        })
            .then(function (newPony) {
            if (!newPony) {
                throw new Error('Failed to save pony');
            }
            if (pony.id) {
                utils_1.removeById(_this.ponies, pony.id);
            }
            else {
                _this.account.characterCount++;
            }
            _this.ponies.push(newPony);
            _this.ponies.sort(comparePonies);
            if (_this.pony === pony) {
                _this.selectPony(newPony);
            }
            return newPony;
        })
            .finally(function () { return _this.pending = false; });
    };
    Model.prototype.removePony = function (pony) {
        var _this = this;
        return this.post('/api/pony/remove', { id: pony.id })
            .then(function () {
            utils_1.removeById(_this.ponies, pony.id);
            _this.account.characterCount--;
            if (_this.pony === pony) {
                _this.selectPony(getDefaultPony(_this.ponies));
            }
        });
    };
    Model.prototype.loadPonies = function () {
        var _this = this;
        return this.getAccountCharacters()
            .then(function (ponies) {
            if (_this.account) {
                _this.account.ponies = ponies || [];
                _this.ponies = _this.account.ponies.sort(comparePonies);
            }
        });
    };
    Model.prototype.sortPonies = function () {
        this.ponies.sort(comparePonies);
    };
    // game
    Model.prototype.status = function (short) {
        var age = 6;
        if (this.account) {
            var now = new Date();
            var currentYear = now.getFullYear();
            var currentMonth = now.getMonth() + 1;
            if (this.account.birthyear) {
                age = currentYear - this.account.birthyear;
            }
            else if (this.account.birthdate) {
                var _a = this.account.birthdate.split('-'), year = _a[0], month = _a[1];
                var before_1 = parseInt(month, 10) > currentMonth;
                age = Math.max(0, currentYear - parseInt(year, 10) - (before_1 ? 1 : 0));
            }
        }
        var params = new http_1.HttpParams()
            .set('short', short.toString())
            .set('d', age.toString())
            .set('t', (Date.now() % 0x10000).toString(16));
        return utils_1.observableToPromise(this.http.get('/api2/game/status', { params: params }));
    };
    Model.prototype.join = function (serverId, ponyId) {
        var _this = this;
        if (this.pending)
            return Promise.reject(new Error('Joining in progress'));
        if (!serverId)
            return Promise.reject(new Error('Invalid server ID'));
        if (!ponyId)
            return Promise.reject(new Error('Invalid pony ID'));
        this.pending = true;
        var alert = !!this.accountAlert ? 'y' : '';
        return this.post('/api/game/join', { version: data_1.version, ponyId: ponyId, serverId: serverId, alert: alert, url: location.href })
            .finally(function () { return _this.pending = false; });
    };
    Model.prototype.post = function (url, data, authenticate) {
        if (authenticate === void 0) { authenticate = true; }
        if (authenticate) {
            if (!this.account) {
                return Promise.reject(new Error(errors_1.NOT_AUTHENTICATED_ERROR));
            }
            var accountId = this.account.id + this.suffix;
            var accountName = this.account.name + this.suffix;
            data = __assign({ accountId: accountId, accountName: accountName }, data);
        }
        var params = new http_1.HttpParams()
            .set('t', (Date.now() % 0x10000).toString(16));
        var headers = new http_1.HttpHeaders({ 'api-version': hash_1.HASH, 'api-bid': this.storage.getItem('bid') || '-' });
        return utils_1.observableToPromise(this.http.post(url, data, { params: params, headers: headers }));
    };
    Model = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [http_1.HttpClient,
            router_1.Router,
            storageService_1.StorageService,
            errorReporter_1.ErrorReporter])
    ], Model);
    return Model;
}());
exports.Model = Model;
