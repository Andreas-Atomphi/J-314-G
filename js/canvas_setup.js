/**
 * @callback drawMethod
 * @param {int} pixelIdx
 * @param {int} [x]
 * @param {int} [y]
 * @param {Color} [currentColor]
 * @returns {Color}
 */

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

    /** @type {drawMethod} */
    let _drawingMethod;

    /**
     * @function
     * @param {drawMethod} callback
     * @returns {void}
     */
    const updateDrawingMethod = (callback) => (_drawingMethod = callback);
    function eraseDrawingMethod() {
        callback = null;
    }

    /** @returns {void} */
    function showLoading() {
        if (loadingOverlay.classList.contains("animated-invisible"))
            loadingOverlay.classList.remove("animated-invisible");
    }

    /** @returns {void} */
    function hideLoading() {
        if (!loadingOverlay.classList.contains("animated-invisible"))
            loadingOverlay.classList.add("animated-invisible");
    }

    /**
     * @param {number|bigint} value
     * @returns {void}
     */
    function refreshProgressBar(value) {
        const MAX = canvas.width * canvas.height * 6;
        progressBar.style.width = `${(100 / MAX) * value}%`;
    }

    /** @param {{ x: number; y: number; }} [from={ x: 0, y: 0 }] */
    function draw({ x = 0, y = 0 } = {}) {
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;

        setAvailable(false);

        const currentOffset = offset.value;
        const startTime = performance.now();

        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);

        while (y < imageHeight) {
            while (x < imageWidth) {
                if (currentOffset != offset.value) {
                    ctx.clearRect(0, 0, imageWidth, imageHeight);
                    return;
                }
                const pixelIdx = imageWidth * y + x;
                const pixelColor = _drawingMethod(pixelIdx, x, y).apply(
                    (color) => {
                        for (const filterIdx of filterManager.usingFiltersIndexes) {
                            color = filterManager.usableFilters[
                                filterIdx
                            ].callback(pixelIdx, x, y, color);
                        }
                        return color;
                    }
                );
                const pixelIdxColor = pixelIdx * 4;
                imageData.data[pixelIdxColor] = pixelColor.r;
                imageData.data[pixelIdxColor + 1] = pixelColor.g;
                imageData.data[pixelIdxColor + 2] = pixelColor.b;

                if (performance.now() - startTime > 200) {
                    ctx.putImageData(imageData, 0, 0);
                    setTimeout(() => draw({ x, y }), 20);
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

    /** @returns{boolean} */
    const isAvailable = () =>
        loadingOverlay.classList.contains("animated-invisible");

    /**
     * @param {boolean} value
     * @returns {void}
     */
    const setAvailable = (value) =>
        (value == true ? hideLoading : showLoading)();

    /**
     * @returns{void}
     */
    function refresh() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }

    /**
     * @function
     */
    function getColorAt(x, y) {
        /** @type {ImageData} */
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const prefix = (canvas.height * y + x) * 4;
        return new Color(
            imageData[prefix],
            imageData[prefix + 1],
            imageData[prefix + 2]
        );
    }

    return {
        loadingOverlay,
        ctx,
        draw,
        set width(value) {
            canvas.width = value;
        },
        get width() {
            return canvas.width;
        },
        set height(value) {
            canvas.height = value;
        },
        get height() {
            return canvas.height;
        },
        get pixelCount() {
            return this.width * this.height;
        },
        setAvailable,
        isAvailable,
        refresh,
        updateDrawingMethod,
        get drawingMethod() {
            return _drawingMethod;
        },
        eraseDrawingMethod,
        refreshProgressBar,
        getColorAt,
    };
})();
