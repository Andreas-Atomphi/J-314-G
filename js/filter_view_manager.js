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
     * @function draggableFilterViewItem
     * @param{int} filterIdx
     * @returns{HTMLLIElement}
     * */
    function draggableFilterViewItem(filterIdx) {
        const filter = filterManager.usableFilters[filterIdx];
        /** @type {HTMLSpanElement} */
        const filterViewItem = filter.toHtmlElement();
        filterViewItem.classList.add("sortable-list-item");
        filterViewItem.draggable = true;

        const gripDots = document.createElement("span");
        gripDots.classList.add("grippy");
        
        filterViewItem.prepend(gripDots);
        return filterViewItem;
    }

    /**
     * @type {int}
     * */
    let _usableFocused = 0;

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
                filterViewItem.addEventListener('click', _e => {
                    const childNodes = Array.from(_usableView.childNodes);
                    _usableFocused = childNodes.indexOf(filterViewItem);
                    for(const item of childNodes) {
                        item.classList.remove("active");
                    }
                    if(!filterViewItem.classList.contains("active")) filterViewItem.classList.add("active");
                })
            }
        },
        resfreshUsingView() {
            _usingView.clearChildren();
            for (const filterIdx of filterManager.usingFiltersIndexes) {
                _usingView.appendChild(draggableFilterViewItem(filterIdx));
            }
        },
        addUsingFilter(){
            if(_usableFocused < 0) return;
            if(_usableFocused >= filterManager.usableFilters.length) return;
            _usingView.appendChild(filterManager.usableFilters[_usableFocused].toHtmlElement());
        },
        apply(){
            const names = Array.from(_usingView.childNodes).map(
                (value, _index, _arr) => value.lastChild.textContent
            );
            filterManager.refreshUsing(names);
        }
    };
})();
