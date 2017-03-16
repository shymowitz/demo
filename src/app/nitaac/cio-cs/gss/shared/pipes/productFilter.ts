import { Pipe, PipeTransform } from '@angular/core';
import * as globs from '../../shared/config';

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
@Pipe({ name: 'ProductFilter' })
// orderBy error
// Error: Unsupported number of argument for pure functions: 11
export class ProductFilter implements PipeTransform {
    transform(products: any,
        searchString: string,
        deviceApplied: string,
        configurationApplied: string,
        brandApplied: string,
        osApplied: string,
        processorApplied: string,
        ramApplied: string,
        harddriveApplied: string,
        weightApplied: string
    ) {
        let resultArray: any = [];
        //For search filter
        if (searchString && searchString.length > 2) {
            for (let product of products) {
                if (this.isNameFound(product, searchString)) {
                    resultArray.push(product);
                }
            }
        }
        else {
            resultArray = products;
        }
        /*
        if (deviceApplied.length == 0 &&
            configurationApplied.length == 0 &&
            brandApplied.length == 0 &&
            osApplied.length == 0 &&
            processorApplied.length == 0 &&
            ramApplied.length == 0 &&
            harddriveApplied.length == 0 &&
            weightApplied.length == 0) {
            return resultArray;
        }
        */
        // For deviceType filter
        if (deviceApplied.length>0)
        resultArray = this.attributeFilter(deviceApplied, products, "configurationTypeCode", globs._devicetypes);
        // For configurations filter
        if (configurationApplied.length>0)
        resultArray = this.attributeFilter(configurationApplied, resultArray, "configurationTypeCode", globs._configurations);
        // For brand filter
        if (brandApplied.length>0)
        resultArray = this.attributeFilter(brandApplied, resultArray, "oemMfrName", globs._brands);
        // // For OS filter
        if (osApplied.length>0)
        resultArray = this.attributeFilter(osApplied, resultArray, "osCode", globs._operating_systems);
        // For processor filter
        if (processorApplied.length>0) 
        resultArray = this.attributeFilter(processorApplied, resultArray, "processorCode", globs._processors);
        // For ram filter
        if (ramApplied.length>0)
        resultArray = this.attributeFilter(ramApplied, resultArray, "ramCode", globs._rams);
        // For hard drive filter
        if (harddriveApplied.length>0)
        resultArray = this.attributeFilter(harddriveApplied, products, "hardDriveCode", globs._harddrives);
        // For weight filter
        if (weightApplied.length>0)
        resultArray = this.weightCategoryFilter(weightApplied, resultArray);
        // resultArray = this.dedup(resultArray);
        console.log("deduped results", resultArray.length ) 
        return resultArray;
    }

    protected isNameFound(product: any, searchString: string) {
        let re = new RegExp(searchString, "gi");
        let ret = !!re.exec(product.attributes.nameCode);

        if (!ret) {
            let contractors = product.relationships.contractors;
            for (let i = 0; i < contractors.length; i++) {
                if (re.exec(contractors[i].contractorName)) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }

    protected attributeFilter(findBy: string, inputResults: any, attrName: string, selectOption: any[]) {
        if (!findBy || findBy === '')
            return [];
        
        let newResultArray: any = [];
        let allOptionArray: any = [];
        let searchArray = findBy.split(',');
        // OMB filter by 'L1,D1,L2,D2,D3'
        // Basic filter by 'L1,D1'
        let omb = (searchArray.indexOf('OMB') > -1) ? true : false;
        let basic = (searchArray.indexOf('Basic') > -1) ? true : false;

        for (let opt of selectOption) {
            allOptionArray.push(opt.id);
        }
        // allOptionArray subtracted by searchArray
        let notToSearchArray = allOptionArray.filter(x => searchArray.indexOf(x) == -1);
        if (notToSearchArray.length === 0) {
            // user selected all options
            console.log('notToSearchArray.length === 0')
            newResultArray = inputResults;
        } else {
            for (let product of inputResults) {
                // if 'Other' in the search, get all items except
                // these IDs not selected by the user
                if (searchArray.indexOf('Other') >= 0) {
                    let addTo = true;
                    for (let search of notToSearchArray) {
                        let re = new RegExp(search, "gi");
                        // matched item should not be returned
                        if (re.exec(product.attributes[attrName])) {
                            addTo = false;
                        }
                    }
                    if (addTo === true) {
                        newResultArray.push(product);
                    }
                } else {
                    // get all items matched user selection
                    searchArray = searchArray.diff(['OMB', 'Basic']);
                    if (omb) {
                        let prod = this.extraFilter(product, 'OMB');
                        if (prod)
                            newResultArray.push(prod);
                    }
                    if (basic) {
                        let prod = this.extraFilter(product, 'Basic');
                        if (prod)
                            newResultArray.push(prod);
                    }

                    for (let search of searchArray) {
                        let re = new RegExp(search, "i");
                        if (re.exec(product.attributes[attrName])) {
                            newResultArray.push(product);
                        }
                        // get product by subtypes if there is subtypes
                        let item = this.getOptionById(selectOption, search);
                        if (item['subTypes']) {
                           for (let subtype of item['subTypes']) {
                              re = new RegExp(subtype.id, "i");
                              if (re.exec(product.attributes[attrName])) {
                                 newResultArray.push(product);
                              }
                           }
                        }
                    }
                }
            }
        }
        newResultArray = this.dedup(newResultArray);
        return newResultArray;
    }
    protected getOptionById(arr, value) {
       let result  = arr.filter(function(o){return o.id == value;} );
       return result? result[0] : null; // or undefined
    }
    protected weightCategoryFilter(selectedWeights: any, inputResults: any) {
        console.log('selectedWeights', selectedWeights);
        if (!selectedWeights || selectedWeights.length === 0)
            return [];

        if (selectedWeights) {
            let weightResult = [];
            let myArray = selectedWeights.split(',');
            for (let i = 0; i < myArray.length; i++) {
                let search = myArray[i].trim();
                for (let product of inputResults) {
                    let code = product.attributes.weightCode;
                    let weight = 0.0;
                    if (code) {
                        weight = parseFloat(code);
                    }
                    if (search === "<3") {
                        if (weight < 3.0) {
                            weightResult.push(product);
                        }
                    } else if (search === "3-6") {
                        if (weight > 3.0 && weight < 6.0) {
                            weightResult.push(product);
                        }
                    } else if (search === ">6") {
                        if (weight > 6.0) {
                            weightResult.push(product);
                        }
                    }
                } // (let product of inputResults)
            }  // (let i = 0; i < myArray.length; i++)
            return weightResult;
        }
    }

    private extraFilter(product, id, attrName = 'configurationTypeCode') {
        for (let cat of globs._configurations) {
            if (cat.id === id) {
                let arr = cat.specs.split(',');
                for (let code of arr) {
                    if (code === product.attributes[attrName]) {
                        return product;
                    }
                }
            }
        }
        return null;
    }

    public dedup(arr) {
        let hashTable = {};
        return arr.filter(function (el) {
            let key = JSON.stringify(el);
            let match = Boolean(hashTable[key]);
            return (match ? false : hashTable[key] = true);
        });
    }
    /*

     // findBy : comma delimited brand string
    protected isFound(product: any, findBy: string, attrName: string) {
        let myArray = findBy.split(',');
        for (let i = 0; i < myArray.length; i++) {
            let search = myArray[i].trim();
            if (search === 'Other') {
                // ?
            }
            let re = new RegExp(search, "gi");
            if (re.exec(product.attributes[attrName])) {
                return true;
            }
        }
        return false;
    }

    protected _attributeFilter(findBy: string, inputResults: any, attrName: string) {
        if (findBy) {
            let localResult = [];
            for (let product of inputResults) {
                if ( this.isFound(product, findBy, attrName)) {
                    localResult.push(product);
                }
            }
            return localResult;
        } else {
            return inputResults;
        }
    }
     // brands : comma delimited brand names
    protected isBrandFound(product: any, brands: string) {
        let brandsArray = brands.split(',');
        for (let i = 0; i < brandsArray.length; i++) {
            let re = new RegExp(brandsArray[i].trim(), "gi");
            if (re.exec(product.attributes.oemMfrName)) {
                return true;
            }
        }
        return false;
    }
    // deviceTypes : comma delimited brand names
    protected isDeviceFound(product: any, deviceTypes: string) {
        let deviceArray = deviceTypes.split(',');
        for (let i = 0; i < deviceArray.length; i++) {
            let re = new RegExp(deviceArray[i].trim(), "gi");
            if (re.exec(product.attributes.configurationTypeCode)) {
                return true;
            }
        }
        return false;
    }

     protected _categoryFilter(category: any, inputResults: any, typeCode: string) {
        if (category) {
            let localResult = [];
            for (let product of inputResults) {
                let code = product.attributes[typeCode];
                if (category.label !== "Other") {
                    if (code === category.id) {
                        localResult.push(product);
                    }
                } else {
                    localResult.push(product);
                }
            }
            return localResult;
        } else {
            return inputResults;
        }
    }

    getAllIndexes(searchArray: any, searchItem: any) {
        let result = [];
        for (let i = 0; i < searchArray.length; i++) {
            (searchArray[i] == searchItem) ? result.push(i) : '';
        }
        return result;
    }

//Sorting objects
        let orderBy = '';
        if ( orderBy && orderBy !== '') {
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
                    for(let i=0;i<allOccurance.length;i++){
                        if(selectedIndexes.indexOf(allOccurance[i])===-1){
                            nextIndex = allOccurance[i];
                        }
                    }
                    index = nextIndex;
                    selectedIndexes.push(index);
                }
                sortedProducts.push(resultArray[index]);
            }
            console.log("orderBy", orderBy)
            resultArray = (orderBy === 'lowhigh') ? sortedProducts : sortedProducts.reverse();
        }
    */
}
