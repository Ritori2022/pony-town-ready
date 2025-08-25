"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./bootstrap-common");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
const app_module_1 = require("./components/app/app.module");
const data_1 = require("./client/data");
// Simplified bootstrap - force application start
console.log('Starting PonyTown application...');
try {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule, { preserveWhitespaces: true });
} catch (error) {
    console.error('Bootstrap error:', error);
}
//# sourceMappingURL=bootstrap.js.map