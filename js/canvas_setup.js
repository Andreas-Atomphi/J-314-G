/** @type {{function(BigInt):void, function(BigInt):void, function():BigInt, function():void}} */
const offsetMan = (() => {
    let offset = 0n;
    const changeOffsetBy = (value, fromView = false) =>
        setOffset(
            (fromView == false ? offset : BigInt(offsetView.value)) +
                BigInt(value),
        );
    const getOffset = () => offset;
    function setOffset(value) {
        if (!piCanvas.isAvailable()) return;
        offset = BigInt(value);
        offsetView.value = offset;
        piMan.refreshPi().then((data) => piCanvas.refresh());
    }
    /** @type {HTMLInputElement}*/
    const offsetView = document.querySelector("#offset-view");
    return {
        offsetView,
        changeOffsetBy,
        getOffset,
        setOffset,
    };
})();

const piCanvas = (() => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#p-canvas");

    /** @type {HTMLDivElement} */
    const loadingOverlay = document.querySelector(".loading-overlay");

    /** @type {HTMLDivElement} */
    const progressBar = document.querySelector(".progress-bar-container div");

    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
        alpha: false,
    });
    ctx.imageSmoothingEnabled = false;

    /**
     * @function
     * @param {Number} value
     * @returns {Number}
     */
    const setWidth = (value) => (canvas.width = value);

    /**
     * @function
     * @returns {Number}
     */
    const getWidth = () => canvas.width;

    /**
     * @function
     * @param {Number} value
     * @returns {Number}
     */
    const setHeight = (value) => (canvas.height = value);

    /**
     * @function
     * @returns {Number}
     */
    const getHeight = () => canvas.height;

    /**
     * @function
     * @returns {Number}
     */
    const getPixelCount = () => canvas.width * canvas.height;

    /** @type {Function(Number, [Number, Number]): Color} */
    let drawingMethod;

    /**
     * @function
     * @param {Function(Number, Number, Number): Color}
     * @returns {void}
     */
    const setDrawingMethod = (callback) => (drawingMethod = callback);

    /**
     * @function
     * @returns {Function(Number, Number, Number):Color}
     * */
    const getDrawingMethod = () => drawingMethod;

    /**
     * @function
     * @returns {void}
     */
    function showLoading() {
        if (loadingOverlay.classList.contains("animated-invisible"))
            loadingOverlay.classList.remove("animated-invisible");
    }

    /**
     * @function
     * @returns {void}
     */
    function hideLoading() {
        if (!loadingOverlay.classList.contains("animated-invisible"))
            loadingOverlay.classList.add("animated-invisible");
    }

    /**
     * @function
     * @param {Number|BigInt} value
     * @returns {void}
     */
    function refreshProgressBar(value) {
        const MAX = getPixelCount() * 6;
        progressBar.style.width = `${(100 / MAX) * value}%`;
    }

    /**
     * @function
     * @param {{ x: number; y: number; }} [from={ x: 0, y: 0 }]
     * */
    function draw(from = { x: 0, y: 0 }) {
        const imageWidth = getWidth();
        const imageHeight = getHeight();

        let x = from.x;
        let y = from.y;

        setAvailable(false);

        const currentOffset = offsetMan.getOffset();
        const startTime = performance.now();

        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);

        while (y < imageHeight) {
            while (x < imageWidth) {
                if (currentOffset != offsetMan.getOffset()) {
                    ctx.clearRect(0, 0, imageWidth, imageHeight);
                    return;
                }
                const pixelIdx = imageWidth * y + x;
                const pixelColor = drawingMethod(pixelIdx, x, y);
                const pixelIdxColor = pixelIdx * 4;
                imageData.data[pixelIdxColor] = pixelColor.r;
                imageData.data[pixelIdxColor + 1] = pixelColor.g;
                imageData.data[pixelIdxColor + 2] = pixelColor.b;

                if (performance.now() - startTime > 200) {
                    setTimeout(() => draw({ x, y }), 20);
                    ctx.putImageData(imageData, 0, 0);
                    return;
                }

                x++;
            }
            x = 0;
            y++;
        }
        ctx.putImageData(imageData, 0, 0);
        setAvailable(true);
    }

    /**
     * @function
     * @returns{Boolean}
     */
    const isAvailable = () =>
        loadingOverlay.classList.contains("animated-invisible");

    /**
     * @function
     * @param {Boolean} value
     * @returns {void}
     */
    const setAvailable = (value) =>
        (value == true ? hideLoading : showLoading)();

    /** @function
     *  @param {Function(Number, Number, Number):String}
     *  @returns{void}
     * */
    function refresh() {
        ctx.clearRect(0, 0, getWidth(), getHeight());
        draw();
    }

    return {
        loadingOverlay,
        ctx,
        setWidth,
        getWidth,
        setHeight,
        getHeight,
        draw,
        setAvailable,
        isAvailable,
        refresh,
        setDrawingMethod,
        getDrawingMethod,
        refreshProgressBar,
    };
})();
