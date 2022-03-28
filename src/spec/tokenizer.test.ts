import { Token, tokenizeLine, } from "../parser/tokenizer";


it("should tokenize a string", () => {
    let collectedTokens: Token[] = tokenizeLine('"Hello, world!"');

    expect(collectedTokens).toStrictEqual([
        {"characters": '"', "type": "collection-cap"},
        {"characters": "Hello, world!", "type": "collection-content"},
        {"characters": '"', "type": "collection-cap"},
    ]);
});