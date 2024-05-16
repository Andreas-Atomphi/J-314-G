const pi = (() => {
    /** @type {string} */
    let _value = "";
    
    /** @type {bigint?} */
    let currentOffset = null;
    
    /** @type {number} */
    let piLength = piCanvas.pixelCount * 6;
    
    /** @type {Subject} */
    const _subject = new Subject();

    /** @type {string} */
    const piDeliveryUrlTemplate = "https://api.pi.delivery/v1/pi?start={0}&numberOfDigits={1}&radix=16";

    /** @returns {Promise<void>} */
    async function refresh() {
        if (currentOffset == offset.value) return;
        piCanvas.setAvailable(false);
        currentOffset = offset.value;
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
            _subject.notifyObservers(piData.length);
        }
        _value = piData;
    }

    return {
        refresh,
        get subject() { return _subject; },
        get value() { return _value; },
    };
})();
