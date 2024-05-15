const piMan = (() => {
    /** @type {string} */
    let _pi = "";
    
    /** @type {bigint?} */
    let currentOffset = null;
    
    /** @type {number} */
    let piLength = piCanvas.pixelCount * 6;
    
    /** @type {string} */
    const piDeliveryUrlTemplate = "https://api.pi.delivery/v1/pi?start={0}&numberOfDigits={1}&radix=16";

    /** @function @returns {Promise<void>} */
    async function refreshPi() {
        if (currentOffset == offsetMan.offset) return;
        piCanvas.setAvailable(false);
        currentOffset = offsetMan.offset;
        const MAX_REQUEST_LENGTH = 1000n;
        let remainingLength = BigInt(piLength);
        let requestOffset = currentOffset;
        let piData = "";
        while (remainingLength > 0) {
            let requestLength = BigMath.min(remainingLength, MAX_REQUEST_LENGTH);
            requestOffset += requestLength;
            remainingLength -= requestLength;
            const result = await fetch(
                piDeliveryUrlTemplate
                    .replace("{0}", requestOffset)
                    .replace("{1}", requestLength)
            );
            if (!result.ok) {
                throw new Error(`Can't fetch Api: ${result.status} - ${result.statusText}`);
            }
            const data = await result.json();
            piData += data["content"];
            piCanvas.refreshProgressBar(piData.length);
        }
        _pi = piData;
    }

    return {
        refreshPi,
        get pi() { return _pi; },
    };
})();
