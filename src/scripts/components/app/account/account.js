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
var constants_1 = require("../../../common/constants");
var clientUtils_1 = require("../../../client/clientUtils");
var data_1 = require("../../../client/data");
var model_1 = require("../../services/model");
var sign_in_box_1 = require("../../shared/sign-in-box/sign-in-box");
var icons_1 = require("../../../client/icons");
var Account = /** @class */ (function () {
    function Account(model) {
        this.model = model;
        this.refreshIcon = icons_1.faSync;
        this.starIcon = icons_1.faStar;
        this.alertIcon = icons_1.faExclamationCircle;
        this.providers = data_1.oauthProviders.filter(function (p) { return !p.disabled; });
        this.nameMinLength = constants_1.ACCOUNT_NAME_MIN_LENGTH;
        this.nameMaxLength = constants_1.ACCOUNT_NAME_MAX_LENGTH;
        this.hidesPerPage = constants_1.HIDES_PER_PAGE;
        this.data = {
            name: '',
            birthdate: '',
        };
        this.accountSaved = false;
        this.hides = undefined;
        this.page = 0;
    }
    Account.prototype.ngOnInit = function () {
        var account = this.account;
        this.sites = account.sites && account.sites.map(clientUtils_1.toSocialSiteInfo);
        this.data = {
            name: account.name,
            birthdate: account.birthdate,
        };
        this.pageChanged();
    };
    Account.prototype.ngOnDestroy = function () {
        this.model.mergedAccount = false;
    };
    Account.prototype.pageChanged = function () {
        var _this = this;
        this.model.getHides(this.page)
            .then(function (result) { return _this.hides = result; });
    };
    Object.defineProperty(Account.prototype, "authError", {
        get: function () {
            return this.model.authError;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "mergedAccount", {
        get: function () {
            return this.model.mergedAccount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "account", {
        get: function () {
            return this.model.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "supporter", {
        get: function () {
            return this.model.supporter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "showSupporter", {
        get: function () {
            return clientUtils_1.isSupporterOrPastSupporter(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "canSubmit", {
        get: function () {
            return this.account && this.data.name && !!clientUtils_1.cleanName(this.data.name).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "supporterTitle", {
        get: function () {
            return clientUtils_1.supporterTitle(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "supporterClass", {
        get: function () {
            return clientUtils_1.supporterClass(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "supporterRewards", {
        get: function () {
            return clientUtils_1.supporterRewards(this.account);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "showSupporterInfo", {
        get: function () {
            var account = this.account;
            return !!(!this.supporter && account && account.sites && account.sites.some(function (s) { return s.provider === 'patreon'; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "showAccountAlert", {
        get: function () {
            return this.model.missingBirthdate;
        },
        enumerable: true,
        configurable: true
    });
    Account.prototype.icon = function (id) {
        return sign_in_box_1.getProviderIcon(id);
    };
    Account.prototype.submit = function () {
        var _this = this;
        if (this.canSubmit) {
            this.resetAllMessages();
            this.data.name = clientUtils_1.cleanName(this.data.name).substr(0, constants_1.ACCOUNT_NAME_MAX_LENGTH);
            this.model.updateAccount(this.data)
                .catch(function (e) { return _this.accountError = e.message; })
                .then(function () { return _this.accountSaved = true; });
        }
    };
    Account.prototype.removeSite = function (site) {
        var _this = this;
        if (confirm('Are you sure you want to remove this social account ?')) {
            this.removingSite = true;
            this.resetAllMessages();
            this.model.removeSite(site.id)
                .then(function () { return _this.sites = _this.account.sites.map(clientUtils_1.toSocialSiteInfo); })
                .then(function () { return _this.removedAccount = true; })
                .catch(function (e) { return _this.mergeError = e.message; })
                .then(function () { return _this.removingSite = false; });
        }
    };
    Account.prototype.connectSite = function (provider) {
        this.model.connectSite(provider);
    };
    Account.prototype.resetAllMessages = function () {
        this.accountSaved = false;
        this.mergeError = undefined;
        this.accountError = undefined;
        this.removedAccount = false;
        this.model.authError = undefined;
        this.model.mergedAccount = false;
    };
    Account.prototype.unhidePlayer = function (player) {
        var _this = this;
        this.model.unhidePlayer(player.id)
            .then(function () { return _this.pageChanged(); })
            .catch(function (e) { return console.error(e); });
    };
    Account = __decorate([
        core_1.Component({
            selector: 'account',
            templateUrl: 'account.pug',
            styleUrls: ['account.scss'],
        }),
        __metadata("design:paramtypes", [model_1.Model])
    ], Account);
    return Account;
}());
exports.Account = Account;
