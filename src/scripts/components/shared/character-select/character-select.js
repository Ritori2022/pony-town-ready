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
var constants_1 = require("../../../common/constants");
var errors_1 = require("../../../common/errors");
var gameService_1 = require("../../services/gameService");
var model_1 = require("../../services/model");
var dropdown_1 = require("../directives/dropdown");
var icons_1 = require("../../../client/icons");
var htmlUtils_1 = require("../../../client/htmlUtils");
var utils_1 = require("../../../common/utils");
var data_1 = require("../../../client/data");
var CharacterSelect = /** @class */ (function () {
    function CharacterSelect(element, router, model, gameService) {
        this.element = element;
        this.router = router;
        this.model = model;
        this.gameService = gameService;
        this.maxNameLength = constants_1.PLAYER_NAME_MAX_LENGTH;
        this.spinnerIcon = icons_1.faSpinner;
        this.deleteIcon = icons_1.faTrash;
        this.removeIcon = icons_1.faTimes;
        this.confirmIcon = icons_1.faCheck;
        this.newButton = false;
        this.editButton = false;
        this.removeButton = false;
        this.errorChange = new core_1.EventEmitter();
        this.change = new core_1.EventEmitter();
        this.preview = new core_1.EventEmitter();
        this.removing = false;
        this.locked = false; // TEMP: move to model
    }
    Object.defineProperty(CharacterSelect.prototype, "joining", {
        get: function () {
            return this.gameService.joining;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterSelect.prototype, "pony", {
        get: function () {
            return this.model.pony;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterSelect.prototype, "canNew", {
        get: function () {
            return !this.joining && this.model.account && this.model.account.characterCount < this.model.characterLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterSelect.prototype, "canEdit", {
        get: function () {
            return !this.joining;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterSelect.prototype, "canRemove", {
        get: function () {
            return !this.joining && !this.locked && !this.model.pending && !!this.pony
                && !!this.pony.id && this.error !== errors_1.VERSION_ERROR;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterSelect.prototype, "hasPonies", {
        get: function () {
            return !!this.model.ponies.length;
        },
        enumerable: true,
        configurable: true
    });
    CharacterSelect.prototype.select = function (pony) {
        if (pony) {
            this.removing = false;
            this.model.selectPony(pony);
            this.change.emit(pony);
            this.preview.emit(undefined);
        }
        this.dropdown.close();
        this.focusName();
    };
    CharacterSelect.prototype.createNew = function () {
        if (this.canNew) {
            this.removing = false;
            this.model.selectPony(model_1.createDefaultPonyObject());
            this.change.emit(this.pony);
            this.router.navigate(['/character']);
            this.focusName();
        }
    };
    CharacterSelect.prototype.edit = function () {
        if (this.canEdit) {
            this.removing = false;
            this.router.navigate(['/character']);
        }
    };
    CharacterSelect.prototype.remove = function () {
        if (this.canRemove) {
            this.removing = true;
            htmlUtils_1.focusElementAfterTimeout(this.element.nativeElement, '.cancel-remove-button');
        }
    };
    CharacterSelect.prototype.cancelRemove = function () {
        this.removing = false;
        htmlUtils_1.focusElementAfterTimeout(this.element.nativeElement, '.remove-button');
    };
    CharacterSelect.prototype.confirmRemove = function () {
        var _this = this;
        if (this.canRemove) {
            this.setError(undefined);
            this.removing = false;
            this.locked = true;
            this.model.removePony(this.pony)
                .then(function () { return _this.change.emit(_this.pony); })
                .catch(function (e) { return _this.setError(e.message); })
                .then(function () { return _this.ariaAnnounce.nativeElement.textContent = 'Character removed'; })
                .then(function () { return utils_1.delay(2000); })
                .then(function () { return _this.locked = false; })
                .then(function () { return _this.focusName(); });
        }
    };
    CharacterSelect.prototype.onToggle = function (show) {
        if (!show) {
            this.preview.emit(undefined);
        }
    };
    CharacterSelect.prototype.focusName = function () {
        if (!data_1.isMobile) {
            this.nameInput.nativeElement.focus();
        }
    };
    CharacterSelect.prototype.setError = function (error) {
        this.error = error;
        this.errorChange.emit(error);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "newButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "editButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "removeButton", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], CharacterSelect.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "errorChange", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "change", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], CharacterSelect.prototype, "preview", void 0);
    __decorate([
        core_1.ViewChild('nameInput', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], CharacterSelect.prototype, "nameInput", void 0);
    __decorate([
        core_1.ViewChild('ariaAnnounce', { static: true }),
        __metadata("design:type", core_1.ElementRef)
    ], CharacterSelect.prototype, "ariaAnnounce", void 0);
    __decorate([
        core_1.ViewChild('dropdown', { static: true }),
        __metadata("design:type", dropdown_1.Dropdown)
    ], CharacterSelect.prototype, "dropdown", void 0);
    CharacterSelect = __decorate([
        core_1.Component({
            selector: 'character-select',
            template: '<div class="sr-only" #ariaAnnounce aria-live="assertive"></div><div class="character-select input-group"><input class="form-control text-center" #nameInput type="text" [(ngModel)]="pony.name" [maxlength]="maxNameLength" placeholder="Name of your character" aria-label="Name of your character"><div class="input-group-append"><button class="btn btn-default" *ngIf="newButton" (click)="createNew()" [disabled]="!canNew" aria-label="Create New character">new</button><button class="btn btn-default" *ngIf="editButton" (click)="edit()" [disabled]="!canEdit" aria-label="Edit character">edit</button><div class="dropdown" dropdown #dropdown="ag-dropdown" (isOpenChange)="onToggle($event)" [focusOnOpen]="false"><button class="btn btn-default dropdown-toggle br-0" [ngClass]="removeButton ? \'btn-no-round\' : \'btn-no-round-left\'" [disabled]="!hasPonies || joining" dropdownToggle aria-label="Select character"></button><character-list class="dropdown-menu" *dropdownMenu (close)="dropdown.close()" (selectCharacter)="select($event)" (newCharacter)="createNew()" (previewCharacter)="preview.emit($event)" [canNew]="!newButton && canNew"></character-list></div><button class="btn btn-danger remove-button" *ngIf="removeButton && !removing" (click)="remove()" [disabled]="!canRemove" tooltip="Delete pony" aria-label="Delete pony"><fa-icon [icon]="deleteIcon" [fixedWidth]="true"></fa-icon></button><button class="btn btn-danger cancel-remove-button" *ngIf="removing" (click)="cancelRemove()" tooltip="Cancel delete" aria-label="Cancel delete"><fa-icon [icon]="removeIcon" [fixedWidth]="true"></fa-icon></button><button class="btn btn-success" *ngIf="removing" (click)="confirmRemove()" [disabled]="!canRemove" tooltip="Confirm delete" aria-label="Confirm delete"><fa-icon [icon]="confirmIcon" [fixedWidth]="true"></fa-icon></button></div></div>',
            styleUrls: ['character-select.scss'],
        }),
        __metadata("design:paramtypes", [core_1.ElementRef,
            router_1.Router,
            model_1.Model,
            gameService_1.GameService])
    ], CharacterSelect);
    return CharacterSelect;
}());
exports.CharacterSelect = CharacterSelect;
