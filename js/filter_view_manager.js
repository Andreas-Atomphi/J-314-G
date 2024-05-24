const filterViewManager = (() => {
    /**
     * @type {HTMLUListElement}
     * @private
     * */
    const _usingView = document.querySelector("#using-filter-list");

    /**
     * @type {HTMLUListElement}
     * @private
     * */
    const _usableView = document.querySelector("#usable-filter-list");

    /**
     * @type {int}
     * @private
     * */
    let _usableFocused = 0;

    /**
     * @type{int}
     * @private
     * */
    let _usingFocused = 0;

    /**
     * @function selectedIndexSetAction
     * @param {int} index
     * @returns {void}
     */

    /**
     * @function setupRadioItem
     * @param {HTMLLIElement} filterViewItem
     * @param {HTMLUListElement} listView
     * @param {selectedIndexSetAction} selectedIndexSet
     */
    function setupRadioItem(filterViewItem, listView, selectedIndexSet) {
        filterViewItem.addEventListener("click", (_e) => {
            /** @type {Node[]} */
            const childNodes = Array.from(listView.childNodes).filter(
                (value, _index, _arr) => value.nodeType == "1"
            );
            selectedIndexSet(childNodes.indexOf(filterViewItem));
            for (const item of childNodes) {
                item.classList.remove("active");
            }
            filterViewItem.classList.add("active");
        });
    }

    /**
     * @function draggableFilterViewItem
     * @param{int} filterIdx
     * @returns{HTMLLIElement}
     * */
    function usingFilterViewItem(filterIdx) {
        const filter = filterManager.usableFilters[filterIdx];
        /** @type {HTMLLIElement} */
        const filterViewItem = filter.toHtmlElement();
        setupRadioItem(
            filterViewItem,
            _usingView,
            (index) => (_usingFocused = index)
        );
        return filterViewItem;
    }

    return {
        /**
         * @method refreshUsableView
         * @param {Filter[]}
         * @returns {void}
         * */
        refreshUsableView() {
            for (const filter of filterManager.usableFilters) {
                const filterViewItem = filter.toHtmlElement();
                _usableView.appendChild(filterViewItem);
                setupRadioItem(
                    filterViewItem,
                    _usableView,
                    (index) => (_usableFocused = index)
                );
            }
        },
        resfreshUsingView() {
            _usingView.clearChildren();
            for (const filterIdx of filterManager.usingFiltersIndexes) {
                _usingView.appendChild(usingFilterViewItem(filterIdx));
            }
        },
        addUsingFilter() {
            if (_usableFocused < 0) return;
            if (_usableFocused >= filterManager.usableFilters.length) return;
            _usingView.appendChild(usingFilterViewItem(_usableFocused));
        },
        apply() {
            const names = Array.from(_usingView.childNodes).map(
                (value, _index, _arr) => value.lastChild.textContent
            );
            filterManager.refreshUsing(names);
        },
        /**
         * @method moveUsingView
         * @param {int} direction
         */
        moveUsingView(direction) {
            const childNodes = _usingView.childNodes;
            const indexSet = _usingFocused + direction;
            if (indexSet < 0 || indexSet >= childNodes.length || direction == 0)
                return;
            const sibling =
                childNodes[direction < 0 ? _usingFocused : _usingFocused + 1];
            const toMove =
                childNodes[direction < 0 ? _usingFocused - 1 : _usingFocused];
            _usingView.insertBefore(sibling, toMove);
            _usingFocused = indexSet;
        },
        /**
         * @method moveUsingViewTo
         * @param {string} value
         * @returns {void}
         */
        moveUsingViewTo(value) {
            if (value == null) return;
            if (value != "top" && value != "bottom") return;
            if (!_usingView.hasChildNodes()) return;
            const childNodes = Array.from(_usingView.childNodes).filter(
                (value, _index, _arr) => value.nodeType == "1"
            );
            const targetIndex = value == "top" ? 0 : childNodes.length - 1;
            if (targetIndex - _usingFocused == 0) return;
            if (value == "top") {
                _usingView.insertBefore(
                    childNodes[_usingFocused],
                    _usingView.firstChild
                );
            } else {
                _usingView.appendChild(childNodes[_usingFocused]);
            }
            _usingFocused = targetIndex;
        },
        removeUsingView() {
            if (!_usingView.hasChildNodes()) return;
            if (
                _usingFocused < 0 ||
                _usableFocused >= _usingView.childNodes.length
            )
                return;
            _usingView.childNodes[_usingFocused].remove();
            clamp(_usingFocused, 0, _usingView.childNodes.length);
        },
    };
})();
