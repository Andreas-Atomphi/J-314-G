filterManager.readySubject.addObserver(filterViewManager.refreshUsableView);

filterManager.setupFilters((subscribeFilter) => {
    subscribeFilter(
        "inverse",
        (_idx, _x, _y, currentColor) =>
            new Color(
                255 - currentColor.r,
                255 - currentColor.g,
                255 - currentColor.b
            )
    );
    subscribeFilter("black and white", (_idx, _x, _y, currentColor) => {
        const gray =
            0.3 * currentColor.r +
            0.59 * currentColor.g +
            0.11 * currentColor.b;
        const bw = gray > 128 ? 255 : 0; // Threshold for black or white
        return Color.all(bw);
    });
    subscribeFilter("grayscale", (_idx, _x, _y, currentColor) => {
        const gray =
            0.3 * currentColor.r +
            0.59 * currentColor.g +
            0.11 * currentColor.b;
        return Color.all(gray);
    });
    subscribeFilter(
        "sepia",
        (_idx, _x, _y, currentColor) =>
            new Color(
                0.393 * currentColor.r +
                    0.769 * currentColor.g +
                    0.189 * currentColor.b,
                0.349 * currentColor.r +
                    0.686 * currentColor.g +
                    0.168 * currentColor.b,
                0.272 * currentColor.r +
                    0.534 * currentColor.g +
                    0.131 * currentColor.b
            )
    );
    subscribeFilter("brightness", (_idx, _x, _y, currentColor) => {
        const brightnessFactor = 1.2;
        return new Color(
            Math.min(255, currentColor.r * brightnessFactor),
            Math.min(255, currentColor.g * brightnessFactor),
            Math.min(255, currentColor.b * brightnessFactor)
        );
    });

    subscribeFilter("darken", (_idx, _x, _y, currentColor) => {
        const factor = 0.7;
        return new Color(
            currentColor.r * factor,
            currentColor.g * factor,
            currentColor.b * factor,
        );
    })

    subscribeFilter("high contrast", (_idx, _x, _y, currentColor) => {
        const contrast = 1.5; // Fator de contraste
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        const mediumValue = 128;
        const adjustColorField = (colorField) =>
            Math.min(
                255,
                Math.max(0, factor * (colorField - mediumValue) + mediumValue)
            );
        return new Color(
            adjustColorField(currentColor.r),
            adjustColorField(currentColor.g),
            adjustColorField(currentColor.b)
        );
    });

    /*
    subscribeFilter("bulge", (_idx, pixelX, pixelY, currentColor) => {
        const centerX = piCanvas.width / 2;
        const centerY = piCanvas.height / 2;

        const intensity = 0.5;
        const radius = Math.min(piCanvas.width, piCanvas.height) / 3;

        const dx = pixelX - centerX;
        const dy = pixelY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            // Calcular a força da distorção
            const factor = (1 - distance / radius) * intensity;

            // Calcular a nova posição do pixel
            const newX = pixelX + dx * factor;
            const newY = pixelY + dy * factor;

            // Garantir que as novas coordenadas estejam dentro da imagem
            const boundedX = Utils.clamp(
                Math.round(newX),
                0,
                piCanvas.width - 1
            );
            const boundedY = Utils.clamp(
                Math.round(newY),
                0,
                piCanvas.height - 1
            );

            // Retornar a cor do pixel deslocado
            return piCanvas.getColorAt(boundedX, boundedY);
        } else {
            // Fora do raio, manter a cor original
            return currentColor;
        }
    });
    */
});
