class Filter {

    constructor(name, callback){
        /** @type {string} */
        this.name = name;

        /** @type {Function(number, [number, number, Color]):Color} */
        this.callback = callback;
    }

    toHtmlElement() {
        return `<li draggable="true">${this.name}</li>`;
    }

}

const filter_manager = (()=>{

    /**
     * @type{Filter[]} 
     * @private
     * */
    let _usableFilters = [];

    return {
        /**
        * @param {string} name
        * @param {drawMethod} callback
        */
        addFilter(name, callback){
            if(_usableFilters.some((e, _index, _arr) => e.name == name)) return;
            _usableFilters.push(new Filter(name, callback));
        },
        get usableFilters() { return Array.from(_usableFilters); }
    }
})();
