"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.largeJson = exports.defaultConfig = void 0;
var promises_1 = __importDefault(require("fs/promises"));
exports.defaultConfig = {
    charactersLimitBeforeWrite: 0,
    overwrite: false,
};
var largeJson = /** @class */ (function () {
    function largeJson(path, config) {
        this.config = exports.defaultConfig;
        this.jsonStack = new Array();
        this.currentJson = "";
        this.fileHandler = null;
        this.path = path;
        if (config === null || config === void 0 ? void 0 : config.charactersLimitBeforeWrite) {
            this.config.charactersLimitBeforeWrite =
                config.charactersLimitBeforeWrite;
        }
        if (config === null || config === void 0 ? void 0 : config.overwrite) {
            this.config.overwrite = config.overwrite;
        }
    }
    largeJson.prototype.write = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fileHandler === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 1:
                        _a.sent();
                        throw new Error("No file handler");
                    case 2: return [4 /*yield*/, this.fileHandler.write(this.currentJson)];
                    case 3:
                        _a.sent();
                        this.currentJson = "";
                        return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.beginObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileExists, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.fileHandler === null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, promises_1.default
                                .access(this.path)
                                .then(function () { return true; })
                                .catch(function () { return false; })];
                    case 1:
                        fileExists = _b.sent();
                        if (!fileExists) return [3 /*break*/, 5];
                        if (!this.config.overwrite) return [3 /*break*/, 3];
                        return [4 /*yield*/, promises_1.default.unlink(this.path)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.cleanup(true)];
                    case 4:
                        _b.sent();
                        throw new Error("File already exists");
                    case 5:
                        _a = this;
                        return [4 /*yield*/, promises_1.default.open(this.path, "a")];
                    case 6:
                        _a.fileHandler = _b.sent();
                        _b.label = 7;
                    case 7:
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.currentJson += ","; // add comma if we are in an array
                            this.jsonStack.pop(); // remove comma from the stack
                        }
                        this.jsonStack.push("{");
                        this.currentJson += "{";
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.write()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.endObject = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.jsonStack.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 1:
                        _a.sent();
                        throw new Error("No object to end");
                    case 2:
                        if (!(this.jsonStack[this.jsonStack.length - 1] !== "{" &&
                            (this.jsonStack[this.jsonStack.length - 2] !== "{" ||
                                this.jsonStack[this.jsonStack.length - 1] !== ","))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 3:
                        _a.sent();
                        throw new Error("No object to end");
                    case 4:
                        // If comma, then pop 2 times
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.jsonStack.pop();
                        }
                        this.jsonStack.pop();
                        if (this.jsonStack[this.jsonStack.length - 1] === "[") {
                            this.jsonStack.push(","); // This comma will tell us that we are in an array and we have already written 1 object.
                        }
                        this.currentJson += "}";
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.write()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.beginArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fileExists, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.fileHandler === null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, promises_1.default
                                .access(this.path)
                                .then(function () { return true; })
                                .catch(function () { return false; })];
                    case 1:
                        fileExists = _b.sent();
                        if (!fileExists) return [3 /*break*/, 5];
                        if (!this.config.overwrite) return [3 /*break*/, 3];
                        return [4 /*yield*/, promises_1.default.unlink(this.path)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.cleanup(true)];
                    case 4:
                        _b.sent();
                        throw new Error("File already exists");
                    case 5:
                        _a = this;
                        return [4 /*yield*/, promises_1.default.open(this.path, "a")];
                    case 6:
                        _a.fileHandler = _b.sent();
                        _b.label = 7;
                    case 7:
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.currentJson += ","; // add comma if we are in an array
                            this.jsonStack.pop(); // remove comma from the stack
                        }
                        this.jsonStack.push("[");
                        this.currentJson += "[";
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.write()];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.endArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.jsonStack.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 1:
                        _a.sent();
                        throw new Error("No array to end");
                    case 2:
                        if (!(this.jsonStack[this.jsonStack.length - 1] !== "[" &&
                            (this.jsonStack[this.jsonStack.length - 2] !== "[" ||
                                this.jsonStack[this.jsonStack.length - 1] !== ","))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 3:
                        _a.sent();
                        throw new Error("No array to end");
                    case 4:
                        // If comma, then pop 2 times
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.jsonStack.pop();
                        }
                        this.jsonStack.pop();
                        if (this.jsonStack[this.jsonStack.length - 1] === "[") {
                            this.jsonStack.push(","); // This comma will tell us that we are in an array and we have already written 1 array.
                        }
                        this.currentJson += "]";
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.write()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.writeJsonStringWithKey = function (key, jsonString, validateJson) {
        if (validateJson === void 0) { validateJson = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fileHandler === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 1:
                        _a.sent();
                        throw new Error("start with beginning either array or object");
                    case 2:
                        if (!(this.jsonStack.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 3:
                        _a.sent();
                        throw new Error("json string can only be written inside an array or provide key if appending inside an object");
                    case 4:
                        if (!!(this.jsonStack[this.jsonStack.length - 1] === "{" ||
                            (this.jsonStack[this.jsonStack.length - 1] === "," &&
                                this.jsonStack[this.jsonStack.length - 2] === "{"))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 5:
                        _a.sent();
                        throw new Error("json string can only be written inside an array or provide key if appending inside an object");
                    case 6:
                        if (!validateJson) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 8, , 10]);
                        JSON.parse(jsonString);
                        return [3 /*break*/, 10];
                    case 8:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.cleanup(true)];
                    case 9:
                        _a.sent();
                        throw new Error("Invalid json");
                    case 10:
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.currentJson += ",\"" + key + "\":" + jsonString;
                        }
                        else {
                            this.currentJson += "\"" + key + "\":" + jsonString;
                            this.jsonStack.push(",");
                        }
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.write()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.writeJsonStringWithoutKey = function (jsonString, validateJson) {
        if (validateJson === void 0) { validateJson = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fileHandler === null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 1:
                        _a.sent();
                        throw new Error("start with beginning either array or object");
                    case 2:
                        if (!(this.jsonStack.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 3:
                        _a.sent();
                        throw new Error("start with beginning either array or object");
                    case 4:
                        if (!(this.jsonStack[this.jsonStack.length - 1] !== "[" &&
                            (this.jsonStack[this.jsonStack.length - 1] !== "," ||
                                this.jsonStack[this.jsonStack.length - 2] !== "["))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.cleanup(true)];
                    case 5:
                        _a.sent();
                        throw new Error("json string can only be written inside an array or provide key if appending inside an object");
                    case 6:
                        if (!validateJson) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 8, , 10]);
                        JSON.parse(jsonString);
                        return [3 /*break*/, 10];
                    case 8:
                        e_2 = _a.sent();
                        return [4 /*yield*/, this.cleanup(true)];
                    case 9:
                        _a.sent();
                        throw new Error("Invalid json");
                    case 10:
                        if (this.jsonStack[this.jsonStack.length - 1] === ",") {
                            this.currentJson += "," + jsonString;
                        }
                        else {
                            this.currentJson += "" + jsonString;
                            this.jsonStack.push(",");
                        }
                        if (!(this.currentJson.length > this.config.charactersLimitBeforeWrite)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.write()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.writeJsonString = function (jsonStringOrKey, jsonStringOrValidateJson, validateJson) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof jsonStringOrValidateJson === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.writeJsonStringWithKey(jsonStringOrKey, jsonStringOrValidateJson)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.writeJsonStringWithoutKey(jsonStringOrKey, jsonStringOrValidateJson)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.writeJson = function (keyOrJson, json) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (json === undefined) {
                            json = keyOrJson;
                            keyOrJson = undefined;
                        }
                        if (!(keyOrJson !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.writeJsonString(keyOrJson, JSON.stringify(json))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.writeJsonString(JSON.stringify(json))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.cleanup = function (isError) {
        if (isError === void 0) { isError = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.fileHandler !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fileHandler.close()];
                    case 1:
                        _a.sent();
                        this.fileHandler = null;
                        _a.label = 2;
                    case 2:
                        if (!isError) return [3 /*break*/, 4];
                        return [4 /*yield*/, promises_1.default.unlink(this.path)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    largeJson.prototype.end = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.fileHandler === null) {
                            throw new Error("start with beginning either array or object");
                        }
                        if (this.jsonStack.length !== 0) {
                            throw new Error("end with terminating either array or object");
                        }
                        return [4 /*yield*/, this.write()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.cleanup()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return largeJson;
}());
exports.largeJson = largeJson;
exports.default = largeJson;
