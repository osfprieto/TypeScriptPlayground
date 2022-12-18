import { Pixel, PixelMatrix, PixelMatrixMetadata } from "./types";

export function resolveImageMetadata(pixelMatrix: PixelMatrix): Promise<PixelMatrixMetadata>{
    return new Promise((resolve, _reject) => {
        const height = pixelMatrix.length;
        const width = pixelMatrix[0].length;
        const max: Pixel = {
            alpha: 0,
            red: 0,
            green: 0,
            blue: 0
        }

        const min: Pixel = {
            alpha: 0,
            red: 0,
            green: 0,
            blue: 0
        }

        pixelMatrix.forEach((row) =>
            row.forEach((pixel) => {
                max.alpha = Math.max(max.alpha, pixel.alpha);
                max.red = Math.max(max.red, pixel.red);
                max.green = Math.max(max.green, pixel.green);
                max.blue = Math.max(max.blue, pixel.blue);

                min.alpha = Math.min(min.alpha, pixel.alpha);
                min.red = Math.min(min.red, pixel.red);
                min.green = Math.min(min.green, pixel.green);
                min.blue = Math.min(min.blue, pixel.blue);
            })
        );

        resolve({width, height, max, min})
    });
}