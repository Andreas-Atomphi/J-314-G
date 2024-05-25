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

const Utils = Object.freeze({
    /**
     * @function posmod
     * @param {number|bigint} a
     * @param {number|bigint} b
     */
    posmod: (a, b) => ((a % b) + b) % b,
    /**
     * @function getElementChildNodes
     * @param {HTMLElement} node
     * @returns {ChildNode[]}
     * */
    getElementChildNodes: (node) =>
        Array.from(node.childNodes).filter(
            (value, _index, _arr) => value.nodeType == "1"
        ),
    /**
     * @function clamp
     * @param {number} num
     * @param {number} min
     * @param {number} max
     * @returns
     */
    clamp: (num, min, max) => (num <= min ? min : num >= max ? max : num),
});

/**
 *  @param {string} text
 *  @param {number} startIndex
 * */
Object.defineProperty(String.prototype, "cyclicSubstring", {
    value: function (startIndex, length) {
        const textLength = BigInt(this.length);
        let result = "";
        for (let i = 0n; i < length; i++) {
            const index = Utils.posmod(startIndex + i, textLength);
            result += this[index];
        }
        return result;
    },
    writable: true,
    configurable: true,
});

Object.defineProperties(HTMLElement.prototype, {
    clearChildren: {
        /** @returns {void} */
        value: function () {
            while (this.firstChild) {
                this.firstChild.remove();
            }
        },
        writable: true,
        configurable: true,
    },
});
