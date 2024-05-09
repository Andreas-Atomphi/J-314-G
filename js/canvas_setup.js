/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#p-canvas");

/** @type {HTMLDivElement} */
const loadingOverlay = document.querySelector(".loading-overlay");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

/** @type {Number} imageWidth */
const imageWidth = 240;

/** @type {Number} imageHeight */
const imageHeight = 135;

/**
 * @function
 * @param {Function(Number, Number, Number): String} callback
 * @param {{ x: number; y: number; }} [from={ x: 0, y: 0 }]
 * */
function canvasDraw(callback, from = { x: 0, y: 0 }) {
    const currentOffset = offsetMan.getOffset();
    const startTime = performance.now();

    let x = from.x;
    let y = from.y;
    
    if (loadingOverlay.classList.contains("animated-invisible")) {
        loadingOverlay.classList.remove("animated-invisible");
    }
    while (y < imageHeight) {
        while (x < imageWidth) {
            if (currentOffset != offsetMan.getOffset()){
                ctx.clearRect(0, 0, imageWidth, imageHeight);
                return;
            }
            ctx.fillStyle = callback(imageWidth * y + x, x, y);
            ctx.fillRect(x, y, 1, 1);

            if (performance.now() - startTime > 30) {
                return setTimeout(() => canvasDraw(callback, { x, y }), 30);
            }

            x++;
        }
        x = 0;
        y++;
    }

    loadingOverlay.classList.add("animated-invisible")
}

/** @function
 *  @param {Function(Number, Number, Number):String}
 *  @returns{void}
 * */
function refreshCanvas(callback) {
    ctx.clearRect(0, 0, imageWidth, imageHeight);
    canvasDraw(callback);
}

/** @function
 * @returns{Boolean}
*/
function isCanvasAvailable(){
    return loadingOverlay.classList.contains("animated-invisible");
}

ctx.scale(3, 3);
