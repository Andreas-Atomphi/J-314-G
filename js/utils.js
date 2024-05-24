const BigMath = Object.freeze({
    /**
     * @param{bigint} value
     * @returns {bigint}
     * */
    abs(value) {
        return value < 0n ? -value : value;
    },
    /**
     * @param{bigint} value
     * @returns {bigint}
     * */
    sign(value) {
        return value === 0 ? 0n : value < 0n ? -1 : 1;
    },
    /**
     * @param{bigint} base
     * @param{bigint} exponent
     * @returns {bigint}
     * */
    pow(base, exponent) {
        return base ** exponent;
    },
    /**
     * @param{bigint} value
     * @param{...bigint} values
     * @returns {bigint}
     * */
    min(value, ...values) {
        for (const v of values) if (v < value) value = v;
        return value;
    },
    /**
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
 * @param {number|bigint} a
 * @param {number|bigint} b
 */
const posmod = (a, b) => ((a % b) + b) % b;

/**
 *  @param {string} text
 *  @param {number} startIndex
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

Object.defineProperty(HTMLElement.prototype, "clearChildren", {
    /** @returns {void} */
    value: function () {
        while (this.firstChild) {
            this.firstChild.remove();
        }
    },
    writable: true,
    configurable: true,
});

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
