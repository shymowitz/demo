import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import * as globs from '../../shared/config';
import { environment } from '../../../../../../environments/environment';
import { ProductsFilterComponent } from '../../shared/components/products-filter/products-filter.component';
import {ProductFilter} from '../../shared/pipes/productFilter';
import {ProductOrderFilter} from '../../shared/pipes/product-orderFilter';


@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
    // for closing the filter outside the filter control
    @ViewChild(ProductsFilterComponent) productsFilter: ProductsFilterComponent

    onLoading = true;
    config: any = globs.config;
    filterCodes: any = globs.filterCodes;
    products: Array<Object> = [];
    // brands = ['Dell', 'HP', 'Apple,OS X', "Lenovo", "Panasonic", "Getac", "Fujitus"];
    // brandProductCount = {};
    selects = ProductsFilterComponent._selects; // globs._selects;
    // desktopDisabled: string = '';
    OMBRestrict = globs.config.OMBRestrict;
    // showCategory: boolean = true;
    // showFilter: boolean = false;
    searchString: string = '';
    viewedIndexes: any = [];
    // orderBy: string = 'lowhigh';
    gssFileSystemUrl = this._commonService.getGssFileSystemUrl();
    // categories: Array<Object> = filters;
    // selectedCategory: any = this.categories[0];
    // filterOptions: any = this.selectedCategory.subTypes || [];
    // filteredTypes: Array<string> = [];
    // appliedFilters: string = '';
    // filteredBrands: Array<string> = [];
    // appliedBrands: string = '';
    // resetBrands: boolean = false;
    // pageTitle: string = 'Product List';
    // orderBy: string = 'lowhigh';
    // AllBrands: Array<Object> = Brands;

    email: string = null;
    filterPipe: ProductFilter;
    orderFilterPipe: ProductOrderFilter;
    constructor(private _commonService: CommonService, private _dataService: DataService, private _eref: ElementRef) { 
        this.filterPipe = new ProductFilter();
        this.orderFilterPipe = new ProductOrderFilter();
    }

    ngOnInit() {
        this._dataService.getProducts().subscribe(res => {
                this.products = res.data;
                // this.setBrandProductCount(res.data);
                console.log("DATA", res)
                this._commonService.setAllProducts(this.products);
                this.onLoading = false;
            }, error => console.log(error));
    }
    onClick(event) {
        this.productsFilter.closeMe(event);
        // event.stopPropagation();
        // console.log(this._eref.nativeElement.contains(event.target));
        // console.log(event.target);
    }
    /*
    onKey(event: any) { // without type info
        if (event.target.value.length > 2) {
            this.resetFilters();
        }
    }
    */
    /*
    setBrandProductCount(data) {
        for (let search of this.brands) {
            if (!(search in this.brandProductCount)) {
                this.brandProductCount[search] = 0;
            }
            for (let bra of search.split(',')) {
                let re = new RegExp(bra, 'i');
                for (let product of data) {
                    let name = product.attributes.oemMfrName;
                    if (re.test(name)) {
                        this.brandProductCount[search] += 1;
                    }
                }
            }
        }
    }
    
    isBrand(id) {
        return (this.brands.indexOf(id) > -1);
    }
    */
    /**
     * toggleAddons(index)
     * Toggle View Addons link
     */
    toggleAddons(index) {
        let extIndex = this.viewedIndexes.indexOf(index);
        (extIndex === -1) ? this.viewedIndexes.push(index) : this.viewedIndexes.splice(extIndex, 1);
    }
    /**
     * Let UI to display View Addons modal
     */
    viewAddons(index) {
        return (this.viewedIndexes.indexOf(index) === -1) ? false : true;
    }
    /*
    // type = device | configuration | brands | os | processor | weight
    filterType(obj, type) {
        this.searchString = '';
        let myArray = this.selects[type].selected;
        let index: number = myArray.indexOf(obj.id);
        if (type === 'device') {
            // disable or enable "Desktop upgrade"
            // when Laptop is clicked
            if (obj.id != 'D1' && (index === -1)) {
                this.desktopDisabled = 'disabled';
            } else {
                this.desktopDisabled = '';
            }
        }
        (index === -1) ? myArray.push(obj.id) : myArray.splice(index, 1);
        this.selects[type].applied = myArray.join(',');
        // console.log(type+'Applied', this.selects[type].applied)
    }

    clearFilters() {
        for (let id of this.selects.ids) {
            this.selects[id].selected = [];
            this.selects[id].applied = '';
        }
    }
    */
    /*
    checkFiltersApplied() {
        let applied = false;
        for (let id of this.selects.ids) {
            if (this.selects[id].selected.length != 0) {
                applied = true;
            }
        }
        return applied;
    }
    */
    getLabel(category, id) {
        for (let type of category) {
            if (type.id == id) {
                return type.label;
            }
        }
    }
    /*
    private resetFilters() {
        this.selects.device.applied = '';
        this.selects.configuration.applied = '';
        this.selects.brand.applied = '';
        this.selects.os.applied = '';
        this.selects.processor.applied = '';
        this.selects.ram.applied = '';
        this.selects.harddrive.applied = '';
        this.selects.weight.applied = '';
    }
    */
    //OMB
    checkOmb(configCode) {
        return (this.OMBRestrict.indexOf(configCode) === -1) ? true : false;
    }
    //End

    handleCategoryChange(selects) {
      this.selects = selects;
      // this.orderBy = this.selects['orderBy'];
      this.searchString = '';
    }
    handleSearchChange(search) {
      // reset selects filter to default
      this.selects = ProductsFilterComponent._selects;
      this.searchString = search;
    }
    // call category filter pipe and order pipe
    // from components to simplify code in html 
    filteredProducts() {
       if (this.products.length===0)
          return [];

       let obj = this.filterPipe.transform(this.products,
         this.searchString,
         this.selects.device.applied,
         this.selects.configuration.applied,
         this.selects.brand.applied,
         this.selects.os.applied,
         this.selects.processor.applied,
         this.selects.ram.applied,
         this.selects.harddrive.applied,
         this.selects.weight.applied
       );
       return this.orderFilterPipe.transform(obj, this.selects.orderBy);
    }
    // selectCategory(category): void {
    //     this.selectedCategory = category;
    //     this.showCategory = !this.showCategory;
    //     this.resetFilters();
    // }

    // resetFilters() {
    //     this.filteredTypes = [];
    //     this.appliedFilters = '';
    //     this.filteredBrands = [];
    //     this.appliedBrands = '';
    //     this.resetBrands = false;
    //     this.searchString = '';
    // }

    // filterItems(): void {
    //     this.showFilter = !this.showFilter;
    // }

    // selectFilter(subtype): void {
    //     let index: number = this.filteredTypes.indexOf(subtype.id);
    //     (index === -1) ? this.filteredTypes.push(subtype.id) : this.filteredTypes.splice(index, 1);
    //     this.appliedFilters = this.filteredTypes.join(',');
    // }

    // filterBrand(brand) {
    //     let index: number = this.filteredBrands.indexOf(brand.id);
    //     (index === -1) ? this.filteredBrands.push(brand.id) : this.filteredBrands.splice(index, 1);
    //     this.appliedBrands = this.filteredBrands.join(',');
    // }


}