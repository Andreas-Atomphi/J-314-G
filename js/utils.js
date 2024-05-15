const BigMath = Object.freeze({
    /** @function 
     * @param{bigint} value
     * @returns {bigint}
     * */
    abs(value) { return (value < 0n ? -value : value); },
    /** @function 
     * @param{bigint} value
     * @returns {bigint}
     * */
    sign(value) { return (value === 0 ? 0n : value < 0n ? -1 : 1); },
    /** @function 
     * @param{bigint} base
     * @param{bigint} exponent
     * @returns {bigint}
     * */
    pow(base, exponent) { return base ** exponent; },
    /** @function 
     * @param{bigint} value
     * @param{...bigint} values
     * @returns {bigint}
     * */
    min(value, ...values) {
        for (const v of values) if (v < value) value = v;
        return value;
    },
    /** @function 
     * @param{bigint} value
     * @param{...bigint} values
     * @returns {bigint}
     * */
    max(value, ...values) {
        for (const v of values) if (v > value) value = v;
        return value;
    },
});

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
