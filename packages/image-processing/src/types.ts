export type Pixel = {
    alpha: number, red: number, green: number, blue: number
}

export type PixelMatrixMetadata = {
    /**
     * Image width
     */
    width: number,
    /**
     * Image height
     */
    height: number,
    /**
     * The max values found through the image.
     */
    max: Pixel,
    /**
     * The min valies found through the image.
     */
    min: Pixel
};

export type PixelMatrix = Pixel[][];