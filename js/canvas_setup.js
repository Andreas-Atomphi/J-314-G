/** @type {{HTMLInputElement, bigint}} */
const offsetMan = (() => {

    /** @type {bigint} */
    let _offset = 0n;

    /** @type {HTMLInputElement}*/
    const offsetView = document.querySelector("#offset-view");
    offsetView.addEventListener('change', () => (_offset = offsetView.value));

    return {
        offsetView,
        set offset(value) {
            if (!piCanvas.isAvailable()) return;
            _offset = BigInt(value);
            offsetView.value = _offset;
            piMan.refreshPi().then(piCanvas.refresh);   
        },
        get offset() {
            return _offset;
        },
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

    /** @type {Function(Number, [Number, Number]): Color} */
    let _drawingMethod;

    /**
     * @function
     * @param {Function(Number, Number, Number): Color}
     * @returns {void}
     */
    const updateDrawingMethod = (callback) => (_drawingMethod = callback);

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
        const MAX = canvas.width * canvas.height * 6;
        progressBar.style.width = `${(100 / MAX) * value}%`;
    }

    /**
     * @function
     * @param {{ x: number; y: number; }} [from={ x: 0, y: 0 }]
     * */
    function draw(from = { x: 0, y: 0 }) {
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;


        setAvailable(false);

        const currentOffset = offsetMan.offset;
        const startTime = performance.now();

        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);

        for (let y = from.x; y < imageHeight; y ++) {
            for (let x = from.x; x < imageWidth; x++) {
                if (currentOffset != offsetMan.offset) {
                    ctx.clearRect(0, 0, imageWidth, imageHeight);
                    return;
                }
                const pixelIdx = imageWidth * y + x;
                const pixelColor = _drawingMethod(pixelIdx, x, y);
                const pixelIdxColor = pixelIdx * 4;
                imageData.data[pixelIdxColor] = pixelColor.r;
                imageData.data[pixelIdxColor + 1] = pixelColor.g;
                imageData.data[pixelIdxColor + 2] = pixelColor.b;

                if (performance.now() - startTime > 200) {
                    ctx.putImageData(imageData, 0, 0);
                    setTimeout(() => draw({ x, y }), 20);
                    return;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
        setAvailable(true);
    }

    /**
     * @function
     * @returns{boolean}
     */
    const isAvailable = () =>
        loadingOverlay.classList.contains("animated-invisible");

    /**
     * @function
     * @param {boolean} value
     * @returns {void}
     */
    const setAvailable = (value) =>
        (value == true ? hideLoading : showLoading)();

    /** @function
     *  @param {Function(number, number, number):String}
     *  @returns{void}
     * */
    function refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }

    return {
        loadingOverlay,
        ctx,
        draw,
        set width(value) { canvas.width = value; },
        get width() { return canvas.width; },
        set height(value) { canvas.height = value },
        get height() { return canvas.height; },
        get pixelCount() { return this.width * this.height; },
        setAvailable,
        isAvailable,
        refresh,
        updateDrawingMethod,
        get drawingMethod() { return _drawingMethod; },
        refreshProgressBar,
    };
})();
