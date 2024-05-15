async function main() {
    piCanvas.updateDrawingMethod(piDrawMethod);
    await piMan.refreshPi();
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
                offsetMan.offset = BigInt(offsetMan.offsetView.value),
            ControlLeft: () => (ctrlPressed.left = true),
            ControlRight: () => (ctrlPressed.right = true),
            ArrowLeft() {
                if (ctrlPressed.any() == true)
                    offsetMan.offset -= 1;
            },
            ArrowRight() {
                if (ctrlPressed.any() == true)
                    offsetMan.offset += 1;
            }
        };
        if (actions[ev.code] != null) {
            actions[ev.code]();
        }
    });
}

function setupButtons() {
    /** @type {HTMLInputElement[]} */
    const offsetChangerButtons = document.querySelectorAll(".offset-changer-button");
    for(const offsetChangerButton of offsetChangerButtons){
        offsetChangerButton.addEventListener('click', ev => {
            offsetMan.offset += BigInt(offsetChangerButton.getAttribute("data-offset-changer"));
        })
    }
}

const piDrawMethod = (idx, _x, _y) => {
    const pi = piMan.pi;
    const digits = pi.cyclicSubstring(
        (BigInt(idx) + offsetMan.offset) * 6n,
        6,
    );
    return Color.fromHex(digits);
    //return `rgb(${r}, ${g}, ${b})`;
}

main();
