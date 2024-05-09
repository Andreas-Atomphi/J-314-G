/**
 * @function
 * @param {Number|BigInt} a
 * @param {Number|BigInt} b
 */
const posmod = (a, b) => ((a % b) + b) % b;

/** @function
 *  @param {String} text
 *  @param {Number} startIndex
 * */
Object.defineProperty(String.prototype, "cyclicSubstring", {
    value: function (startIndex, length) {
        const textLength = BigInt(this.length);
        let result = "";
        for (let i = 0n; i < length; i++) {
            const index = posmod(startIndex + i, textLength);
            result += this[index];
        }
        return result;
    },
    writable: true,
    configurable: true,
});
