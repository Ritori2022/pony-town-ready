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
var router_1 = require("@angular/router");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var popover_1 = require("ngx-bootstrap/popover");
var modal_1 = require("ngx-bootstrap/modal");
var gameService_1 = require("../services/gameService");
var model_1 = require("../services/model");
var data_1 = require("../../client/data");
var game_1 = require("../../client/game");
var icons_1 = require("../../client/icons");
var installService_1 = require("../services/installService");
var clientUtils_1 = require("../../client/clientUtils");
var errorReporter_1 = require("../services/errorReporter");
var constants_1 = require("../../common/constants");
var pony_1 = require("../../common/pony");
var worldMap_1 = require("../../common/worldMap");
var gameUtils_1 = require("../../client/gameUtils");
function tooltipConfig() {
    return Object.assign(new tooltip_1.TooltipConfig(), { container: 'body' });
}
exports.tooltipConfig = tooltipConfig;
function popoverConfig() {
    return Object.assign(new popover_1.PopoverConfig(), { container: 'body' });
}
exports.popoverConfig = popoverConfig;
var App = /** @class */ (function () {
    function App(modalService, gameService, model, game, router, activatedRoute, installService, errorReporter) {
        this.modalService = modalService;
        this.gameService = gameService;
        this.model = model;
        this.game = game;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.installService = installService;
        this.errorReporter = errorReporter;
        this.version = data_1.version;
        this.date = new Date();
        this.emailIcon = icons_1.faEnvelope;
        this.twitterIcon = icons_1.faTwitter;
        this.patreonIcon = icons_1.faPatreon;
        this.cogIcon = icons_1.faCog;
        this.homeIcon = icons_1.faHome;
        this.helpIcon = icons_1.faGamepad;
        this.aboutIcon = icons_1.faInfoCircle;
        this.charactersIcon = icons_1.faHorseHead;
        this.contactEmail = data_1.contactEmail;
        this.patreonLink = data_1.supporterLink;
        this.twitterLink = data_1.twitterLink;
        this.copyright = data_1.copyrightName;
        this.url = location.pathname;
        this.subscriptions = [];
    }
    Object.defineProperty(App.prototype, "canInstall", {
        get: function () {
            return this.installService.canInstall;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "loading", {
        get: function () {
            return this.model.loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "account", {
        get: function () {
            return this.model.account;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "isMod", {
        get: function () {
            return this.model.isMod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "notifications", {
        get: function () {
            return this.game.notifications;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "selected", {
        get: function () {
            return this.gameService.selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "playing", {
        get: function () {
            return this.gameService.playing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "showActionBar", {
        get: function () {
            return this.playing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "editingActions", {
        get: function () {
            return this.game.editingActions;
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.ngOnInit = function () {
        var _this = this;
        if (typeof ga !== 'undefined') {
            this.subscriptions.push(this.router.events.subscribe(function (event) {
                if (event instanceof router_1.NavigationEnd && _this.url !== event.url) {
                    ga('set', 'page', _this.url = event.url);
                    ga('send', 'pageview');
                }
            }));
        }
        if (clientUtils_1.isBrowserOutdated) {
            this.errorReporter.disable();
        }
        if (!DEVELOPMENT) {
            clientUtils_1.registerServiceWorker(data_1.host + "sw.js", function () {
                _this.model.updating = true;
                setTimeout(function () {
                    _this.model.updatingTakesLongTime = true;
                }, 20 * constants_1.SECOND);
            });
        }
        if (DEVELOPMENT) {
            this.subscriptions.push(this.game.announcements.subscribe(function (message) {
                _this.announcer.nativeElement.style.display = 'flex';
                var announcerText = _this.announcerText.nativeElement;
                announcerText.textContent = '';
                setTimeout(function () { return announcerText.textContent = message; }, 100);
            }));
        }
        this.activatedRoute.queryParams.subscribe(function (_a) {
            var error = _a.error, merged = _a.merged, alert = _a.alert;
            _this.model.authError = error;
            _this.model.accountAlert = alert;
            _this.model.mergedAccount = !!merged;
        });
        this.subscriptions.push(this.model.protectionErrors.subscribe(function () {
            _this.openReloadModal();
        }));
    };
    App.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
    };
    App.prototype.focus = function () {
        this.model.verifyAccount();
    };
    App.prototype.signIn = function (provider) {
        this.model.signIn(provider);
    };
    App.prototype.signOut = function () {
        this.model.signOut();
    };
    App.prototype.openReloadModal = function () {
        var _this = this;
        if (!this.reloadModalRef) {
            this.reloadModalRef = this.modalService.show(this.reloadModal, { class: 'modal-lg', ignoreBackdropClick: true, keyboard: false });
            this.reloadInterval = setInterval(function () {
                if (clientUtils_1.checkIframeKey('reload-frame', 'gep84r9jshge4g')) {
                    _this.cancelReloadModal();
                }
            }, 500);
        }
    };
    App.prototype.cancelReloadModal = function () {
        if (this.reloadModalRef) {
            this.reloadModalRef.hide();
            this.reloadModalRef = undefined;
        }
        clearInterval(this.reloadInterval);
    };
    App.prototype.chatLogNameClick = function (chatBox, message) {
        if (!message.entityId) {
            return;
        }
        var entity = worldMap_1.findEntityById(this.game.map, message.entityId);
        if (entity && (!pony_1.isPony(entity) || entity === this.game.player)) {
            return;
        }
        if (!entity) {
            entity = { fake: true, type: constants_1.PONY_TYPE, id: message.entityId, name: message.name };
        }
        if (gameUtils_1.isSelected(this.game, message.entityId)) {
            this.game.whisperTo = entity;
            chatBox.setChatType('whisper');
        }
        else {
            this.game.select(entity);
        }
    };
    App.prototype.messageToFriend = function (chatBox, friend) {
        if (friend.entityId) {
            var entity = { id: friend.entityId, name: friend.actualName || 'unknown' };
            this.messageToPony(chatBox, entity);
        }
    };
    App.prototype.messageToPony = function (chatBox, pony) {
        var _this = this;
        setTimeout(function () {
            _this.game.whisperTo = pony;
            chatBox.setChatType('whisper');
        });
    };
    __decorate([
        core_1.ViewChild('announcer', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], App.prototype, "announcer", void 0);
    __decorate([
        core_1.ViewChild('announcerText', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], App.prototype, "announcerText", void 0);
    __decorate([
        core_1.ViewChild('reloadModal', { static: true }),
        __metadata("design:type", core_1.TemplateRef)
    ], App.prototype, "reloadModal", void 0);
    __decorate([
        core_1.ViewChild('signInModal', { static: true }),
        __metadata("design:type", core_1.TemplateRef)
    ], App.prototype, "signInModal", void 0);
    __decorate([
        core_1.HostListener('window:focus'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], App.prototype, "focus", null);
    App = __decorate([
        core_1.Component({
            selector: 'pony-town-app',
            template: '<div id="app-game" class="app-game" [hidden]="!playing"><canvas id="canvas" class="unselectable pixelart"></canvas><span id="stats" class="d-none d-sm-inline"></span><pony-box id="pony-box" *ngIf="selected" [pony]="selected" (sendMessage)="messageToPony(chatBox, $event)"></pony-box><editor-box id="editor" *hasFeature="\'editor\'; also playing && isMod"></editor-box><party-list id="party-list"></party-list><settings-box id="settings-box"></settings-box><swap-box id="swap-box"></swap-box><notification-list id="notifications" [notifications]="notifications" [notificationsLength]="notifications.length"></notification-list><chat-log id="chat-log" *ngIf="playing" (toggleType)="chatBox.setChatType($event)" (nameClick)="chatLogNameClick(chatBox, $event)"></chat-log><action-bar id="action-bar" *ngIf="showActionBar" [blurred]="chatBox.isOpen" [editable]="editingActions"></action-bar><friends-box id="friends-box" (sendMessage)="messageToFriend(chatBox, $event)"></friends-box><chat-box id="chat-box" #chatBox [disabled]="editingActions"></chat-box><div id="game-announcer" #announcer style="display: none"><div #announcerText aria-live="assertive"></div></div><div id="touch-origin"></div><div id="touch-position"></div><div id="range-indicator"></div><div><dropdown-outlet></dropdown-outlet></div></div><div class="container" [hidden]="playing"><menu-bar *ngIf="!playing" [logo]="true" [account]="account" [loading]="loading" (signIn)="signIn($event)" (signOut)="signOut()"><menu-item route="/" name="Home" [icon]="homeIcon"></menu-item><menu-item route="/help" name="Help" [icon]="helpIcon"></menu-item><menu-item route="/about" name="About" [icon]="aboutIcon"></menu-item><menu-item route="/character" name="Characters" [icon]="charactersIcon" *ngIf="account"></menu-item></menu-bar><main><router-outlet></router-outlet></main><footer class="text-muted text-nowrap" *ngIf="!playing"><div class="app-version">version <b>{{version}}</b></div><div class="text-right"><div class="d-flex flex-wrap"><div class="text-nowrap"><a class="text-muted mr-2" *ngIf="twitterLink" [href]="twitterLink" target="_blank" title="Twitter"><fa-icon [icon]="twitterIcon" [fixedWidth]="true"></fa-icon></a><a class="text-muted mr-2" *ngIf="patreonLink" [href]="patreonLink" target="_blank" title="Patreon"><fa-icon [icon]="patreonIcon" [fixedWidth]="true"></fa-icon></a><a class="text-muted mr-2" *ngIf="contactEmail" [href]="contactEmail" target="_blank" title="Email"><fa-icon [icon]="emailIcon" [fixedWidth]="true"></fa-icon></a></div><div><a class="text-muted privacy-policy" href="/privacypolicy.html" target="_blank" rel="noopener">privacy policy</a><span class="mx-2">|</span><a class="text-muted" href="/termsofservice.html" target="_blank" rel="noopener">terms of service</a></div></div></div></footer></div><draggable-outlet></draggable-outlet>',
            styles: [],
            providers: [
                { provide: tooltip_1.TooltipConfig, useFactory: tooltipConfig },
                { provide: popover_1.PopoverConfig, useFactory: popoverConfig },
            ]
        }),
        __metadata("design:paramtypes", [modal_1.BsModalService,
            gameService_1.GameService,
            model_1.Model,
            game_1.PonyTownGame,
            router_1.Router,
            router_1.ActivatedRoute,
            installService_1.InstallService,
            errorReporter_1.ErrorReporter])
    ], App);
    return App;
}());
exports.App = App;
