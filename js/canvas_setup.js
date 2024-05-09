/** @type {{function(BigInt):void, function(BigInt):void, function():BigInt, function():void}} */
const offsetMan = (() => {
    let offset = 0n;
    let drawingMethod;
    const changeOffsetBy = (value) => setOffset(offset + BigInt(value));
    const getOffset = () => offset;
    const setDrawingMethod = (callback) => (drawingMethod = callback);
    function setOffset(value) {
        if (!piCanvas.isAvailable()) return;
        offset = BigInt(value);
        offsetView.value = offset;
        piCanvas.refresh(drawingMethod);
    }
    /** @type {HTMLInputElement}*/
    const offsetView = document.querySelector("#offset-view");
    return {
        offsetView,
        changeOffsetBy,
        getOffset,
        setOffset,
        setDrawingMethod,
    };
})();

const piCanvas = (() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#p-canvas");

    /** @type {HTMLDivElement} */
    const loadingOverlay = document.querySelector(".loading-overlay");

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    const setWidth = (value) => (canvas.width = value);
    const getWidth = () => canvas.width;

    const setHeight = (value) => (canvas.height = value);
    const getHeight = () => canvas.height;

    /**
     * @function
     * @param {Function(Number, Number, Number): String} callback
     * @param {{ x: number; y: number; }} [from={ x: 0, y: 0 }]
     * */
    function draw(callback, from = { x: 0, y: 0 }) {
        const imageWidth = getWidth();
        const imageHeight = getHeight();

        let x = from.x;
        let y = from.y;

        if (loadingOverlay.classList.contains("animated-invisible")) {
            loadingOverlay.classList.remove("animated-invisible");
        }

        const currentOffset = offsetMan.getOffset();
        const startTime = performance.now();

        while (y < imageHeight) {
            while (x < imageWidth) {
                if (currentOffset != offsetMan.getOffset()) {
                    ctx.clearRect(0, 0, imageWidth, imageHeight);
                    return;
                }
                ctx.fillStyle = callback(imageWidth * y + x, x, y);
                ctx.fillRect(x, y, 1, 1);

                if (performance.now() - startTime > 30) {
                    return setTimeout(() => draw(callback, { x, y }), 30);
                }

                x++;
            }
            x = 0;
            y++;
        }

        loadingOverlay.classList.add("animated-invisible");
    }

    /** @function
     * @returns{Boolean}
     */
    const isAvailable = () =>
        loadingOverlay.classList.contains("animated-invisible");

    /** @function
     *  @param {Function(Number, Number, Number):String}
     *  @returns{void}
     * */
    function refresh(callback) {
        ctx.clearRect(0, 0, getWidth(), getHeight());
        draw(callback);
    }

    ctx.imageSmoothingEnabled = false;

    return {
        loadingOverlay,
        ctx,
        setWidth,
        getWidth,
        setHeight,
        getHeight,
        draw,
        isAvailable,
        refresh,
    };
})();
