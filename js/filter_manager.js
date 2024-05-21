class Filter {
    constructor(name, callback) {
        /** @type {string} */
        this.name = name;

        /** @type {Function(number, [number, number, Color]):Color} */
        this.callback = callback;
    }

    toHtmlElement() {
        return `<li draggable="true">${this.name}</li>`;
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

    /** @type {drawMethod[]} */
    let _usingFilters = [];

    /**
     * @type {HTMLUListElement}
     * @private
     * */
    const _view = document.querySelector("#filter-list-view");

    return {
        /**
         * @method subscribeFilter
         * @param {string} name
         * @param {drawMethod} callback
         */
        subscribeFilter(name, callback) {
            if (_usableFilters.some((e, _index, _arr) => e.name == name))
                return;
            _usableFilters.push(new Filter(name, callback));
        },
        get usableFilters() {
            return Array.from(_usableFilters);
        },
        get view() {
            return _view;
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
            if (_view.firstChild == null) {
                _usingFilters = [];
                return;
            }
            _usingFilters = [..._view.childNodes];
            _view.clearChildren();
            for (const filter of _usingFilters) {
                const filterViewItem = new HTMLLIElement();
                filterViewItem.classList.add(
                    "sortable-list-button",
                    "sortable-list-item",
                );
                filterViewItem.draggable = true;

                const gripDots = new HTMLSpanElement();
                gripDots.classList.add("grippy");

                const text = new HTMLSpanElement();
                text.textContent = filter.name;

                filterViewItem.appendChild(gripDots);
                filterViewItem.appendChild(text);

                _view.appendChild(filterViewItem);
            }
        },
    };
})();
