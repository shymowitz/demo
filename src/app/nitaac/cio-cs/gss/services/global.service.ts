import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
    getSortedByPrice(products) {
        //for sorting products based on price
        let amntArray = [];
        let unsortedAmntArray = [];
        let sortedProducts = [];
        for (let product of products) {
            amntArray.push(product.baseProductPrice);
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

        return sortedProducts;
    }

    getAllIndexes(searchArray: any, searchItem: any) {
        let result = [];
        for (let i = 0; i < searchArray.length; i++) {
            (searchArray[i] == searchItem) ? result.push(i) : '';
        }
        return result;
    }
}