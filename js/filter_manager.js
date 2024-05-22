class Filter {
    constructor(name, callback) {
        /** @type {string} */
        this.name = name;

        /** @type {Function(number, [number, number, Color]):Color} */
        this.callback = callback;
    }

    /**
     * @method toHtmlElement
     * @returns {HTMLLIElement}
     * */
    toHtmlElement() {
        /** @type {HTMLLIElement} */
        const filterViewItem = document.createElement("li");
        filterViewItem.classList.add(
            "sortable-list-button",
            "sortable-list-item",
        );
        filterViewItem.draggable = true;

        /** @type {HTMLSpanElement} */
        const text = document.createElement("span");
        text.textContent = this.name;

        filterViewItem.appendChild(text);
        return filterViewItem;
    }
}

const filter_manager = (() => {
    /** @type {Subject} */
    const _subject = new Subject();

    /**
     * @type{Filter[]}
     * @private
     * */
    const _usableFilters = [];

    /** @type {Filter[]} */
    let _usingFilters = [];

    /**
     * @type {HTMLUListElement}
     * @private
     * */
    const _usingView = document.querySelector("#using-filter-list");
    const _usableView = document.querySelector("#usable-filter-list");

    return {
        /**
         * @method subscribeFilter
         * @param {string} name
         * @param {drawMethod} callback
         */
        subscribeFilter(name, callback) {
            if (_usableFilters.some((e, _index, _arr) => e.name == name))
                return;
            const filter = new Filter(name, callback)
            _usableFilters.push(filter);
            _usableView.appendChild(filter.toHtmlElement());
            
        },
        get usableFilters() {
            return Array.from(_usableFilters);
        },
        get view() {
            return _usingView;
        },
        get subject() {
            return _subject;
        },
        get usingFilters() {
            return _usingFilters;
        },
        /**
         * @method apply
         * @returns {void}
         * */
        apply() {
            if (_usingView.firstChild == null) {
                _usingFilters = [];
                return;
            }
            _usingFilters = [..._usingView.childNodes].map(
                (view, _index, _arr) => _usableFilters.find(
                    (value, _index, _arr) => value.name.toLowerCase() == view.textContent.toLowerCase()
                )
            );
            _usingView.clearChildren();
            for (const filter of _usingFilters) {
                /** @type {HTMLSpanElement} */
                const gripDots = document.createElement("span");
                gripDots.classList.add("grippy");
                const filterHtmlElement = filter.toHtmlElement();
                filterHtmlElement.prepend(gripDots);
                _usingView.appendChild(filterHtmlElement);
            }
            _subject.callObservers();
        },
    };
})();
