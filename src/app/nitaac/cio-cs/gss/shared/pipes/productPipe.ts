import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({ name: 'ProductPipe' })
export class ProductPipe implements PipeTransform {
    transform(products: any, searchString: string, selectedCategory: any, subTypes: string, brands: string, orderBy: string) {
        let resultArray: any = [];


        //For search filter
        if (searchString !== '') {
            for (let product of products) {
                if (product.attributes.nameCode.toLowerCase().startsWith(searchString.toLowerCase())) {
                    resultArray.push(product);
                }
            }
        }
        else {
            resultArray = products;
        }

        //For Category filter
        if (selectedCategory.id !== 'A1') {
            let catResult = [];
            for (let product of resultArray) {
                if (product.attributes.configurationTypeCode === selectedCategory.id) {
                    catResult.push(product);
                }
            }
            resultArray = catResult;
        }

        //For subtype filtering
        if (subTypes.length > 0) {
            let subTypesArray = [];
            subTypesArray = subTypes.split(',');
            let subTypesResult = [];

            for (let product of resultArray) {
                if (subTypesArray.indexOf(product.attributes.configurationSubtypeCode) !== -1) {
                    subTypesResult.push(product);
                }
            }
            resultArray = subTypesResult;
        }

        //Filter for brands
        if (brands.length > 0) {
            let brandsArray = [];
            brandsArray = brands.split(',');
            let brandsResult = [];

            for (let product of resultArray) {
                if (brandsArray.indexOf(product.attributes.oemMfrName.toLowerCase()) !== -1) {
                    brandsResult.push(product);
                }
            }
            resultArray = brandsResult;
        }

        //Sorting objects
        if (orderBy !== '') {
            let amntArray = [];
            let unsortedAmntArray = [];
            let sortedProducts = [];
            for (let product of resultArray) {
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
                sortedProducts.push(resultArray[index]);
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
