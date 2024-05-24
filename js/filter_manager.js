class Filter {
    constructor(name, callback) {
        /** @type {string} */
        this.name = name;

        /** @type {Function(number, [number, number, Color]):Color} */
        this.callback = callback;
    }

    /**
     * @method toHtmlElement
     * @returns {HTMLInputElement}
     * */
    toHtmlElement() {
        /** @type {HTMLLIElement} */
        const filterViewItem = document.createElement("li");
        filterViewItem.classList.add(
            "list-group-item",
            "list-group-item-action"
        );
        const inputButton = document.createElement("input");
        inputButton.classList.add("btn-check");
        inputButton.type = "radio";

        const label = document.createElement("label");
        label.textContent = this.name;

        filterViewItem.appendChild(inputButton);
        filterViewItem.appendChild(label);

        return filterViewItem;
    }
}

const filterManager = (() => {
    /** @type {Subject} */
    const _applySubject = new Subject();
    const _readySubject = new Subject();

    /**
     * @type{Filter[]}
     * @private
     * */
    const _usableFilters = [];

    /** @type {Filter[]} */
    let _usingFilters = [];

    return {
        /**
         * @function setupFilterFunction
         * @param {string} name
         * @param {drawMethod} callback
         * */
        /**
         * @method setupFilters
         * @param {setupFilterFunction} setup
         */
        setupFilters(setup) {
            setup((name, callback) => {
                if (_usableFilters.some((e, _index, _arr) => e.name == name))
                    return;
                const filter = new Filter(name, callback);
                _usableFilters.push(filter);
            });
            _readySubject.callObservers();
        },
        /**
         * @method getFilter
         * @param {int} idx
         * @returns {drawMethod}
         * */
        getFilter(idx) {
            return _usableFilters[_usingFilters[idx]].callback;
        },
        get usingFiltersIndexes() {
            return Array.from(_usingFilters);
        },
        get usableFilters() {
            return Array.from(_usableFilters);
        },
        get applySubject() {
            return _applySubject;
        },
        get readySubject() {
            return _readySubject;
        },
        /**
         * @method apply
         * @param {string[]} filterNames
         * @returns {void}
         * */
        refreshUsing(filterNames = []) {
            if (filterNames == null) {
                _usingFilters = [];
                _applySubject.callObserver();
                return;
            }
            _usingFilters = filterNames.map((name, _index, _arr) =>
                _usableFilters.findIndex(
                    (value, _index, _arr) =>
                        value.name.toLowerCase() == name.toLowerCase()
                )
            );
            _applySubject.callObservers();
        },
    };
})();
