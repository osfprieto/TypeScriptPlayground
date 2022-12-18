import { readFile, writeFile } from 'fs';
import { decode, encode } from 'bmp-js';
import type { Pixel, PixelMatrix } from './types';

declare type BMP_DTO = {width: number, height: number, data: Buffer};

/**
 * Reads a bmp image from a given path and returns a typed PixelMatrix
 */
export function readBmp(path: string): Promise<PixelMatrix>{
    return new Promise((resolve, reject) => {
        try{
            readFile(path, (error, data) => {
                if(error) {
                    reject(error);
                }
                const decodedData = decode(data);
                resolve(parseDecodedDataIntoPixelMatrix(decodedData));
            });
            
        } catch (error){
            reject(error);
        }
    });
}

/** Writes a PixelMatrix into a bmp image file */
export function writeBmp(path: string, pixelMatrix: PixelMatrix): Promise<void>{
    return new Promise((resolve, reject) => {
        try {
            const preppedData = prepEncodedDataFromPixelMatrix(pixelMatrix);
            const encodedData = encode(preppedData);
            writeFile(path, encodedData.data, () => resolve());
        } catch (error) {
            reject(error);
        } 
    });
}

function prepEncodedDataFromPixelMatrix(pixelMatrix: PixelMatrix): BMP_DTO{
    const rawData = [];

    pixelMatrix.forEach((row) =>
        row.forEach((pixel) => rawData.push(pixel.alpha, pixel.red, pixel.green, pixel.blue))
    );

    return {height: pixelMatrix.length, width: pixelMatrix[0].length, data: Buffer.from(rawData)};
}

function parseDecodedDataIntoPixelMatrix(decodedData: BMP_DTO): PixelMatrix {
    const pixelMatrix: PixelMatrix = [];
    let currentRow: Pixel[] = [];

    let decodedDataIndex = 0;
    while(decodedDataIndex < decodedData.data.length){
        currentRow.push({
            alpha: decodedData.data[decodedDataIndex],
            red: decodedData.data[decodedDataIndex + 1],
            green: decodedData.data[decodedDataIndex + 2],
            blue: decodedData.data[decodedDataIndex + 3]
        });
        decodedDataIndex += 4;
        if(currentRow.length >= decodedData.width){
            pixelMatrix.push(currentRow);
            currentRow = [];
        }
    }
    
    return pixelMatrix;
}


