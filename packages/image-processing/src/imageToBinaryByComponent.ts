import { calculateMaxCount } from "./imageToBinary";
import { readBmp, writeBmp } from "./io";
import { resolveImageMetadata } from "./resolveImageMetadata";
import { Pixel, PixelMatrix } from "./types";

/** 
 * Contains the full flow for reading and processing an image into its binary version.
 */
export function imageToBinaryByComponentTask(inputPath?: string, outputPath?: string, factor?: number): Promise<void>{
    return readBmp(inputPath ?? '.images/color.bmp')
    .then((pixelMatrix) => {
        resolveImageMetadata(pixelMatrix).then((metadata) => console.log('read image', metadata));
        return imageToBinaryByComponent(pixelMatrix, factor);
    })
    .then((processedMatrix) => {
        resolveImageMetadata(processedMatrix).then((metadata) => console.log('processed image', metadata));
        return writeBmp(outputPath ?? '.images/output/color-binary-by-component.bmp', processedMatrix);
    })
    .then(() => console.log('copied over'))
    .catch((error) => console.error(error));
}

/**
 * Receives a PixelMatrix and yields a binary version of it.
 * This implementation does a binary processing on each of the color components of a pixel;
 * because of this and the random nature of the algorithm, resulting data shows shows Red,
 * Green and Blue components on their own but this can be applied to colored images
 * to enable rendering on devices that can't control the brightness of their leds
 * (either on or off).
 * @param factor The higher the number, the bigger the resulting image (factor^2) but
 * the better the quality that is kept when seen from a distance
 */
export async function imageToBinaryByComponent(pixelMatrix: PixelMatrix, factor: number = 4): Promise<PixelMatrix> {
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
            // Goes through reds, greens and blues doing the same thing:
            // Takes the current value and finds the bucket where the current
            // pixel value falls within the factor^scale, calculates the expected
            // number of pixels to declare as Max and Min and then populates with 
            // that amount.
            
            // Reds
            let max = pixelMatrixMetadata.max.red;
            let min = pixelMatrixMetadata.min.red;
            let current = pixel.red;

            let maxCount = calculateMaxCount(max, min, current, factor*factor);

            // Flush the augmented pixels with the min values.
            for(let i = 0; i < factor; i += 1){
                for(let j = 0; j < factor; j += 1){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red = min;
                }
            }

            // Randomly fill pixels with max until we get to a max count for that pixel
            let counter = 0;
            while(counter < maxCount){
                const i = Math.floor(Math.random()*factor);
                const j = Math.floor(Math.random()*factor);
                if(processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red === min){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].red = max;
                    counter += 1;
                }
            }

            // Greens
            max = pixelMatrixMetadata.max.green;
            min = pixelMatrixMetadata.min.green;
            current = pixel.green;

            maxCount = calculateMaxCount(max, min, current, factor*factor);

            // Flush the augmented pixels with the min values.
            for(let i = 0; i < factor; i += 1){
                for(let j = 0; j < factor; j += 1){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].green = min;
                }
            }

            // Randomly fill pixels with max until we get to a max count for that pixel
            counter = 0;
            while(counter < maxCount){
                const i = Math.floor(Math.random()*factor);
                const j = Math.floor(Math.random()*factor);
                if(processedMatrix[rowIndex*factor + i][columnIndex*factor + j].green === min){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].green = max;
                    counter += 1;
                }
            }

            // Blues
            max = pixelMatrixMetadata.max.blue;
            min = pixelMatrixMetadata.min.blue;
            current = pixel.blue;

            maxCount = calculateMaxCount(max, min, current, factor*factor);

            // Flush the augmented pixels with the min values.
            for(let i = 0; i < factor; i += 1){
                for(let j = 0; j < factor; j += 1){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].blue = min;
                }
            }

            // Randomly fill pixels with max until we get to a max count for that pixel
            counter = 0;
            while(counter < maxCount){
                const i = Math.floor(Math.random()*factor);
                const j = Math.floor(Math.random()*factor);
                if(processedMatrix[rowIndex*factor + i][columnIndex*factor + j].blue === min){
                    processedMatrix[rowIndex*factor + i][columnIndex*factor + j].blue = max;
                    counter += 1;
                }
            }
        })
    });

    return processedMatrix;
}