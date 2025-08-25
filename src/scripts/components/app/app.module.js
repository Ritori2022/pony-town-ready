"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var platform_browser_1 = require("@angular/platform-browser");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var popover_1 = require("ngx-bootstrap/popover");
var buttons_1 = require("ngx-bootstrap/buttons");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var shared_module_1 = require("../shared/shared.module");
var app_1 = require("./app");
var home_1 = require("./home/home");
var help_1 = require("./help/help");
var about_1 = require("./about/about");
var account_1 = require("./account/account");
var character_1 = require("./character/character");
var editor_box_1 = require("./editor-box/editor-box");
var authGuard_1 = require("../services/authGuard");
var rollbarErrorHandler_1 = require("../services/rollbarErrorHandler");
var errorReporter_1 = require("../services/errorReporter");
var rollbarErrorReporter_1 = require("../services/rollbarErrorReporter");
exports.routes = [
    { path: '', component: home_1.Home },
    { path: 'help', component: help_1.Help },
    { path: 'about', component: about_1.About },
    { path: 'account', component: account_1.Account, canActivate: [authGuard_1.AuthGuard] },
    { path: 'character', component: character_1.Character, canActivate: [authGuard_1.AuthGuard] },
    { path: '**', redirectTo: '/', pathMatch: 'full' },
];
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                popover_1.PopoverModule.forRoot(),
                buttons_1.ButtonsModule.forRoot(),
                tooltip_1.TooltipModule.forRoot(),
                // TypeaheadModule.forRoot(),
                shared_module_1.SharedModule,
                router_1.RouterModule.forRoot(exports.routes),
                angular_fontawesome_1.FontAwesomeModule,
            ],
            declarations: [
                app_1.App,
                home_1.Home,
                help_1.Help,
                about_1.About,
                account_1.Account,
                character_1.Character,
                editor_box_1.EditorBox,
            ],
            providers: [
                { provide: rollbarErrorHandler_1.RollbarService, useFactory: rollbarErrorHandler_1.rollbarFactory },
                { provide: core_1.ErrorHandler, useClass: rollbarErrorHandler_1.RollbarErrorHandler },
                { provide: errorReporter_1.ErrorReporter, useClass: rollbarErrorReporter_1.RollbarErrorReporter },
            ],
            bootstrap: [app_1.App],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
