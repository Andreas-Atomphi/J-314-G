const piMan = (() => {
    /** @type {String} */
    let pi = "";
    /** @type {BigInt?} */
    let currentOffset = null;
    /** @type {Number} */
    let piLength = piCanvas.getWidth() * piCanvas.getHeight() * 6;

    /** @function
     *   @returns {Promise<void>}
     */
    const refreshPi = async () => {
        if (currentOffset == offsetMan.getOffset()) return pi;
        piCanvas.setAvailable(false);
        const MAX_REQUEST_LENGTH = 996n;
        currentOffset = offsetMan.getOffset();
        let remainingLength = BigInt(piLength);
        let requestOffset = currentOffset;
        let piData = "";
        while (remainingLength > 0) {
            let requestLength =
                remainingLength >= MAX_REQUEST_LENGTH
                    ? MAX_REQUEST_LENGTH
                    : remainingLength;
            requestOffset += requestLength;
            remainingLength -= requestLength;
            const result = await fetch(
                `https://api.pi.delivery/v1/pi?start=${requestOffset}&numberOfDigits=${requestLength}&radix=16`,
            );
            if (!result.ok) {
                throw new Error("Can't fetch PI Api");
            }
            const data = await result.json();
            piData += data["content"];
            piCanvas.refreshProgressBar(piData.length);
        }
        pi = piData;
    };

    /** @function
     *   @returns {String}
     */
    const getPi = () => pi;

    return { refreshPi, getPi };
})();
