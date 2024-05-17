
/** @type {{HTMLInputElement, bigint}} */
const offset = (() => {

    /** @type {bigint} */
    let _value = 0n;
    
    /** @type {AsyncSequentialSubject} */
    const _subject = new AsyncSequentialSubject();

    /** @type {HTMLInputElement}*/
    const _view = document.querySelector("#offset-view");
    _view.addEventListener('change', () => (_value = _view.value));

    return {
        get view() { return _view; },
        get subject() { return _subject },
        set value(value) {
            if (!piCanvas.isAvailable()) return;
            _value = BigInt(value);
            _view.value = _value;
            _subject.callObservers(); 
        },
        get value() {
            return _value;
        },
    };
})();
