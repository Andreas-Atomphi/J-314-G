async function main() {
    piCanvas.setDrawingMethod(piMethod);
    await piMan.refreshPi();

    piCanvas.draw();
}

function setupHotkeys() {
    const ctrlPressed = { left: false, right: false };
    ctrlPressed.any = () => ctrlPressed.left || ctrlPressed.right;

    document.addEventListener("keyup", (ev) => {
        const actions = {
            ControlLeft: () => (ctrlPressed.left = false),
            ControlRight: () => (ctrlPressed.right = false),
        };
        if (actions[ev.code] != null) {
            actions[ev.code]();
        }
    });

    document.addEventListener("keydown", (ev) => {
        const actions = {
            Enter: () =>
                offsetMan.setOffset(BigInt(offsetMan.offsetView.value)),
            ControlLeft: () => (ctrlPressed.left = true),
            ControlRight: () => (ctrlPressed.right = true),
            ArrowLeft() {
                if (ctrlPressed.any() == true)
                    offsetMan.changeOffsetBy(-1, true);
            },
            ArrowRight: () =>
                ctrlPressed.any() == true
                    ? offsetMan.changeOffsetBy(1, true)
                    : null,
        };
        if (actions[ev.code] != null) {
            actions[ev.code]();
        }
    });
}

function piMethod(idx, _x, _y) {
    const pi = piMan.getPi();
    const digits = pi.cyclicSubstring(
        (BigInt(idx) + offsetMan.getOffset()) * 6n,
        6,
    );
    return Color.fromHex(digits);
    //return `rgb(${r}, ${g}, ${b})`;
}

main();
