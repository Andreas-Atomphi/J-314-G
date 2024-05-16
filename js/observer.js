class Subject {
    constructor() {
        this._observers = new Set();
    }

    /** @param {Function} */
    addObserver(observer) {
        this._observers.add(observer);
    }

    /** @param {Function} */
    removeObserver(observer) {
        this._observers.delete(observer);
    }

    /** @param {*} */
    async notifyObservers(data) {
        for(const observer of this._observers) observer(data);
    }

    async callObservers() {
        for(const observer of this._observers) observer();
    }


}
