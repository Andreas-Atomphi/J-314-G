function piFrag(idx, _x, _y) {
    const digits = largePI.cyclicSubstring(
        (BigInt(idx) + offsetMan.getOffset()) * 9n,
        9,
    );
    const r = Math.round(255 * (parseInt(digits.substring(0, 3)) / 999));
    const g = Math.round(255 * (parseInt(digits.substring(3, 6)) / 999));
    const b = Math.round(255 * (parseInt(digits.substring(6, 9)) / 999));
    return [r, g, b, 255];
    //return `rgb(${r}, ${g}, ${b})`;
}

offsetMan.setDrawingMethod(piFrag);

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

piCanvas.draw(piFrag);
