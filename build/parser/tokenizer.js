"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeLine = void 0;
const headedForEach_1 = __importDefault(require("../util/headedForEach"));
const tokenizeLine = (line, context) => {
    let collectedTokens = [];
    let lineContext = Object.assign(Object.assign({}, (typeof context !== "undefined" ? context : {})), { readingString: false, escapeNext: false });
    (0, headedForEach_1.default)(line.split(''), (value, index) => {
        // Basic Cases
        // Escape means it escapes ALL basic cases
        if (lineContext.escapeNext === false) {
            switch (value) {
                case '>':
                    collectedTokens.push({
                        'type': 'return',
                        'characters': value,
                    });
                    return;
                case '\\':
                    lineContext.escapeNext = true;
                    return;
                case '"':
                    lineContext.readingString = !lineContext.readingString;
                    collectedTokens.push({
                        'type': 'collection-cap',
                        'characters': value,
                    });
                    return;
                default:
                    break;
            }
        }
        lineContext.escapeNext = false;
        if (lineContext.readingString) {
            let foundToken = collectedTokens.at(-1);
            if (typeof foundToken === "undefined")
                throw 'The collectedTokens array is empty on a readingString call, this is weird behavior';
            if (foundToken.type !== "collection-content") {
                collectedTokens.push({
                    'characters': value,
                    'type': 'collection-content',
                });
            }
            else {
                foundToken.characters += value;
            }
            return;
        }
    });
    return collectedTokens;
};
exports.tokenizeLine = tokenizeLine;
//# sourceMappingURL=tokenizer.js.map