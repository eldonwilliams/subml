import headedForEach from "../util/headedForEach";

export interface TokenizingContext {

}

export interface LineTokenizingContext extends TokenizingContext {
    readingString: boolean;
    escapeNext: boolean;
}

/**
 * Examples of each
 * 
 * RETURN:
 * The return token describes something being returned or exported from a subml document.
 * The only current way to do this is '>'
 * 
 * HASH:
 * The hash is a special type of control character that seperates a HEADER token from a bracket collection.
 * 
 * COLLECTION-CAP:
 * This token will wrap around a COLLECTION-CONTENT token or any other set of tokens. Anything between two COLLECTION-CAP tokens with the same "characters"
 * field should be assumed to be in the same collection and parsed as such
 * 
 * COLLECTION-CONTENT:
 * This token is the content between two COLLECTION-CONTENT tokens.
 * This is really only used for strings where the collection-content cannot be subdivided
 * If there is tokens inside of the collection it will be just a marker for the beginning and end of the collection
 * 
 * CONTROL:
 * This token represents only a few characters that act as some form of context changer
 * Examples include '.', '*', '+', ':', '='
 * and so forth
 * 
 * HEADER:
 * These tokens usually go before a collection to describe that collection
 * For example, the JSON header tells the interpreter to read that section as JSON data and parse it as so.
 * Another example, the EVAL header tells the interpreter to read that section as code
 */
export type TokenTypes = "return" | "hash" | "collection-cap" | "collection-content" | "control" | "header";
export type Token = {
    characters: string,
    type: TokenTypes,
}

const tokenizeLine = (line: string, context?: TokenizingContext): Token[] => {
    let collectedTokens: Token[] = [];
    let lineContext: LineTokenizingContext = {
        ...(typeof context !== "undefined" ? context : {}),
        readingString: false,
        escapeNext: false,
    };

    headedForEach(line.split(''), (value, index) => {
        
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
            if (typeof foundToken === "undefined") throw 'The collectedTokens array is empty on a readingString call, this is weird behavior';
            if (foundToken.type !== "collection-content") {
                collectedTokens.push({
                    'characters': value,
                    'type': 'collection-content',
                });
            } else {
                foundToken.characters += value;
            }
            return;
        }
    });

    return collectedTokens;
}

export {tokenizeLine};