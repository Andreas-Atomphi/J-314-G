function piFrag(idx, _x, _y) {
    const digits = largePI.cyclicSubstring(
        (BigInt(idx) + offsetMan.getOffset()) * 9n,
        9,
    );
    const r = Math.round(255 * (parseInt(digits.substring(0, 3)) / 999));
    const g = Math.round(255 * (parseInt(digits.substring(3, 6)) / 999));
    const b = Math.round(255 * (parseInt(digits.substring(6, 9)) / 999));
    return new Color(r, g, b, 255);
    //return `rgb(${r}, ${g}, ${b})`;
}

const ctrlPressed = {left: false, right: false}
ctrlPressed.any = () => ctrlPressed.left || ctrlPressed.right;

document.addEventListener("keyup", (ev) => {
    const actions = {
        ControlLeft: () => ctrlPressed.left = false,
        ControlRight: () => ctrlPressed.right = false
    }
    if (actions[ev.code] != null) {
        actions[ev.code]();
    }
})

document.addEventListener("keydown", (ev) => {
    const actions = {
        Enter: () =>  offsetMan.setOffset(BigInt(offsetMan.offsetView.value)),
        ControlLeft: () => ctrlPressed.left = true,
        ControlRight: () => ctrlPressed.right = true,
        ArrowLeft () {
            if (ctrlPressed.any() == true) offsetMan.changeOffsetBy(-1, true)
        },
        ArrowRight: () => (ctrlPressed.any() == true) ? offsetMan.changeOffsetBy(1, true) : null,
    }
    if (actions[ev.code] != null) {
        actions[ev.code]();
    }
});


piCanvas.setDrawingMethod(piFrag);
piCanvas.draw();
