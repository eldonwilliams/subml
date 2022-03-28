"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A modified forEach function that allows you to move the current index, additionally you can modify the array.
 * Returns a modified version of the array, modifications can be applied using the onEach function
 */
const headedForEach = (initialArray, onEach) => {
    if (typeof onEach === "undefined")
        return [...initialArray];
    let array = [...initialArray]; // A mutable copy of the array
    let index = 0;
    let context = {
        incrementIndex: true,
    };
    const forward = (amount = 1) => {
        if (context.incrementIndex === false)
            throw `You should only call the forward function once`;
        if (amount + index - 1 >= array.length)
            throw `The index ${amount + index - 1} is not in array of length ${array.length}`;
        if (amount <= 0)
            throw amount === 0 ? `Please do not move forward 0` : `Please do not move backwards using the forward function`;
        context.incrementIndex = false;
        index += amount;
    };
    const backward = (amount = 1) => {
        if (context.incrementIndex === false)
            throw `You should only call the backward function once`;
        if (index - amount < 0)
            throw `${index - amount} is a negative index, please don't do that!`;
        if (amount <= 0)
            throw amount === 0 ? `Please do not move backward 0` : `Please do not move forward using the backwards function!`;
        context.incrementIndex = false;
        index -= amount;
    };
    while (true) {
        context = Object.assign(Object.assign({}, context), { incrementIndex: true });
        if (index >= array.length)
            break;
        let result = onEach(array[index], index, array, forward, backward);
        switch (typeof result) {
            case 'undefined':
                break;
            case 'object':
                if (result instanceof Array) {
                    array = result;
                }
                else {
                    const { setIndex, newArray, } = result;
                    index = setIndex;
                    array = newArray;
                    context.incrementIndex = false;
                }
            default:
                break;
        }
        if (context.incrementIndex === true)
            index++;
    }
    return array;
};
exports.default = headedForEach;
//# sourceMappingURL=headedForEach.js.map