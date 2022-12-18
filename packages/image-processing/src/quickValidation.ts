import { readBmp, writeBmp } from './io';
import { resolveImageMetadata } from './resolveImageMetadata';

/**
 * This is the quick validation function to run manual tests.
 * Run using `npm run quick-validation`.
 */
export function quickValidation(): void {
    validateIO();
}

/**
 * This reads an image into a PixelMatrix and then writes the PixelMatrix into an image 
 * to validate the whole I/O flow.
 */
function validateIO(): void {
    readBmp('.images/gray.bmp')
    .then((pixelMatrix) => {
        resolveImageMetadata(pixelMatrix).then((metadata) => console.log('read image', metadata));
        return writeBmp('.images/output/gray-copy.bmp', pixelMatrix);
    })
    .then(() => console.log('copied over'))
    .catch((error) => console.error(error));
}