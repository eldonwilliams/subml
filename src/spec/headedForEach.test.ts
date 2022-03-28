import headedForEach from "../util/headedForEach";

/**
 * The following test ensures that the 'headedForEach' function will respond properly
 * if 'onEach' is undefined or not passed. The proper response is to return a copy of the 'initialArray'.
 */
it("handles 'onEach' missing", () => {
    expect(headedForEach(["oh", "no!"])).toStrictEqual(["oh", "no!"]);
});

/**
 * The following test ensures that the 'onEach' 'forward' function works as intended.
 */
it("allows forwarding", () => {
    let touched: any[] = [];
    headedForEach(["hello", "amazing", "cool", "programming", "world"], (value, index, array, forward) => {
        if (index === 2) forward(2);
        touched.push(value);
    });

    expect(touched).toStrictEqual(["hello", "amazing", "cool", "world"]);
});

/**
 * The following test ensures that the 'onEach' 'backward' function works as intended.
 */
it("allows going backward", () => {
    let touched: any[] = [];
    let hitYet: boolean = false;
    headedForEach(["hi", "bye", "hola", "bonjour"], (value, index, array, forward, backward) => {
        if (index === 2 && !hitYet) { hitYet = true; backward(1); return; }
        touched.push(value);
    });

    expect(touched).toStrictEqual(["hi", "bye", "bye", "hola", "bonjour"]);
});

/**
 * The following test makes sure that during the 'onEach' function the array can be modified
 * and that those modifications appear in the next loop.
 * 
 * This does not handle the object type returns
 */
it("allows modifications to the array and modifications are responsive", () => {
    let response: any[] = headedForEach([0], (value, index, array) => {
        if (index >= 10) return;

        return [
            ...array,
            index + 1
        ];
    });

    expect(response).toStrictEqual([0,1,2,3,4,5,6,7,8,9,10]);
});

/**
 * The following test makes sure that during the 'onEach' function the array can be modified using
 * an object containing the keys 'setIndex' and 'newArray'.
 */
it("allows modifications to the array and modifications can be given as an object", () => {
    let response: string = headedForEach("\"Hello, world!\"".split(''), (value, index, array) => {
        // This example emulates normal behavior
        // There is no checks currently for the validity of setIndex, but that's intended
        if (value === "\"") return {
            newArray: array.filter((v, i) => i !== index),
            setIndex: index + 1, 
        };
    }).join('');

    expect(response).toStrictEqual("Hello, world!")
});