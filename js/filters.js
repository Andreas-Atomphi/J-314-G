filter_manager.subscribeFilter("inverse", (_idx, _x, _y, currentColor) => {
    return currentColor.inverse();
});

filter_manager.subscribeFilter(
    "black and white",
    (_idx, _x, _y, currentColor) => {
        return currentColor.toBlackAndWhite();
    },
);
