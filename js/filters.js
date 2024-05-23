filterManager.readySubject.addObserver(filterViewManager.refreshUsableView);

filterManager.setupFilters((subscribeFilter) => {
    subscribeFilter("inverse", (_idx, _x, _y, currentColor) => {
        return currentColor.inverse();
    });
    subscribeFilter("black and white", (_idx, _x, _y, currentColor) => {
        return currentColor.toBlackAndWhite();
    });
});
