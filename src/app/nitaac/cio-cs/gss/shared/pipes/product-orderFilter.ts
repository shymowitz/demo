import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
 * searchString:selectedCategory:selectedOs:selectedProcessor:selectedRam:selectedHardDrive:selectedWeight
*/
@Pipe({ name: 'ProductOrderFilter' })
export class ProductOrderFilter implements PipeTransform {
    transform(products: any,
        orderBy: string) {
        //Sorting objects
        let resultArray: any[];

        if (orderBy && orderBy !== '') {
            let amntArray = [];
            let unsortedAmntArray = [];
            let sortedProducts = [];
            for (let product of products) {
                amntArray.push(product.minBaseProductPrice);
            }

            let amntCopy = Object.assign({}, amntArray);
            for (let key in amntCopy) {
                if (amntCopy.hasOwnProperty(key)) {
                    unsortedAmntArray.push(amntCopy[key]);
                }
            }

            amntArray.sort(function (a, b) { return a - b });
            let selectedIndexes = [];
            for (let amnt of amntArray) {
                let index = unsortedAmntArray.indexOf(amnt);
                if (selectedIndexes.indexOf(index) === -1) {
                    selectedIndexes.push(index);
                } else {
                    let allOccurance = this.getAllIndexes(unsortedAmntArray, amnt);
                    let nextIndex = 0;
                    for (let i = 0; i < allOccurance.length; i++) {
                        if (selectedIndexes.indexOf(allOccurance[i]) === -1) {
                            nextIndex = allOccurance[i];
                        }
                    }
                    index = nextIndex;
                    selectedIndexes.push(index);
                }
                sortedProducts.push(products[index]);
            }
            resultArray = (orderBy === 'lowhigh') ? sortedProducts : sortedProducts.reverse();
        }
        return resultArray;
    }

    getAllIndexes(searchArray: any, searchItem: any) {
        let result = [];
        for (let i = 0; i < searchArray.length; i++) {
            (searchArray[i] == searchItem) ? result.push(i) : '';
        }
        return result;
    }
}
