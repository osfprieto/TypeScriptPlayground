import { PixelMatrix } from "./types";

/** 
 * Contains the full flow for reading and processing an image into its monochrome version.
 */
export function imageToMonochromeTask(_inputPath?: string, _outputPath?: string): Promise<void> {
    return Promise.reject('this task is not implemented yet');
}

/**
 * Receives a PixelMatrix and yields a monochrome scale of it.
 */
export function imageToMonochrome(pixelMatrix: PixelMatrix): Promise<PixelMatrix> {
    return Promise.reject('not implemented yet');
}