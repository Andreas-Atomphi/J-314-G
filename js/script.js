/** @type {HTMLInputElement}*/
const offsetView = document.querySelector("#offset-view");

/** @type {{function(BigInt):void, function(BigInt):void, function():BigInt}} */
const offsetMan = ((changeCallback) => {
    let offset = 0n;
    const changeOffsetBy = (value) => setOffset(offset + BigInt(value));
    const getOffset = () => offset;
    function setOffset(value) {
        if (isCanvasAvailable() == false) return;
        offset = BigInt(value);
        offsetView.value = offset;
        refreshCanvas(changeCallback);
    }
    return {
        changeOffsetBy,
        getOffset,
        setOffset,
    };
})(frag);

/** @function
 *  @param {Number} idx
 *  @param {Number} x
 *  @param {Number} y
 */
function frag(idx, _x, _y) {
    const digits = largePI.cyclicSubstring(
        (BigInt(idx) + offsetMan.getOffset()) * 9n,
        9,
    );
    const r = Math.round(255 * (parseInt(digits.substring(0, 3)) / 999));
    const g = Math.round(255 * (parseInt(digits.substring(3, 6)) / 999));
    const b = Math.round(255 * (parseInt(digits.substring(6, 9)) / 999));
    return `rgb(${r}, ${g}, ${b})`;
}

document.addEventListener("keydown", (ev) => {
    const actions = {
        KeyA: () => offsetMan.changeOffsetBy(-1),
        KeyS: () => offsetMan.changeOffsetBy(1),
        Enter() {
            offsetMan.setOffset(BigInt(offsetView.value));
        },
    };
    if (actions[ev.code] != null) {
        actions[ev.code]();
    }
});

canvasDraw(frag);
