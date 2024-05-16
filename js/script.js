async function main() {
    piCanvas.updateDrawingMethod(piDrawMethod);
    pi.subject.addObserver(piCanvas.refreshProgressBar);
    offset.subject.addObserver(pi.refresh);
    await pi.refresh();
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
            Enter: () =>
                offset.value = BigInt(offset.view.value),
            ControlLeft: () => (ctrlPressed.left = true),
            ControlRight: () => (ctrlPressed.right = true),
            ArrowLeft() {
                if (ctrlPressed.any() == true)
                    offset.value -= 1;
            },
            ArrowRight() {
                if (ctrlPressed.any() == true)
                    offset.value += 1;
            }
        };
        if (actions[ev.code] != null) {
            actions[ev.code]();
        }
    });
}

function setupButtons() {
    /** @type {NodeListOf<Element>} */
    const offsetChangerButtons = document.querySelectorAll(".offset-changer-button");
    for(const offsetChangerButton of offsetChangerButtons){
        offsetChangerButton.addEventListener('click', _ev => {
            offset.value += BigInt(offsetChangerButton.getAttribute("data-offset-changer"));
        })
    }
}

const piDrawMethod = (idx, _x, _y) => {
    const digits = pi.value.cyclicSubstring(
        (BigInt(idx) + offset.value) * 6n,
        6,
    );
    return Color.fromHex(digits);
    //return `rgb(${r}, ${g}, ${b})`;
}

main();
