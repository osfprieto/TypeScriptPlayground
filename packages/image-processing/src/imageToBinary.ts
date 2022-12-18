import { readBmp, writeBmp } from "./io";
import { resolveImageMetadata } from "./resolveImageMetadata";
import { Pixel, PixelMatrix } from "./types";

/** 
 * Contains the full flow for reading and processing an image into its binary version.
 */
export function imageToBinaryTask(): Promise<void>{
    return readBmp('.images/gray.bmp')
    .then((pixelMatrix) => {
        resolveImageMetadata(pixelMatrix).then((metadata) => console.log('read image', metadata));
        return imageToBinary(pixelMatrix);
    })
    .then((processedMatrix) => {
        resolveImageMetadata(processedMatrix).then((metadata) => console.log('processed image', metadata));
        return writeBmp('.images/gray-binary.bmp', processedMatrix);
    })
    .then(() => console.log('copied over'))
    .catch((error) => console.error(error));
}

/**
 * Receives a PixelMatrix and yields a binary version of it.
 * This calcualtes the max and minimum values for each component and rebuilds the same image
 * using only these two colors.
 * @param factor The higher the number, the bigger the resulting image (factor^2) but
 * the better the quality that is kept when seen from a distance
 */
export async function imageToBinary(pixelMatrix: PixelMatrix, factor: number = 4): Promise<PixelMatrix> {
    const pixelMatrixMetadata = await resolveImageMetadata(pixelMatrix);
    
    // Pre-fill the new matrix with the new pixel data to make it easier to navigate.
    const processedMatrix: PixelMatrix = [];
    let row: Pixel[] = [];

    for(let i = 0; i < pixelMatrixMetadata.height * factor; i += 1){
        for(let j = 0; j < pixelMatrixMetadata.width * factor; j += 1){
            row.push({alpha: 0, red: 0, green: 0, blue: 0});
        }
        processedMatrix.push(row);
        row = [];
        // console.log('row pushed', i);
    }

    // Walk the original matrix while regenerating the new list of pixels.
    pixelMatrix.forEach((row, rowIndex) => {
        // console.log('walking row', rowIndex);
        row.forEach((pixel, columnIndex) => {
            // Alpha stays the same.
            
            // Calculates the max count based of the reds, because red is the coolest color.
            let maxCount = calculateMaxCount(
                pixelMatrixMetadata.max.red,
                pixelMatrixMetadata.min.red,
                pixel.red,
                factor*factor);

            // Flush the augmented pixels with the min values.
            for(let i = 0; i < factor; i += 1){
                for(let j = 0; j < factor; j += 1){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red = pixelMatrixMetadata.min.red;
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].green = pixelMatrixMetadata.min.green;
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].blue = pixelMatrixMetadata.min.blue;
                }
            }

            // Randomly fill pixels with max until we get to a max count for that pixel
            let counter = 0;
            while(counter < maxCount){
                const i = Math.floor(Math.random()*factor);
                const j = Math.floor(Math.random()*factor);
                if(processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red === pixelMatrixMetadata.min.red){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red = pixelMatrixMetadata.max.red;
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].green = pixelMatrixMetadata.max.green;
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].blue = pixelMatrixMetadata.max.blue;
                    counter += 1;
                }
            }

        })
    });

    return processedMatrix;
}

export function calculateMaxCount(max: number, min: number, current: number, slots: number): number {
    const step = Math.floor((max - min + 1 /* We add 1 because both max and min are part of the range */) / slots);
    const result = Math.floor((current - min + 1) / step);
    // console.log(max, min, current, slots, step, result);
    return result;
}
