filter_manager.addFilter("inverse", (_idx, _x, _y, currentColor) => {
    return currentColor.inverse();
});

filter_manager.addFilter("black and white", (_idx, _x, _y, currentColor) => {
    return currentColor.toBlackAndWhite();
});
