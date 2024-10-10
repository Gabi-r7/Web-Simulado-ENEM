"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var test_utils_exports = {};
__export(test_utils_exports, {
  jestConsoleContext: () => import_jestContext.jestConsoleContext,
  jestContext: () => import_jestContext.jestContext,
  jestProcessContext: () => import_jestContext.jestProcessContext
});
module.exports = __toCommonJS(test_utils_exports);
var import_jestContext = require("./jestContext");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  jestConsoleContext,
  jestContext,
  jestProcessContext
});
