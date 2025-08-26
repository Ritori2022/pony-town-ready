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
var lodash_1 = require("lodash");
var htmlUtils_1 = require("../../../client/htmlUtils");
var DropdownOutletService = /** @class */ (function () {
    function DropdownOutletService() {
    }
    DropdownOutletService = __decorate([
        core_1.Injectable({ providedIn: 'root' })
    ], DropdownOutletService);
    return DropdownOutletService;
}());
exports.DropdownOutletService = DropdownOutletService;
var DropdownOutlet = /** @class */ (function () {
    function DropdownOutlet(service, viewContainer, element) {
        service.viewContainer = viewContainer;
        service.rootElement = element.nativeElement.parentElement;
    }
    DropdownOutlet = __decorate([
        core_1.Component({
            selector: 'dropdown-outlet',
            template: "<ng-template></ng-template>",
        }),
        __metadata("design:paramtypes", [DropdownOutletService, core_1.ViewContainerRef, core_1.ElementRef])
    ], DropdownOutlet);
    return DropdownOutlet;
}());
exports.DropdownOutlet = DropdownOutlet;
var DropdownMenu = /** @class */ (function () {
    function DropdownMenu(templateRef, viewContainer, renderer, service) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.renderer = renderer;
        this.service = service;
        this.id = lodash_1.uniqueId('dropdown-menu-');
    }
    Object.defineProperty(DropdownMenu.prototype, "root", {
        get: function () {
            return this.ref && this.ref.rootNodes[0];
        },
        enumerable: true,
        configurable: true
    });
    DropdownMenu.prototype.open = function (useOutlet, rootElement) {
        var _this = this;
        if (!this.ref) {
            if (useOutlet) {
                this.ref = this.service.viewContainer.createEmbeddedView(this.templateRef);
            }
            else {
                this.ref = this.viewContainer.createEmbeddedView(this.templateRef);
            }
            var _a = this, renderer_1 = _a.renderer, root_1 = _a.root;
            renderer_1.addClass(root_1, 'show');
            renderer_1.setAttribute(root_1, 'id', this.id);
            if (useOutlet) {
                var positionMenu = function () {
                    var rect = rootElement.getBoundingClientRect();
                    var menuRect = root_1.getBoundingClientRect();
                    var transform;
                    if ((rect.bottom + menuRect.height) > window.innerHeight) {
                        transform = "translate3d(" + Math.round(rect.left) + "px, " + Math.round(rect.top - menuRect.height) + "px, 0)";
                        renderer_1.addClass(root_1, 'dropdown-menu-up');
                    }
                    else {
                        transform = "translate3d(" + Math.round(rect.left) + "px, " + Math.round(rect.bottom) + "px, 0)";
                        renderer_1.removeClass(root_1, 'dropdown-menu-up');
                    }
                    renderer_1.setStyle(root_1, 'transform', transform);
                };
                renderer_1.addClass(root_1, 'dropdown-in-outlet');
                positionMenu();
                var closeDropdown_1 = function () {
                    _this.close();
                };
                document.addEventListener('scroll', closeDropdown_1, true);
                window.addEventListener('resize', closeDropdown_1, true);
                this.onClose = function () {
                    document.removeEventListener('scroll', closeDropdown_1, true);
                    window.removeEventListener('resize', closeDropdown_1, true);
                };
            }
        }
    };
    DropdownMenu.prototype.close = function () {
        if (this.ref) {
            this.ref.destroy();
            this.ref = undefined;
        }
        if (this.onClose) {
            this.onClose();
            this.onClose = undefined;
        }
    };
    DropdownMenu.prototype.checkTarget = function (e) {
        return this.root && this.root.contains(e.target);
    };
    DropdownMenu.prototype.focusFirstElement = function () {
        if (this.root) {
            htmlUtils_1.focusFirstElement(this.root);
        }
    };
    DropdownMenu = __decorate([
        core_1.Directive({
            selector: '[dropdownMenu]',
        }),
        __metadata("design:paramtypes", [core_1.TemplateRef,
            core_1.ViewContainerRef,
            core_1.Renderer2,
            DropdownOutletService])
    ], DropdownMenu);
    return DropdownMenu;
}());
exports.DropdownMenu = DropdownMenu;
var Dropdown = /** @class */ (function () {
    function Dropdown(element, service) {
        var _this = this;
        this.element = element;
        this.service = service;
        this.autoClose = true;
        this.preventAutoCloseOnOutlet = false;
        this.hookToCanvas = false;
        this.focusOnOpen = true;
        this.focusOnClose = true;
        this.useOutlet = false;
        this.isOpen = false;
        this.isOpenChange = new core_1.EventEmitter();
        this.closeHandler = function (e) {
            if (!e.keyCode
                && (_this.autoClose || (_this.dropdownToggle && _this.dropdownToggle.checkTarget(e)))
                && !(_this.preventAutoCloseOnOutlet && _this.service.rootElement && _this.service.rootElement.contains(e.target))
                && !(_this.autoClose === 'outsideClick' && _this.menu.checkTarget(e))) {
                _this.close();
            }
            else if (_this.autoClose && e.keyCode === 27) { // esc
                _this.close();
            }
        };
        this.canvasCloseHandler = function () { return _this.close(); };
    }
    Object.defineProperty(Dropdown.prototype, "menuId", {
        get: function () {
            return this.isOpen ? this.menu.id : '';
        },
        enumerable: true,
        configurable: true
    });
    Dropdown.prototype.open = function () {
        var _this = this;
        if (!this.isOpen) {
            this.isOpen = true;
            this.isOpenChange.emit(true);
            this.menu.open(this.useOutlet, this.element.nativeElement);
            setTimeout(function () {
                document.addEventListener('click', _this.closeHandler);
                document.addEventListener('keydown', _this.closeHandler);
                if (_this.focusOnOpen) {
                    _this.menu.focusFirstElement();
                }
                if (_this.hookToCanvas) {
                    var canvas = document.getElementById('canvas');
                    if (canvas) {
                        canvas.addEventListener('touchstart', _this.canvasCloseHandler);
                        canvas.addEventListener('mousedown', _this.canvasCloseHandler);
                    }
                }
            });
        }
    };
    Dropdown.prototype.close = function () {
        if (this.isOpen) {
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.menu.close();
            if (this.focusOnClose && this.dropdownToggle) {
                this.dropdownToggle.focus();
            }
            document.removeEventListener('click', this.closeHandler);
            document.removeEventListener('keydown', this.closeHandler);
            if (this.hookToCanvas) {
                var canvas = document.getElementById('canvas');
                if (canvas) {
                    canvas.removeEventListener('touchstart', this.canvasCloseHandler);
                    canvas.removeEventListener('mousedown', this.canvasCloseHandler);
                }
            }
        }
    };
    Dropdown.prototype.toggle = function () {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    };
    __decorate([
        core_1.ContentChild(DropdownMenu, { static: false }),
        __metadata("design:type", DropdownMenu)
    ], Dropdown.prototype, "menu", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "autoClose", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "preventAutoCloseOnOutlet", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "hookToCanvas", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "focusOnOpen", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "focusOnClose", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "useOutlet", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "isOpen", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], Dropdown.prototype, "isOpenChange", void 0);
    Dropdown = __decorate([
        core_1.Directive({
            selector: '[dropdown]',
            exportAs: 'ag-dropdown',
            host: {
                '[class.show]': 'isOpen',
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, DropdownOutletService])
    ], Dropdown);
    return Dropdown;
}());
exports.Dropdown = Dropdown;
var DropdownToggle = /** @class */ (function () {
    function DropdownToggle(element, dropdown) {
        this.element = element;
        this.dropdown = dropdown;
        dropdown.dropdownToggle = this;
    }
    DropdownToggle.prototype.click = function () {
        this.dropdown.toggle();
    };
    DropdownToggle.prototype.checkTarget = function (e) {
        return this.element.nativeElement.contains(e.target);
    };
    DropdownToggle.prototype.focus = function () {
        this.element.nativeElement.focus();
    };
    __decorate([
        core_1.HostListener('click'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DropdownToggle.prototype, "click", null);
    DropdownToggle = __decorate([
        core_1.Directive({
            selector: '[dropdownToggle]',
            host: {
                'aria-haspopup': 'true',
                '[attr.aria-expanded]': 'dropdown.isOpen',
                '[attr.aria-controls]': 'dropdown.isOpen ? dropdown.menuId : undefined',
            },
        }),
        __metadata("design:paramtypes", [core_1.ElementRef, Dropdown])
    ], DropdownToggle);
    return DropdownToggle;
}());
exports.DropdownToggle = DropdownToggle;
exports.dropdownDirectives = [Dropdown, DropdownToggle, DropdownMenu, DropdownOutlet];
