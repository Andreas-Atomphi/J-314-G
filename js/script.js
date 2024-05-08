/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#p-canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const imageWidth = 240;
const imageHeight = 135;

function posmod(a, b) {
  return ((a % b) + b) % b;
}

/** @type {HTMLInputElement}*/
const offsetView = document.querySelector("#offset-view");
const offsetMan = (() => {
  let offset = 0n;
  function setOffset(x) {
    offset = BigInt(x);
    offsetView.value = offset;
    refreshCanvas();
  }
  function changeOffsetBy(x) {
    setOffset(offset + BigInt(x));
  }
  const getOffset = () => offset;
  return {
    setOffset,
    changeOffsetBy,
    getOffset,
  };
})();

function getCyclicDigits(text, startIndex) {
  const RESULT_LENGTH = 9n;
  const maxLength = BigInt(text.length);
  let result = "";
  for (let i = 0n; i < RESULT_LENGTH; i++) {
    const index = posmod(startIndex + i, maxLength);
    result += text[index];
  }
  return result;
}

function frag(idx, x, y) {
  let digits = getCyclicDigits(
    largePI,
    (BigInt(idx) + offsetMan.getOffset()) * 9n,
  );
  let r = Math.round(255 * (parseInt(digits.substring(0, 3)) / 999));
  let g = Math.round(255 * (parseInt(digits.substring(3, 6)) / 999));
  let b = Math.round(255 * (parseInt(digits.substring(6, 9)) / 999));
  return `rgb(${r}, ${g}, ${b})`;
}

function canvasDraw(callback, from = { x: 0, y: 0 }) {
  const currentOffset = offsetMan.getOffset();
  const startTime = performance.now();

  let x = from.x;
  let y = from.y;

  const toNext = () => setTimeout(() => canvasDraw(callback, { x, y }), 30);

  while (y < imageHeight) {
    while (x < imageWidth) {
      if (currentOffset != offsetMan.getOffset())
        return setTimeout(() => refreshCanvas());

      ctx.fillStyle = callback(imageWidth * y + x, x, y);
      ctx.fillRect(x, y, 1, 1);

      if (performance.now() - startTime > 30) {
        return toNext();
      }

      x++;
    }
    x = 0;
    y++;
  }
}

function refreshCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  /** @type {Promise} */
  canvasDraw(frag);
}

document.addEventListener("keypress", (ev) => {
  const actions = {
    KeyA: () => offsetMan.changeOffsetBy(-1),
    KeyS: () => offsetMan.changeOffsetBy(1),
    Enter() {
      offsetMan.setOffset(BigInt(offsetView.value));
    },
  };
  if (actions[ev.code] != null) {
    actions[ev.code]();
  }
});

ctx.scale(3, 3);
canvasDraw(frag);
