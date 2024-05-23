async function main() {
    piCanvas.updateDrawingMethod(piDrawMethod);
    pi.subject.addObserver(piCanvas.refreshProgressBar);
    offset.subject.addObserver(pi.refresh);
    offset.subject.addObserver(piCanvas.draw);
    await pi.refresh();
    filterManager.applySubject.addObserver(piCanvas.refresh);
    setupHotkeys();
    setupButtons();
    piCanvas.draw();
}

function setupHotkeys() {
    const ctrlPressed = {
        left: false,
        right: false,
        any() {
            return this.left || this.right;
        },
    };

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
            Enter: () => (offset.value = BigInt(offset.view.value)),
            ControlLeft: () => (ctrlPressed.left = true),
            ControlRight: () => (ctrlPressed.right = true),
            ArrowLeft() {
                if (ctrlPressed.any() == true) offset.value -= 1n;
            },
            ArrowRight() {
                if (ctrlPressed.any() == true) offset.value += 1n;
            },
        };
        if (actions[ev.code] != null) {
            actions[ev.code]();
        }
    });
}

function setupButtons() {
    /** @type {NodeListOf<Element>} */
    const offsetChangerButtons = document.querySelectorAll(
        ".offset-changer-button",
    );
    for (const offsetChangerButton of offsetChangerButtons) {
        offsetChangerButton.addEventListener("click", (_ev) => {
            offset.value += BigInt(
                offsetChangerButton.getAttribute("data-offset-changer"),
            );
        });
    }
}

/**
 * @param{number} idx
 * @param{number} _x
 * @param{number} _y
 * @param{Color} _currentColor
 * @returns{Color}
 */
const piDrawMethod = (idx, _x, _y, _currentColor = new Color(0, 0, 0)) => {
    const digits = pi.value.cyclicSubstring(
        (BigInt(idx) + offset.value) * 6n,
        6,
    );
    return Color.fromHex(digits);
};

main();
